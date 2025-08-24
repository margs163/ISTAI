import json
import math
import time
from typing import Annotated
from fastapi import APIRouter, Body, Depends, HTTPException, Path, Query, status
from aioboto3.session import Session
import asyncio
from sqlalchemy import select
from pathlib import Path as OSPath

from api.app.dependencies import get_s3_client, current_active_user
from api.app.lib.auth_db import get_async_session
from api.app.lib.utils import construct_input
from api.app.schemas.db_tables import PracticeTest, Result, User
from api.app.schemas.practice_test import (
    CriteriaScores,
    GrammarAnalysis,
    GeneralTips,
    ReadingCardSchema,
    SentenceImprovements,
    StrongPoints,
    VocabAnalysis,
    WeakSides,
)
from uuid import uuid4
from api.app.schemas.transcriptions import TranscriptionSchema
from api.app.lib.general_agents import GeneralState, general_app
from api.app.lib.sentence_agents import AnalysisState, sentence_app
from api.app.lib.pronunciation_agent import pronunciation_app
import azure.cognitiveservices.speech as speechsdk
from dotenv import load_dotenv
import os

load_dotenv()


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
    stdout, stderr = await process.communicate()
    if process.returncode != 0:
        raise RuntimeError(f"FFmpeg failed: {stderr.decode()}")


def round_to_half(value: float) -> float:
    return math.floor(value * 2 + 0.5) / 2


router = APIRouter()
bucket_name = os.getenv("S3_BUCKET_NAME")
azure_region = os.getenv("AZURE_REGION")
azure_api_key = os.getenv("AZURE_SUBSCRIPTION_KEY")


@router.post("/")
async def post_results(
    readingCard: Annotated[ReadingCardSchema, Body()],
    reading_audio_path: Annotated[str, Query()],
    s3_client: Annotated[Session, Depends(get_s3_client)],
    user: Annotated[User, Depends(current_active_user)],
    transcription: Annotated[TranscriptionSchema, Body()],
    score_treshold: Annotated[float, Query()] = 0.5,
):
    local_path = None
    try:
        async for session in get_async_session():
            async with session.begin():
                test = await session.scalars(
                    select(PracticeTest).where(PracticeTest.id == transcription.test_id)
                )
                test = test.first()
                if not test:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Could not find a test with specified id",
                    )

                parsed_transcriptions = construct_input(transcription)

                general_state = await general_app.ainvoke(
                    {"transcriptions": parsed_transcriptions}
                )

                sentences_state = await sentence_app.ainvoke(
                    {"transcriptions": parsed_transcriptions}
                )

                print("General and sentences state graphes were run.")

                local_path = f"./data/pronunciation-{uuid4()}.wav"
                await s3_client.download_file(
                    Bucket=bucket_name, Key=reading_audio_path, Filename=local_path
                )

                print("Downloaded the file:", local_path)

                output_path = f"./data/pronunciation-{uuid4()}.wav"

                await convert_to_wav(local_path, output_path)

                print("Converted to the right format.")

                reference_text = readingCard.text

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
                pronunciation_assessment_config = (
                    speechsdk.PronunciationAssessmentConfig(
                        json_string=json.dumps(config)
                    )
                )

                recognizer = speechsdk.SpeechRecognizer(
                    speech_config=speech_config, audio_config=audio_config
                )

                pronunciation_assessment_config.apply_to(recognizer)

                print("Applied config to a recognizer")

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
                    if (
                        event.cancellation_details.reason
                        == speechsdk.CancellationReason.Error
                    ):
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
                    time.sleep(0.5)

                print("Transcribed audio for pronunciation assessment.")

                state = await pronunciation_app.ainvoke(
                    {
                        "transcriptions": transcriptions,
                        "phonemes": phonemes,
                        "accuracy": accuracy,
                    }
                )

                print("Pronunciation agent run successfully.")

                pronunciation_score = state["pronunciation_score"]
                pronunciation_strong_points = state["pronunciation_strong_points"]
                pronunciation_weak_sides = state["pronunciation_weak_sides"]
                pronunciation_mistakes = state["pronunciation_mistakes"]
                pronunciation_tips = state["pronunciation_tips"]

                general_tips = GeneralTips(
                    fluency=general_state["fluency_tips"],
                    grammar=general_state["grammar_tips"],
                    lexis=general_state["lexis_tips"],
                    pronunciation=pronunciation_tips,
                )

                scores = CriteriaScores(
                    fluency=general_state["fluency_score"],
                    grammar=general_state["grammar_score"],
                    lexis=general_state["lexis_score"],
                    pronunciation=pronunciation_score,
                )

                overall_score = round_to_half(
                    (
                        scores.fluency
                        + scores.grammar
                        + scores.lexis
                        + scores.pronunciation
                    )
                    / 4
                    + score_treshold
                )

                weak_sides = WeakSides(
                    fluency=general_state["fluency_weak_sides"],
                    grammar=general_state["grammar_weak_sides"],
                    lexis=general_state["lexis_weak_sides"],
                    pronunciation=pronunciation_weak_sides,
                )

                strong_points = StrongPoints(
                    fluency=general_state["fluency_strong_points"],
                    grammar=general_state["grammar_strong_points"],
                    lexis=general_state["lexis_strong_points"],
                    pronunciation=pronunciation_strong_points,
                )

                sentence_improvements = SentenceImprovements(
                    grammar_enhancements=sentences_state["grammar_enhancements"],
                    vocabulary_enhancements=sentences_state["vocabulary_enhancements"],
                )

                grammar_errors = GrammarAnalysis(
                    grammar_analysis=sentences_state["grammar_analysis"]
                )

                vocabulary_usage = VocabAnalysis(
                    advanced_vocabulary=sentences_state["advanced_vocabulary"],
                    repetitions=sentences_state["repetitions"],
                )

                end_result = Result(
                    practice_test_id=test.id,
                    overall_score=overall_score,
                    criterion_scores=scores.model_dump(),
                    weak_sides=weak_sides.model_dump(),
                    strong_points=strong_points.model_dump(),
                    sentence_improvements=sentence_improvements.model_dump(),
                    grammar_errors=grammar_errors.model_dump(),
                    vocabulary_usage=vocabulary_usage.model_dump()[
                        "advanced_vocabulary"
                    ],
                    repeated_words=vocabulary_usage.model_dump()["repetitions"],
                    pronunciation_issues=pronunciation_mistakes,
                    general_tips=general_tips.model_dump(),
                )

                session.add(end_result)
                print("Results object was added to the session.")

                if OSPath(local_path).exists():
                    OSPath(local_path).unlink()

                if OSPath(output_path).exists():
                    OSPath(output_path).unlink()

                return {"data": end_result}

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not post results: {e}",
        )

    finally:
        pass
        # await s3_client.delete_object(Bucket=bucket_name, Key=reading_audio_path)


@router.get("/{test_id}")
async def get_results(
    user: Annotated[User, Depends(current_active_user)],
    test_id: Annotated[str | None, Path()],
    result_id: Annotated[str | None, Query()] = None,
):
    try:
        async for session in get_async_session():
            async with session:
                query = select(PracticeTest).where(PracticeTest.user_id == user.id)

                if test_id:
                    query = query.where(PracticeTest.id == test_id)

                if result_id:
                    query = query.where(PracticeTest.result.id == result_id)

                result = await session.scalars(query)
                practice_tests = result.all()

                results = [practice_test.result for practice_test in practice_tests]

                return {"data": results, "status": "success"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not fetch practice_tests and results: {str(e)}",
        )
