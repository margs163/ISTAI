import json
import math
from typing import Annotated
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Path,
    Query,
    Request,
    WebSocket,
    WebSocketDisconnect,
    WebSocketException,
    status,
)
from aioboto3.session import Session
import asyncio
from pydantic import BaseModel, Field
from sqlalchemy import select
from pathlib import Path as OSPath

from ..dependencies import get_s3_client, current_active_user
from ..lib.auth_db import get_async_session
from ..lib.utils import construct_input
from ..schemas.db_tables import PracticeTest, Result, User
from ..schemas.practice_test import (
    CriteriaScores,
    GrammarAnalysis,
    GeneralTips,
    ReadingCardSchema,
    SentenceImprovements,
    StrongPoints,
    VocabAnalysis,
    WeakSides,
    Result as ResultModel,
)
from uuid import uuid4
from ..schemas.transcriptions import TranscriptionSchema
from ..lib.general_agents import general_app
from ..lib.sentence_agents import sentence_app
from ..lib.pronunciation_agent import pronunciation_app
import azure.cognitiveservices.speech as speechsdk
from sqlalchemy.ext.asyncio import AsyncSession
from dotenv import load_dotenv
from ..dependencies import limiter
from ..lib.celery_app import celery_app
from celery.result import AsyncResult
import logging
import os

load_dotenv()

logger = logging.getLogger(__name__)


async def convert_to_wav(input_path: str, output_path: str) -> None:
    if not os.path.exists(input_path):
        raise FileNotFoundError(f"Input file with path {input_path} does not exist")

    command = [
        "ffmpeg",
        "-i",
        str(input_path),
        "-ac",
        "1",  # Mono
        "-ar",
        "16000",  # Sample rate
        "-sample_fmt",
        "s16",  # Sample width (16-bit = 2 bytes)
        "-threads",
        "auto",
        "-y",
        str(output_path),
    ]

    try:
        process = await asyncio.create_subprocess_exec(
            *command, stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.PIPE
        )
        logger.info("Converted an audio file to a wav format")
        stdout, stderr = await process.communicate()

        if process.returncode != 0:
            print(stderr.decode())
            # raise RuntimeError(f"FFmpeg failed: {stderr.decode()}")

    except Exception as e:
        logger.error(f"FFmpeg conversion to wav failed: {str(e)}")
        print(f"FFmpeg conversion to wav failed: {str(e)}")
        # raise RuntimeError(f"FFmpeg conversion to wav failed: {str(e)}")


async def azure_speech_recognition(output_path: str, reference_text: str) -> dict:
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

    logger.info("Applied config to a recognizer")

    accuracy = 0
    transcriptions = []
    phonemes = []
    done_event = asyncio.Event()

    def stop_callback(event):
        recognizer.stop_continuous_recognition_async()
        done_event.set()

    def cancell_callback(event):
        print(f"CLOSING ON: {event}")
        recognizer.stop_continuous_recognition_async()

        done_event.set()
        if event.cancellation_details.reason == speechsdk.CancellationReason.Error:
            raise WebSocketException(
                code=status.WS_1011_INTERNAL_ERROR,
                reason=f"Reason: {event.cancellation_details.error_details}",
            )

    def recognize_handle(event):
        if event.result.reason == speechsdk.ResultReason.RecognizedSpeech:
            pronunciation_result = speechsdk.PronunciationAssessmentResult(event.result)

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
    await done_event.wait()

    return {
        "accuracy": accuracy,
        "transcriptions": transcriptions,
        "phonemes": phonemes,
    }


@celery_app.task
def azure_speech_task(output_path: str, reference_text: str):
    results = asyncio.run(azure_speech_recognition(output_path, reference_text))
    return results


@celery_app.task
def wav_converter_task(input_path: str, output_path: str):
    asyncio.run(convert_to_wav(input_path, output_path))


def round_to_half(value: float) -> float:
    return math.floor(value * 2 + 0.5) / 2


router = APIRouter()
bucket_name = os.getenv("S3_BUCKET_NAME")
azure_region = os.getenv("AZURE_REGION")
azure_api_key = os.getenv("AZURE_SUBSCRIPTION_KEY")


class WebSocketInputData(BaseModel):
    readingCard: ReadingCardSchema
    reading_audio_path: str
    transcription: TranscriptionSchema
    score_threshold: float | None = Field(default=0.5)
    user_id: str


