import { useLocalPracticeTestStore } from "@/lib/practiceTestStore";
import {
  CircleCheck,
  CircleX,
  GanttChartSquare,
  Info,
  Lightbulb,
} from "lucide-react";
import React from "react";

export function GrammarError({
  error,
}: {
  error: {
    identified_mistakes: {
      mistake_type: string;
      description: string;
    }[];
    original_sentence: string;
    suggested_improvement: string;
    explanation: string;
  };
}) {
  return (
    <div className="border border-gray-200 bg-red-white rounded-md lg:rounded-md p-5 lg:p-6 flex flex-col gap-2 lg:gap-3 items-start lg:flex-1/2">
      <p className="text-xs font-medium px-2 py-1 rounded-md border border-red-200 text-red-600 flex flex-row gap-1 items-center bg-red-50">
        <Info className="text-red-500 size-3.5" />{" "}
        {error.identified_mistakes[0].mistake_type}
      </p>
      <div className="bg-red-50 border border-red-200 rounded-md p-4 lg:p-5 flex flex-col items-start gap-2 lg:gap-2 w-full">
        <div className="flex flex-row gap-1 items-center">
          <CircleX className="text-red-500 size-4" />
          <h5 className="text-red-600 font-semibold text-sm  lg:text-base">
            Incorrect
          </h5>
        </div>
        <p className="text-sm lg:text-sm font-normal text-gray-700 w-full">
          {/* <code className="rounded-sm px-3 py-1.5 bg-white block"> */}
          {error.original_sentence}
          {/* </code> */}
        </p>
      </div>
      <div className="bg-green-50 border border-green-200 rounded-md p-4 lg:p-5 flex flex-col items-start gap-2 lg:gap-2 w-full">
        <div className="flex flex-row gap-1 items-center">
          <CircleCheck className="text-green-500 size-4" />
          <h5 className="text-green-700 font-semibold text-sm lg:text-base">
            Correct
          </h5>
        </div>
        <p className="text-sm lg:text-sm font-normal text-gray-600 w-full">
          {/* <code className="rounded-sm px-2 py-1 bg-white block"> */}
          {error.suggested_improvement}
          {/* </code> */}
        </p>
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4 lg:p-5 flex flex-col items-start gap-2 lg:gap-2 w-full">
        <div className="flex flex-row gap-1 items-center">
          <Lightbulb className="text-blue-500 size-4" />
          <h5 className="text-blue-700 font-semibold text-sm lg:text-base">
            Explanation
          </h5>
        </div>
        <p className="text-sm lg:text-sm font-normal text-gray-600">
          {error.explanation}
        </p>
      </div>
    </div>
  );
}

export default function GrammarErrors() {
  const grammar = useLocalPracticeTestStore(
    (state) => state.result?.grammar_errors
  );

  return (
    <section className="w-full px-6 lg:px-20 xl:px-36">
      <div className="p-6 lg:p-8 border border-gray-200 rounded-lg bg-white flex flex-col gap-6 shadow-none">
        <header className="flex flex-row items-center gap-2">
          <GanttChartSquare className="size-6 text-indigo-600" />
          <h3 className="font-semibold lg:text-xl text-gray-800 text-lg">
            Grammar Errors & Corrections
          </h3>
        </header>
        <main className="flex flex-col gap-8">
          <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:gap-6">
            {grammar?.grammar_analysis.map((item, index) => (
              <GrammarError error={item} key={index} />
            ))}
          </div>
        </main>
      </div>
    </section>
  );
}
