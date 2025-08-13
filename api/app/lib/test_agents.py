import asyncio
from pprint import pprint
from langchain_core.runnables import RunnableConfig
from langchain_core.messages import HumanMessage, AIMessageChunk
from .conv_agent import part1_graph
from .conversation_agents import agent_part1, agent_part3
from ..dependencies import get_polly_client, get_s3_client
import boto3
import botocore
from botocore.exceptions import ClientError
from dotenv import load_dotenv

load_dotenv()
import uuid
import os


async def s3():
    client = next(get_s3_client())
    bucket_name = os.getenv("S3_BUCKET_NAME")
    try:
        client.put_object(Bucket=bucket_name, Key="damn.txt", Body=b"Hey!")
        print("Successfuly uploaded an object!")
    except ClientError as e:
        pprint(e)
    # client.Object(bucket_name, "test.txt").upload_file(Filename="./app/lib/test.txt")


async def polly():
    client_polly = next(get_polly_client())
    client_s3 = next(get_s3_client())
    bucket_name = os.getenv("S3_BUCKET_NAME")

    try:
        response = client_polly.synthesize_speech(
            Text="Hello, this is a simple test to try the AWS Polly API",
            OutputFormat="mp3",
            VoiceId="Joanna",
        )
        client_s3.put_object(
            Bucket=bucket_name,
            Key="test_audio.mp3",
            Body=response["AudioStream"].read(),
        )
    except Exception as e:
        print(e)


async def main():
    input_message2 = {
        "role": "user",
        "content": "My name is Daniyal, nice to meet you Ron!",
    }
    input_message3 = {
        "role": "user",
        "content": "My name is Daniyal!",
    }
    config: RunnableConfig = {
        "configurable": {"thread_id": str(uuid.uuid4())},
        "recursion_limit": 25,
    }

    input_message = {
        "role": "user",
        "content": "Hello, I want to take an IELTS Speaking Test!",
    }
    while True:
        async for chunk in agent_part1.astream(
            {"messages": [input_message]}, config=config, stream_mode="messages"
        ):
            if isinstance(chunk[0], AIMessageChunk):
                if hasattr(chunk[0], "tool_calls") and len(chunk[0].tool_calls) > 0:
                    call_args = chunk[0].tools_calls
                    print("Tool call detected:", chunk[0].tool_calls)
                    break
                else:
                    print("No tool call in chunk:", chunk[0].content)

            else:
                print(chunk[0].content)
            # print(result[0].content)
            # print(result.tool_calls)

        user_input = input("PLEASE ENTER YOUR RESPONSE: ")
        input_message["content"] = user_input

    # await asyncio.sleep(2)
    # print("\n\nTHIRD ITERATION:\n\n")

    # async for result2 in agent_part1.astream(
    #     {"messages": [input_message2]}, config=config, stream_mode="values"
    # ):
    #     pprint(result2["messages"])
    # result3 = await agent_part1.ainvoke({"messages": [input_message2]}, config=config)
    # result3["messages"][-1].pretty_print()


if __name__ == "__main__":
    asyncio.run(polly())
