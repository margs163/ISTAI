from copy import deepcopy
from typing import Annotated
from fastapi import APIRouter, Body, Depends, HTTPException, Query, Request, status
from sqlalchemy import Date, and_, select
from sqlalchemy.ext.asyncio import AsyncSession

from datetime import date, datetime

from ..schemas.analytics import (
    AnalyticsSchema,
    AnalyticsUpdateSchema,
    AverageBandScores,
    BandScoresIncrease,
)
from ..schemas.db_tables import Analytics, Notifications, PracticeTest, User
from sqlalchemy import cast, func
from ..lib.auth_db import get_async_session
from ..dependencies import current_active_user, limiter

router = APIRouter(dependencies=[Depends(current_active_user)])


@router.get("/")
@limiter.limit("25/minute")
async def get_analytics(
    request: Request,
    user: Annotated[User, Depends(current_active_user)],
    session: Annotated[AsyncSession, Depends(get_async_session)],
    limit: Annotated[int | None, Query()] = 4,
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

        await session.commit()

        result = {
            "id": analytic.id,
            "user_id": analytic.user_id,
            "practice_time": analytic.practice_time,
            "tests_completed": analytic.tests_completed,
            "current_bandscore": analytic.current_bandscore,
            "average_band_scores": deepcopy(analytic.average_band_scores),
            "average_band": analytic.average_band,
            "grammar_common_mistakes": (
                deepcopy(analytic.grammar_common_mistakes)[:limit]
                if analytic.grammar_common_mistakes
                else None
            ),
            "lexis_common_mistakes": (
                deepcopy(analytic.lexis_common_mistakes)[:limit]
                if analytic.lexis_common_mistakes
                else None
            ),
            "pronunciation_common_mistakes": (
                deepcopy(analytic.pronunciation_common_mistakes)[:limit]
                if analytic.pronunciation_common_mistakes
                else None
            ),
            "streak_days": analytic.streak_days,
        }

        return {"data": result}
    except Exception as e:
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not fetch analytics record: {e}",
        )


