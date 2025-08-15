from pydantic import BaseModel, Field


class PronunciationMistake(BaseModel):
    word: str
    accuracy: int = Field(ge=0, le=100)
    phonemes: str


class PronunciationAnalysis(BaseModel):
    pronunciationScore: float = Field(ge=2, le=9, multiple_of=0.5)
    pronunciationStrongPoints: list[str]
    pronunciationWeakSides: list[str]
    pronunciationMistakes: list[PronunciationMistake]
    pronunciationTips: list[str]
