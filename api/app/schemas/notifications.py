# class Notifications(Base):
#     __tablename__ = "notifications_table"

#     id: Mapped[UUID_ID] = mapped_column(GUID, primary_key=True, default=uuid.uuid4)
#     user_id: Mapped[UUID_ID] = mapped_column(
#         GUID, ForeignKey("user_table.id"), index=True
#     )
#     user: Mapped[User] = relationship(back_populates="notificates")
#     type: Mapped[str] = mapped_column(String(30))
#     message: Mapped[str] = mapped_column(String(250))
#     time: Mapped[datetime] = mapped_column(DateTime, default=datetime.now())

from datetime import datetime
import enum
from pydantic import BaseModel, Field


class NotificationsSchema(BaseModel):
    id: str | None = Field(default=None)
    user_id: str | None = Field(default=None)
    type: str = Field(max_length=50)
    message: str = Field(max_length=150)
    is_read: bool = Field(default=False)
    time: datetime | None = Field(default=None)


class NotificationTypeEnum(enum.StrEnum):
    GREETING = "Greeting"
    TEST_INFO = "Test Info"
    PROFILE_CHANGE = "Profile Change"
    STREAK = "Streak"
    CREDIT_BALANCE = "Credit Balance"
    CREDIT_PURCHASE = "Credit Purchase"
    PLAN_CHANGE = "Plan Change"


class CreateNotificationSchema(BaseModel):
    type: str = Field(max_length=50)
    message: str = Field(max_length=150)
    is_read: bool = Field(default=False)
    time: datetime | None = Field(default=None)
