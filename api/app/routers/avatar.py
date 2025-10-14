from datetime import datetime
import os
from typing import Annotated, Any
from uuid import uuid4
from fastapi import (
    APIRouter,
    Body,
    Depends,
    File,
    HTTPException,
    Request,
    UploadFile,
    status,
)
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import joinedload

from ..lib.auth_db import get_async_session
from ..lib.send_notification import create_notification
from ..schemas.db_tables import Notifications, Subscription, User
from ..schemas.notifications import NotificationTypeEnum, NotificationsSchema
from ..dependencies import current_active_user, get_s3_client
from sqlalchemy.ext.asyncio import AsyncSession
from ..dependencies import limiter
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(dependencies=[Depends(current_active_user)])


class AvatarUpdateSchema(BaseModel):
    path: str


bucket_name = os.getenv("S3_BUCKET_NAME")


@router.put("/me")
@limiter.limit("10/minute")
async def upload_avatar(
    request: Request,
    user: Annotated[User, Depends(current_active_user)],
    session: Annotated[AsyncSession, Depends(get_async_session)],
    file: UploadFile,
    s3_client: Annotated[Any, Depends(get_s3_client)],
):

    try:
        filePath = f"avatars/file-{uuid4()}.{file.filename.split(".")[-1]}"
        fileBytes = await file.read()
        await s3_client.put_object(
            Bucket=bucket_name,
            Key=filePath,
            Body=fileBytes,
        )
        await file.close()

        user.avatar_path = filePath

        await create_notification(
            user_id=str(user.id),
            session=session,
            type=NotificationTypeEnum.PROFILE_CHANGE,
            message="You have updated your avatar",
        )
        await session.commit()

        return {"filepath": filePath}

    except Exception as e:
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not upload avatar file: {e}",
        )


@router.delete("/me")
@limiter.limit("10/minute")
async def delete_my_avatar(
    request: Request,
    user: Annotated[User, Depends(current_active_user)],
    session: Annotated[AsyncSession, Depends(get_async_session)],
    s3_client: Annotated[Any, Depends(get_s3_client)],
):
    try:
        fileKey = user.avatar_path
        await s3_client.delete_object(Bucket=bucket_name, Key=fileKey)
        user.avatar_path = ""

        await session.commit()

    except Exception as e:
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not upload avatar file: {e}",
        )
