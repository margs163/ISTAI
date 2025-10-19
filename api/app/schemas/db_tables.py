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
    UUID,
    Enum as ORMEnum,
    Integer,
    Float,
    ARRAY,
    Text,
)
from datetime import date, timedelta
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
    __tablename__ = "user_table"

    id: Mapped[UUID_ID] = mapped_column(UUID, primary_key=True, default=uuid.uuid4)
    first_name: Mapped[str] = mapped_column(String)
    last_name: Mapped[str] = mapped_column(String, nullable=True)
    avatar_path: Mapped[str] = mapped_column(String, nullable=True)
    createdAt: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.now(), nullable=True
    )
    updatedAt: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.now(), nullable=True, onupdate=datetime.now()
    )
    last_login_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now(), nullable=True)
    subscription: Mapped["Subscription"] = relationship(
        back_populates="user", lazy="joined", cascade="all, delete-orphan"
    )
    practice_tests: Mapped[list["PracticeTest"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    analytics: Mapped["Analytics"] = relationship(back_populates="user", cascade="all, delete-orphan")
    notificates: Mapped[list["Notifications"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    transcriptions: Mapped[list["Transcription"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    pronunciation_tests: Mapped[list["PronunciationTest"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )
    questionnaire_answers: Mapped["Questionnaire"] = relationship(back_populates="user", cascade="all, delete-orphan")
    oauth_accounts: Mapped[list["OAuthAccount"]] = relationship(
        back_populates="user", lazy="joined", cascade="all, delete-orphan"
    )


class Result(Base):
    __tablename__ = "result_table"

    id: Mapped[UUID_ID] = mapped_column(UUID, primary_key=True, default=uuid.uuid4)
    practice_test_id: Mapped[UUID_ID] = mapped_column(
        UUID, ForeignKey("practice_test_table.id"), index=True
    )
    practice_test: Mapped["PracticeTest"] = relationship(
        back_populates="result",
    )

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


class OAuthAccount(SQLAlchemyBaseOAuthAccountTableUUID, Base):
    id: Mapped[UUID_ID] = mapped_column(UUID, primary_key=True, default=uuid.uuid4)
    user_id: Mapped[UUID_ID] = mapped_column(ForeignKey("user_table.id"))
    user: Mapped["User"] = relationship(back_populates="oauth_accounts")


class PronunciationTest(Base):
    __tablename__ = "pronunciation_test_table"

    id: Mapped[UUID_ID] = mapped_column(UUID, primary_key=True, default=uuid.uuid4)
    user_id: Mapped[UUID_ID] = mapped_column(
        UUID, ForeignKey("user_table.id"), index=True
    )
    user: Mapped[User] = relationship(back_populates="pronunciation_tests")
    pronunciation_score: Mapped[float] = mapped_column(FLOAT)
    pronunciation_strong_points: Mapped[list[str]] = mapped_column(ARRAY(String))
    pronunciation_weak_sides: Mapped[list[str]] = mapped_column(ARRAY(String))
    pronunciation_mistakes: Mapped[list[dict]] = mapped_column(JSONB)
    pronunciation_tips: Mapped[list[str]] = mapped_column(ARRAY(String))


class Transcription(Base):
    __tablename__ = "transcriptions_table"

    id: Mapped[UUID_ID] = mapped_column(UUID, primary_key=True, default=uuid.uuid4)
    user_id: Mapped[UUID_ID] = mapped_column(
        UUID, ForeignKey("user_table.id"), index=True
    )
    user: Mapped[User] = relationship(back_populates="transcriptions")
    part_one: Mapped[list[dict]] = mapped_column(JSONB)
    part_two: Mapped[list[dict]] = mapped_column(JSONB)
    part_three: Mapped[list[dict]] = mapped_column(JSONB)
    test_id: Mapped[UUID_ID] = mapped_column(UUID, ForeignKey("practice_test_table.id"))
    practice_test: Mapped["PracticeTest"] = relationship(back_populates="transcription")


class Analytics(Base):
    __tablename__ = "analytics_table"

    id: Mapped[UUID_ID] = mapped_column(UUID, primary_key=True, default=uuid.uuid4)
    user_id: Mapped[UUID_ID] = mapped_column(
        UUID, ForeignKey("user_table.id"), index=True
    )
    user: Mapped[User] = relationship(back_populates="analytics")
    practice_time: Mapped[int] = mapped_column(Integer, default=0)
    tests_completed: Mapped[int] = mapped_column(Integer)
    current_bandscore: Mapped[float] = mapped_column(Float)
    average_band_scores: Mapped[dict[str, float]] = mapped_column(JSONB)
    scores_increase: Mapped[dict[str, float]] = mapped_column(JSONB, nullable=True)
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


class Questionnaire(Base):
    __tablename__ = "questionnaire_table"

    id: Mapped[UUID_ID] = mapped_column(UUID, primary_key=True, default=uuid.uuid4)
    user: Mapped[User] = relationship(back_populates="questionnaire_answers", passive_deletes=True)
    user_id: Mapped[UUID_ID] = mapped_column(
        UUID, ForeignKey("user_table.id", ondelete="CASCADE"), index=True, nullable=True
    )

    heard_from: Mapped[str] = mapped_column(String(100), nullable=True)
    previous_score: Mapped[float] = mapped_column(Float, nullable=True)
    role: Mapped[str] = mapped_column(String(50), nullable=True)

    test_experience: Mapped[float] = mapped_column(Float, nullable=True)
    ui_intuitivity: Mapped[float] = mapped_column(Float, nullable=True)
    eval_accuracy: Mapped[float] = mapped_column(Float, nullable=True)
    suggestion: Mapped[str] = mapped_column(String(300), nullable=True)


class QuestionCard(Base):
    __tablename__ = "question_cards_table"

    id: Mapped[UUID_ID] = mapped_column(UUID, primary_key=True, default=uuid.uuid4)
    part: Mapped[int] = mapped_column(Integer)
    topic: Mapped[str] = mapped_column(String(512))
    questions: Mapped[list[str]] = mapped_column(ARRAY(String))


class ReadingCard(Base):
    __tablename__ = "reading_cards_table"

    id: Mapped[UUID_ID] = mapped_column(UUID, primary_key=True, default=uuid.uuid4)
    topic: Mapped[str] = mapped_column(String(128))
    text: Mapped[str] = mapped_column(Text)
    practice_id: Mapped[UUID_ID] = mapped_column(
        ForeignKey("practice_test_table.id"), index=True, nullable=True
    )
    practice_test: Mapped["PracticeTest"] = relationship(back_populates="reading_cards")


class PracticeTest(Base):
    __tablename__ = "practice_test_table"

    id: Mapped[UUID_ID] = mapped_column(UUID, primary_key=True, default=uuid.uuid4)
    user_id: Mapped[UUID_ID] = mapped_column(ForeignKey("user_table.id"), index=True)
    user: Mapped[User] = relationship(back_populates="practice_tests")
    result: Mapped[Result] = relationship(
        back_populates="practice_test", cascade="all, delete-orphan"
    )
    status: Mapped[str] = mapped_column(String)

    practice_name: Mapped[str] = mapped_column(String(length=100))
    assistant: Mapped[str] = mapped_column(String)
    transcription: Mapped[Transcription] = relationship(
        back_populates="practice_test", cascade="all, delete-orphan"
    )
    test_duration: Mapped[int] = mapped_column(Integer, nullable=True)
    test_date: Mapped[datetime] = mapped_column(DateTime, default=datetime.now())

    part_one_card_id = mapped_column(
        UUID, ForeignKey("question_cards_table.id"), index=True
    )
    part_two_card_id = mapped_column(
        UUID, ForeignKey("question_cards_table.id"), index=True
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

    id: Mapped[UUID_ID] = mapped_column(UUID, primary_key=True, default=uuid.uuid4)
    user_id: Mapped[UUID_ID] = mapped_column(
        UUID, ForeignKey("user_table.id"), index=True
    )
    user: Mapped[User] = relationship(back_populates="notificates")
    type: Mapped[str] = mapped_column(String(30))
    message: Mapped[str] = mapped_column(String(250))
    time: Mapped[datetime] = mapped_column(DateTime, default=datetime.now())


class Subscription(Base):
    __tablename__ = "subscriptions_table"

    id: Mapped[UUID_ID] = mapped_column(UUID, primary_key=True, default=uuid.uuid4)
    user: Mapped[User] = relationship(back_populates="subscription")
    user_id: Mapped[UUID_ID] = mapped_column(
       UUID, ForeignKey("user_table.id"), index=True
    )

    status: Mapped[str] = mapped_column(String(50), nullable=True)
    polar_product_id: Mapped[str] = mapped_column(String(150), nullable=True)
    polar_subscription_id: Mapped[str] = mapped_column(String(150), nullable=True)
    polar_customer_id: Mapped[str] = mapped_column(String(150), nullable=True)
    polar_price_id: Mapped[str] = mapped_column(String(150), nullable=True)

    subscription_tier: Mapped[str] = mapped_column(
        String(20), nullable=True, default="Free"
    )
    polar_subscription_status: Mapped[str] = mapped_column(String(20), nullable=True)
    subscription_created_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    subscription_next_billed_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=True
    )
    subscription_cancelled_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=True
    )
    cancellation_reason: Mapped[str] = mapped_column(
        Text, nullable=True
    )
    cancellation_comment: Mapped[str] = mapped_column(
        Text, nullable=True
    )
    total_money_spent: Mapped[float] = mapped_column(Float, default=0, nullable=True)

    # credit_card: Mapped["CreditCard"] = relationship(
    #     back_populates="subscription", lazy="joined"
    # )
    credits_total_purchased: Mapped[int] = mapped_column(Integer)
    credits_left: Mapped[int] = mapped_column(Integer)
    pronunciation_tests_left: Mapped[int] = mapped_column(Integer, default=2, nullable=True)

    billing_interval: Mapped[str] = mapped_column(String(20), nullable=True)
    billing_frequency: Mapped[int] = mapped_column(Integer, nullable=True)
    # polar_update_url: Mapped[str] = mapped_column(String(2000), nullable=True)
    # polar_cancel_url: Mapped[str] = mapped_column(String(2000), nullable=True)


# class CreditCard(Base):
#     __tablename__ = "credit_card_table"

#     id: Mapped[UUID_ID] = mapped_column(UUID, primary_key=True, default=uuid.uuid4)
#     subscription: Mapped[Subscription] = relationship(back_populates="credit_card")
#     subscription_id: Mapped[UUID_ID] = mapped_column(
#         ForeignKey("subscriptions_table.id")
#     )

#     payment_id: Mapped[str] = mapped_column(String(150), nullable=True)
#     payment_method: Mapped[str] = mapped_column(String(64), nullable=False)
#     card_holder_name: Mapped[str | None] = mapped_column(String(150), nullable=True)
#     card_type: Mapped[str] = mapped_column(String(30))
#     last_four: Mapped[str] = mapped_column(String(4), nullable=False)
#     expiry_month: Mapped[int] = mapped_column(Integer)
#     expiry_year: Mapped[int] = mapped_column(Integer)
#     country: Mapped[str] = mapped_column(String(50))
