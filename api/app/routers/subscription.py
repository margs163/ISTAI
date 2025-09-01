from datetime import datetime
import json
import os
from pathlib import Path
from pprint import pprint
from typing import Annotated, Any, Dict
from fastapi import APIRouter, Body, Depends, HTTPException, Request, status
from paddle_billing.Notifications.Requests.Request import Request as PRequest
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import joinedload
from ..dependencies import limiter

from api.app.lib.auth_db import get_async_session
from api.app.schemas.db_tables import CreditCard, Subscription, User
from api.app.schemas.subscriptions import (
    CreditCardSchema,
    SubscriptionSchema,
    SubscriptionUpdateSchema,
    TierEnum,
)
from ..dependencies import current_active_user
from sqlalchemy.ext.asyncio import AsyncSession
from paddle_billing.Notifications.Requests.Headers import Headers
from paddle_billing.Notifications import Secret, Verifier
from paddle_billing import Client, Options, Environment
from paddle_billing.Resources.Events.Operations import ListEvents
from paddle_billing.Resources.Shared.Operations import Pager
from paddle_billing.Entities.Events import EventTypeName
from paddle_billing.Resources.Transactions.Operations import ListTransactions
from paddle_billing.Entities.Transaction import Transaction

# from paddle_billing.Resources.Events.EventsClient

# from paddle_billing.R
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

WEBHOOK_SECRET = os.getenv("PADDLE_WEBHOOK_SECRET")
PADDLE_API_KEY = os.getenv("PADDLE_API_KEY")

if not PADDLE_API_KEY:
    raise Exception("No paddle api key")


paddle = Client(PADDLE_API_KEY, Options(environment=Environment.SANDBOX))


def make_naive(dt: datetime) -> datetime:
    if dt is not None and dt.tzinfo is not None:
        return dt.replace(tzinfo=None)
    return dt


class PaddleRequest:
    def __init__(self, body, headers):
        self._body = body
        self._headers = headers

    @property
    def body(self):
        return self._body

    @property
    def headers(self):
        return self._headers


def verify_paddle_signature(request: Request, body: bytes) -> bool:
    """Verify that the webhook came from Paddle"""
    try:
        # Use Paddle's SDK to verify the signature
        wrapper = PaddleRequest(body, request.headers)
        verifier = Verifier()
        is_valid = verifier.verify(wrapper, Secret(WEBHOOK_SECRET))
        return is_valid

    except Exception as e:
        print(f"Signature verification failed: {e}")
        return False


