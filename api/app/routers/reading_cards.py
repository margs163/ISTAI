from fastapi import APIRouter, Depends, HTTPException, Path, status, Query
from sqlalchemy import and_, func, insert, select
from typing import Annotated

from api.app.schemas.db_tables import ReadingCard
from ..dependencies import current_active_user
from ..lib.auth_db import get_async_session
from ..schemas.practice_test import ReadingCardSchema

router = APIRouter(dependencies=[Depends(current_active_user)])


@router.post("/new")
async def post_questions(readingCards: list[ReadingCardSchema]):
    async for session in get_async_session():
        async with session.begin():
            try:
                await session.scalars(
                    insert(ReadingCard),
                    [
                        {
                            "topic": card.topic,
                            "text": card.text,
                        }
                        for card in readingCards
                    ],
                )

                return {"status": "Success"}

            except Exception as e:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Failed to create a record: {e}",
                )


@router.get("/")
async def get_reading_card(
    cardId: Annotated[str | None, Query()],
    random: Annotated[bool | None, Query()],
    count: Annotated[int, Query(ge=1, le=3)] = 1,
):

    if not cardId and not random:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Specify one of the parameters",
        )

    async for session in get_async_session():
        async with session.begin():
            try:
                query = select(ReadingCard)

                if cardId:
                    query = query.where(ReadingCard.id == cardId)
                elif random:
                    query = query.order_by(func.random()).limit(count)

                result = await session.scalars(query)
                return {"status": "success", "cards": result.all()}

            except Exception as e:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Could not fetch questions: {e}",
                )


@router.delete("/{readingCardId}")
async def delete_questions(readingCardId: Annotated[str, Path()]):
    try:
        async for session in get_async_session():
            async with session.begin():
                result = await session.scalars(
                    select(ReadingCard).where(ReadingCard.id == readingCardId)
                )
                await session.delete(result.all())

                return {"status": "Success"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not delete reading card: {e}",
        )
