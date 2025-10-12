from datetime import datetime
import os
from pprint import pprint
from typing import Annotated
from fastapi import APIRouter, Body, Depends, HTTPException, Query, Request, status
from redis import Redis
from sqlalchemy import select
from sqlalchemy.orm import joinedload
from polar_sdk import Polar
from polar_sdk.webhooks import validate_event, WebhookVerificationError, WebhoookPayload
from polar_sdk.models import Customer, SubscriptionRecurringInterval

from ..lib.send_notification import create_notification
from ..schemas.notifications import NotificationTypeEnum
from ..dependencies import get_redis_client, limiter, get_pollar_client

from ..lib.auth_db import get_async_session
from ..schemas.db_tables import Subscription, User
from ..schemas.subscriptions import (
    CreditCardSchema,
    SubscriptionSchema,
    SubscriptionUpdateSchema,
    TierEnum,
)
from ..dependencies import current_active_user
from sqlalchemy.ext.asyncio import AsyncSession
from paddle_billing.Notifications import Secret, Verifier
from paddle_billing import Client, Options, Environment
from paddle_billing.Resources.Events.Operations import ListEvents
from paddle_billing.Resources.Shared.Operations import Pager
from paddle_billing.Entities.Events import EventTypeName
from paddle_billing.Resources.Transactions.Operations import ListTransactions
from paddle_billing.Entities.Transaction import Transaction
from paddle_billing.Resources.Subscriptions.Operations import CancelSubscription
from paddle_billing.Resources.Transactions.Operations import CreateTransaction
from paddle_billing.Resources.Transactions.Operations.Create import (
    TransactionCreateItemWithPrice,
    TransactionCreateItem,
)

# from paddle_billing.Resources.Events.EventsClient

# from paddle_billing.R
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

WEBHOOK_SECRET = os.getenv("PADDLE_WEBHOOK_SECRET")
PADDLE_API_KEY = os.getenv("PADDLE_API_KEY")

if not PADDLE_API_KEY:
    raise Exception("No paddle api key")

if not WEBHOOK_SECRET:
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
    request: Request,
    session: Annotated[AsyncSession, Depends(get_async_session)],
    polar_client: Annotated[Polar, Depends(get_pollar_client)],
    redis_client: Annotated[Redis, Depends(get_redis_client)],
):
    try:
        request_body = await request.body()
        event: WebhoookPayload = validate_event(
            body=request_body,
            headers=request.headers,
            secret=os.getenv("POLAR_WEBHOOK_SECRET"),
        )

        print("EVENT WAS HIT!", event.TYPE)

        if event.TYPE == "subscription.created":
            customer_id = event.data.customer_id
            subscription_id = event.data.id
            user_email = event.data.metadata.get("userEmail")

            if not user_email:
                raise Exception("No user email was found in metadata")
            
            user = await session.scalar(select(User).where(User.email == user_email))

            user_subscription = await session.scalar(
                select(Subscription).where(Subscription.user_id == user.id)
            )

            if not user_subscription:
                raise Exception("No subscription record was found")

            customer: Customer = polar_client.customers.get(id=customer_id)

            if not customer:
                raise Exception(f"No customer was found with id {customer_id}")

            polar_product_id = event.data.product_id
            polar_price_id = event.data.prices[0].id

            user_subscription.polar_product_id = polar_product_id
            user_subscription.polar_subscription_id = subscription_id
            user_subscription.polar_price_id = polar_price_id
            user_subscription.polar_customer_id = customer_id

            polar_product_name = event.data.product.name


            user_subscription.polar_subscription_status = event.data.status.value

            created_at = event.data.current_period_start
            next_billed_at = event.data.current_period_end

            user_subscription.subscription_created_at = make_naive(created_at)
            user_subscription.subscription_next_billed_at = make_naive(next_billed_at)

            money_spent = float(event.data.amount / 100)
            user_subscription.total_money_spent += money_spent

            recurring_interval = event.data.recurring_interval

            if recurring_interval == SubscriptionRecurringInterval.MONTH:
                user_subscription.billing_interval = "month" 
                user_subscription.billing_frequency = 1
            elif recurring_interval == SubscriptionRecurringInterval.YEAR:
                user_subscription.billing_interval = "year"
                user_subscription.billing_frequency = 12

            if polar_product_name.startswith("Starter"):
                user_subscription.subscription_tier = TierEnum.STARTER.value

                if recurring_interval == SubscriptionRecurringInterval.MONTH:
                    user_subscription.credits_total_purchased += 300
                    user_subscription.credits_left += 300
                elif recurring_interval == SubscriptionRecurringInterval.YEAR:
                    user_subscription.credits_total_purchased += 3600
                    user_subscription.credits_left += 3600

                user_subscription.pronunciation_tests_left = 6
            else:
                user_subscription.subscription_tier = TierEnum.PRO.value

                if recurring_interval == SubscriptionRecurringInterval.MONTH:
                    user_subscription.credits_total_purchased += 800
                    user_subscription.credits_left += 800
                elif recurring_interval == SubscriptionRecurringInterval.YEAR:
                    user_subscription.credits_total_purchased += 9600
                    user_subscription.credits_left += 9600

                user_subscription.pronunciation_tests_left = 10

            print("Subscription record was updated.")
            await session.commit()

        if event.TYPE == "subscription.canceled":
            subscription_id = event.data.id
            customer_id = event.data.customer_id
            user_email = redis_client.get(customer_id)

            if not user_email:
                raise Exception(f"No user email was found in redis for customer id {customer_id}")

            user = await session.scalar(
                select(User).where(User.email == user_email)
            )

            if not user:
                raise Exception(f"No user was found with email {user_email}")

            user_subscription = await session.scalar(
                select(Subscription).where(Subscription.user_id == user.id)
            )

            if not user_subscription:
                raise Exception("No subscription record was found") 

            user_subscription.polar_subscription_status = "canceled"
            user_subscription.subscription_cancelled_at = make_naive(event.data.canceled_at)
            user_subscription.cancellation_reason = event.data.customer_cancellation_reason
            user_subscription.cancellation_comment = event.data.customer_cancellation_comment

            await session.commit()
            print("Subscription was canceled.")
        
        if event.TYPE == "subscription.revoked":
            subscription_id = event.data.id
            customer_id = event.data.customer_id
            user_email = redis_client.get(customer_id)

            if not user_email:
                raise Exception(f"No user email was found in redis for customer id {customer_id}")

            user = await session.scalar(
                select(User).where(User.email == user_email)
            )

            if not user:
                raise Exception(f"No user was found with email {user_email}")

            user_subscription = await session.scalar(
                select(Subscription).where(Subscription.user_id == user.id)
            )

            if not user_subscription:
                raise Exception("No subscription record was found")

            user_subscription.polar_subscription_status = "revoked"
            user_subscription.credits_left = 0
            user_subscription.subscription_tier = TierEnum.FREE.value
            user_subscription.subscription_cancelled_at = make_naive(event.data.canceled_at)

            user_subscription.polar_product_id = None
            user_subscription.polar_price_id = None
            user_subscription.polar_subscription_id = None
            user_subscription.polar_customer_id = None

            await session.commit()
            print("Subscription was revoked.")

        return {"status": "success"}

    except WebhookVerificationError as e:
        print(f"Error processing webhook: {e}")
        return {"status": "error"}
        # raise HTTPException(
        #     status_code=status.HTTP_403_FORBIDDEN,
        #     detail=f"Could not process webhook record: {e}",
        # )
    except Exception as e:
        await session.rollback()
        print(f"Error processing webhook: {e}")
        return {"status": "error"}
        # raise HTTPException(
        #     status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        #     detail=f"Could not process webhook record: {e}",
        # )
  


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
            pronunciation_tests_left=2,
        )
        subscriptions_record = Subscription(**new_subscription.model_dump())
        session.add(subscriptions_record)
        # user.subscription = subscriptions_record
        await session.commit()

        return {"data": user.subscription}

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

        if update.polar_product_id:
            record.polar_product_id = update.polar_product_id

        if update.polar_price_id:
            record.polar_price_id = update.polar_price_id

        if update.polar_subscription_id:
            record.polar_subscription_id = update.polar_subscription_id

        if update.polar_customer_id:
            record.polar_customer_id = update.polar_customer_id

        if update.polar_subscription_status:
            record.polar_subscription_status = update.polar_subscription_status

        if update.subscription_created_at:
            record.subscription_created_at = update.subscription_created_at

        if update.subscription_next_billed_at:
            record.subscription_next_billed_at = update.subscription_next_billed_at
        
        if update.subscription_cancelled_at:
            record.subscription_cancelled_at = update.subscription_cancelled_at
        
        if update.cancellation_reason:
            record.cancellation_reason = update.cancellation_reason
        
        if update.cancellation_comment:
            record.cancellation_comment = update.cancellation_comment

        if update.total_money_spent:
            record.total_money_spent += update.total_money_spent

        if update.credits_left:
            record.credits_left -= update.credits_left

        if update.pronunciation_tests_left:
            record.pronunciation_tests_left = update.pronunciation_tests_left

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


