from fastapi_users_db_sqlalchemy import (
    SQLAlchemyBaseOAuthAccountTableUUID,
    SQLAlchemyBaseUserTableUUID,
)
import enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import (
    FLOAT,
    ForeignKey,
    String,
    DateTime,
    Date,
    Enum as ORMEnum,
    Integer,
    Float,
    ARRAY,
    Text,
    null,
    sql,
)
from datetime import date, timedelta
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


class OAuthAccount(SQLAlchemyBaseOAuthAccountTableUUID, Base):
    user_id: Mapped[UUID_ID] = mapped_column(ForeignKey("user_table.id"))
    user: Mapped["User"] = relationship(back_populates="oauth_accounts")


class User(Base, SQLAlchemyBaseUserTableUUID):
    first_name: Mapped[str] = mapped_column(String)
    last_name: Mapped[str] = mapped_column(String, nullable=True)
    avatar_path: Mapped[str] = mapped_column(String, nullable=True)
    createdAt: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.now(), nullable=True
    )
    updatedAt: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.now(), nullable=True, onupdate=datetime.now()
    )
    subscription: Mapped["Subscription"] = relationship(
        back_populates="user", lazy="joined"
    )
    practice_tests: Mapped[list["PracticeTest"]] = relationship(back_populates="user")
    analytics: Mapped["Analytics"] = relationship(back_populates="user")
    notificates: Mapped[list["Notifications"]] = relationship(back_populates="user")
    transcriptions: Mapped[list["Transcription"]] = relationship(back_populates="user")
    pronunciation_tests: Mapped[list["PronunciationTest"]] = relationship(
        back_populates="user"
    )
    oauth_accounts: Mapped[list["OAuthAccount"]] = relationship(
        back_populates="user", lazy="joined"
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
    grammar_errors: Mapped[list[dict]] = mapped_column(JSONB)
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
    # user_responses: Mapped[list[str]] = mapped_column(ARRAY(String))
    # assistant_responses: Mapped[list[str]] = mapped_column(ARRAY(String))
    part_one: Mapped[list[dict]] = mapped_column(JSONB)
    part_two: Mapped[list[dict]] = mapped_column(JSONB)
    part_three: Mapped[list[dict]] = mapped_column(JSONB)
    test_id: Mapped[UUID_ID] = mapped_column(GUID, ForeignKey("practice_test_table.id"))
    practice_test: Mapped["PracticeTest"] = relationship(back_populates="transcription")


class Analytics(Base):
    __tablename__ = "analytics_table"

    id: Mapped[UUID_ID] = mapped_column(GUID, primary_key=True, default=uuid.uuid4)
    user_id: Mapped[UUID_ID] = mapped_column(
        GUID, ForeignKey("user_table.id"), index=True
    )
    user: Mapped[User] = relationship(back_populates="analytics")
    practice_time: Mapped[int] = mapped_column(Integer, default=0)
    tests_completed: Mapped[int] = mapped_column(Integer)
    current_bandscore: Mapped[float] = mapped_column(Float)
    average_band_scores: Mapped[dict[str, float]] = mapped_column(JSONB)
    average_band: Mapped[float] = mapped_column(Float)
    grammar_common_mistakes: Mapped[list[dict | None]] = mapped_column(
        JSONB, nullable=True
    )
    lexis_common_mistakes: Mapped[list[dict | None]] = mapped_column(
        JSONB, nullable=True
    )
    pronunciation_common_mistakes: Mapped[list[dict | None]] = mapped_column(
        JSONB, nullable=True
    )
    streak_days: Mapped[int] = mapped_column(Integer, default=0)


class QuestionCard(Base):
    __tablename__ = "question_cards_table"

    id: Mapped[UUID_ID] = mapped_column(GUID, primary_key=True, default=uuid.uuid4)
    part: Mapped[int] = mapped_column(Integer)
    topic: Mapped[str] = mapped_column(String(512))
    questions: Mapped[list[str]] = mapped_column(ARRAY(String))


class ReadingCard(Base):
    __tablename__ = "reading_cards_table"

    id: Mapped[UUID_ID] = mapped_column(GUID, primary_key=True, default=uuid.uuid4)
    topic: Mapped[str] = mapped_column(String(128))
    text: Mapped[str] = mapped_column(Text)
    practice_id: Mapped[UUID_ID] = mapped_column(
        ForeignKey("practice_test_table.id"), index=True, nullable=True
    )
    practice_test: Mapped["PracticeTest"] = relationship(back_populates="reading_cards")


class PracticeTest(Base):
    __tablename__ = "practice_test_table"

    id: Mapped[UUID_ID] = mapped_column(GUID, primary_key=True, default=uuid.uuid4)
    user_id: Mapped[UUID_ID] = mapped_column(ForeignKey("user_table.id"), index=True)
    user: Mapped[User] = relationship(back_populates="practice_tests")
    result: Mapped[Result] = relationship(back_populates="practice_test")
    status: Mapped[str] = mapped_column(String)

    practice_name: Mapped[str] = mapped_column(String(length=100))
    assistant: Mapped[str] = mapped_column(String)
    transcription: Mapped[Transcription] = relationship(back_populates="practice_test")
    test_duration: Mapped[int] = mapped_column(Integer, nullable=True)
    test_date: Mapped[datetime] = mapped_column(DateTime, default=datetime.now())

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
        back_populates="practice_test", lazy="joined"
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
    time: Mapped[datetime] = mapped_column(DateTime, default=datetime.now())


class Subscription(Base):
    __tablename__ = "subscriptions_table"

    id: Mapped[UUID_ID] = mapped_column(GUID, primary_key=True, default=uuid.uuid4)
    user: Mapped[User] = relationship(back_populates="subscription")
    user_id: Mapped[UUID_ID] = mapped_column(
        GUID, ForeignKey("user_table.id"), index=True
    )

    paddle_product_id: Mapped[str] = mapped_column(String(150), nullable=True)
    paddle_subscription_id: Mapped[str] = mapped_column(String(150), nullable=True)
    paddle_price_id: Mapped[str] = mapped_column(String(150), nullable=True)

    subscription_tier: Mapped[str] = mapped_column(
        String(20), nullable=True, default="Free"
    )
    paddle_subscription_status: Mapped[str] = mapped_column(String(20), nullable=True)
    subscription_created_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    subscription_next_billed_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=True
    )
    total_money_spent: Mapped[float] = mapped_column(Float, default=0)

    credit_card: Mapped["CreditCard"] = relationship(
        back_populates="subscription", lazy="joined"
    )
    credits_total_purchased: Mapped[int] = mapped_column(Integer)
    credits_left: Mapped[int] = mapped_column(Integer)

    billing_interval: Mapped[str] = mapped_column(String(20), nullable=True)
    billing_frequency: Mapped[int] = mapped_column(Integer, nullable=True)


class CreditCard(Base):
    __tablename__ = "credit_card_table"

    id: Mapped[UUID_ID] = mapped_column(GUID, primary_key=True, default=uuid.uuid4)
    subscription: Mapped[Subscription] = relationship(back_populates="credit_card")
    subscription_id: Mapped[UUID_ID] = mapped_column(
        ForeignKey("subscriptions_table.id")
    )

    payment_id: Mapped[str] = mapped_column(String(150), nullable=True)
    payment_method: Mapped[str] = mapped_column(String(64), nullable=False)
    card_holder_name: Mapped[str | None] = mapped_column(String(150), nullable=True)
    card_type: Mapped[str] = mapped_column(String(30))
    last_four: Mapped[str] = mapped_column(String(4), nullable=False)
    expiry_month: Mapped[int] = mapped_column(Integer)
    expiry_year: Mapped[int] = mapped_column(Integer)
    country: Mapped[str] = mapped_column(String(50))
