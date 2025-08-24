from typing import Any
from uuid import UUID
from pydantic import BaseModel, Field


# class Analytics(Base):
#     __tablename__ = "analytics_table"


#     id: Mapped[UUID_ID] = mapped_column(GUID, primary_key=True, default=uuid.uuid4)
#     user_id: Mapped[UUID_ID] = mapped_column(
#         GUID, ForeignKey("user_table.id"), index=True
#     )
#     user: Mapped[User] = relationship(back_populates="analytics")
#     practice_time: Mapped[timedelta] = mapped_column(Integer, default=0)
#     tests_completed: Mapped[int] = mapped_column(Integer)
#     current_bandscore: Mapped[float] = mapped_column(Float)
#     average_band_scores: Mapped[dict[str, float]] = mapped_column(JSONB)
#     average_band: Mapped[float] = mapped_column(Float)
#     common_mistakes: Mapped[dict[str, Any]] = mapped_column(JSONB)
#     streak_days: Mapped[int] = mapped_column(Integer, default=0)


class AverageBandScores(BaseModel):
    fluency: float
    grammar: float
    lexis: float
    pronunciation: float


class AnalyticsSchema(BaseModel):
    id: str | None = Field(default=None)
    user_id: str
    practice_time: int
    tests_completed: int
    current_bandscore: float
    average_band_scores: AverageBandScores
    average_band: float
    common_mistakes: dict[str, Any]
    streak_days: int


class AnalyticsUpdateSchema(BaseModel):
    practice_time: int | None = Field(default=None)
    tests_completed: int | None = Field(default=None)
    current_bandscore: float | None = Field(default=None)
    average_band_scores: AverageBandScores | None = Field(default=None)
    average_band: float | None = Field(default=None)
    common_mistakes: dict[str, Any] | None = Field(default=None)
    streak_days: int | None = Field(default=None)
