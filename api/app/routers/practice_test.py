from datetime import datetime
from typing import Annotated, Any
from fastapi import APIRouter, Depends, Body, HTTPException, Path, Query, status
from pydantic import BaseModel

from api.app.lib.auth_db import get_async_session
from api.app.schemas.db_tables import (
    PracticeTest,
    QuestionCard,
    Result,
    Transcription,
    User,
)
from ..schemas.practice_test import PracticeTestSchema, PracticeTestUpdateSchema
from sqlalchemy import select
from sqlalchemy.orm import joinedload, selectinload
from ..dependencies import current_active_user

router = APIRouter(dependencies=[Depends(current_active_user)])


class PostResponse(BaseModel):
    class Data(BaseModel):
        id: str
        result: Any
        status: str
        practice_name: str
        assistant: str
        transcription: Any
        test_duration: int
        test_date: datetime
        part_one_card: Any
        part_two_card: Any
        reading_cards: list

    status: str
    data: list[Data]


@router.post("/new")
async def create_test(
    test: Annotated[PracticeTestSchema, Body()],
    user: Annotated[User, Depends(current_active_user)],
):
    insert_dict = {
        "user_id": user.id,
        "status": "Ongoing",
        "practice_name": test.practice_name,
        "assistant": test.assistant,
    }

    if test.transcription:
        insert_dict.update({"transcription": test.transcription})
    if test.result:
        insert_dict.update({"result": test.result})
    if test.part_one_card_id:
        insert_dict.update({"part_one_card_id": test.part_one_card_id})
    if test.part_two_card_id:
        insert_dict.update({"part_two_card_id": test.part_two_card_id})

    practice_test = None
    async for session in get_async_session():
        async with session.begin():
            try:
                practice_test = PracticeTest(**insert_dict)
                session.add(practice_test)

            except Exception as e:
                await session.rollback()
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Could not create a practice test {e}",
                )
    async for session in get_async_session():
        async with session.begin():
            try:
                result = await session.scalars(
                    select(PracticeTest)
                    .where(PracticeTest.id == practice_test.id)
                    .options(
                        joinedload(PracticeTest.result),
                        joinedload(PracticeTest.transcription),
                        joinedload(PracticeTest.part_one_card),
                        joinedload(PracticeTest.part_two_card),
                        selectinload(PracticeTest.reading_cards),
                    )
                )

                data = result.first()

                return {
                    "status": "Success",
                    "data": data,
                }
            except Exception as e:
                await session.rollback()
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Could not create a practice test {e}",
                )


@router.get("/")
async def get_practice_test(
    user: Annotated[User, Depends(current_active_user)],
    test_ids: Annotated[list[str] | None, Query()] = None,
    user_id: Annotated[bool | None, Query()] = None,
):
    if not test_ids and not user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Specify one of the parameters",
        )

    query = select(PracticeTest).options(
        joinedload(PracticeTest.result),
        joinedload(PracticeTest.transcription),
        joinedload(PracticeTest.part_one_card),
        joinedload(PracticeTest.part_two_card),
        selectinload(PracticeTest.reading_cards),
    )
    if user_id:
        query = query.where(PracticeTest.user_id == user.id)
    if test_ids:
        query = query.where(PracticeTest.id.in_(test_ids))
    async for session in get_async_session():
        async with session.begin():
            try:
                practice_test = await session.scalars(query)
                return {"status": "success", "results": practice_test.all()}
            except Exception as e:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Could not create a practice test {e}",
                )


@router.put("/{test_id}")
async def update_test(
    test_id: Annotated[str, Path()],
    update_obj: Annotated[PracticeTestUpdateSchema, Body()],
):
    async for session in get_async_session():
        async with session.begin():
            try:
                result_select = await session.scalars(
                    select(PracticeTest).where(PracticeTest.id == test_id)
                )
                practice_test = result_select.first()

                if not practice_test:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Could not find a practice test",
                    )

                if update_obj.test_duration:
                    practice_test.test_duration = update_obj.test_duration

                if update_obj.status:
                    practice_test.status = update_obj.status

                if update_obj.result:
                    practice_test.result = Result(**update_obj.result.model_dump())

                if update_obj.transcription:
                    practice_test.transcription = Transcription(
                        **update_obj.transcription.model_dump()
                    )

                if update_obj.part_one_card_id:
                    card_one = await session.scalars(
                        select(QuestionCard).where(
                            QuestionCard.id == update_obj.part_one_card_id
                        )
                    )
                    card_one = card_one.first()
                    if not card_one:
                        raise HTTPException(
                            status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Could not find a question card",
                        )

                    practice_test.part_one_card = card_one

                if update_obj.part_two_card_id:
                    card_two = await session.scalars(
                        select(QuestionCard).where(
                            QuestionCard.id == update_obj.part_two_card_id
                        )
                    )
                    card_two = card_two.first()
                    if not card_two:
                        raise HTTPException(
                            status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Could not find a question card",
                        )

                    practice_test.part_two_card = card_two

                return {"status": "success"}

            except Exception as e:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Could not update a practice test {e}",
                )


@router.delete("/{test_id}")
async def delete_test(test_id: Annotated[str, Path()]):
    async for session in get_async_session():
        async with session.begin():
            try:
                result_select = await session.scalars(
                    select(PracticeTest).where(PracticeTest.id == test_id)
                )
                test = result_select.first()
                if not test:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Could not find a practice test",
                    )

                await session.delete(test)
                return {"status": "success"}

            except Exception as e:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Could not delete a practice test {e}",
                )


# "Could not create a practice test (sqlalchemy.dialects.postgresql.asyncpg.Error) <class 'asyncpg.exceptions.InvalidTextRepresentationError'>: invalid input value for enum test_status_enum: \"ONGOING\"
# \n[SQL: INSERT INTO practice_test_table (id, user_id, status, practice_name, assistant, test_date) VALUES ($1::UUID, $2::UUID, $3::test_status_enum, $4::VARCHAR, $5::assistant_enum, $6::DATE) RETURNING practice_test_table.id, practice_test_table.user_id, practice_test_table.status, practice_test_table.practice_name, practice_test_table.assistant, practice_test_table.test_duration, practice_test_table.test_date, practice_test_table.part_one_card_id, practice_test_table.part_two_card_id]\n[parameters: ('be127298-c6ea-4d09-82fb-0dc2c7e0c8be', '5bd3cfa3-05be-4946-b141-2301565ec06f', 'ONGOING', 'string', 'RON', datetime.date(2025, 8, 15))]
# (Background on this error at: https://sqlalche.me/e/20/dbapi)"
