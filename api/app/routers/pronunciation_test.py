import asyncio
import json
from typing import Annotated
from fastapi import APIRouter, Body, Depends, HTTPException, Path, Request, status
from dotenv import load_dotenv
from sqlalchemy import select

from ..schemas.pronunciation import PronunciationAnalysis, PronunciationMistake
from ..lib.pronunciation_agent import pronunciation_app
from boto3.session import Session
import azure.cognitiveservices.speech as speechsdk
from uuid import uuid4
import os
import logging as LOGGER
from sqlalchemy.ext.asyncio import AsyncSession
from pathlib import Path as OSPath
from ..dependencies import limiter

from ..dependencies import get_s3_client, current_active_user
from ..lib.auth_db import get_async_session
from ..schemas.db_tables import PronunciationTest, User
from ..schemas.practice_test import ReadingCardSchema

load_dotenv()

router = APIRouter(dependencies=[Depends(current_active_user)])
bucket_name = os.getenv("S3_BUCKET_NAME")
azure_region = os.getenv("AZURE_REGION")
azure_api_key = os.getenv("AZURE_SUBSCRIPTION_KEY")


async def convert_to_wav(input_path: str, output_path: str) -> None:
    command = [
        "ffmpeg",
        "-i",
        input_path,
        "-ac",
        "1",  # Mono
        "-ar",
        "16000",  # Sample rate
        "-sample_fmt",
        "s16",  # Sample width (16-bit = 2 bytes)
        output_path,
    ]
    process = await asyncio.create_subprocess_exec(
        *command, stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.PIPE
    )
    LOGGER.info("Converted an audio file to a wav format")
    stdout, stderr = await process.communicate()
    if process.returncode != 0:
        LOGGER.error("FFmpeg could not convert audio to a wav format")
        raise RuntimeError(f"FFmpeg failed: {stderr.decode()}")


@router.get("/{pronunciation_test_id}")
@limiter.limit("10/minute")
async def get_pronunciation_tests(
    request: Request,
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


@router.post("/")
@limiter.limit("10/minute")
async def test_pronunciation(
    request: Request,
    readingCard: Annotated[ReadingCardSchema, Body()],
    audio_path: Annotated[str, Body()],
    s3_client: Annotated[Session, Depends(get_s3_client)],
    user: Annotated[User, Depends(current_active_user)],
    session: Annotated[AsyncSession, Depends(get_async_session)],
):
    local_path = None
    output_path = None
    try:
        local_path = f"./app/data/pronunciation-{uuid4()}.wav"
        await s3_client.download_file(  # type: ignore
            Bucket=bucket_name,
            Key=audio_path,
            Filename=local_path,
        )

        LOGGER.info("Downloaded the reading audio file")

        output_path = f"./app/data/pronunciation-{uuid4()}.wav"

        await convert_to_wav(local_path, output_path)

        reference_text = readingCard.text

        LOGGER.debug("Converted the audio to a wav format")

        speech_config = speechsdk.SpeechConfig(
            subscription=azure_api_key,
            region=azure_region,
            speech_recognition_language="en-US",
        )

        audio_config = speechsdk.audio.AudioConfig(filename=output_path)

        config = {
            "referenceText": reference_text,
            "gradingSystem": "HundredMark",
            "granularity": "Phoneme",
            "phonemeAlphabet": "IPA",
        }
        pronunciation_assessment_config = speechsdk.PronunciationAssessmentConfig(
            json_string=json.dumps(config)
        )

        recognizer = speechsdk.SpeechRecognizer(
            speech_config=speech_config, audio_config=audio_config
        )

        pronunciation_assessment_config.apply_to(recognizer)

        LOGGER.info("Applied config to a recognizer")

        accuracy = 0
        transcriptions = []
        phonemes = []
        done = False

        def stop_callback(event):
            recognizer.stop_continuous_recognition_async()
            nonlocal done
            done = True

        def cancell_callback(event):
            print(f"CLOSING ON: {event}")
            recognizer.stop_continuous_recognition_async()

            nonlocal done
            done = True
            if event.cancellation_details.reason == speechsdk.CancellationReason.Error:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Reason: {event.cancellation_details.error_details}",
                )

        def recognize_handle(event):
            if event.result.reason == speechsdk.ResultReason.RecognizedSpeech:
                pronunciation_result = speechsdk.PronunciationAssessmentResult(
                    event.result
                )

                nonlocal accuracy
                accuracy = pronunciation_result.accuracy_score
                transcriptions.append(event.result.text)

                for word in pronunciation_result.words:
                    phonemes.append(
                        {
                            word.word: {
                                "accuracy": word.accuracy_score,
                                "phonemes": "".join(
                                    [phone.phoneme for phone in word.phonemes]
                                ),
                            }
                        }
                    )

        recognizer.session_stopped.connect(stop_callback)
        recognizer.canceled.connect(cancell_callback)
        recognizer.recognized.connect(recognize_handle)

        recognizer.start_continuous_recognition_async()
        while not done:
            await asyncio.sleep(0.5)

        LOGGER.info("Transcribed audio for pronunciation assessment")

        if not transcriptions or not phonemes or not accuracy:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Could not transcribe the audio",
            )

        print(f"Transcriptions:\n{transcriptions}\n\n\nPhonemes:\n{phonemes}")

        state = await pronunciation_app.ainvoke(
            {
                "transcriptions": transcriptions,
                "phonemes": phonemes,
                "accuracy": accuracy,  # type: ignore
            }
        )

        pronunciation_tips = state["pronunciation_tips"]
        pronunciation_score = state["pronunciation_score"]
        pronunciation_strong_points = state["pronunciation_strong_points"]
        pronunciation_weak_sides = state["pronunciation_weak_sides"]
        pronunciation_mistakes: list[dict] = state["pronunciation_mistakes"]

        serializable = PronunciationAnalysis(
            pronunciation_score=pronunciation_score,
            pronunciation_strong_points=pronunciation_strong_points,
            pronunciation_weak_sides=pronunciation_weak_sides,
            pronunciation_tips=pronunciation_tips,
            pronunciation_mistakes=[
                PronunciationMistake(**mistake) for mistake in pronunciation_mistakes
            ],
        )

        test = PronunciationTest(user_id=str(user.id), **serializable.model_dump())

        session.add(test)
        await session.commit()

        LOGGER.info("Pronunciation agent run successfully")
        return {"data": test}

    except Exception as e:
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not process request: {str(e)}",
        )

    finally:
        if local_path and OSPath(local_path).exists():
            OSPath(local_path).unlink()

        if output_path and OSPath(output_path).exists():
            OSPath(output_path).unlink()

        if audio_path:
            await s3_client.delete_object(Bucket=bucket_name, Key=audio_path)
