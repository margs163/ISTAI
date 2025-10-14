from contextlib import asynccontextmanager
import logging
import os
from fastapi import FastAPI, Request
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

from .lib.auth_db import create_db_and_tables
from .routers.email import router as email_router
from .routers.questions import router as questions_router
from .users import fastapi_users, auth_backend
from .schemas.user import UserRead, UserCreate, UserUpdate
from .routers.transcriptions import router as transcription_router
from .routers.practice_test import router as practice_router
from .routers.reading_cards import router as reading_cards_router
from .routers.results import router as result_router
from .routers.stt_ws import router as stt_router
from .routers.subscription import router as subscription_router
from .routers.analytics import router as analytics_router
from .routers.chat import router as chat_router
from .routers.avatar import router as avatar_router
from .routers.notifications import router as notification_router
from .routers.pronunciation_test import router as pronunciation_test_router
from .routers.questionnaire import router as questionnaire_router
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from .dependencies import limiter
from .users import google_oauth_client
import uvicorn

load_dotenv()

SECRET = os.getenv("SECRET")
if not SECRET:
    raise Exception("Google OAuth Secret empty")

@asynccontextmanager
async def lifespan(app: FastAPI):
    yield


app = FastAPI(lifespan=lifespan)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

origins = [
    "http://localhost",
    "http://localhost:3000",
    "https://ielts-fluency.vercel.app",
    "http://frontend:3000",
    "http://nextjs:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(email_router, prefix="/email", tags=["email"])
app.include_router(
    fastapi_users.get_auth_router(auth_backend), prefix="/auth/jwt", tags=["auth"]
)

app.include_router(
    fastapi_users.get_oauth_router(
        google_oauth_client,
        auth_backend,
        SECRET,
        is_verified_by_default=True,
        associate_by_email=True,
    ),
    prefix="/auth/google",
    tags=["auth"],
)

app.include_router(
    fastapi_users.get_oauth_associate_router(google_oauth_client, UserRead, "SECRET"),
    prefix="/auth/associate/google",
    tags=["auth"],
)

app.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
    prefix="/auth",
    tags=["auth"],
)
app.include_router(
    fastapi_users.get_verify_router(UserRead),
    prefix="/auth",
    tags=["auth"],
)
app.include_router(
    fastapi_users.get_reset_password_router(),
    prefix="/auth",
    tags=["auth"],
)
app.include_router(
    fastapi_users.get_users_router(UserRead, UserUpdate),
    prefix="/users",
    tags=["users"],
)

app.include_router(questions_router, prefix="/questions", tags=["questions"])

app.include_router(
    transcription_router, prefix="/transcription", tags=["transcription"]
)

app.include_router(practice_router, prefix="/practice_test", tags=["practice_test"])

app.include_router(
    reading_cards_router, prefix="/reading_cards", tags=["reading_cards"]
)

app.include_router(avatar_router, prefix="/avatar", tags=["avatar"])

app.include_router(stt_router, prefix="/stt", tags=["stt"])

app.include_router(chat_router, prefix="/chat", tags=["chat"])

app.include_router(result_router, prefix="/results", tags=["results"])

app.include_router(analytics_router, prefix="/analytics", tags=["analytics"])

app.include_router(subscription_router, prefix="/subscription", tags=["subscription"])

app.include_router(notification_router, prefix="/notifications", tags=["notifications"])

app.include_router(
    pronunciation_test_router, prefix="/pronunciation-test", tags=["pronunciation test"]
)

app.include_router(
    questionnaire_router, prefix="/questionnaire", tags=["questionnaire"]
)


@app.get("/")
@limiter.limit("8/minute")
async def main(request: Request):
    return {"message": "Hello, World!"}


if __name__ == "__main__":
    uvicorn.run(
        "app.main:app", host="127.0.0.1", port=8000, log_level="info", reload=True
    )