@router.post("/webhook")
async def paddle_webhook(
    request: Request, session: Annotated[AsyncSession, Depends(get_async_session)]
):
    try:
        body = await request.body()
        # raw_body = body.decode("utf-8")
        if not verify_paddle_signature(request, body):
            print("Could not verify paddle signature")
            raise HTTPException(status_code=401, detail="Invalid signature")

        try:
            # webhook_data = WebhookEvent.model_validate_json(await request.json())
            data = await request.json()
            event_id = data["event_id"]
            events = paddle.events.list(ListEvents(Pager(after=event_id)))

            for event in events:
                if event.event_type.value == EventTypeName.SubscriptionActivated.value:
                    print("Subscription was activated")

                if event.event_type.value == EventTypeName.SubscriptionCreated.value:
                    subscription_id = data["data"]["id"]
                    customer_id = data["data"]["customer_id"]
                    subscription = None
                    customer = None
                    if subscription_id and customer_id:
                        subscription = paddle.subscriptions.get(subscription_id)
                        customer = paddle.customers.get(customer_id)
                        print("Subscription and customer records were retrieved")

                    if subscription and customer:
                        sub_item = subscription.items[0]
                        credits_purchased = 0
                        user = await session.scalar(
                            select(User).where(User.email == customer.email)
                        )

                        if not user:
                            raise HTTPException(
                                status_code=status.HTTP_400_BAD_REQUEST,
                                detail=f"No user was found with email {customer.email}",
                            )
                        subscription_record = await session.scalar(
                            select(Subscription).where(Subscription.user_id == user.id)
                        )

                        if sub_item.product.name == "Starter":
                            credits_purchased = 300
                        elif sub_item.product.name == "Pro":
                            credits_purchased = 800

                        if not subscription_record:
                            raise HTTPException(
                                status_code=status.HTTP_400_BAD_REQUEST,
                                detail="No subscription was found",
                            )

                        subscription_record.paddle_product_id = sub_item.product.id
                        subscription_record.paddle_subscription_id = subscription_id
                        subscription_record.paddle_price_id = sub_item.price.id
                        subscription_record.subscription_tier = sub_item.product.name
                        subscription_record.paddle_subscription_status = (
                            sub_item.status.value
                        )
                        subscription_record.subscription_created_at = make_naive(
                            sub_item.created_at
                        )
                        if sub_item.next_billed_at:
                            subscription_record.subscription_next_billed_at = (
                                make_naive(sub_item.next_billed_at)
                            )
                        subscription_record.total_money_spent = (
                            float(sub_item.price.unit_price.amount) / 100
                        )
                        subscription_record.credits_total_purchased = credits_purchased
                        subscription_record.credits_left = credits_purchased
                        subscription_record.billing_interval = (
                            subscription.billing_cycle.interval.value
                        )
                        subscription_record.billing_frequency = (
                            subscription.billing_cycle.frequency
                        )

                        await session.commit()
                    pprint("Subscription record was updated!")

                if event.event_type.value == EventTypeName.TransactionCompleted.value:
                    print("Transaction completed!")

                if event.event_type.value == EventTypeName.SubscriptionCanceled.value:
                    print("Subscription cancelled!")

                if event.event_type.value == EventTypeName.PaymentMethodSaved.value:
                    customer_id: str = data["data"]["customer_id"]
                    address_id: str = data["data"]["address_id"]
                    subscription_id = data["data"]["id"]

                    subscription = paddle.subscriptions.get(subscription_id)
                    customer = paddle.customers.get(customer_id)
                    address = paddle.addresses.get(customer_id, address_id)

                    transaction = paddle.transactions.list(
                        ListTransactions(subscription_ids=[subscription_id])
                    )
                    transactions: list[Transaction] = transaction.items
                    payment_details = transactions[0].payments[-1].method_details

                    if subscription and customer:
                        user = await session.scalar(
                            select(User).where(User.email == customer.email)
                        )

                        if not user:
                            raise HTTPException(
                                status_code=status.HTTP_400_BAD_REQUEST,
                                detail=f"No user was found with email {customer.email}",
                            )
                        subscription_record = await session.scalar(
                            select(Subscription).where(Subscription.user_id == user.id)
                        )

                        if not subscription_record:
                            raise HTTPException(
                                status_code=status.HTTP_400_BAD_REQUEST,
                                detail="No subscription was found",
                            )

                        if not payment_details.card:
                            raise HTTPException(
                                status_code=status.HTTP_400_BAD_REQUEST,
                                detail="No card details were found",
                            )

                        if not subscription_record.credit_card:
                            new_credit_card = CreditCardSchema(
                                subscription_id=str(subscription_record.id),
                                payment_method=payment_details.type.value,
                                card_holder_name=payment_details.card.cardholder_name,
                                card_type=payment_details.card.type.value,
                                last_four=payment_details.card.last4,
                                expiry_month=payment_details.card.expiry_month,
                                expiry_year=payment_details.card.expiry_year,
                                country=address.country_code.value,
                            )

                            credit_card_record = CreditCard(
                                **new_credit_card.model_dump()
                            )

                            session.add(credit_card_record)

                        else:
                            subscription_record.credit_card.payment_method = (
                                payment_details.type.value
                            )
                            if payment_details.card.cardholder_name:
                                subscription_record.credit_card.card_holder_name = (
                                    payment_details.card.cardholder_name
                                )
                            subscription_record.credit_card.card_type = (
                                payment_details.card.type.value
                            )
                            subscription_record.credit_card.last_four = (
                                payment_details.card.last4
                            )
                            subscription_record.credit_card.expiry_month = (
                                payment_details.card.expiry_month
                            )
                            subscription_record.credit_card.expiry_year = (
                                payment_details.card.expiry_year
                            )
                            subscription_record.credit_card.country = (
                                address.country_code.value
                            )
                        await session.commit()
                        pprint("Credit card was set/updated!")

            return {"status": "success"}
        except Exception as e:
            print(f"Failed to parse webhook data: {e}")
            raise HTTPException(status_code=400, detail=f"{e}")

    except Exception as e:
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could process webhook record: {e}",
        )


