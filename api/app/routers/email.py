from fastapi import APIRouter, BackgroundTasks, Request
from pydantic import EmailStr
from fastapi_mail import MessageSchema, MessageType, FastMail
from ..dependencies import limiter
from ..users import conf

router = APIRouter()


@router.post("/test")
@limiter.limit("5/minute")
async def send_email(
    request: Request, emails: list[EmailStr], background_tasks: BackgroundTasks
):
    html = "<p>Hi this is test email!</p>"

    message = MessageSchema(
        subject="Testing FastAPI mail",
        recipients=emails,
        body=html,
        subtype=MessageType.html,
    )

    fm = FastMail(conf)

    background_tasks.add_task(fm.send_message, message)
    return {"message": "Successfully sent an email!"}
