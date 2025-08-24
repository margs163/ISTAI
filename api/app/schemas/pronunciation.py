from pydantic import BaseModel, Field


class PronunciationMistake(BaseModel):
    word: str
    accuracy: int = Field(ge=0, le=100)
    mistake_type: str
    user_phonemes: str
    correct_phonemes: str


class PronunciationAnalysis(BaseModel):
    pronunciation_score: float = Field(ge=2, le=9, multiple_of=0.5)
    pronunciation_strong_points: list[str]
    pronunciation_weak_sides: list[str]
    pronunciation_mistakes: list[PronunciationMistake]
    pronunciation_tips: list[str]
