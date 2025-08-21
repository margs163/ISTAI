from api.app.schemas.transcriptions import TranscriptionSchema


def construct_input(transcription: TranscriptionSchema) -> str:
    part_one_parsed = "\n".join(
        [f" - {message.name}:{message.text}" for message in transcription.part_one]
    )
    part_two_parsed = "\n".join(
        [f" - {message.name}:{message.text}" for message in transcription.part_two]
    )
    part_three_parsed = "\n".join(
        [f" - {message.name}:{message.text}" for message in transcription.part_three]
    )
    return f"[Part_One]:\n{part_one_parsed}\n\n[Part_Two]:\n{part_two_parsed}\n\n[Part_Three]:\n{part_three_parsed}"
