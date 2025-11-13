from datetime import datetime, timedelta
from fastapi_users.authentication import (
    CookieTransport,
    JWTStrategy,
    AuthenticationBackend,
)
from typing import Annotated
from fastapi_users import UUIDIDMixin, BaseUserManager, FastAPIUsers
from fastapi_mail import ConnectionConfig, MessageSchema, FastMail, MessageType
from sqlalchemy import select, delete, and_
from sqlalchemy.ext.asyncio import AsyncSession
from logging import getLogger

from .schemas.analytics import AnalyticsSchema, AverageBandScores, BandScoresIncrease
from .schemas.db_tables import (
    Analytics,
    Notifications,
    PracticeTest,
    Subscription,
)
from .schemas.notifications import NotificationTypeEnum, NotificationsSchema
from .schemas.subscriptions import SubscriptionSchema, TierEnum
from .lib.auth_db import User, get_async_session, get_user_db
from fastapi import Request, Depends, Response
from fastapi.responses import RedirectResponse
from httpx_oauth.clients.google import GoogleOAuth2
from .lib.celery_app import celery_app
import asyncio
from typing import Optional
import uuid
from dotenv import load_dotenv
import os

load_dotenv()

SECRET = os.getenv("SECRET")
if not SECRET:
    raise Exception("No secret!")

mail_address = os.getenv("MAIL_ADDRESS")
mail_pwd = os.getenv("APP_PWD")
logger = getLogger(__name__)

if not mail_address or not mail_pwd:
    raise Exception("no env variables")

conf = ConnectionConfig(
    MAIL_USERNAME="aldanovdaniyal",
    MAIL_PASSWORD=mail_pwd,
    MAIL_FROM=mail_address,
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_FROM_NAME="Fluent Flow",
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True,
)

CLIENT_ID = os.getenv("GOOGLE_OAUTH_CLIENTID")
CLIENT_SECRET = os.getenv("GOOGLE_OAUTH_SECRET")

google_oauth_client = GoogleOAuth2(
    CLIENT_ID, CLIENT_SECRET, scopes=["openid", "email", "profile"]
)


@celery_app.task(ignore_result=True)
async def send_email_offload(subject: str, user_email: str, html_content: str) -> None:
    global conf

    message = MessageSchema(
        subject=subject,
        recipients=[user_email],
        body=html_content,
        subtype=MessageType.html,
    )
    fm = FastMail(conf)
    await fm.send_message(message=message)


