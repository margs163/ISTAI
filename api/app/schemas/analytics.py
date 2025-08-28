from pydantic import BaseModel, Field


class AverageBandScores(BaseModel):
    fluency: float
    grammar: float
    lexis: float
    pronunciation: float


class GrammarCommonMistake(BaseModel):
    original_sentence: str
    identified_mistakes: list[dict]
    suggested_improvement: str
    frequency: int
    explanation: str


class VocabularyCommonMistake(BaseModel):
    original_sentence: str
    identified_issues: list[str]
    suggested_improvement: str
    frequency: int
    explanation: str


class PronunciationCommonMistake(BaseModel):
    word: str
    accuracy: int = Field(ge=0, le=100)
    mistake_type: str
    user_phonemes: str
    correct_phonemes: str
    frequency: int


class AnalyticsSchema(BaseModel):
    id: str | None = Field(default=None)
    user_id: str
    practice_time: int
    tests_completed: int
    current_bandscore: float
    average_band_scores: AverageBandScores
    average_band: float
    grammar_common_mistakes: list[GrammarCommonMistake] | None = Field(default=None)
    lexis_common_mistakes: list[VocabularyCommonMistake] | None = Field(default=None)
    pronunciation_common_mistakes: list[PronunciationCommonMistake] | None = Field(
        default=None
    )
    streak_days: int


class AnalyticsUpdateSchema(BaseModel):
    practice_time: int | None = Field(default=None)
    tests_completed: int | None = Field(default=None)
    current_bandscore: float | None = Field(default=None)
    average_band_scores: AverageBandScores | None = Field(default=None)
    average_band: float | None = Field(default=None)
    grammar_common_mistakes: list[GrammarCommonMistake] | None = Field(default=None)
    lexis_common_mistakes: list[VocabularyCommonMistake] | None = Field(default=None)
    pronunciation_common_mistakes: list[PronunciationCommonMistake] | None = Field(
        default=None
    )
    streak_days: int | None = Field(default=None)
