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
    """A must use tool for ending and concluding part 1 of the test.
    Returns an ending phrase that you must output to the test taker."""
    return "That concludes part 1, now let's move on to part 2."


@tool("conclude_part3")
async def conclude_part3():
    """A must use tool for ending and concluding part 3 of the test.
    Returns an ending phrase that you must output to the test taker."""
    return "That concludes the test. Thank you very much for your time today."


@tool("random_questions_retriever")
async def get_questions():
    """Useful for getting a topic with a list of speaking part questions
    related to that topic. Should be invoked only once."""
    result = None

    async for session in get_async_session():
        async with session.begin():
            result = await session.scalars(
                select(QuestionCard)
                .where(QuestionCard.part == TestPartEnum.PART_ONE)
                .order_by(func.random())
                .limit(1)
            )
            question_card = result.first()
            if question_card:
                return {
                    "Topic": question_card.topic,
                    "Questions": question_card.questions,
                }

            raise Exception("NO QUESTION CARD!")


checkpointer1 = InMemorySaver()
checkpointer3 = MemorySaver()
llm = ChatGroq(model="llama-3.1-8b-instant")

system_prompt_test = "You are a conversation IELTS Speaking examiner."

prompt_part1 = ChatPromptTemplate([("system", system_prompt_test)])
prompt_part3 = ChatPromptTemplate(
    [("system", system_prompt_part3), ("user", human_prompt_conversation)]
)

model_part1 = prompt_part1 | llm.bind_tools([get_questions, conclude_part1])
model_part3 = prompt_part3 | llm.bind_tools([conclude_part3])


# def call_model(state: MessagesState):
#     messages = trim_messages(
#         state["messages"],
#         strategy="last",
#         token_counter=count_tokens_approximately,
#         max_tokens=12800,
#         start_on="human",
#         end_on=("human", "tool"),
#         include_system=True,
#         allow_partial=False,
#     )
#     print("Trimmed messages:", messages, "\n")
#     return {"llm_input_messages": messages}


def call_model_part1(state: MessagesState):
    messages = trim_messages(
        state["messages"],
        strategy="last",
        token_counter=count_tokens_approximately,
        max_tokens=12800,
        start_on="human",
        end_on=("human", "tool"),
    )
    response = model_part1.invoke(messages)
    return {"messages": [response]}


checkpointer = InMemorySaver()
builder = StateGraph(MessagesState)
builder.add_node(call_model_part1)
builder.add_edge(START, "call_model_part1")
part1_graph = builder.compile(checkpointer=checkpointer)


# agent_part1 = create_react_agent(
#     prompt=prompt_part1,
#     model=llm,
#     tools=[conclude_part1, get_questions],
#     pre_model_hook=call_model,
#     checkpointer=checkpointer1,
# )
# agent_part3 = create_react_agent(
#     prompt=prompt_part3,
#     model=llm,
#     tools=[conclude_part3],
#     pre_model_hook=call_model,
#     checkpointer=checkpointer3,
# )

# agent_conversation_part1 = AgentExecutor(
#     agent=agent_part1, tools=[conclude_part1, get_questions]
# )
# agent_conversation_part3 = AgentExecutor(agent=agent_part3, tools=[conclude_part3])
# async def call_assistant_part1(state) -> dict:
#    return {"messages": [await model.ainvoke(state['messages']]}

# async def call_assistant_part3(state) -> dict:
#    return {"messages": [await model.ainvoke([] + state['messages'])]}
