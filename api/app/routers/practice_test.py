from datetime import datetime
from typing import Annotated, Any
from fastapi import (
    APIRouter,
    Depends,
    Body,
    HTTPException,
    Path,
    Query,
    Request,
    status,
)
from pydantic import BaseModel

from api.app.lib.send_notification import create_notification
from api.app.lib.auth_db import get_async_session
from api.app.schemas.db_tables import (
    Notifications,
    PracticeTest,
    QuestionCard,
    ReadingCard,
    Result,
    Transcription,
    User,
)
from api.app.schemas.notifications import NotificationTypeEnum, NotificationsSchema
from ..schemas.practice_test import PracticeTestSchema, PracticeTestUpdateSchema
from sqlalchemy import select
from ..dependencies import limiter
from sqlalchemy.orm import joinedload, selectinload
from sqlalchemy.ext.asyncio import AsyncSession
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
@limiter.limit("2/minute")
async def create_test(
    request: Request,
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

                await create_notification(
                    user_id=str(user.id),
                    session=session,
                    type=NotificationTypeEnum.TEST_INFO,
                    message="You have started a speaking test",
                )

                await session.commit()

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
@limiter.limit("25/minute")
async def get_practice_test(
    request: Request,
    user: Annotated[User, Depends(current_active_user)],
    test_ids: Annotated[list[str] | None, Query()] = None,
    user_id: Annotated[bool | None, Query()] = None,
):
    if not test_ids and not user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Specify one of the parameters",
        )

    query = (
        select(PracticeTest)
        .options(
            joinedload(PracticeTest.result),
            joinedload(PracticeTest.transcription),
            joinedload(PracticeTest.part_one_card),
            joinedload(PracticeTest.part_two_card),
            selectinload(PracticeTest.reading_cards),
        )
        .order_by(PracticeTest.test_date.desc())
    )
    if user_id:
        query = query.where(PracticeTest.user_id == user.id)
    if test_ids:
        query = query.where(PracticeTest.id.in_(test_ids))
    async for session in get_async_session():
        async with session.begin():
            try:
                practice_test = await session.scalars(query)
                return {"data": practice_test.all()}
            except Exception as e:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Could not create a practice test {e}",
                )


@router.put("/{test_id}")
@limiter.limit("4/minute")
async def update_test(
    request: Request,
    test_id: Annotated[str, Path()],
    update_obj: Annotated[PracticeTestUpdateSchema, Body()],
    user: Annotated[User, Depends(current_active_user)],
    session: Annotated[AsyncSession, Depends(get_async_session)],
):
    try:
        result_select = await session.scalar(
            select(PracticeTest).where(PracticeTest.id == test_id)
        )
        practice_test = result_select

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
                **update_obj.transcription.model_dump(), user_id=user.id
            )

        if update_obj.part_one_card_id:
            card_one = await session.scalar(
                select(QuestionCard).where(
                    QuestionCard.id == update_obj.part_one_card_id
                )
            )
            if not card_one:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Could not find a question card",
                )

            practice_test.part_one_card = card_one

        if update_obj.part_two_card_id:
            card_two = await session.scalar(
                select(QuestionCard).where(
                    QuestionCard.id == update_obj.part_two_card_id
                )
            )
            if not card_two:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Could not find a question card",
                )

            practice_test.part_two_card = card_two

        if update_obj.reading_cards:
            reading_card = update_obj.reading_cards[0]
            reading_record = await session.scalar(
                select(ReadingCard).where(ReadingCard.id == reading_card.id)
            )
            reading_one = reading_record

            if not reading_one:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Could not find a reading card",
                )
            reading_cards_list = [reading_one]
            practice_test.reading_cards = reading_cards_list

        await session.commit()
        return {"status": "success"}

    except Exception as e:
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Could not update a practice test {e}",
        )


@router.delete("/{test_id}")
@limiter.limit("10/minute")
async def delete_test(request: Request, test_id: Annotated[str, Path()]):
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
