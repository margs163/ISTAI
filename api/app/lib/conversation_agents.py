from typing import Dict
from langchain_groq import ChatGroq
from sqlalchemy import func, select

from .auth_db import get_async_session
from ..schemas.db_tables import QuestionCard, TestPartEnum
from .prompts import system_prompt_part1, system_prompt_part3, human_prompt_conversation

# from langgraph.checkpoint.memory import MemorySaver
from langgraph.prebuilt import tools_condition
from langchain.prompts import ChatPromptTemplate
from langgraph.checkpoint.memory import InMemorySaver, MemorySaver
from langgraph.graph import START, END, MessagesState, StateGraph
from langgraph.prebuilt import tools_condition, create_react_agent
from langchain_core.tools import tool
from langchain.agents import AgentExecutor
from langchain_core.messages.utils import trim_messages, count_tokens_approximately


@tool("conclude_part1")
async def conclude_part1():
    """Useful tool for ending and concluding part 1 of the test.
    Returns an ending phrase that you must output to the test taker."""
    return "That concludes part 1, now let's move on to part 2."


@tool("conclude_part3")
async def conclude_part3():
    """Useful tool for ending and concluding part 3 of the test.
    Returns an ending phrase that you must output to the test taker."""
    return "That concludes the test. Thank you very much for your time today."


@tool("random_questions_retriever")
async def get_questions():
    """Useful for getting a topic with a list of speaking part questions
    related to that topic."""
    result = ""
    async for session in get_async_session():
        async with session.begin():
            result = await session.scalars(
                select(QuestionCard)
                .where(QuestionCard.part == 1)
                .order_by(func.random())
                .limit(1)
            )
            question_card = result.first()
            print("Got a question card: ", question_card)
            if question_card:
                return {
                    "Topic": question_card.topic,
                    "Questions": question_card.questions,
                }

            raise Exception("NO QUESTION CARD!")


checkpointer1 = InMemorySaver()
checkpointer3 = InMemorySaver()
llm = ChatGroq(model="llama-3.3-70b-versatile")


# prompt_part1 = ChatPromptTemplate([("system", system_prompt_part1)])
# prompt_part3 = ChatPromptTemplate([("system", system_prompt_part3)])

# model_part1 = prompt_part1 | llm
# model_part3 = prompt_part3 | llm


def call_model(state: MessagesState):
    messages = trim_messages(
        state["messages"],
        strategy="last",
        token_counter=count_tokens_approximately,
        max_tokens=10000,
        start_on="human",
        end_on=("human", "tool"),
        include_system=True,
        allow_partial=False,
    )
    # print("Trimmed messages:", messages, "\n")
    return {"llm_input_messages": messages}


agent_part1 = create_react_agent(
    prompt=system_prompt_part1,
    model=llm,
    tools=[conclude_part1, get_questions],
    pre_model_hook=call_model,
    checkpointer=checkpointer1,
)
agent_part3 = create_react_agent(
    prompt=system_prompt_part3,
    model=llm,
    tools=[conclude_part3],
    pre_model_hook=call_model,
    checkpointer=checkpointer3,
)

# agent_conversation_part1 = AgentExecutor(
#     agent=agent_part1, tools=[conclude_part1, get_questions]
# )
# agent_conversation_part3 = AgentExecutor(agent=agent_part3, tools=[conclude_part3])
# async def call_assistant_part1(state) -> dict:
#    return {"messages": [await model.ainvoke(state['messages']]}

# async def call_assistant_part3(state) -> dict:
#    return {"messages": [await model.ainvoke([] + state['messages'])]}
