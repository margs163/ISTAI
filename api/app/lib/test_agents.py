import asyncio
from pprint import pprint
from langchain_core.runnables import RunnableConfig
from langchain_core.messages import HumanMessage, AIMessageChunk
from .conv_agent import part1_graph
from .conversation_agents import agent_part1, agent_part3
from ..dependencies import get_polly_client, get_s3_client
import azure.cognitiveservices.speech as speechsdk
import time
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


async def azure_stt():
    azure_region = os.getenv("AZURE_REGION")
    azure_api_key = os.getenv("AZURE_SUBSCRIPTION_KEY")

    reference_text = "My first attempt at baking chocolate chip cookies was absolutely catastrophic. I carefully measured all the ingredients: flour, sugar, butter, eggs, and vanilla extract. However, I accidentally confused salt with sugar and added three tablespoons instead of three teaspoons. When I tasted the raw batter, it was incredibly salty and completely inedible. I threw everything away and started over, this time reading the recipe more carefully. The second batch turned out perfectly golden brown and deliciously sweet. My family couldn't believe the difference between my first disaster and final success."

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

    audio_config = speechsdk.audio.AudioConfig(filename="./app/data/test.wav")

    recognizer = speechsdk.SpeechRecognizer(
        speech_config=speech_config, audio_config=audio_config
    )

    pronunciation_assessment_config.apply_to(recognizer)

    results = []

    def recognize_handle(event):
        if event.result.reason == speechsdk.ResultReason.RecognizedSpeech:
            pronunciation_result = speechsdk.PronunciationAssessmentResult(event.result)
            results.append(pronunciation_result)
            print(f"Recognized: {event.result.text}")
            print(f"Accuracy Score: {pronunciation_result.accuracy_score}")
            print(f"Fluency Score: {pronunciation_result.fluency_score}")
            print(f"Prosody Score: {pronunciation_result.prosody_score}")

            for word in pronunciation_result.words:
                print(
                    f" Word: {word.word}, Accuracy: {word.accuracy_score}, Error: {word.error_type}"
                )

    def canceled(event):
        print(f"Recognition canceled: {event.cancellation_details.reason}")
        if event.cancellation_details.reason == speechsdk.CancellationReason.Error:
            print(f"Error details: {event.cancellation_details.error_details}")

    recognizer.recognized.connect(recognize_handle)
    recognizer.canceled.connect(recognize_handle)

    print("Starting continuous recognition...")
    recognizer.start_continuous_recognition()

    time.sleep(40)

    recognizer.stop_continuous_recognition()
    print("Recognition stopped.")

    print("\nSummary of Pronunciation Assessment:")
    for i, pronunciation_result in enumerate(results):
        print(f"Segment {i+1}:")
        print(f"  Accuracy: {pronunciation_result.accuracy_score}")
        print(f"  Fluency: {pronunciation_result.fluency_score}")
        print(f"  Prosody: {pronunciation_result.prosody_score}")


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
    asyncio.run(azure_stt())
