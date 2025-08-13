from pydantic import BaseModel, Field
from .db_tables import TestPartEnum

class QuestionSchema(BaseModel):
    part: TestPartEnum = Field(description="The part of which the question belongs to")
    topic: str = Field(max_length=800)
    questions: list[str] = Field(min_length=1)