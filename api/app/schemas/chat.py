import enum
from pydantic import BaseModel, Field
import uuid


def generate_id():
    return str(uuid.uuid4())


class AssistantEnumSchema(enum.Enum):
    RON = "Ron"
    Kate = "Kate"


class AIChunk(BaseModel):
    chunkID: str = Field(default_factory=generate_id)
    chunk: str = Field()
    assistant: AssistantEnumSchema = Field()
