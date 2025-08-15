import uuid
import datetime
from pydantic import Field
from typing import Optional
from fastapi_users import schemas


class UserRead(schemas.BaseUser[uuid.UUID]):
    first_name: str
    last_name: str


class UserCreate(schemas.BaseUserCreate):
    first_name: str
    last_name: str | None


class UserUpdate(schemas.BaseUserUpdate):
    first_name: str | None
    last_name: str | None
    pass
