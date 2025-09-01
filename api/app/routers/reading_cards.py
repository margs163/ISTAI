from fastapi import APIRouter, Depends, HTTPException, Path, Request, status, Query
from sqlalchemy import and_, func, insert, select
from typing import Annotated

from api.app.schemas.db_tables import ReadingCard
from ..dependencies import current_active_user
from ..lib.auth_db import get_async_session
from ..schemas.practice_test import ReadingCardSchema
from ..dependencies import limiter

router = APIRouter(dependencies=[Depends(current_active_user)])


@router.post("/new")
@limiter.limit("4/minute")
async def post_questions(request: Request, readingCards: list[ReadingCardSchema]):
    async for session in get_async_session():
        async with session.begin():
            try:
                reading_cards = [
                    ReadingCard(topic=card.topic, text=card.text)
                    for card in readingCards
                ]
                session.add_all(reading_cards)
                return {"status": "Success"}

            except Exception as e:
                await session.rollback()
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Failed to create a record: {e}",
                )


@router.get("/")
@limiter.limit("10/minute")
async def get_reading_card(
    request: Request,
    cardId: Annotated[str | None, Query()] = None,
    random: Annotated[bool | None, Query()] = None,
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
                return {"cards": result.all()}

            except Exception as e:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Could not fetch questions: {e}",
                )


@router.delete("/{readingCardId}")
@limiter.limit("4/minute")
async def delete_questions(request: Request, readingCardId: Annotated[str, Path()]):
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
