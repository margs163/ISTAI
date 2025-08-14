from contextlib import asynccontextmanager
from typing import AsyncGenerator, Generator
import boto3.session
from fastapi_mail import ConnectionConfig
from .users import fastapi_users
from dotenv import load_dotenv
import os
import aioboto3
from aioboto3.session import Session

load_dotenv()

current_active_user = fastapi_users.current_user(active=True)


@asynccontextmanager
async def get_polly_client() -> AsyncGenerator[Session, None]:
    session = Session()
    async with session.client("polly", region_name="eu-north-1") as polly:
        try:
            yield polly
        finally:
            pass


@asynccontextmanager
async def get_s3_client() -> AsyncGenerator[Session, None]:
    session = Session()
    async with session.client("s3", region_name="eu-north-1") as s3:
        try:
            yield s3
        finally:
            pass
