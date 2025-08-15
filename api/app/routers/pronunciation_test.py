import time
from typing import Annotated, Any
from fastapi import APIRouter, Body, Depends, HTTPException, Path, status
from dotenv import load_dotenv
from sqlalchemy import select

from api.app.schemas import pronunciation
from ..lib.pronunciation_agent import pronunciation_app
from boto3.session import Session
import azure.cognitiveservices.speech as speechsdk
from uuid import uuid4
import os

from api.app.dependencies import get_s3_client, current_active_user
from api.app.lib.auth_db import get_async_session
from api.app.schemas.db_tables import PronunciationTest, User
from api.app.schemas.practice_test import ReadingCardSchema

router = APIRouter(dependencies=[Depends(current_active_user)])
bucket_name = os.getenv("S3_BUCKET_NAME")
azure_region = os.getenv("AZURE_REGION")
azure_api_key = os.getenv("AZURE_SUBSCRIPTION_KEY")


@router.get("/{pronunciation_test_id}")
async def get_pronunciation_tests(
    pronunciation_test_id: Annotated[str, Path()],
    user: Annotated[User, Depends(current_active_user)],
):
    try:
        query = select(PronunciationTest).where(PronunciationTest.user_id == user.id)
        if pronunciation_test_id:
            query = query.where(PronunciationTest.id == pronunciation_test_id)

        async for session in get_async_session():
            async with session:
                result = await session.scalars(query)
                data = result.all()

        return {"tests": data, "status": "success"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not fetch pronunciation tests: {str(e)}",
        )


@router.post("/{audio_path}")
async def test_pronunciation(
    readingCard: Annotated[ReadingCardSchema, Body()],
    audio_path: Annotated[str, Path()],
    s3_client: Annotated[Session, Depends(get_s3_client)],
    user: Annotated[User, Depends(current_active_user)],
):
    try:
        local_path = f"../data/pronunciation-{uuid4()}.wav"
        await s3_client.download_file(
            Bucket=bucket_name, Key=audio_path, Filename=local_path
        )

        reference_text = readingCard.text

        pronunciation_assessment_config = speechsdk.PronunciationAssessmentConfig(
            reference_text=reference_text,
            grading_system=speechsdk.PronunciationAssessmentGradingSystem.HundredMark,
            granularity=speechsdk.PronunciationAssessmentGranularity.Phoneme,
            enable_miscue=True,
        )

        speech_config = speechsdk.SpeechConfig(
            subscription=azure_api_key, region=azure_region
        )
        speech_config.speech_recognition_language = "en-GB"

        audio_config = speechsdk.audio.AudioConfig(filename=local_path)

        recognizer = speechsdk.SpeechRecognizer(
            speech_config=speech_config, audio_config=audio_config
        )

        pronunciation_assessment_config.apply_to(recognizer)

        results = []
        transcriptions = []
        phonemes = [{"word1": {"accuracy": 80, "phonemes": "nasdk13"}}]

        def recognize_handle(event):
            if event.result.reason == speechsdk.ResultReason.RecognizedSpeech:
                pronunciation_result = speechsdk.PronunciationAssessmentResult(
                    event.result
                )
                results.append(pronunciation_result)
                transcriptions.append(event.result.text)

                for word in pronunciation_result.words:
                    phonemes.append(
                        {
                            word.word: {
                                "accuracy": word.accuracy_score,
                                "phonemes": str(word.phonemes),
                            }
                        }
                    )

        def cancel_handle(event):
            print(f"Recognition canceled: {event.cancellation_details.reason}")
            if event.cancellation_details.reason == speechsdk.CancellationReason.Error:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Reason: {event.cancellation_details.error_details}",
                )

        recognizer.recognized.connect(recognize_handle)
        recognizer.canceled.connect(cancel_handle)

        recognizer.start_continuous_recognition()
        time.sleep(20)
        recognizer.stop_continuous_recognition()

        state = await pronunciation_app.ainvoke(
            {"transcriptions": " ".join(transcriptions), "phonemes": phonemes}
        )

        score = state["pronunciation_score"]
        strong_points = state["pronunciation_strong_points"]
        weak_sides = state["pronunciation_weak_sides"]
        mistakes = state["pronunciation_mistakes"]
        tips = state["pronunciation_tips"]

        async for session in get_async_session():
            async with session.begin():
                try:
                    pronunciation_test = PronunciationTest(
                        user_id=user.id,
                        pronunciation_score=score,
                        pronunciation_strong_points=strong_points,
                        pronunciation_weak_sides=weak_sides,
                        pronunciation_mistakes=[
                            mistake.model_dump() for mistake in mistakes
                        ],
                        pronunciation_tips=tips,
                    )

                    session.add(pronunciation_test)
                except Exception:
                    await session.rollback()
                    raise HTTPException(
                        detail="Could not insert data into db",
                        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    )

        return {
            "data": {
                "score": score,
                "strong_points": strong_points,
                "weak_sides": weak_sides,
                "mistakes": mistakes,
                "tips": tips,
            },
            "status": "success",
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not process request: {str(e)}",
        )
