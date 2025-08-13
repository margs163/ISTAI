from typing import Generator
import boto3.session
from fastapi_mail import ConnectionConfig
from .users import fastapi_users
from dotenv import load_dotenv
import os
import boto3

load_dotenv()

current_active_user = fastapi_users.current_user(active=True)
polly_client = boto3.client("polly", region_name="eu-north-1")
s3_client = boto3.client("s3", region_name="eu-north-1")


def get_polly_client() -> Generator[boto3.session.Session, None]:
    yield polly_client


def get_s3_client() -> Generator[boto3.session.Session, None]:
    yield s3_client
