from datetime import datetime
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from api.app.schemas.db_tables import Notifications, User
from api.app.schemas.notifications import NotificationTypeEnum, NotificationsSchema


async def create_notification(
    user_id: str, message: str, session: AsyncSession, type: NotificationTypeEnum
) -> None:

    user = await session.scalar(
        select(User).where(User.id == user_id).options(joinedload(User.notificates))
    )
    notification = NotificationsSchema(
        user_id=str(user_id), type=type.value, message=message, time=datetime.now()
    )
    record = Notifications(**notification.model_dump())
    user.notificates.append(record)
