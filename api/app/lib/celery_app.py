from celery import Celery
from celery.utils.log import get_task_logger

celery_app = Celery(
    "tasks",
    broker="redis://:Brawl01man@kv-redis:6379/0",
    backend="redis://:Brawl01man@kv-redis:6379/0",
    include=["app.users", "app.routers.results", "app.lib.groq_audio"],
)
celery_logger = get_task_logger(__name__)
