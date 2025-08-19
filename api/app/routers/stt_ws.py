from typing import Annotated
from fastapi import (
    APIRouter,
    HTTPException,
    WebSocket,
    WebSocketDisconnect,
    WebSocketException,
    status,
    Depends,
)
from ..lib.auth_db import User
import uuid
from ..lib.groq_audio import transcribe_audio_in_chunks
from pathlib import Path
from ..dependencies import current_active_user
import os


def get_speech_metadata(transcription) -> list:
    try:
        no_speech = 0
        avg_logprob = 0
        compression = 0
        count = 0
        for segment in transcription["segments"]:
            no_speech += segment["no_speech_prob"]
            avg_logprob += segment["avg_logprob"]
            compression += segment["compression_ratio"]
            count += 1
    except Exception as e:
        raise WebSocketException(
            code=status.WS_1011_INTERNAL_ERROR, reason="Could not get speech metadata"
        )
    return [no_speech / count, avg_logprob / count, compression / count]


router = APIRouter()


@router.websocket("/ws")
async def stt_websocket(websocket: WebSocket):
    transcription = {"text": ""}
    try:
        await websocket.accept()
        while True:
            data = await websocket.receive_bytes()
            temp_file_path = f"./data/temp_audio_{uuid.uuid4().hex}.webm"

            with open(temp_file_path, "wb") as file:
                file.write(data)

            try:
                result = transcribe_audio_in_chunks(Path(temp_file_path))
                metadata = get_speech_metadata(result)

                for segment in result["segments"]:
                    transcription["text"] += segment["text"]

                transcription["no_speech_prob"] = metadata[0]
                transcription["avg_logprob"] = metadata[1]
                transcription["compression_ratio"] = metadata[2]

                await websocket.send_json(transcription)
                transcription = {"text": ""}

                if os.path.exists(temp_file_path):
                    os.remove(temp_file_path)
            except Exception as e:
                raise WebSocketException(
                    code=status.WS_1011_INTERNAL_ERROR,
                    reason=f"Could not transcribe audio chunks: {e}",
                )

    except WebSocketDisconnect:
        pass
    except Exception as e:
        print(e)
        raise WebSocketException(
            code=status.WS_1011_INTERNAL_ERROR,
            reason="Could not recieve audio chunks",
        )
