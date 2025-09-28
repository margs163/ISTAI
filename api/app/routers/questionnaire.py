from fastapi import (
    APIRouter,
    Body,
    Depends,
    HTTPException,
    Request,
    status,
)
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Annotated

from ..schemas.questionnaire import QuestionnaireSchema

from ..schemas.db_tables import Questionnaire, User
from ..dependencies import current_active_user
from ..lib.auth_db import get_async_session
from ..dependencies import limiter

router = APIRouter(dependencies=[Depends(current_active_user)])


@router.get("/")
@limiter.limit("4/minute")
async def get_questionnaire(
    request: Request,
    user: Annotated[User, Depends(current_active_user)],
    session: Annotated[AsyncSession, Depends(get_async_session)],
):
    try:
        record = await session.scalar(
            select(Questionnaire).where(Questionnaire.user_id == user.id)
        )

        if not record:
            return {"status": "abscent"}

        return {"status": "success", "data": record}

    except Exception as e:
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch a record: {e}",
        )


@router.post("/new")
@limiter.limit("4/minute")
async def create_questionnaire(
    request: Request,
    user: Annotated[User, Depends(current_active_user)],
    session: Annotated[AsyncSession, Depends(get_async_session)],
):
    try:
        record = Questionnaire(user_id=user.id)
        session.add(record)

        await session.commit()
        return {"status": "Success"}

    except Exception as e:
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create a record: {e}",
        )


@router.post("/")
@limiter.limit("4/minute")
async def post_questionnaire(
    request: Request,
    user: Annotated[User, Depends(current_active_user)],
    answers: Annotated[QuestionnaireSchema, Body()],
    session: Annotated[AsyncSession, Depends(get_async_session)],
):
    try:
        record = await session.scalar(
            select(Questionnaire).where(Questionnaire.user_id == user.id)
        )

        if not record:
            raise Exception("No questionnaire record found")

        await session.execute(
            update(Questionnaire)
            .where(Questionnaire.user_id == user.id)
            .values(**answers.model_dump(exclude_unset=True))
        )

        await session.commit()


        return {"data": record}

    except Exception as e:
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update a record: {e}",
        )
