import asyncio
from langchain_core.runnables import RunnableConfig
from app.lib.conversation_agents import agent_part1
import uuid


async def main():
    input_message = {"role": "user", "content": "hello"}
    input_message2 = {
        "role": "user",
        "content": "My name is Daniyal and I want to take an IELTS Speaking test.",
    }
    config: RunnableConfig = {"configurable": {"thread_id": str(uuid.uuid4())}}
    async for event in agent_conversation_part1.astream(
        {"messages": [input_message]}, config, stream_mode="messages"
    ):
        event["messages"][-1].pretty_print()

    print("---------------------SECOND_ITERATION--------------------")

    async for event in agent_conversation_part1.astream(
        {"messages": [input_message2]}, config, stream_mode="messages"
    ):
        event["messages"][-1].pretty_print()


asyncio.run(main())
