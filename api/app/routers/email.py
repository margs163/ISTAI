from fastapi import APIRouter, BackgroundTasks
from pydantic import EmailStr
from fastapi_mail import MessageSchema, MessageType, FastMail
from ..users import conf

router = APIRouter()


@router.post("/test")
async def send_email(emails: list[EmailStr], background_tasks: BackgroundTasks):
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

