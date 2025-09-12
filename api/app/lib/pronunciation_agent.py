from pprint import pprint
from typing import Annotated, TypedDict, Dict, List
import asyncio
from dotenv import load_dotenv
from langgraph.graph import StateGraph, START, END
from langchain_groq import ChatGroq
from langchain.prompts import ChatPromptTemplate
from pydantic_core import from_json

from ..schemas.pronunciation import PronunciationAnalysis
from .prompts import pronunciation_system_prompt, human_input_pronunciation

load_dotenv()

llm = ChatGroq(model="meta-llama/llama-4-scout-17b-16e-instruct", temperature=0.5)

pronunciation_prompt = ChatPromptTemplate(
    [
        ("system", pronunciation_system_prompt),
        ("user", human_input_pronunciation),
    ]
)


class PronunciationState(TypedDict):
    # metadata
    metadata_id: str
    transcriptions: List
    phonemes: List
    accuracy: str
    # criteria
    pronunciation_score: float
    pronunciation_strong_points: List[str]
    pronunciation_weak_sides: List[str]
    pronunciation_mistakes: List[dict]
    pronunciation_tips: List[str]


async def agent_invoke(state: PronunciationState) -> Dict:
    chain = pronunciation_prompt | llm
    response = await chain.ainvoke(
        {"transcriptions": state["transcriptions"], "phonemes": state["phonemes"]}
    )
    result = from_json(str(response.content), allow_partial=True)
    pprint(result)
    serialized = PronunciationAnalysis(**result)
    return {
        "pronunciation_score": serialized.pronunciation_score,
        "pronunciation_strong_points": serialized.pronunciation_strong_points,
        "pronunciation_weak_sides": serialized.pronunciation_weak_sides,
        "pronunciation_tips": serialized.pronunciation_tips,
        "pronunciation_mistakes": [
            mistake.model_dump() for mistake in serialized.pronunciation_mistakes
        ],
    }


pronunciation_graph = StateGraph(PronunciationState)
pronunciation_graph.add_node("call_node_pronunciation", agent_invoke)

pronunciation_graph.add_edge(START, "call_node_pronunciation")
pronunciation_graph.add_edge("call_node_pronunciation", END)
pronunciation_app = pronunciation_graph.compile()


if __name__ == "__main__":

    async def main():
        print("-----------------------Graph image-----------------------:\n")
        pronunciation_app.get_graph(xray=True).print_ascii()
        print("---------------------------------------------------------\n\n")

    asyncio.run(main())