class UserManager(UUIDIDMixin, BaseUserManager[User, uuid.UUID]):
    reset_password_token_secret = SECRET
    verification_token_secret = SECRET

    async def on_after_register(self, user: User, request: Optional[Request] = None):
        html = "<p>Hi, you have successfully registered in <strong>FluentFlow!</strong> Visit the dashboard to learn more.</p>"
        subject = "Successful Registration in FluentFlow"

        async for session in get_async_session():
            try:
                new_analytics = AnalyticsSchema(
                    user_id=str(user.id),
                    practice_time=0,
                    tests_completed=0,
                    current_bandscore=0,
                    average_band_scores=AverageBandScores(
                        fluency=0, grammar=0, lexis=0, pronunciation=0
                    ),
                    scores_increase=BandScoresIncrease(
                        fluency=0, grammar=0, lexis=0, pronunciation=0
                    ),
                    average_band=0,
                    grammar_common_mistakes=[],
                    lexis_common_mistakes=[],
                    pronunciation_common_mistakes=[],
                    streak_days=0,
                )

                new_subscription = SubscriptionSchema(
                    user_id=str(user.id),
                    subscription_tier=TierEnum.FREE.value,
                    credits_total_purchased=0,
                    pronunciation_tests_left=2,
                    credits_left=20,
                )

                hello_message = (
                    "Hello, welcome to FluentFlow! You have successfully registered."
                )

                new_message = NotificationsSchema(
                    user_id=str(user.id),
                    type=NotificationTypeEnum.GREETING.value,
                    message=hello_message,
                )

                notification = Notifications(**new_message.model_dump())
                analytics_record = Analytics(**new_analytics.model_dump())
                subscriptions_record = Subscription(**new_subscription.model_dump())

                session.add_all([analytics_record, subscriptions_record, notification])
                await session.commit()
            except Exception as e:
                await session.rollback()
                print(
                    f"Could not create analytics record after registering.\nError: {e}"
                )

        # fm = FastMail(conf)
        # await fm.send_message(message=message)
        send_email_offload.delay(subject, user.email, html)
        print(f"User {user.id} has registered.")

    async def on_after_forgot_password(
        self, user: User, token: str, request: Optional[Request] = None
    ):
        html = f"""<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Password Reset</title>
                </head>
                <body>
                    <div>
                        <h1>Password Reset</h1> 
                        <p>Hi, you have requested a password reset. Click on the following link to set a new password: https://fluentflow.space/login/new-password/{token}</p>
                    </div>
                </body>
                </html>"""

        subject = "Password Reset in FluentFlow"

        # fm = FastMail(conf)
        # await fm.send_message(message=message)
        send_email_offload.delay(subject, user.email, html)
        print(f"User {user.id} has forgot their password. Reset token: {token}")

    async def on_after_request_verify(
        self, user: User, token: str, request: Optional[Request] = None
    ):
        html = f"""<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Account Verification</title>
                </head>
                <body>
                    <div>
                        <h1>Email verification</h1> 
                        <p>Hi, you have to verify your email to continue. Click on the following link to verify your e: https://fluentflow.space/verify/{token}</p>
                    </div>
                </body>
                </html>"""

        subject = "Account Verification in FluentFlow"

        # fm = FastMail(conf)
        # await fm.send_message(message=message)
        send_email_offload.delay(subject, user.email, html)
        print(f"Verification requested for user {user.id}. Verification token: {token}")

    async def on_after_login(
        self,
        user: User,
        request: Optional[Request] = None,
        response: Optional[Response] = None,
    ):
        try:
            async for session in get_async_session():
                async with session.begin():
                    analytic = await session.scalar(
                        select(Analytics).where(Analytics.user_id == user.id)
                    )
                    user_record = await session.scalar(
                        select(User).where(User.id == user.id)
                    )
                    sub_record = await session.scalar(
                        select(Subscription).where(Subscription.user_id == user.id)
                    )

                    tests = await session.scalars(
                        select(PracticeTest)
                        .where(PracticeTest.user_id == user.id)
                        .order_by(PracticeTest.test_date.desc())
                    )

                    one_day_ago = datetime.now() - timedelta(days=1)

                    deleted_result = await session.execute(
                        delete(Notifications).where(
                            and_(
                                Notifications.time < one_day_ago,
                                Notifications.user_id == user.id,
                            )
                        )
                    )

                    result = tests.unique()
                    result = result.all()

                    if result and analytic:
                        last = result[0]
                        print("LAST DATE:", last.test_date)
                        if datetime.now() - last.test_date > timedelta(days=1):
                            analytic.streak_days = 0

                    if (
                        user_record.last_login_at is not None
                        and datetime.now() - user_record.last_login_at
                        > timedelta(days=1)
                    ):
                        if sub_record.subscription_tier == TierEnum.STARTER.value:
                            sub_record.pronunciation_tests_left = 6
                        elif sub_record.subscription_tier == TierEnum.PRO.value:
                            sub_record.pronunciation_tests_left = 10
                        else:
                            sub_record.pronunciation_tests_left = 2

                    user_record.last_login_at = datetime.now()
                    await session.commit()

                    logger.log(
                        f"Deleted {str(deleted_result.rowcount)} notifications from user {str(user.id)}"
                    )

                    print("Last login is set!", user_record.last_login_at)

            if response is not None:
                return RedirectResponse(url="http://localhost:3000/dashboard")

        except Exception as e:
            logger.error(f"Could not process login request: {str(e)}")
            return RedirectResponse(url="http://localhost:3000/dashboard")


cookie_transport = CookieTransport(
    cookie_max_age=259200, cookie_name="account-session", cookie_samesite="none"
)


def get_jwt_strategy() -> JWTStrategy:
    return JWTStrategy(secret=SECRET, lifetime_seconds=259200)


auth_backend = AuthenticationBackend(
    name="jwt", transport=cookie_transport, get_strategy=get_jwt_strategy
)


async def get_user_manager(user_db=Depends(get_user_db)):
    yield UserManager(user_db)


fastapi_users = FastAPIUsers[User, uuid.UUID](get_user_manager, [auth_backend])
