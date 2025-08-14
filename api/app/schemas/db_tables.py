from fastapi_users_db_sqlalchemy import SQLAlchemyBaseUserTableUUID
import enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import (
    FLOAT,
    ForeignKey,
    String,
    DateTime,
    Enum as ORMEnum,
    Integer,
    Float,
    ARRAY,
    Text,
    sql,
)
from datetime import timedelta
from fastapi_users_db_sqlalchemy.generics import GUID
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import DeclarativeBase
from datetime import datetime
from typing import Any
import uuid

UUID_ID = uuid.UUID


class AssistantEnum(enum.Enum):
    RON = "Ron"
    EMMA = "Emma"


class TestPartEnum(enum.Enum):
    PART_ONE = "Part_One"
    PART_TWO = "Part_Two"


class SubscriptionEnum(enum.Enum):
    FREE = "Free"
    STARTER = "STARTER"
    PRO = "PRO"


class TestStatusEnum(enum.Enum):
    ONGOING = "Ongoing"
    FINISHED = "Finished"
    CANCELLED = "Cancelled"
    PAUSED = "Paused"


class Base(DeclarativeBase):
    pass


class User(Base, SQLAlchemyBaseUserTableUUID):
    createdAt: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.now(), nullable=True
    )
    updatedAt: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.now(), nullable=True, onupdate=datetime.now()
    )
    subscription: Mapped["Subscription"] = relationship(back_populates="user")
    practice_tests: Mapped[list["PracticeTest"]] = relationship(back_populates="user")
    analytics: Mapped["Analytics"] = relationship(back_populates="user")
    notificates: Mapped["Notifications"] = relationship(back_populates="user")
    transcriptions: Mapped[list["Transcription"]] = relationship(back_populates="user")
    pronunciation_tests: Mapped[list["PronunciationTest"]] = relationship(
        back_populates="user"
    )


class Result(Base):
    __tablename__ = "result_table"

    id: Mapped[UUID_ID] = mapped_column(GUID, primary_key=True, default=uuid.uuid4)
    practice_test_id: Mapped[UUID_ID] = mapped_column(
        GUID, ForeignKey("practice_test_table.id"), index=True
    )
    practice_test: Mapped["PracticeTest"] = relationship(back_populates="result")

    overall_score: Mapped[float] = mapped_column(Float)
    criterion_scores: Mapped[dict[str, float]] = mapped_column(JSONB)
    weak_sides: Mapped[dict[str, list[str]]] = mapped_column(JSONB)
    strong_points: Mapped[dict[str, list[str]]] = mapped_column(JSONB)
    sentence_improvements: Mapped[dict[str, Any]] = mapped_column(JSONB)
    grammar_errors: Mapped[dict[str, Any] | list[dict]] = mapped_column(JSONB)
    vocabulary_usage: Mapped[list[dict]] = mapped_column(JSONB)
    repeated_words: Mapped[list[dict]] = mapped_column(JSONB)
    pronunciation_issues: Mapped[list[dict]] = mapped_column(JSONB)
    general_tips: Mapped[dict[str, list[str]]] = mapped_column(JSONB)


class PronunciationTest(Base):
    __tablename__ = "pronunciation_test_table"

    id: Mapped[UUID_ID] = mapped_column(GUID, primary_key=True, default=uuid.uuid4)
    user_id: Mapped[UUID_ID] = mapped_column(
        GUID, ForeignKey("user_table.id"), index=True
    )
    user: Mapped[User] = relationship(back_populates="pronunciation_tests")
    pronunciation_score: Mapped[float] = mapped_column(FLOAT)
    pronunciation_strong_points: Mapped[list[str]] = mapped_column(ARRAY(String))
    pronunciation_weak_sides: Mapped[list[str]] = mapped_column(ARRAY(String))
    pronunciation_mistakes: Mapped[list[dict]] = mapped_column(JSONB)
    pronunciation_tips: Mapped[list[str]] = mapped_column(ARRAY(String))


class Transcription(Base):
    __tablename__ = "transcriptions_table"

    id: Mapped[UUID_ID] = mapped_column(GUID, primary_key=True, default=uuid.uuid4)
    user_id: Mapped[UUID_ID] = mapped_column(
        GUID, ForeignKey("user_table.id"), index=True
    )
    user: Mapped[User] = relationship(back_populates="transcriptions")
    user_responses: Mapped[list[str]] = mapped_column(ARRAY(String))
    assistant_responses: Mapped[list[str]] = mapped_column(ARRAY(String))
    test_id: Mapped[UUID_ID] = mapped_column(GUID, ForeignKey("practice_test_table.id"))
    practice_test: Mapped["PracticeTest"] = relationship(back_populates="transcription")


