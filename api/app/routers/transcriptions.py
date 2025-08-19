from fastapi import APIRouter, Depends, HTTPException, Path, status, Query
from sqlalchemy import and_, insert, select
from typing import Annotated
from ..dependencies import current_active_user
from ..lib.auth_db import get_async_session
from ..schemas.transcriptions import TranscriptionSchema
from ..schemas.db_tables import (
    PracticeTest,
    Transcription,
    User,
)

router = APIRouter(dependencies=[Depends(current_active_user)])


@router.post("/new")
async def post_transcription(
    transcription: TranscriptionSchema,
    user: Annotated[User, Depends(current_active_user)],
):
    async for session in get_async_session():
        async with session.begin():
            try:
                result_select = await session.execute(
                    select(PracticeTest).where(PracticeTest.id == transcription.test_id)
                )
                test_id = result_select.scalar_one()

                if not test_id:
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail=f"Could not find a practice test with an id '{transcription.test_id}'",
                    )

                create_obj = Transcription(
                    user_id=user.id,
                    test_id=test_id,
                    part_one=transcription.part_one,
                    part_two=transcription.part_two,
                    part_three=transcription.part_three,
                )
                session.add(create_obj)

                return {"status": "Success"}

            except Exception as e:
                await session.rollback()
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Failed to create a record: {e}",
                )


@router.get("/")
async def get_transcription(
    user: Annotated[User, Depends(current_active_user)],
    test_id: Annotated[str | None, Query()] = None,
    user_id: Annotated[bool | None, Query()] = None,
):
    result = None
    async for session in get_async_session():
        async with session.begin():
            try:
                if not test_id and not user_id:
                    raise HTTPException(
                        status_code=status.HTTP_406_NOT_ACCEPTABLE,
                        detail="Specify one of the queries",
                    )
                if user_id:
                    result = await session.scalars(
                        select(Transcription).where(Transcription.user_id == user.id)
                    )
                else:
                    result = await session.scalars(
                        select(Transcription).where(Transcription.user_id == user.id)
                    )

                return {"transcriptions": result.all()}
            except Exception as e:
                await session.rollback()
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Could not fetch transcriptions: {e}",
                )


@router.delete("/{questionCardId}")
async def delete_questions(testId: Annotated[str, Path()]):
    try:
        async for session in get_async_session():
            async with session.begin():
                result = await session.scalars(
                    select(Transcription).where(Transcription.id == testId)
                )
                await session.delete(result.all())

                return {"status": "Success"}
    except Exception as e:
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not delete transcription: {e}",
        )
