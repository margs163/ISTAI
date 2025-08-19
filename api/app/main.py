from fastapi import FastAPI
from fastapi_users import FastAPIUsers
from fastapi.middleware.cors import CORSMiddleware
from .routers.email import router as email_router
from .routers.questions import router as questions_router
from .lib.auth_db import User
from .users import fastapi_users, auth_backend
from .schemas.user import UserRead, UserCreate, UserUpdate
from .routers.transcriptions import router as transcription_router
from .routers.practice_test import router as practice_router
from .routers.reading_cards import router as reading_cards_router
from .routers.stt_ws import router as stt_router
from .routers.chat import router as chat_router

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
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

app.include_router(stt_router, prefix="/stt", tags=["stt"])

app.include_router(chat_router, prefix="/chat", tags=["chat"])


@app.get("/")
async def main():
    return {"message": "Hello, World!"}
