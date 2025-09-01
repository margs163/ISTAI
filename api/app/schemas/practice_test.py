from pydantic import BaseModel, Field

from api.app.schemas.pronunciation import PronunciationMistake
from api.app.schemas.transcriptions import TranscriptionSchema


class CriteriaScores(BaseModel):
    fluency: float = Field(
        ge=2.0, le=9.0, multiple_of=0.5, description="Fluency band score of the test"
    )
    grammar: float = Field(
        ge=2.0, le=9.0, multiple_of=0.5, description="Grammar band score of the test"
    )
    pronunciation: float = Field(
        ge=2.0,
        le=9.0,
        multiple_of=0.5,
        description="Pronunciation band score of the test",
    )
    lexis: float = Field(
        ge=2.0, le=9.0, multiple_of=0.5, description="Lexis band score of the test"
    )


class WeakSides(BaseModel):
    fluency: list[str] = Field(min_length=3, max_length=5)
    grammar: list[str] = Field(min_length=3, max_length=5)
    pronunciation: list[str] = Field(min_length=3, max_length=5)
    lexis: list[str] = Field(min_length=3, max_length=5)


class StrongPoints(BaseModel):
    fluency: list[str] = Field(min_length=3, max_length=5)
    grammar: list[str] = Field(min_length=3, max_length=5)
    pronunciation: list[str] = Field(min_length=3, max_length=5)
    lexis: list[str] = Field(min_length=3, max_length=5)


class SentenceImprovement(BaseModel):
    original_sentence: str = Field(
        ...,
        description="The extracted original sentence (string, including part reference).",
    )
    identified_issues: list[str] = Field(
        ...,
        description="An array of 1–3 strings describing vocabulary issues (e.g., 'Basic word 'good' could be more precise').",
    )
    suggested_improvement: str = Field(..., description="The revised sentence (string)")
    explanation: str = Field(..., description="Explanation to improvements")


class SentenceImprovements(BaseModel):
    grammar_enhancements: list[SentenceImprovement] = Field(
        ...,
        description="An array of 3–5 objects, each representing a grammar-focused enhancement",
    )
    vocabulary_enhancements: list[SentenceImprovement] = Field(
        ...,
        description="An array of 3–5 objects, each representing a vocabulary-focused enhancement",
    )


class ErrorMistake(BaseModel):
    original_sentence: str = Field(..., description="The extracted original sentence")
    identified_mistakes: list[dict] = Field(
        ...,
        description="An array of 1–2 objects, each with mistake_type and mistake_description",
    )
    suggested_improvement: str = Field(..., description="The revised sentence (string)")
    explanation: str = Field(
        ..., description="A concise explanation of improvements to improvements"
    )


class VocabUsage(BaseModel):
    word_or_phrase: str = Field(
        ..., description="The extracted word or phrase (string)."
    )
    cefr_level: str = Field(
        ...,
        description="The CEFR classification level (string: 'B1', 'B2', 'C1', or 'C2').",
    )


class VocabRepetition(BaseModel):
    word_or_phrase: str = Field(
        ..., description="The extracted word or phrase (string)."
    )
    count: int = Field(
        ...,
        description="The CEFR classification level (string: 'B1', 'B2', 'C1', or 'C2",
    )
    suggested_synonyms: list[str] = Field(
        ...,
        description="A list of 2–4 strings with synonyms or alternatives (e.g., ['beneficial', 'advantageous', 'helpful', 'valuable']).",
    )


class VocabAnalysis(BaseModel):
    advanced_vocabulary: list[VocabUsage] = Field(
        ..., description="An array of 3–5 objects, each for an advanced vocabulary"
    )
    repetitions: list[VocabRepetition] = Field(
        ..., description="An array of 3–5 objects, each for a repeated word/phrase"
    )


class GeneralTips(BaseModel):
    fluency: list[str] = Field(min_length=3, max_length=5)
    grammar: list[str] = Field(min_length=3, max_length=5)
    pronunciation: list[str] = Field(min_length=3, max_length=5)
    lexis: list[str] = Field(min_length=3, max_length=5)


class GrammarAnalysis(BaseModel):
    grammar_analysis: list[ErrorMistake] = Field(
        ...,
        description="An array of 3–5 objects, each representing a grammar-focused analysis",
    )


class Result(BaseModel):
    id: str | None = Field(default=None)
    practice_test_id: str | None = Field(default=None)

    overall_score: float = Field(
        ge=2.0, le=9.0, multiple_of=0.5, description="Overall band score of the test"
    )
    criterion_scores: CriteriaScores = Field()
    weak_sides: WeakSides = Field()
    strong_points: StrongPoints = Field()
    sentence_improvements: SentenceImprovements = Field()
    grammar_errors: GrammarAnalysis = Field()
    vocabulary_usage: list[VocabUsage] = Field()
    repeated_words: list[VocabRepetition] = Field()
    general_tips: GeneralTips = Field()
    pronunciation_issues: list[PronunciationMistake] = Field()


class ReadingCardSchema(BaseModel):
    id: str | None = Field(default=None)
    topic: str = Field()
    text: str = Field()
    practice_id: str | None = Field(default=None)


class PracticeTestSchema(BaseModel):
    result: Result | None = Field(default=None)
    practice_name: str = Field(max_length=200)
    assistant: str = Field()
    status: str = Field()
    transcription: TranscriptionSchema | None = Field(default=None)
    part_one_card_id: str | None = Field(default=None)
    part_two_card_id: str | None = Field(default=None)
    reading_cards: list[ReadingCardSchema] | None = Field(default=None)


class PracticeTestUpdateSchema(BaseModel):
    result: Result | None = Field(default=None)
    transcription: TranscriptionSchema | None = Field(default=None)
    part_one_card_id: str | None = Field(default=None)
    part_two_card_id: str | None = Field(default=None)
    test_duration: int | None = Field(default=None)
    reading_cards: list[ReadingCardSchema] | None = Field(default=None)
    status: str | None = Field(default=None)
