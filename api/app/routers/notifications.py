from datetime import date
from typing import Annotated
from fastapi import APIRouter, Body, Depends, HTTPException, Query, Request, status
from sqlalchemy import func, select

from api.app.lib.auth_db import get_async_session
from api.app.schemas.db_tables import Notifications, User
from api.app.dependencies import current_active_user
from sqlalchemy.ext.asyncio import AsyncSession
from ..dependencies import limiter

from api.app.schemas.notifications import (
    CreateNotificationSchema,
    NotificationTypeEnum,
    NotificationsSchema,
)

router = APIRouter(dependencies=[Depends(current_active_user)])


@router.get("/me")
@limiter.limit("25/minute")
async def get_notifications(
    request: Request,
    user: Annotated[User, Depends(current_active_user)],
    session: Annotated[AsyncSession, Depends(get_async_session)],
    today: Annotated[bool, Query()] = False,
):
    try:

        query = select(Notifications).where(Notifications.user_id == user.id)

        if today:
            query = query.where(func.date(Notifications.time) == date.today())

        records = await session.scalars(query.order_by(Notifications.time))
        return {"data": records.all()}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not fetch notifications record: {e}",
        )


@router.post("/init")
@limiter.limit("4/minute")
async def init_notifications(
    request: Request,
    user: Annotated[User, Depends(current_active_user)],
    session: Annotated[AsyncSession, Depends(get_async_session)],
):
    try:
        hello_message = (
            "Hello, welcome to AIELTSTalk! You have successfully registered."
        )

        new_message = NotificationsSchema(
            user_id=str(user.id),
            type=NotificationTypeEnum.GREETING.value,
            message=hello_message,
        )

        notification = Notifications(**new_message.model_dump())

        session.add(notification)
        await session.commit()

        return {"data": notification}
    except Exception as e:
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not fetch notifications record: {e}",
        )


@router.put("/")
@limiter.limit("20/minute")
async def create_notification(
    request: Request,
    user: Annotated[User, Depends(current_active_user)],
    session: Annotated[AsyncSession, Depends(get_async_session)],
    notification: Annotated[CreateNotificationSchema, Body()],
):
    try:
        new_message = NotificationsSchema(
            user_id=str(user.id),
            type=notification.type,
            message=notification.message,
        )

        notification = Notifications(**new_message.model_dump())
        user.notificates.append(notification)

        session.add(notification)
        await session.commit()

        return {"data": notification}
    except Exception as e:
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not fetch notifications record: {e}",
        )
