from typing import Annotated
from fastapi import APIRouter, Body, Depends, HTTPException, Path, Query, status
from aioboto3.session import Session

from api.app.dependencies import get_s3_client, current_active_user
from api.app.lib.utils import construct_input
from api.app.schemas.db_tables import User
from api.app.schemas.practice_test import ReadingCardSchema
from api.app.schemas.transcriptions import TranscriptionSchema
from api.app.lib.general_agents import general_app
from api.app.lib.sentence_agents import sentence_app


router = APIRouter()


@router.post("/{test_id}")
async def post_results(
    test_id: Annotated[str, Path()],
    readingCard: Annotated[ReadingCardSchema, Body()],
    audio_path: Annotated[str, Query()],
    s3_client: Annotated[Session, Depends(get_s3_client)],
    user: Annotated[User, Depends(current_active_user)],
    transcription: Annotated[TranscriptionSchema, Body()],
):
    try:
        parsed_transcriptions = construct_input(
            transcription.user_responses, transcription.assistant_responses
        )

        general_state = await general_app.ainvoke(
            {"transcriptions": parsed_transcriptions}
        )

        sentences_state = await sentence_app.ainvoke(
            {"transcriptions": parsed_transcriptions}
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not post results",
        )
