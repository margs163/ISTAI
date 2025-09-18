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
import json
from dotenv import load_dotenv
from pydub import AudioSegment

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


async def download():
    bucket_name = os.getenv("S3_BUCKET_NAME")
    local_path = f"./app/data/pronunciation-{uuid.uuid4()}.wav"
    reading_audio_path = "reading-files/9899464e-2436-4203-881d-f4f0428c58ff.wav"
    async for s3_client in get_s3_client():
        await s3_client.download_file(
            Bucket=bucket_name, Key=reading_audio_path, Filename=local_path
        )
    print("DOWNLOADED SUCCESSFULLY!")


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

    reference_text = "Yesterday my mother and I went shopping at the mall. We needed to buy some new clothes for school and some shoes for my brother. First, we stopped at the department store where my mother tried on several dresses. She chose a beautiful blue one with white flowers. Then we went to the shoe store where we found the perfect pair of sneakers for my brother. They were red and black with white laces. After shopping, we were hungry, so we ate lunch at the food court. It was a wonderful day spent together."

    speech_config = speechsdk.SpeechConfig(
        subscription=azure_api_key,
        region=azure_region,
        speech_recognition_language="en-US",
    )

    audio_config = speechsdk.audio.AudioConfig(filename="./app/data/pronun2(2).wav")

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

    accuracy = 0
    transcriptions = []
    phonemes = []
    done = False

    def stop_callback(event):
        nonlocal done
        done = True
        recognizer.stop_continuous_recognition_async()

    def cancell_callback(event):
        nonlocal done
        done = True

        print(f"CLOSING ON: {event}")
        recognizer.stop_continuous_recognition_async()

        if event.cancellation_details.reason == speechsdk.CancellationReason.Error:
            raise Exception("Cancelled because of error")

    def recognize_handle(event: speechsdk.SpeechRecognitionEventArgs):
        if event.result.reason == speechsdk.ResultReason.RecognizedSpeech:
            pronunciation_result = speechsdk.PronunciationAssessmentResult(event.result)
            # pronunciation_assessment_result_json = event.result.properties.get(speechsdk.PropertyId.SpeechServiceResponse_JsonResult)

            global accuracy
            accuracy = pronunciation_result.accuracy_score
            transcriptions.append(event.result.text)

            # print(event.result.text)

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
            # pprint(phonemes)

    recognizer.session_stopped.connect(stop_callback)
    recognizer.canceled.connect(cancell_callback)
    recognizer.recognized.connect(recognize_handle)

    recognizer.start_continuous_recognition_async()
    while not done:
        time.sleep(0.5)

    pprint(
        f"Accuracy: {accuracy}\nTranscription: {transcriptions}\nPhonemes: {[phonemes]}"
    )


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


async def convert_to_wav():
    audio = AudioSegment.from_ogg(
        "./app/data/pronunciation-6aac544f-726a-4fde-ba30-f07d142c1b0d.wav",
    )
    audio = audio.set_channels(1).set_sample_width(2).set_frame_rate(16000)
    audio.export(
        "./app/data/output.wav",
        format="wav",
    )


async def convert_to_wav_sub():
    input_file = "./app/data/pronunciation-6aac544f-726a-4fde-ba30-f07d142c1b0d.wav"
    output_file = "./app/data/output.wav"
    command = [
        "ffmpeg",
        "-i",
        input_file,
        "-ac",
        "1",  # Mono
        "-ar",
        "16000",  # Sample rate
        "-sample_fmt",
        "s16",  # Sample width (16-bit = 2 bytes)
        output_file,
    ]
    process = await asyncio.create_subprocess_exec(*command)
    await process.wait()


async def convert_to_wav_aio(input_path: str, output_path: str) -> None:
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


if __name__ == "__main__":
    pass
    # asyncio.run(
    #     convert_to_wav_aio(
    #         "./app/data/pronunciation-6aac544f-726a-4fde-ba30-f07d142c1b0d.wav",
    #         "./app/data/damn.wav",
    #     )
    # )
