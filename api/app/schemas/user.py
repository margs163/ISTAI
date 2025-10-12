import uuid
import datetime
from pydantic import Field
from typing import Any, Optional
from fastapi_users import schemas

from .analytics import AnalyticsSchema


class UserRead(schemas.BaseUser[uuid.UUID]):
    first_name: str
    last_name: str
    updatedAt: datetime.datetime
    createdAt: datetime.datetime
    last_login_at: datetime.datetime
    avatar_path: str | None


class UserCreate(schemas.BaseUserCreate):
    first_name: str
    last_name: str | None = None


class UserUpdate(schemas.BaseUserUpdate):
    first_name: str | None = None
    last_name: str | None = None
