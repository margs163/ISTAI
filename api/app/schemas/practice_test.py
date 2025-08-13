from pydantic import BaseModel, Field

from api.app.schemas.db_tables import AssistantEnum, QuestionCard
from api.app.schemas.transcriptions import TranscriptionSchema

# class Result(Base):
#     __tablename__ = "result_table"

#     id: Mapped[UUID_ID] = mapped_column(GUID, primary_key=True, expire_on_commit=False, default=uuid.uuid4)
#     practice_test_id: Mapped[UUID_ID] = mapped_column(GUID, ForeignKey("practice_test_table.id"), index=True)
#     practice_test: Mapped["PracticeTest"] = relationship(back_populates="result")

#     overall_score: Mapped[float] = mapped_column(Float)
#     criterion_scores: Mapped[dict[str, float]] = mapped_column(JSONB)
#     weak_sides: Mapped[dict[str, list[str]]] = mapped_column(JSONB)
#     strong_sides: Mapped[dict[str, list[str]]] = mapped_column(JSONB)
#     sentence_improvements: Mapped[dict[str, Any]] = mapped_column(JSONB)
#     grammar_errors: Mapped[dict[str, Any] | list[dict]] = mapped_column(JSONB)
#     vocabulary_usage: Mapped[list[dict]] = mapped_column(JSONB)
#     repeated_words: Mapped[list[dict]] = mapped_column(JSONB)
#     pronunciation_issues: Mapped[list[dict]] = mapped_column(JSONB)
#     general_tips: Mapped[dict[str, list[str]]] = mapped_column(JSONB)

# class PracticeTest(Base):
#     __tablename__ = "practice_test_table"

#     id: Mapped[UUID_ID] = mapped_column(GUID, primary_key=True, expire_on_commit=False, default=uuid.uuid4)
#     user_id: Mapped[UUID_ID] = mapped_column(ForeignKey("user_table.id"), index=True)
#     user: Mapped[User] = relationship(back_populates="practice_tests")
#     result: Mapped[Result] = relationship(back_populates="practice_test")

#     practice_name: Mapped[str] = mapped_column(String(length=100))
#     assistant: Mapped[AssistantEnum] = mapped_column(ORMEnum(AssistantEnum, name="assistant_enum"))
#     transcription: Mapped[Transcription] = relationship(back_populates="practice_test")

#     part_one_card_id = mapped_column(GUID, ForeignKey("question_cards_table.id"), index=True)
#     part_two_card_id = mapped_column(GUID, ForeignKey("question_cards_table.id"), index=True)
#     part_one_card: Mapped[QuestionCard] = relationship("QuestionCard", foreign_keys=[part_one_card_id])
#     part_two_card: Mapped[QuestionCard] = relationship("QuestionCard", foreign_keys=[part_two_card_id])


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
    originalSentence: str = Field(
        ...,
        description="The extracted original sentence (string, including part reference).",
    )
    identifiedMistake: list[str] = Field(
        ...,
        description="An array of 1–3 strings describing vocabulary issues (e.g., 'Basic word 'good' could be more precise').",
    )
    suggestedImprovement: str = Field(..., description="The revised sentence (string)")
    explanation: str = Field(..., description="Explanation to improvements")


class SentenceImprovements(BaseModel):
    grammarEnhancements: list[SentenceImprovement] = Field(
        ...,
        description="An array of 3–5 objects, each representing a grammar-focused enhancement",
    )
    vocabularyEnhancements: list[SentenceImprovement] = Field(
        ...,
        description="An array of 3–5 objects, each representing a vocabulary-focused enhancement",
    )


class ErrorMistake(BaseModel):
    originalSentence: str = Field(..., description="The extracted original sentence")
    identifiedMistake: list[dict] = Field(
        ...,
        description="An array of 1–2 objects, each with mistakeType and mistakeDescription",
    )
    suggestedImprovement: str = Field(..., description="The revised sentence (string)")
    explanation: str = Field(
        ..., description="A concise explanation of improvements to improvements"
    )


class VocabUsage(BaseModel):
    wordOrPhrase: str = Field(..., description="The extracted word or phrase (string).")
    cefrLevel: str = Field(
        ...,
        description="The CEFR classification level (string: 'B1', 'B2', 'C1', or 'C2').",
    )


class VocabRepetition(BaseModel):
    wordOrPhrase: str = Field(..., description="The extracted word or phrase (string).")
    count: int = Field(
        ...,
        description="The CEFR classification level (string: 'B1', 'B2', 'C1', or 'C2",
    )
    suggestedSynonyms: list[str] = Field(
        ...,
        description="A list of 2–4 strings with synonyms or alternatives (e.g., ['beneficial', 'advantageous', 'helpful', 'valuable']).",
    )


class VocabAnalysis(BaseModel):
    advancedVocabulary: list[VocabUsage] = Field(
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


class Result(BaseModel):
    overall_score: float = Field(
        ge=2.0, le=9.0, multiple_of=0.5, description="Overall band score of the test"
    )
    criterion_scores: CriteriaScores = Field()
    weak_sides: WeakSides = Field()
    strong_points: StrongPoints = Field()
    sentence_improvements: SentenceImprovements = Field()
    grammar_errors: list[ErrorMistake] = Field()
    vocabulary_usage: VocabUsage = Field()
    repeated_words: VocabRepetition = Field()
    general_tips: GeneralTips = Field()


class ReadingCardSchema(BaseModel):
    topic: str = Field()
    text: str = Field()


class PracticeTestSchema(BaseModel):
    result: Result | None = Field()
    practice_name: str = Field(max_length=200)
    assistant: AssistantEnum = Field()
    transcription: TranscriptionSchema | None = Field()
    part_one_card_id: str | None = Field()
    part_two_card_id: str | None = Field()
    reading_card_id: str | None = Field()


class PracticeTestUpdateSchema(BaseModel):
    result: Result | None = Field()
    transcription: TranscriptionSchema | None = Field()
    part_one_card_id: str | None = Field()
    part_two_card_id: str | None = Field()
