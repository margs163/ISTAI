from langchain_groq import ChatGroq
import asyncio
from langchain.prompts import ChatPromptTemplate
from langgraph.graph import StateGraph, START, END
from typing import Dict, List, Any, TypedDict

from pydantic_core import from_json
from .prompts import (
    SentenceEvaluation,
    sentence_system_prompt,
    test_taker_prompt,
    vocabulary_system_prompt,
    grammar_error_system_prompt,
    VocabAnalysis,
    GrammarAnalysis,
)

llm = ChatGroq(model="meta-llama/llama-4-scout-17b-16e-instruct", temperature=0.5)

sentence_prompt = ChatPromptTemplate(
    [("system", sentence_system_prompt), ("human", str(test_taker_prompt))]
)

vocab_prompt = ChatPromptTemplate(
    [("system", vocabulary_system_prompt), ("human", str(test_taker_prompt))]
)

grammar_prompt = ChatPromptTemplate(
    [("system", grammar_error_system_prompt), ("human", str(test_taker_prompt))]
)


class AnalysisState(TypedDict):
    transcriptions: List
    grammar_enhancements: List[Dict[str, Any]]
    vocabulary_enhancements: List[Dict[str, Any]]
    grammar_analysis: List[Dict[str, Any]]
    advanced_vocabulary: List[Dict[str, Any]]
    repetitions: List[Dict[str, Any]]


async def sentence_invoke(state: AnalysisState) -> Dict:
    chain = sentence_prompt | llm
    response = await chain.ainvoke({"transcriptions": state["transcriptions"]})
    result = from_json(str(response.content), allow_partial=True)
    serialized = SentenceEvaluation(**result)
    return {
        "grammar_enhancements": [
            enhance.model_dump() for enhance in serialized.grammar_enhancements
        ],
        "vocabulary_enhancements": [
            enhance.model_dump() for enhance in serialized.vocabulary_enhancements
        ],
    }


async def vocabulary_analysis_invoke(state: AnalysisState) -> Dict:
    chain = vocab_prompt | llm
    response = await chain.ainvoke({"transcriptions": state["transcriptions"]})
    result = from_json(str(response.content), allow_partial=True)
    serialized = VocabAnalysis(**result)
    return {
        "advanced_vocabulary": [
            vocab.model_dump() for vocab in serialized.advanced_vocabulary
        ],
        "repetitions": [rep.model_dump() for rep in serialized.repetitions],
    }


async def grammar_analysis_invoke(state: AnalysisState) -> Dict:
    chain = grammar_prompt | llm
    response = await chain.ainvoke({"transcriptions": state["transcriptions"]})
    result = from_json(str(response.content), allow_partial=True)
    serialized = GrammarAnalysis(**result)
    return {
        "grammar_analysis": [
            mistake.model_dump() for mistake in serialized.grammar_analysis
        ],
    }


analysis_graph = StateGraph(AnalysisState)
analysis_graph.add_node("call_sentence_agent", sentence_invoke)
analysis_graph.add_node("call_vocabulary_analysis_agent", vocabulary_analysis_invoke)
analysis_graph.add_node("call_grammar_analysis_agent", grammar_analysis_invoke)

analysis_graph.add_edge(START, "call_sentence_agent")
analysis_graph.add_edge(START, "call_vocabulary_analysis_agent")
analysis_graph.add_edge(START, "call_grammar_analysis_agent")
analysis_graph.add_edge("call_sentence_agent", END)
analysis_graph.add_edge("call_vocabulary_analysis_agent", END)
analysis_graph.add_edge("call_grammar_analysis_agent", END)
sentence_app = analysis_graph.compile()

if __name__ == "__main__":

    async def main():
        print("-----------------------Graph image-----------------------:\n")
        sentence_app.get_graph(xray=True).print_ascii()
        print("---------------------------------------------------------\n\n")

    asyncio.run(main())
