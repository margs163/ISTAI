from typing import Annotated, Any
from fastapi import APIRouter, Depends, WebSocket, WebSocketException, status
from langchain_core.runnables import RunnableConfig
from langchain_core.messages import AIMessageChunk
from dotenv import load_dotenv

from api.app.dependencies import get_polly_client, get_s3_client
from api.app.schemas.chat import AssistantEnumSchema
from ..lib.conversation_agents import agent_part1, agent_part3
import uuid
import os

load_dotenv()

bucket_name = os.getenv("S3_BUCKET_NAME")
router = APIRouter()


@router.websocket("/")
async def chat_websocket(
    websocket: WebSocket,
    s3_client: Annotated[Any, Depends(get_s3_client)],
    polly_client: Annotated[Any, Depends(get_polly_client)],
):
    thread_id = str(uuid.uuid4())
    config: RunnableConfig = {"configurable": {"thread_id": thread_id}}
    input_message = {"role": "user", "content": ""}

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
                            hasattr(ai_chunk, "tool_calls")
                            and len(ai_chunk.tool_calls) > 0
                        ):
                            call_args = ai_chunk.tool_calls[0]
                            if call_args["name"] == "conclude_part1":
                                await websocket.send_json(
                                    {
                                        "type": "switchToPart2",
                                        "text": "That concludes part 1, now let's move on to part 2.",
                                    }
                                )
                                break

                        full_text_response += str(ai_chunk.content)
            elif data["part"] == 3:
                if data["type"] != "userResponse":
                    raise WebSocketException(
                        code=status.WS_1003_UNSUPPORTED_DATA, reason="No text data"
                    )
                input_message["content"] = data["text"]
                async for chunk in agent_part3.astream(
                    {"messages": [input_message]}, config, stream_mode="messages"
                ):
                    ai_chunk: AIMessageChunk = chunk[0]
                    if isinstance(ai_chunk, AIMessageChunk):
                        if (
                            hasattr(ai_chunk, "tool_calls")
                            and len(ai_chunk.tool_calls) > 0
                        ):
                            call_args = ai_chunk.tool_calls[0]
                            if call_args["name"] == "conclude_part3":
                                await websocket.send_json(
                                    {
                                        "type": "endTest",
                                        "text": "That concludes the test. Thank you very much for your time today.",
                                    }
                                )
                                break

                        full_text_response += str(ai_chunk.content)

                    # websocket.send_json({"response": event["messages"][-1]})
            if full_text_response:
                voice_id = ""
                tts_filename = f"tts-files/test-{uuid.uuid4()}.mp3"
                if data["assistant"] == AssistantEnumSchema.Kate:
                    voice_id = "Salli"
                else:
                    voice_id = "Stephen"

                response = await polly_client.synthesize_speech(
                    Text=full_text_response,
                    OutputFormat="mp3",
                    VoiceId=voice_id,
                    Engine="neural",
                )

                byte_body = await response["AudioStream"].read()

                await s3_client.put_object(
                    Bucket=bucket_name,
                    Key=tts_filename,
                    Body=byte_body,
                )

                await websocket.send_json(
                    {
                        "type": "ttsFileName",
                        "filename": tts_filename,
                        "text": full_text_response,
                    }
                )

                full_text_response = ""

    except Exception as e:
        raise WebSocketException(
            code=status.WS_1011_INTERNAL_ERROR, reason=f"Server error: {e}"
        )
