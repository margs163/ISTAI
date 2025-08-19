from pydantic import BaseModel, Field
from .db_tables import TestPartEnum


class QuestionSchema(BaseModel):
    part: int = Field(
        description="The part of which the question belongs to", ge=1, le=2
    )
    topic: str = Field(max_length=800)
    questions: list[str] = Field(min_length=1)
