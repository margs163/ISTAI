from typing import Annotated, Any
from fastapi import (
    APIRouter,
    Depends,
    WebSocket,
    WebSocketDisconnect,
    WebSocketException,
    status,
)
from langchain_core.runnables import RunnableConfig
from langchain_core.messages import AIMessageChunk
from dotenv import load_dotenv

from ..dependencies import get_openai_client, get_s3_client, get_polly_client
from ..lib.conversation_agents import agent_part1, agent_part3
from openai import OpenAI, HttpxBinaryResponseContent
import logging
import uuid
import os

load_dotenv()

bucket_name = os.getenv("S3_BUCKET_NAME")
router = APIRouter()
logger = logging.getLogger(__name__)


@router.websocket("/ws")
async def chat_websocket(
    websocket: WebSocket,
    s3_client: Annotated[Any, Depends(get_s3_client)],
    openai_client: Annotated[OpenAI, Depends(get_openai_client)],
):
    thread_id = str(uuid.uuid4())
    config: RunnableConfig = {"configurable": {"thread_id": thread_id}}
    input_message = {"role": "user", "content": ""}
    delete_audio_list = []
    test_ended = False

    try:
        await websocket.accept()

        while True:
            full_text_response = ""
            data: dict = await websocket.receive_json()

            if data["part"] == 1:
                if data["type"] != "userResponse":
                    raise WebSocketException(
                        code=status.WS_1003_UNSUPPORTED_DATA, reason="No text data"
                    )

                input_message["content"] = data["text"]
                async for chunk in agent_part1.astream(
                    {"messages": [input_message]}, config, stream_mode="messages"
                ):
                    ai_chunk: AIMessageChunk = chunk[0]
                    if isinstance(ai_chunk, AIMessageChunk):
                        if (
                            hasattr(ai_chunk, "tool_call_chunks")
                            and len(ai_chunk.tool_call_chunks) > 0
                        ):
                            # print("IDENTIFIED A TOOL CALL")
                            call_args = ai_chunk.tool_call_chunks[0]
                            if call_args["name"] == "conclude_part1":
                                # print("CONCLUDING PART 1")
                                logger.info(
                                    f"Switching to part 2, thread_id: {thread_id}"
                                )
                                await websocket.send_json(
                                    {
                                        "type": "switchToPart2",
                                        "text": "That concludes part 1, now let's move on to part 2.",
                                    }
                                )
                                break

                        full_text_response += str(ai_chunk.content)
            elif data["part"] == 3:
                if (
                    data["type"] != "userResponse"
                    and data["type"] != "part2QuestionCard"
                ):
                    raise WebSocketException(
                        code=status.WS_1003_UNSUPPORTED_DATA, reason="No text data"
                    )
                # print("Recieved a part 3 message: ", data)
                if data["type"] == "part2QuestionCard":
                    content = f"Part 2 questions:\n{data['questionCard']}\nTest taker input:\n{data['text']}"
                    input_message["content"] = content
                    # print("Input message to part 3 agent: ", input_message)

                else:
                    input_message["content"] = data["text"]

                async for chunk in agent_part3.astream(
                    {"messages": [input_message]}, config, stream_mode="messages"
                ):
                    ai_chunk: AIMessageChunk = chunk[0]
                    if isinstance(ai_chunk, AIMessageChunk):
                        if (
                            hasattr(ai_chunk, "tool_call_chunks")
                            and len(ai_chunk.tool_call_chunks) > 0
                        ):
                            # print("IDENTIFIED TOOL CALL")
                            call_args = ai_chunk.tool_call_chunks[0]
                            if call_args["name"] == "conclude_part3":
                                # print("CONCLUDING PART3")
                                logger.info(
                                    f"Switching to part 3, thread_id: {thread_id}"
                                )
                                await websocket.send_json(
                                    {
                                        "type": "endTest",
                                        "text": "That concludes the test. Thank you very much for your time today.",
                                    }
                                )
                                test_ended = True
                                break

                        full_text_response += str(ai_chunk.content)
                # print("Part 3 response: ", full_text_response)

            if full_text_response and not test_ended:
                # print("Generating tts")
                voice_id = ""
                tts_filename = f"tts-files/test-{uuid.uuid4()}.mp3"
                if data["assistant"] == "Emma":
                    voice_id = "coral"
                else:
                    voice_id = "fable"

                response: HttpxBinaryResponseContent = (
                    openai_client.audio.speech.create(
                        model="tts-1",
                        voice=voice_id,
                        input=full_text_response,
                    )
                )

                # byte_body = b"".join(response.read())  # Read the ReadableStream into bytes

                await s3_client.put_object(
                    Bucket=bucket_name,
                    Key=tts_filename,
                    Body=response.content,
                    # ContentType="audio/mpeg",  # Optional: specify MP3 content type
                )

                tts_obj = {
                    "type": "ttsFileName",
                    "filename": tts_filename,
                    "text": full_text_response,
                }

                logger.info(f"Sending tts object to client. {tts_obj}")

                await websocket.send_json(tts_obj)

                delete_audio_list.append({"Key": tts_filename})
                full_text_response = ""

    except WebSocketDisconnect:
        pass
    except Exception as e:
        raise WebSocketException(
            code=status.WS_1011_INTERNAL_ERROR, reason=f"Server error: {e}"
        )

    finally:
        if len(delete_audio_list) > 0:
            await s3_client.delete_objects(
                Bucket=bucket_name,
                Delete={"Objects": delete_audio_list, "Quiet": False},
            )


@router.post("/words")
async def word_pronunciations(
    words: list[str],
    s3_client: Annotated[Any, Depends(get_s3_client)],
    polly_client: Annotated[Any, Depends(get_polly_client)],
):
    pass
