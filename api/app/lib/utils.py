import asyncio
from pprint import pprint
from ..schemas.transcriptions import TranscriptionSchema
from .general_agents import general_app
from .sentence_agents import sentence_app


def construct_input(transcription: TranscriptionSchema) -> str:
    part_one_parsed = "\n".join(
        [f" - {message.name}: {message.text}" for message in transcription.part_one]
    )
    part_two_parsed = "\n".join(
        [f" - {message.name}: {message.text}" for message in transcription.part_two]
    )
    part_three_parsed = "\n".join(
        [f" - {message.name}: {message.text}" for message in transcription.part_three]
    )
    return f"[Part_One]:\n{part_one_parsed}\n\n[Part_Two]:\n{part_two_parsed}\n\n[Part_Three]:\n{part_three_parsed}"


async def main():
    transcription = {
        "part_one": [
            {"name": "Daniyal Aldanov", "text": " Hello."},
            {
                "name": "Ron",
                "text": "I'm Ron, your IELTS Speaking examiner. What is your name?",
            },
            {
                "name": "Daniyal Aldanov",
                "text": " My name is Daniel, I'm a nice to meet you.",
            },
            {
                "name": "Ron",
                "text": "In the first part of the IELTS Speaking test, I will ask you some questions on general topics.\n",
            },
            {"name": "Daniyal Aldanov", "text": " okay go ahead"},
            {
                "name": "Ron",
                "text": "In the first part of the IELTS Speaking test, I will ask you some questions on general topics. Now, let's talk about Hobbies. What do you like to do in your free time?",
            },
            {
                "name": "Daniyal Aldanov",
                "text": " In my free time I actually like to learn how to program and how to generally do coding as I think I really enjoy doing coding and programming and stuff.",
            },
            {
                "name": "Ron",
                "text": "How did you first become interested in programming and coding?",
            },
            {
                "name": "Daniyal Aldanov",
                "text": " so it started in sixth grade back when I was in middle school so there was one guy called so that was my classmate essentially he was going like to programming clubs and like to programming classes so he inspired me to start this journey and to learn how to code. to start this journey and to learn how to code. So,",
            },
            {
                "name": "Ron",
                "text": "What kind of programs or applications do you enjoy coding the most, for example, games, websites, or something else?",
            },
            {
                "name": "Daniyal Aldanov",
                "text": " so I'm actually doing web development and I think this is the most prominent and the most like dominant sphere of programming and I think it's really fun to make websites to learn how they work and to make like your own applications",
            },
        ],
        "part_two": [
            {
                "name": "Daniyal Aldanov",
                "text": " so I remember we so I was in a class trip this class trip was held was held at the nearby park and I think this place was very crowded as as I remember there were many more than like 100 people or something so our teachers and curators they essentially bring us out of the school to clean up the area around the school. essentially bring us out of the school to clean up the area around the school. So I was there with my classmates and we cleaned our school area and it took us about 30 minutes to clean the leaves, garbage and the rubbish.",
            }
        ],
        "part_three": [
            {
                "name": "Ron",
                "text": "How did you think the experience of cleaning up the area affected the overall appearance of the park and the school surroundings?",
            },
            {
                "name": "Daniyal Aldanov",
                "text": " so the park has experienced like dramatic changes it was it was unbelievable to see how clean it was after we have cleaned it up because because before we cleaned it was really polluted there were many  IELTS many plastic bags, empty bottles and also other rubbish that was there. many plastic bags, empty bottles and also other rubbish that was there. And after we cleaned it, the park was much cleaner and was more enjoyable to be in.",
            },
            {
                "name": "Ron",
                "text": "Do you think that the community or local authorities should take more responsibility for maintaining public spaces like that park, or is it better for groups like your school to organize their own clean-up initiatives?",
            },
            {
                "name": "Daniyal Aldanov",
                "text": " I think it's better for the school and organizations to clean their private territories because the government should not be responsible for cleaning every possible area in the town it's just impossible for the authorities to clean up and keep everything cleaned so I think it's up to the school and organizations",
            },
        ],
    }

    transcription_parsed = construct_input(
        TranscriptionSchema(**transcription, test_id="asdasd")
    )
    result = await sentence_app.ainvoke({"transcriptions": transcription_parsed})

    with open("./text.txt", "w") as file:
        file.write(str(result).replace("'", '"'))


if __name__ == "__main__":
    asyncio.run(main())
