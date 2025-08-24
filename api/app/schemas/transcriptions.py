from pydantic import BaseModel, Field

# class Transcription(Base):
#     __tablename__ = "transcriptions_table"

#     id: Mapped[UUID_ID] = mapped_column(GUID, primary_key=True, expire_on_commit=False, default=uuid.uuid4)
#     user_id: Mapped[UUID_ID] = mapped_column(GUID, ForeignKey("user_table.id"), index=True)
#     user: Mapped[User] = relationship(back_populates="transcriptions")
#     user_responses: Mapped[list[str]] = mapped_column(ARRAY(String))
#     assistant_responses: Mapped[list[str]] = mapped_column(ARRAY(String))
#     test_id: Mapped[UUID_ID] = mapped_column(GUID, ForeignKey("practice_test_table.id"))
#     practice_test: Mapped["PracticeTest"] = relationship(back_populates="transcription")


class TranscriptionMessage(BaseModel):
    name: str
    text: str


class TranscriptionSchema(BaseModel):
    test_id: str | None = Field(description="Id of the test", default=None)
    part_one: list[TranscriptionMessage]
    part_two: list[TranscriptionMessage]
    part_three: list[TranscriptionMessage]
