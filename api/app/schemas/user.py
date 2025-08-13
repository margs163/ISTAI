import uuid
import datetime
from pydantic import Field
from typing import Optional
from fastapi_users import schemas


class UserRead(schemas.BaseUser[uuid.UUID]):
    pass

class UserCreate(schemas.BaseUserCreate):
    createdAt: Optional[datetime.datetime] = Field(default_factory=datetime.datetime.now)


class UserUpdate(schemas.BaseUserUpdate):
    updatedAt: Optional[datetime.datetime] = Field(default_factory=datetime.datetime.now)

