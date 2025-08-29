from enum import StrEnum

# class Subscription(Base):
#     __tablename__ = "subscriptions_table"

#     id: Mapped[UUID_ID] = mapped_column(GUID, primary_key=True, default=uuid.uuid4)
#     user: Mapped[User] = relationship(back_populates="subscription")
#     user_id: Mapped[UUID_ID] = mapped_column(
#         GUID, ForeignKey("user_table.id"), index=True
#     )
#     sub_tier: Mapped[str] = mapped_column(String)
#     credit_card: Mapped["CreditCard"] = relationship(back_populates="subscription")
#     credits_total_purchased: Mapped[int] = mapped_column(Integer)
#     credits_left: Mapped[int] = mapped_column(Integer)


# class CreditCard(Base):
#     __tablename__ = "credit_card_table"

#     id: Mapped[UUID_ID] = mapped_column(GUID, primary_key=True, default=uuid.uuid4)
#     subscription: Mapped[User] = relationship(back_populates="credit_card")
#     encrypted_card_number: Mapped[str] = mapped_column(
#         String(64), unique=True, nullable=False
#     )
#     card_holder_name: Mapped[str] = mapped_column(String(150), nullable=False)
#     card_type: Mapped[str] = mapped_column(String(50))
#     last_four: Mapped[str] = mapped_column(String(4), nullable=False)
#     expirty_date: Mapped[date] = mapped_column(Date, default=datetime.date.today)

from datetime import date, datetime
from pydantic import BaseModel, Field


class CardTypeEnum(StrEnum):
    VISA = "Visa"
    Mastercard = "Mastercard"
    AMERICAN_EXPRESS = "American Express"


class TierEnum(StrEnum):
    FREE = "Free"
    STARTER = "Starter"
    PRO = "PRO"


class CreditCardSchema(BaseModel):
    id: str | None = Field(default=None)
    subscription_id: str | None = Field(default=None)

    payment_id: str | None = Field(default=None)
    payment_method: str | None = Field(default=None)
    card_holder_name: str | None = Field(max_length=150, default=None)
    card_type: str | None = Field(max_length=50)
    last_four: str = Field(max_length=4)
    expiry_month: int = Field()
    expiry_year: int = Field()
    country: str = Field()


class SubscriptionSchema(BaseModel):
    id: str | None = Field(default=None)
    user_id: str

    paddle_product_id: str | None = Field(default=None)
    paddle_subscription_id: str | None = Field(default=None)
    paddle_price_id: str | None = Field(default=None)

    subscription_tier: TierEnum | str = Field(default="Free")
    paddle_subscription_status: str | None = Field(default=None)
    subscription_created_at: datetime | None = Field(default=None)
    subscription_next_billed_at: datetime | None = Field(default=None)
    total_money_spent: float = Field(default=0)

    credit_card: CreditCardSchema | None = Field(default=None)
    credits_total_purchased: int = Field(default=0)
    credits_left: int = Field(default=20)

    billing_interval: str | None = Field(default=None)
    billing_frequency: int | None = Field(default=None)


class SubscriptionUpdateSchema(BaseModel):
    paddle_product_id: str | None = Field(default=None)
    paddle_subscription_id: str | None = Field(default=None)
    paddle_price_id: str | None = Field(default=None)

    subscription_tier: TierEnum | str | None = Field(default=None)
    paddle_subscription_status: str | None = Field(default=None)
    subscription_created_at: datetime | None = Field(default=None)
    subscription_next_billed_at: datetime | None = Field(default=None)
    total_money_spent: float | None = Field(default=0)

    credit_card: CreditCardSchema | None = Field(default=None)
    credits_total_purchased: int | None = Field(default=0)
    credits_left: int | None = Field(default=None)

    billing_interval: str | None = Field(default=None)
    billing_frequency: int | None = Field(default=None)
