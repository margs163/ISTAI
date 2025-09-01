from operator import add
from pprint import pprint
from typing import Annotated, TypedDict, Dict, List
import asyncio
from pydantic_core import from_json
from dotenv import load_dotenv
from langgraph.graph import StateGraph, START, END
from langchain_groq import ChatGroq
from langchain.prompts import ChatPromptTemplate
from .prompts import (
    general_agents_prompts,
    test_taker_prompt,
    FluencyEvaluation,
    GrammaticalEvaluation,
    LexicalEvaluation,
)

load_dotenv()

llm = ChatGroq(model="meta-llama/llama-4-scout-17b-16e-instruct", temperature=0.5)

fluency_prompt = ChatPromptTemplate(
    [
        ("system", general_agents_prompts["system_fluency_prompt"]),
        ("user", str(test_taker_prompt)),
    ]
)
grammar_prompt = ChatPromptTemplate(
    [
        ("system", general_agents_prompts["system_grammar_prompt"]),
        ("user", str(test_taker_prompt)),
    ]
)
lexis_prompt = ChatPromptTemplate(
    [
        ("system", general_agents_prompts["system_lexis_prompt"]),
        ("user", str(test_taker_prompt)),
    ]
)


class GeneralState(TypedDict):
    # metadata
    metadata_id: str
    speech_metadata: Dict[str, float]
    transcriptions: str
    # criteria
    fluency_score: float
    fluency_strong_points: List[str]
    fluency_weak_sides: List[str]
    fluency_tips: List[str]
    grammar_score: float
    grammar_strong_points: List[str]
    grammar_weak_sides: List[str]
    grammar_tips: List[str]
    lexis_score: float
    lexis_strong_points: List[str]
    lexis_weak_sides: List[str]
    lexis_tips: List[str]


async def fluency_invoke(state: GeneralState) -> Dict:
    chain = fluency_prompt | llm
    response = await chain.ainvoke({"transcriptions": state["transcriptions"]})
    result = from_json(str(response.content), allow_partial=True)
    pprint(result)
    serialized = FluencyEvaluation(**result)

    return {
        "fluency_score": serialized.fluency_score,
        "fluency_strong_points": serialized.fluency_strong_points,
        "fluency_weak_sides": serialized.fluency_weak_sides,
        "fluency_tips": serialized.fluency_tips,
    }


async def grammar_invoke(state: GeneralState) -> Dict:
    chain = grammar_prompt | llm
    response = await chain.ainvoke({"transcriptions": state["transcriptions"]})
    result = from_json(str(response.content), allow_partial=True)
    pprint(result)
    serialized = GrammaticalEvaluation(**result)

    return {
        "grammar_score": serialized.grammatical_score,
        "grammar_strong_points": serialized.grammatical_strong_points,
        "grammar_weak_sides": serialized.grammatical_weak_sides,
        "grammar_tips": serialized.grammatical_tips,
    }


async def lexis_invoke(state: GeneralState) -> Dict:
    chain = lexis_prompt | llm
    response = await chain.ainvoke({"transcriptions": state["transcriptions"]})
    result = from_json(str(response.content), allow_partial=True)
    pprint(result)
    serialized = LexicalEvaluation(**result)

    return {
        "lexis_score": serialized.lexical_score,
        "lexis_strong_points": serialized.lexical_strong_points,
        "lexis_weak_sides": serialized.lexical_weak_sides,
        "lexis_tips": serialized.lexical_tips,
    }


general_graph = StateGraph(GeneralState)
general_graph.add_node("call_node_fluency", fluency_invoke)
general_graph.add_node("call_node_grammar", grammar_invoke)
general_graph.add_node("call_node_lexis", lexis_invoke)

general_graph.add_edge(START, "call_node_fluency")
general_graph.add_edge(START, "call_node_grammar")
general_graph.add_edge(START, "call_node_lexis")
general_graph.add_edge("call_node_fluency", END)
general_graph.add_edge("call_node_grammar", END)
general_graph.add_edge("call_node_lexis", END)
general_app = general_graph.compile()


if __name__ == "__main__":

    async def main():
        print("-----------------------Graph image-----------------------:\n")
        general_app.get_graph(xray=True).print_ascii()
        print("---------------------------------------------------------\n\n")

    asyncio.run(main())
