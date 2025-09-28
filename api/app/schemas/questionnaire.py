import uuid
from pydantic import BaseModel, Field


class QuestionnaireSchema(BaseModel):
    id: str | None = Field(default=None)
    user_id: str | None = Field(default=None)
    heard_from: str | None = Field(default=None)
    previous_score: float | None = Field(default=None)
    role: str | None = Field(default=None)
    test_experience: float | None = Field(default=None)
    ui_intuitivity: float | None = Field(default=None)
    eval_accuracy: float | None = Field(default=None)
    suggestion: str | None = Field(default=None)
