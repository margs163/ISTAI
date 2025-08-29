import { useLocalPracticeTestStore } from "@/lib/practiceTestStore";
import { ImprovementType } from "@/lib/types";
import {
  CircleCheck,
  CircleX,
  GanttChartSquare,
  Lightbulb,
} from "lucide-react";
import React from "react";

export function Improvement({
  improvement,
}: {
  improvement: {
    original_sentence: string;
    suggested_improvement: string;
    identified_issues: string[];
    explanation: string;
  };
}) {
  return (
    <div className="border border-gray-200 bg-white rounded-md lg:rounded-md p-5 lg:p-6 space-y-2">
      <div className="bg-red-50 border-l-2 border-red-300 rounded-r-md p-4 flex flex-col items-start gap-1 lg:gap-2">
        <div className="flex flex-row gap-1 items-center">
          <CircleX className="text-red-500 size-4" />
          <h5 className="text-red-700 font-semibold text-sm lg:text-sm">
            Original
          </h5>
        </div>
        <p className="text-sm lg:text-sm font-normal italic text-gray-600">
          <q>{improvement.original_sentence}</q>
        </p>
      </div>
      <div className="bg-green-50 border-l-2 border-green-300 rounded-r-md p-4 flex flex-col items-start gap-1 lg:gap-2">
        <div className="flex flex-row gap-1 items-center">
          <CircleCheck className="text-green-500 size-4 lg:size-4.5" />
          <h5 className="text-green-700 font-semibold text-sm lg:text-sm">
            Improved
          </h5>
        </div>
        <p className="text-sm lg:text-sm font-normal italic text-gray-600">
          <q>{improvement.suggested_improvement}</q>
        </p>
      </div>
      <div className="bg-blue-50 border-l-2 border-blue-300 rounded-r-md p-4 flex flex-col items-start gap-1 lg:gap-2">
        <div className="flex flex-row gap-1 items-center">
          <Lightbulb className="text-blue-500 size-4 lg:size-4.5" />
          <h5 className="text-blue-700 font-semibold text-sm lg:text-sm">
            Why This Works
          </h5>
        </div>
        <p className="text-sm lg:text-sm font-normal text-gray-600">
          {improvement.explanation}
        </p>
      </div>
    </div>
  );
}

export default function SentenceImprovements() {
  const senteces = useLocalPracticeTestStore(
    (state) => state.result?.sentence_improvements
  );
  const copySentences = {
    grammar: [...(senteces?.grammar_enhancements as [])],
    vocabulary: [...(senteces?.vocabulary_enhancements as [])],
  };
  return (
    <section className="w-full px-6 lg:px-20 xl:px-36">
      <div className="p-6 lg:p-8 border border-gray-200 rounded-lg bg-white flex flex-col gap-6 shadow-none">
        <header className="flex flex-row items-center gap-2">
          <GanttChartSquare className="size-6 text-indigo-600" />
          <h3 className="font-semibold lg:text-xl text-gray-800 text-lg">
            Sentence Improvements
          </h3>
        </header>
        <main className="flex flex-col gap-8">
          <div className="flex flex-col gap-3 items-start justify-start">
            <p className="text-sm font-medium px-2 py-1 rounded-md border border-indigo-200 text-indigo-600">
              Grammar
            </p>
            <div className="flex flex-col gap-3 lg:grid lg:grid-cols-3 lg:gap-6">
              {copySentences.grammar.map((item, index) => (
                <Improvement improvement={item} key={index} />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3 items-start justify-start">
            <p className="text-sm font-medium px-2 py-1 rounded-md border border-indigo-200 text-indigo-600">
              Vocabulary
            </p>
            <div className="flex flex-col gap-3 lg:grid lg:grid-cols-3 lg:gap-6">
              {copySentences.vocabulary.map((item, index) => (
                <Improvement improvement={item} key={index} />
              ))}
            </div>
          </div>
        </main>
      </div>
    </section>
  );
}
