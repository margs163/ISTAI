from fastapi_users.authentication import (
    CookieTransport,
    JWTStrategy,
    AuthenticationBackend,
)
from fastapi_users import UUIDIDMixin, BaseUserManager, FastAPIUsers
from fastapi_mail import ConnectionConfig, MessageSchema, FastMail, MessageType

from api.app.schemas.analytics import AnalyticsSchema, AverageBandScores
from api.app.schemas.db_tables import Analytics
from .lib.auth_db import User, get_async_session, get_user_db
from fastapi import Request, Depends
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

if not mail_address or not mail_pwd:
    raise Exception("no env variables")

conf = ConnectionConfig(
    MAIL_USERNAME="aldanovdaniyal",
    MAIL_PASSWORD=mail_pwd,
    MAIL_FROM=mail_address,
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_FROM_NAME="AIELTSTalk",
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True,
)


class UserManager(UUIDIDMixin, BaseUserManager[User, uuid.UUID]):
    reset_password_token_secret = SECRET
    verification_token_secret = SECRET

    async def on_after_register(self, user: User, request: Optional[Request] = None):
        html = "<p>Hi, you have successfully registered in <strong>AIELTSTalk!</strong> Visit the dashboard to learn more.</p>"

        message = MessageSchema(
            subject="Successful Registration in AIELTSTalk",
            recipients=[user.email],
            body=html,
            subtype=MessageType.html,
        )

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
                    average_band=0,
                    common_mistakes={"prop": None},
                    streak_days=0,
                )
                analytics_record = Analytics(**new_analytics.model_dump())
                session.add(analytics_record)
                await session.commit()
            except Exception as e:
                await session.rollback()
                print(
                    f"Could not create analytics record after registering.\nError: {e}"
                )

        fm = FastMail(conf)
        await fm.send_message(message=message)
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
                        <p>Hi, you have requested a password reset. Click on the following link to set a new password: http://localhost:3000/new-password/{token}</p>
                    </div>
                </body>
                </html>"""

        message = MessageSchema(
            subject="Password Reset in AIELTSTalk",
            recipients=[user.email],
            body=html,
            subtype=MessageType.html,
        )

        fm = FastMail(conf)
        await fm.send_message(message=message)
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
                        <p>Hi, you have to verify your email to continue. Click on the following link to verify your e: http://localhost:3000/verify/{token}</p>
                    </div>
                </body>
                </html>"""

        message = MessageSchema(
            subject="Account Verification in AIELTSTalk",
            recipients=[user.email],
            body=html,
            subtype=MessageType.html,
        )

        fm = FastMail(conf)
        await fm.send_message(message=message)
        print(f"Verification requested for user {user.id}. Verification token: {token}")


cookie_transport = CookieTransport(cookie_max_age=259200, cookie_name="account-session")


def get_jwt_strategy() -> JWTStrategy:
    return JWTStrategy(secret=SECRET, lifetime_seconds=259200)


auth_backend = AuthenticationBackend(
    name="jwt", transport=cookie_transport, get_strategy=get_jwt_strategy
)


async def get_user_manager(user_db=Depends(get_user_db)):
    yield UserManager(user_db)


fastapi_users = FastAPIUsers[User, uuid.UUID](get_user_manager, [auth_backend])
