from typing import AsyncGenerator
from .users import fastapi_users
from dotenv import load_dotenv
from aioboto3.session import Session
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from openai import OpenAI
from polar_sdk import Polar
from celery import Celery
from celery.utils.log import get_task_logger

import os
import redis

load_dotenv()

current_active_user = fastapi_users.current_user(active=True)
limiter = Limiter(key_func=get_remote_address)


async def get_openai_client() -> AsyncGenerator[OpenAI, None]:
    client = OpenAI(
        api_key=os.environ.get("OPENAI_API_KEY"),
    )

    try:
        yield client
    finally:
        client.close()


async def get_redis_client() -> AsyncGenerator[redis.Redis, None]:
    instance = redis.Redis(
        host="kv-redis",
        port=6379,
        decode_responses=True,
        password=os.getenv("REDIS_PASSWORD"),
    )

    try:
        yield instance
    finally:
        instance.close()


async def get_polly_client() -> AsyncGenerator[Session, None]:
    session = Session()
    async with session.client("polly", region_name="eu-central-1") as polly:
        try:
            yield polly
        finally:
            pass


async def get_s3_client() -> AsyncGenerator[Session, None]:
    session = Session()
    async with session.client("s3", region_name="eu-central-1") as s3:
        try:
            yield s3
        finally:
            pass


async def get_pollar_client() -> AsyncGenerator[Polar, None]:
    async with Polar(
        access_token=os.getenv("POLAR_ACCESS_TOKEN_TEST"), server="sandbox"
    ) as polar:
        try:
            yield polar
        finally:
            pass