@router.websocket("/ws")
async def post_results(
    websocket: WebSocket,
    s3_client: Annotated[Session, Depends(get_s3_client)],
    session: Annotated[AsyncSession, Depends(get_async_session)],
):
    local_path = None
    validated = None
    output_path = None
    try:
        await websocket.accept()
        while True:
            data = await websocket.receive_json()
            logger.info("Recieved data")
            validated = WebSocketInputData(**data)

            test = await session.scalars(
                select(PracticeTest).where(
                    PracticeTest.id == validated.transcription.test_id
                )
            )
            test = test.first()
            logger.info("Got the test")
            if not test:
                logger.error("Could not find a test with a specified id")
                raise WebSocketException(
                    code=status.HTTP_400_BAD_REQUEST,
                    reason="Could not find a test with specified id",
                )

            await websocket.send_text("Invoking general graph")

            parsed_transcriptions = construct_input(validated.transcription)

            general_state = await general_app.ainvoke(
                {
                    "transcriptions": parsed_transcriptions,  # type: ignore
                }
            )

            await websocket.send_text("Invoking sentences graph")
            logger.info("Invoked a general graph")

            sentences_state = await sentence_app.ainvoke(
                {
                    "transcriptions": parsed_transcriptions,  # type: ignore
                }
            )

            logger.info("Invoked a sentences graph")
            local_path = f"./app/data/pronunciation-{uuid4()}.wav"
            await s3_client.download_file(  # type: ignore
                Bucket=bucket_name,
                Key=validated.reading_audio_path,
                Filename=local_path,
            )

            logger.info("Downloaded the reading audio file")

            output_path = f"./app/data/pronunciation-{uuid4()}.wav"

            task = wav_converter_task.delay(local_path, output_path)
            result = AsyncResult(task.id)
            logger.info("Wav conversion started with task id:", task.id)

            while not result.ready():
                await asyncio.sleep(0.1)

            if result.successful():
                reference_text = validated.readingCard.text

                await websocket.send_text("Transcribing reading speech")
                logger.debug("Converted the audio to a wav format")

                task_recognize = azure_speech_task.delay(output_path, reference_text)
                result_recognize = AsyncResult(task_recognize.id)

                while not result_recognize.ready():
                    await asyncio.sleep(1)

                if result_recognize.successful():
                    results: dict = result_recognize.get()

                    accuracy = results.get("accuracy")
                    transcriptions = results.get("transcriptions")
                    phonemes = results.get("phonemes")

                    await websocket.send_text("Invoking pronunciation agent")
                    logger.info("Transcribed audio for pronunciation assessment")

                    if not accuracy:
                        raise WebSocketException(
                            code=status.WS_1011_INTERNAL_ERROR,
                            reason="Missing input values to pronunciation agent",
                        )

                    state = await pronunciation_app.ainvoke(
                        {
                            "transcriptions": transcriptions,
                            "phonemes": phonemes,
                            "accuracy": accuracy,
                        }
                    )

                    logger.info("Pronunciation agent run successfully")

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
                        fluency=general_state["fluency_score"] + 0.5,
                        grammar=general_state["grammar_score"] + 0.5,
                        lexis=general_state["lexis_score"] + 0.5,
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
                        vocabulary_enhancements=sentences_state[
                            "vocabulary_enhancements"
                        ],
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
                    await session.commit()

                    serializable = ResultModel(
                        id=str(end_result.id),
                        practice_test_id=str(test.id),
                        overall_score=end_result.overall_score,
                        criterion_scores=scores,
                        weak_sides=weak_sides,
                        strong_points=strong_points,
                        sentence_improvements=sentence_improvements,
                        grammar_errors=grammar_errors,
                        vocabulary_usage=vocabulary_usage.advanced_vocabulary,
                        repeated_words=vocabulary_usage.repetitions,
                        pronunciation_issues=pronunciation_mistakes,
                        general_tips=general_tips,
                    )

                    logger.info("Results object was added to the session")
                    await websocket.send_json({"data": serializable.model_dump()})

    except WebSocketDisconnect:
        pass
    except Exception as e:
        logger.error(e)
        raise WebSocketException(
            code=status.WS_1011_INTERNAL_ERROR, reason=f"Server error: {e}"
        )

    finally:
        if local_path and OSPath(local_path).exists():
            OSPath(local_path).unlink(missing_ok=True)

        if output_path and OSPath(output_path).exists():
            OSPath(output_path).unlink(missing_ok=True)

        if validated and validated.reading_audio_path:
            await s3_client.delete_object(
                Bucket=bucket_name, Key=validated.reading_audio_path
            )  # type: ignore


@router.get("/{test_id}")
@limiter.limit("12/minute")
async def get_results(
    request: Request,
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
