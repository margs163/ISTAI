from typing import Annotated
from fastapi import APIRouter, Body, Depends, HTTPException, status
from sqlalchemy import and_, select
from sqlalchemy.orm import joinedload
from sqlalchemy.ext.asyncio import AsyncSession

from api.app.schemas import analytics
import datetime

datetime.datetime.now


from api.app.schemas.analytics import (
    AnalyticsSchema,
    AnalyticsUpdateSchema,
    AverageBandScores,
)
from api.app.schemas.db_tables import Analytics, PracticeTest, User
from ..lib.auth_db import get_async_session
from ..dependencies import current_active_user

router = APIRouter(dependencies=[Depends(current_active_user)])


@router.get("/")
async def get_analytics(
    user: Annotated[User, Depends(current_active_user)],
    session: Annotated[AsyncSession, Depends(get_async_session)],
):
    try:
        result = await session.scalars(
            select(Analytics).where(Analytics.user_id == user.id)
        )
        analytic = result.first()

        if not analytic:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Could not find an analytics record",
            )

        return {"data": analytic}
    except Exception as e:
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not fetch analytics record: {e}",
        )


@router.post("/new")
async def init_analytics(
    user: Annotated[User, Depends(current_active_user)],
    session: Annotated[AsyncSession, Depends(get_async_session)],
):
    try:
        new_analytics = AnalyticsSchema(
            user_id=user.id,
            practice_time=0,
            tests_completed=0,
            current_bandscore=0,
            average_band_scores=AverageBandScores(
                fluency=0, grammar=0, lexis=0, pronunciation=0
            ),
            average_band=0,
            common_mistakes={"prop": None},
            streak_days=0,
        )
        analytics_record = Analytics(**new_analytics.model_dump())
        session.add(analytics_record)
        await session.commit()

        return {"data": analytics_record}
    except Exception as e:
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not fetch analytics record: {e}",
        )


@router.put("/")
async def update_analytics(
    user: Annotated[User, Depends(current_active_user)],
    session: Annotated[AsyncSession, Depends(get_async_session)],
    update: Annotated[AnalyticsUpdateSchema, Body()],
):
    try:
        result = await session.scalars(
            select(PracticeTest)
            .where(
                and_(
                    PracticeTest.user_id == user.id,
                    PracticeTest.test_date == datetime.datetime.now(),
                )
            )
            .order_by(PracticeTest.test_date.desc())
        )
        today_tests = result.all()
        result2 = await session.scalars(
            select(Analytics).where(Analytics.user_id == user.id)
        )
        analytic = result2.first()

        if not analytic:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Could not find an analytics record",
            )

        num_tests = analytic.tests_completed
        analytic.tests_completed = num_tests + 1

        if update.average_band:
            total_bands = analytic.average_band * num_tests
            new_average = (total_bands + update.average_band) / (num_tests + 1)
            analytic.average_band = new_average

        if update.average_band_scores:
            average_bands = analytic.average_band_scores
            fluency_avg = average_bands["fluency"]
            grammar_avg = average_bands["grammar"]
            lexis_avg = average_bands["lexis"]
            pronunciation_avg = average_bands["pronunciation"]

            new_avg_bands = {
                "fluency": (
                    fluency_avg * num_tests + update.average_band_scores.fluency
                )
                / (num_tests + 1),
                "grammar": (
                    grammar_avg * num_tests + update.average_band_scores.grammar
                )
                / (num_tests + 1),
                "lexis": (lexis_avg * num_tests + update.average_band_scores.lexis)
                / (num_tests + 1),
                "pronunciation": (
                    pronunciation_avg * num_tests
                    + update.average_band_scores.pronunciation
                )
                / (num_tests + 1),
            }
            analytic.average_band_scores = new_avg_bands

        if update.current_bandscore:
            analytic.current_bandscore = update.current_bandscore

        if update.practice_time:
            current_time = analytic.practice_time
            analytic.practice_time = current_time + update.practice_time

        if update.streak_days:
            if not today_tests:
                analytic.streak_days = 1
            else:
                if len(today_tests) == 1:
                    current_streak = analytic.streak_days
                    analytic.streak_days = current_streak + 1

        if update.common_mistakes:
            analytic.common_mistakes = update.common_mistakes

        await session.commit()
        await session.refresh(analytic)

        return {"data": analytic}
    except Exception as e:
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not fetch analytics record: {e}",
        )
