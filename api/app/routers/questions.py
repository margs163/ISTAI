from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy import and_, insert, select
from typing import  Annotated
from ..dependencies import current_active_user
from ..lib.auth_db import get_async_session
from ..schemas.questions import QuestionSchema
from ..schemas.db_tables import QuestionCard, TestPartEnum

router = APIRouter(dependencies=[Depends(current_active_user)])

@router.post("/new")
async def post_questions(questionCards: list[QuestionSchema]):
    async for session in get_async_session():
        async with session.begin():
            try:
                await session.scalars(
                    insert(QuestionCard),
                    [
                        {
                            "part": card.part,
                            "topic": card.topic,
                            "questions": card.questions,
                        }
                        for card in questionCards
                    ],
                )

                return {"status": "Success"}

            except Exception as e:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Failed to create a record: {e}",
                )

@router.get("/")
async def get_questions(part: Annotated[TestPartEnum | None, Query()] = None, topic: Annotated[str | None, Query()] = None):
    result = None
    async for session in get_async_session():
        async with session.begin():
            try:
                if not topic and not part:
                    result = await session.scalars(select(QuestionCard).order_by(part))
                elif topic and not part:
                    result = await session.scalars(select(QuestionCard).where(QuestionCard.topic == topic).order_by(QuestionCard.part))
                elif part and not topic:
                    result = await session.scalars(select(QuestionCard).where(QuestionCard.part == part).order_by(QuestionCard.part))
                else:
                    result = await session.scalars(select(QuestionCard).where(and_(QuestionCard.topic == topic, QuestionCard.part == part)).order_by(QuestionCard.part))

                return {"questions": result.all()}
            except Exception as e:
                raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Could not fetch questions: {e}")
            

@router.delete("/{questionCardId}")
async def delete_questions(questionCardId: str):
    try:
        async for session in get_async_session():
            async with session.begin(): 
                result = await session.scalars(select(QuestionCard).where(QuestionCard.id==questionCardId)) 
                await session.delete(result.all())

                return {"status": "Success"}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Could not delete question: {e}")

        
