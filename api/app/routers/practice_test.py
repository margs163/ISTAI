from typing import Annotated
from fastapi import APIRouter, Depends, Body, HTTPException, Path, Query, status

from api.app.lib.auth_db import get_async_session
from api.app.schemas.db_tables import (
    PracticeTest,
    QuestionCard,
    Result,
    Transcription,
    User,
)
from ..schemas.practice_test import PracticeTestSchema, PracticeTestUpdateSchema
from sqlalchemy import insert, select
from ..dependencies import current_active_user

router = APIRouter(dependencies=[Depends(current_active_user)])


@router.post("/new")
async def create_test(
    test: Annotated[PracticeTestSchema, Body()],
    user: Annotated[User, Depends(current_active_user)],
):
    insert_dict = {
        "id": user.id,
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

    async for session in get_async_session():
        async with session.begin():
            try:
                result = await session.scalars(
                    insert(PracticeTest).returning(PracticeTest), [insert_dict]
                )
                return {"status": "Success", "obj": result.all()}
            except Exception as e:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Could not create a practice test {e}",
                )


@router.get("/{test_id}")
async def get_practice_test(
    test_ids: Annotated[list[str] | None, Path()],
    user_id: Annotated[bool | None, Query()],
    user: Annotated[User, Depends(current_active_user)],
):
    if not test_ids and not user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Specify one of the parameters",
        )

    query = select(PracticeTest)
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