@router.post("/new")
@limiter.limit("4/minute")
async def init_analytics(
    request: Request,
    user: Annotated[User, Depends(current_active_user)],
    session: Annotated[AsyncSession, Depends(get_async_session)],
):
    try:
        new_analytics = AnalyticsSchema(
            user_id=str(user.id),
            practice_time=0,
            tests_completed=0,
            current_bandscore=0,
            average_band_scores=AverageBandScores(
                fluency=0, grammar=0, lexis=0, pronunciation=0
            ),
            scores_increase=BandScoresIncrease(
                fluency=0, grammar=0, lexis=0, pronunciation=0
            ),
            average_band=0,
            grammar_common_mistakes=[],
            lexis_common_mistakes=[],
            pronunciation_common_mistakes=[],
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
@limiter.limit("4/minute")
async def update_analytics(
    request: Request,
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
                    cast(PracticeTest.test_date, Date) == date.today(),
                )
            )
            .order_by(PracticeTest.test_date.desc())
        )

        today_tests = result.unique().all()
        result2 = await session.execute(
            select(Analytics).where(Analytics.user_id == user.id)
        )
        analytic = result2.unique().scalar_one_or_none()

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

            scores_increase = {
                "fluency": new_avg_bands["fluency"] - fluency_avg,
                "grammar": new_avg_bands["grammar"] - grammar_avg,
                "lexis": new_avg_bands["lexis"] - lexis_avg,
                "pronunciation": new_avg_bands["pronunciation"] - pronunciation_avg,
            }

            analytic.scores_increase = scores_increase

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

        if update.grammar_common_mistakes:
            # Initialize if empty
            if not analytic.grammar_common_mistakes:
                analytic.grammar_common_mistakes = [
                    {
                        "identified_mistakes": [
                            {
                                "mistake_type": mistake.identified_mistakes[0][
                                    "mistake_type"
                                ],
                                "description": mistake.identified_mistakes[0][
                                    "description"
                                ],
                            }
                        ],
                        "frequency": 1,
                        "original_sentence": mistake.original_sentence,
                        "suggested_improvement": mistake.suggested_improvement,
                        "explanation": mistake.explanation,
                    }
                    for mistake in update.grammar_common_mistakes
                ]
            else:
                # Create a lookup dictionary for existing mistakes
                mistake_dict_grammar = {
                    m["identified_mistakes"][0]["mistake_type"]: m
                    for m in analytic.grammar_common_mistakes
                }
                for mistake in update.grammar_common_mistakes:
                    mistake_type = mistake.identified_mistakes[0]["mistake_type"]
                    if mistake_type in mistake_dict_grammar:
                        # Update existing mistake
                        common = mistake_dict_grammar[mistake_type]
                        common["frequency"] += 1
                        common["original_sentence"] = mistake.original_sentence
                        common["suggested_improvement"] = mistake.suggested_improvement
                        common["explanation"] = mistake.explanation
                    else:
                        # Add new mistake
                        analytic.grammar_common_mistakes.append(
                            {
                                "identified_mistakes": [
                                    {
                                        "mistake_type": mistake_type,
                                        "description": mistake.identified_mistakes[0][
                                            "description"
                                        ],
                                    }
                                ],
                                "frequency": 1,
                                "original_sentence": mistake.original_sentence,
                                "suggested_improvement": mistake.suggested_improvement,
                                "explanation": mistake.explanation,
                            }
                        )

            analytic.grammar_common_mistakes = sorted(
                analytic.grammar_common_mistakes,
                key=lambda x: x["frequency"],
                reverse=True,
            )[:20]

        if update.lexis_common_mistakes:
            if not analytic.lexis_common_mistakes:
                analytic.lexis_common_mistakes = [
                    {
                        "identified_issues": mistake.identified_issues,
                        "frequency": 1,
                        "original_sentence": mistake.original_sentence,
                        "suggested_improvement": mistake.suggested_improvement,
                        "explanation": mistake.explanation,
                    }
                    for mistake in update.lexis_common_mistakes
                ]

            else:
                mistake_dict_lexis = {
                    m["identified_issues"][0]: m for m in analytic.lexis_common_mistakes
                }
                for mistake in update.lexis_common_mistakes:
                    mistake_type = mistake.identified_issues[0]
                    if mistake_type in mistake_dict_lexis:
                        common = mistake_dict_lexis[mistake_type]
                        common["frequency"] += 1
                        common["original_sentence"] = mistake.original_sentence
                        common["suggested_improvement"] = mistake.suggested_improvement
                        common["explanation"] = mistake.explanation
                    else:
                        analytic.lexis_common_mistakes.append(
                            {
                                "identified_issues": mistake.identified_issues,
                                "frequency": 1,
                                "original_sentence": mistake.original_sentence,
                                "suggested_improvement": mistake.suggested_improvement,
                                "explanation": mistake.explanation,
                            }
                        )
            analytic.lexis_common_mistakes = sorted(
                analytic.lexis_common_mistakes,
                key=lambda x: x["frequency"],
                reverse=True,
            )[:20]

        if update.pronunciation_common_mistakes:
            if not analytic.pronunciation_common_mistakes:
                analytic.pronunciation_common_mistakes = [
                    {
                        "mistake_type": mistake.mistake_type,
                        "frequency": 1,
                        "user_phonemes": mistake.user_phonemes,
                        "correct_phonemes": mistake.correct_phonemes,
                        "word": mistake.word,
                        "accuracy": mistake.accuracy,
                    }
                    for mistake in update.pronunciation_common_mistakes
                ]

            else:
                mistake_dict_pronunciation = {
                    m["mistake_type"]: m for m in analytic.pronunciation_common_mistakes
                }
                for mistake in update.pronunciation_common_mistakes:
                    if mistake.mistake_type in mistake_dict_pronunciation:
                        common = mistake_dict_pronunciation[mistake.mistake_type]
                        common["frequency"] += 1
                        common["user_phonemes"] = mistake.user_phonemes
                        common["correct_phonemes"] = mistake.correct_phonemes
                        common["accuracy"] = mistake.accuracy
                    else:
                        analytic.pronunciation_common_mistakes.append(
                            {
                                "mistake_type": mistake.mistake_type,
                                "frequency": 1,
                                "user_phonemes": mistake.user_phonemes,
                                "correct_phonemes": mistake.correct_phonemes,
                                "word": mistake.word,
                                "accuracy": mistake.accuracy,
                            }
                        )
            analytic.pronunciation_common_mistakes = sorted(
                analytic.pronunciation_common_mistakes,
                key=lambda x: x["frequency"],
                reverse=True,
            )[:20]

        await session.commit()
        await session.refresh(analytic)

        return {"data": analytic}
    except Exception as e:
        await session.rollback()
        raise Exception(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not fetch analytics record: {e}",
        )