@router.get("/cancel-inline")
@limiter.limit("2/minute")
async def cancel_subscription_inline(
    request: Request,
    user: Annotated[User, Depends(current_active_user)],
    session: Annotated[AsyncSession, Depends(get_async_session)],
):
    try:
        subscription = await session.scalar(
            select(Subscription).where(Subscription.user_id == user.id)
        )

        if not subscription:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="No subscription found"
            )

        paddle_sub_id = subscription.paddle_subscription_id
        subscription_paddle = paddle.subscriptions.get(paddle_sub_id)

        if not subscription_paddle:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="No subscription found"
            )

        paddle.subscriptions.cancel(subscription_paddle.id, CancelSubscription())

    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=e)


@router.get("/cancel-link")
@limiter.limit("3/minute")
async def cancel_subscription(
    request: Request,
    user: Annotated[User, Depends(current_active_user)],
    session: Annotated[AsyncSession, Depends(get_async_session)],
):
    try:
        subscription = await session.scalar(
            select(Subscription).where(Subscription.user_id == user.id)
        )

        if not subscription:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="No subscription found"
            )

        return {"url": subscription.paddle_cancel_url}

    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=e)


@router.get("/update-link")
@limiter.limit("3/minute")
async def update_payment_link(
    request: Request,
    user: Annotated[User, Depends(current_active_user)],
    session: Annotated[AsyncSession, Depends(get_async_session)],
):
    try:
        subscription = await session.scalar(
            select(Subscription).where(Subscription.user_id == user.id)
        )

        if not subscription:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="No subscription found"
            )

        return {"url": subscription.paddle_update_url}

    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=e)


@router.post("/transaction")
@limiter.limit("10/minute")
async def create_price_transaction(
    request: Request,
    user: Annotated[User, Depends(current_active_user)],
    priceId: Annotated[str, Query()],
):
    try:
        prices = paddle.prices.list()
        list_prices = [price.id for price in list(prices)]

        if priceId not in list_prices:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Price does not exist with id {priceId}",
            )

        transaction = paddle.transactions.create(
            CreateTransaction(
                items=[TransactionCreateItem(price_id=priceId, quantity=1)]
            )
        )

        return {"transaction_id": transaction.id, "status": transaction.status}

    except Exception as e:
        return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e)