@router.get("/me")
@limiter.limit("25/minute")
async def get_my_subscription(
    request: Request,
    user: Annotated[User, Depends(current_active_user)],
    session: Annotated[AsyncSession, Depends(get_async_session)],
):
    try:
        record = await session.scalar(
            select(Subscription)
            .where(Subscription.user_id == user.id)
            .options(joinedload(Subscription.credit_card))
        )

        if not record:
            raise Exception("No record was found.")

        return {"data": record}

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not fetch subscriptions record: {e}",
        )


@router.post("/init")
@limiter.limit("4/minute")
async def create_subscription(
    request: Request,
    user: Annotated[User, Depends(current_active_user)],
    session: Annotated[AsyncSession, Depends(get_async_session)],
):
    try:
        new_subscription = SubscriptionSchema(
            user_id=str(user.id),
            subscription_tier=TierEnum.FREE.value,
            credits_total_purchased=0,
            credits_left=20,
        )
        subscriptions_record = Subscription(**new_subscription.model_dump())

        session.add(subscriptions_record)
        await session.commit()

        return {"data": subscriptions_record}

    except Exception as e:
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not create subscriptions record: {e}",
        )


@router.post("/card")
@limiter.limit("6/minute")
async def post_credit_card(
    request: Request,
    user: Annotated[User, Depends(current_active_user)],
    session: Annotated[AsyncSession, Depends(get_async_session)],
    data: Annotated[CreditCardSchema, Body()],
):
    try:
        record = await session.scalar(
            select(Subscription).where(Subscription.user_id == user.id)
        )

        if not record:
            raise Exception("No record was found.")

        credit_record = CreditCard(**data.model_dump())
        record.credit_card = credit_record

        await session.commit()

    except Exception as e:
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not create a credit card record: {e}",
        )


@router.get("/card")
@limiter.limit("20/minute")
async def get_credit_card(
    request: Request,
    user: Annotated[User, Depends(current_active_user)],
    session: Annotated[AsyncSession, Depends(get_async_session)],
    data: Annotated[CreditCardSchema, Body()],
):
    try:
        subscription = await session.scalar(
            select(Subscription).where(Subscription.user_id == user.id)
        )

        if not subscription:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="No subscription was found:",
            )

        credit_card = await session.scalar(
            select(CreditCard).where(CreditCard.subscription_id == subscription.id)
        )

        if not credit_card:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="No credit card was found",
            )

        return {"data": credit_card}
    except Exception as e:
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"No credit card was found: {e}",
        )


@router.put("/")
@limiter.limit("10/minute")
async def update_subscription(
    request: Request,
    user: Annotated[User, Depends(current_active_user)],
    session: Annotated[AsyncSession, Depends(get_async_session)],
    update: Annotated[SubscriptionUpdateSchema, Body()],
):
    try:
        record = await session.scalar(
            select(Subscription).where(Subscription.user_id == user.id)
        )

        if not record:
            raise Exception("No record was found.")

        if update.paddle_product_id:
            record.paddle_product_id = update.paddle_product_id

        if update.paddle_price_id:
            record.paddle_price_id = update.paddle_price_id

        if update.paddle_subscription_id:
            record.paddle_subscription_id = update.paddle_subscription_id

        if update.paddle_subscription_status:
            record.paddle_subscription_status = update.paddle_subscription_status

        if update.subscription_created_at:
            record.subscription_created_at = update.subscription_created_at

        if update.subscription_next_billed_at:
            record.subscription_next_billed_at = update.subscription_next_billed_at

        if update.total_money_spent:
            record.total_money_spent += update.total_money_spent

        if update.credits_left:
            record.credits_left -= update.credits_left

        if update.credits_total_purchased:
            record.credits_total_purchased += update.credits_total_purchased

        if update.subscription_tier:
            record.subscription_tier = update.subscription_tier

        await session.commit()

    except Exception as e:
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not update subscriptions record: {e}",
        )
