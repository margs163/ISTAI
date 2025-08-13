from typing import TypedDict, Dict, List
import asyncio
from dotenv import load_dotenv
from langgraph.graph import StateGraph, START, END
from langchain_groq import ChatGroq
from langchain.prompts import ChatPromptTemplate
from .prompts import general_agents_prompts, test_taker_prompt, FluencyEvaluation, GrammaticalEvaluation, LexicalEvaluation
load_dotenv()

llm = ChatGroq(model="llama-3.3-70b-versatile", temperature=0.5)

fluency_prompt = ChatPromptTemplate(
    [("system", general_agents_prompts['system_fluency_prompt']), ("user", str(test_taker_prompt))]
)
grammar_prompt = ChatPromptTemplate(
    [("system", general_agents_prompts['system_grammar_prompt']), ("user", str(test_taker_prompt))]
)
lexis_prompt = ChatPromptTemplate(
    [("system", general_agents_prompts['system_lexis_prompt']), ("user", str(test_taker_prompt))]
)

class GeneralState(TypedDict):
    #metadata
    metadata_id: str
    speech_metadata: Dict[str, float]
    transcriptions: List
    #criteria
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
    chain = fluency_prompt | llm.with_structured_output(FluencyEvaluation)
    response: FluencyEvaluation = await chain.ainvoke({"transcriptions": state["transcriptions"]})
    return {
        "fluency_score": response.fluencyScore,
        "fluency_strong_points": response.fluencyStrongPoints,
        "fluency_weak_sides": response.fluencyWeakSide,
        "fluency_tips": response.fluencyTips
    }

async def grammar_invoke(state: GeneralState) -> Dict:
    chain = grammar_prompt | llm.with_structured_output(GrammaticalEvaluation)
    response: FluencyEvaluation = await chain.ainvoke({"transcriptions": state["transcriptions"]})
    return {
        "grammar_score": response.fluencyScore,
        "grammar_strong_points": response.fluencyStrongPoints,
        "grammar_weak_sides": response.fluencyWeakSide,
        "grammar_tips": response.fluencyTips
    }

async def lexis_invoke(state: GeneralState) -> Dict:
    chain = lexis_prompt | llm.with_structured_output(LexicalEvaluation)
    response: LexicalEvaluation = await chain.ainvoke({"transcriptions": state["transcriptions"]})
    return {
        "lexis_score": response.lexicalScore,
        "lexis_strong_points": response.lexicalStrongPoints,
        "lexis_weak_sides": response.lexicalWeakSide,
        "lexis_tips": response.lexicalTips
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



   