class Analytics(Base):
    __tablename__ = "analytics_table"

    id: Mapped[UUID_ID] = mapped_column(GUID, primary_key=True, default=uuid.uuid4)
    user_id: Mapped[UUID_ID] = mapped_column(
        GUID, ForeignKey("user_table.id"), index=True
    )
    user: Mapped[User] = relationship(back_populates="analytics")
    practice_time: Mapped[timedelta] = mapped_column(Integer, default=0)
    tests_completed: Mapped[int] = mapped_column(Integer)
    current_bandscore: Mapped[float] = mapped_column(Float)
    average_band_scores: Mapped[dict[str, float]] = mapped_column(JSONB)
    average_band: Mapped[float] = mapped_column(Float)
    common_mistakes: Mapped[dict[str, Any]] = mapped_column(JSONB)


class QuestionCard(Base):
    __tablename__ = "question_cards_table"

    id: Mapped[UUID_ID] = mapped_column(GUID, primary_key=True, default=uuid.uuid4)
    part: Mapped[TestPartEnum] = mapped_column(
        ORMEnum(TestPartEnum, name="test_part_enum")
    )
    topic: Mapped[str] = mapped_column(String(512))
    questions: Mapped[list[str]] = mapped_column(ARRAY(String))


class ReadingCard(Base):
    __tablename__ = "reading_cards_table"

    id: Mapped[UUID_ID] = mapped_column(GUID, primary_key=True, default=uuid.uuid4)
    topic: Mapped[str] = mapped_column(String(128))
    text: Mapped[str] = mapped_column(Text)
    practice_id: Mapped[UUID_ID] = mapped_column(
        ForeignKey("practice_test_table.id"), index=True
    )
    practice_test: Mapped["PracticeTest"] = relationship(back_populates="reading_cards")


class PracticeTest(Base):
    __tablename__ = "practice_test_table"

    id: Mapped[UUID_ID] = mapped_column(GUID, primary_key=True, default=uuid.uuid4)
    user_id: Mapped[UUID_ID] = mapped_column(ForeignKey("user_table.id"), index=True)
    user: Mapped[User] = relationship(back_populates="practice_tests")
    result: Mapped[Result] = relationship(back_populates="practice_test")
    status: Mapped[TestStatusEnum] = mapped_column(
        ORMEnum(TestStatusEnum, name="test_status_enum")
    )

    practice_name: Mapped[str] = mapped_column(String(length=100))
    assistant: Mapped[AssistantEnum] = mapped_column(
        ORMEnum(AssistantEnum, name="assistant_enum")
    )
    transcription: Mapped[Transcription] = relationship(back_populates="practice_test")

    part_one_card_id = mapped_column(
        GUID, ForeignKey("question_cards_table.id"), index=True
    )
    part_two_card_id = mapped_column(
        GUID, ForeignKey("question_cards_table.id"), index=True
    )
    part_one_card: Mapped[QuestionCard] = relationship(
        "QuestionCard", foreign_keys=[part_one_card_id]
    )
    part_two_card: Mapped[QuestionCard] = relationship(
        "QuestionCard", foreign_keys=[part_two_card_id]
    )
    reading_cards: Mapped[list[ReadingCard]] = relationship(
        back_populates="practice_test"
    )


class Notifications(Base):
    __tablename__ = "notifications_table"

    id: Mapped[UUID_ID] = mapped_column(GUID, primary_key=True, default=uuid.uuid4)
    user_id: Mapped[UUID_ID] = mapped_column(
        GUID, ForeignKey("user_table.id"), index=True
    )
    user: Mapped[User] = relationship(back_populates="notificates")
    type: Mapped[str] = mapped_column(String(30))
    message: Mapped[str] = mapped_column(String(250))
    link: Mapped[str] = mapped_column(String(1024), nullable=True)


class Subscription(Base):
    __tablename__ = "subscriptions_table"

    id: Mapped[UUID_ID] = mapped_column(GUID, primary_key=True, default=uuid.uuid4)
    user: Mapped[User] = relationship(back_populates="subscription")
    user_id: Mapped[UUID_ID] = mapped_column(
        GUID, ForeignKey("user_table.id"), index=True
    )
    sub_tier: Mapped[SubscriptionEnum] = mapped_column(
        ORMEnum(SubscriptionEnum), name="subscription_tier_enum"
    )
    credits_total_purchased: Mapped[int] = mapped_column(Integer)
    credits_left: Mapped[int] = mapped_column(Integer)
