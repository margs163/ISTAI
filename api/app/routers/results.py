from typing import Annotated
from fastapi import APIRouter, Body, Depends, HTTPException, Path, Query, status
from aioboto3.session import Session
import asyncio
from sqlalchemy import select

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
            async with session:
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

                local_path = f"../data/pronunciation-{uuid4()}.wav"
                await s3_client.download_file(
                    Bucket=bucket_name, Key=reading_audio_path, Filename=local_path
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
                phonemes = []

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
                    if (
                        event.cancellation_details.reason
                        == speechsdk.CancellationReason.Error
                    ):
                        raise HTTPException(
                            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail=f"Reason: {event.cancellation_details.error_details}",
                        )

                recognizer.recognized.connect(recognize_handle)
                recognizer.canceled.connect(cancel_handle)

                recognizer.start_continuous_recognition()
                await asyncio.sleep(20)
                recognizer.stop_continuous_recognition()

                state = await pronunciation_app.ainvoke(
                    {"transcriptions": " ".join(transcriptions), "phonemes": phonemes}
                )

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
                    grammar=general_state["grammar_state"],
                    lexis=general_state["lexis_score"],
                    pronunciation=pronunciation_score,
                )

                overall_score = (
                    scores.fluency
                    + scores.grammar
                    + scores.lexis
                    + scores.pronunciation
                ) / 4 + score_treshold

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
                    grammarEnhancements=sentences_state["grammar_enhancement"],
                    vocabularyEnhancements=sentences_state["vocabulary_enhancements"],
                )

                grammar_errors = GrammarAnalysis(
                    grammar_analysis=sentences_state["grammar_analysis"]
                )

                vocabulary_usage = VocabAnalysis(
                    advancedVocabulary=sentences_state["advanced_vocabulary"],
                    repetitions=sentences_state["repetitions"],
                )

                end_result = Result(
                    practice_test=test,
                    overall_score=overall_score,
                    criterion_scores=scores.model_dump(),
                    weak_sides=weak_sides.model_dump(),
                    strong_points=strong_points.model_dump(),
                    sentence_improvements=sentence_improvements.model_dump(),
                    grammar_errors=grammar_errors.model_dump(),
                    vocabulary_usage=vocabulary_usage.model_dump()[
                        "advancedVocabulary"
                    ],
                    repeated_words=vocabulary_usage.model_dump()["repetitions"],
                    pronunciation_issues=pronunciation_mistakes,
                    general_tips=general_tips.model_dump(),
                )

                session.add(end_result)

                if os.path.exists(local_path):
                    os.remove(local_path)

                return {"data": end_result, "status": "success"}

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not post results: {e}",
        )

    finally:
        await s3_client.delete_objects(
            Bucket=bucket_name,
            Delete={"Objects": [reading_audio_path], "Quiet": False},
        )


@router.get("/{test_id}")
async def get_results(
    user: Annotated[User, Depends(current_active_user)],
    test_id: Annotated[str | None, Path()] = None,
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
