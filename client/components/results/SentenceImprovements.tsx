import {
  CircleCheck,
  CircleX,
  GanttChartSquare,
  Lightbulb,
} from "lucide-react";
import React from "react";

const improvements = {
  grammar: [
    {
      original: "I like reading books because it's interesting.",
      improved:
        "I'm passionate about reading books as I find them intellectually stimulating.",
      explanation:
        "More complex sentence structure with advanced vocabulary and subordinate clauses.",
    },
    {
      original: "I like reading books because it's interesting.",
      improved:
        "I'm passionate about reading books as I find them intellectually stimulating.",
      explanation:
        "More complex sentence structure with advanced vocabulary and subordinate clauses.",
    },
    {
      original: "The movie was good. I enjoyed it. It had good actors.",
      improved:
        "The movie, which featured exceptional performances, was thoroughly enjoyable.",
      explanation:
        "Combining simple sentences into complex structures with relative clauses.",
    },
  ],
  vocabulary: [
    {
      original: "The weather was very bad yesterday.",
      improved: "The weather was absolutely dreadful yesterday.",
      explanation:
        "Using more sophisticated adjectives and intensifiers shows better lexical range.",
    },
    {
      original: "I think this is a big problem in society.",
      improved: "I believe this constitutes a significant societal challenge.",
      explanation:
        "Academic vocabulary and more precise word choices demonstrate lexical sophistication.",
    },
    {
      original: "Many people like to travel because it's fun.",
      improved:
        "Numerous individuals are drawn to travel due to its enriching and exhilarating nature.",
      explanation:
        "Varied vocabulary choices and more formal register show lexical diversity.",
    },
  ],
};

export function Improvement({
  improvement,
}: {
  improvement: {
    original: string;
    improved: string;
    explanation: string;
  };
}) {
  return (
    <div className="border border-gray-200 bg-white rounded-md lg:rounded-lg p-5 lg:p-6 space-y-2">
      <div className="bg-red-50 border-l-2 border-red-300 rounded-r-md p-4 flex flex-col items-start gap-1 lg:gap-2">
        <div className="flex flex-row gap-1 items-center">
          <CircleX className="text-red-500 size-4" />
          <h5 className="text-red-700 font-semibold text-sm lg:text-sm">
            Original
          </h5>
        </div>
        <p className="text-sm lg:text-sm font-normal italic text-gray-600">
          <q>{improvement.original}</q>
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
          <q>{improvement.improved}</q>
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
  return (
    <section className="w-full px-6 lg:px-20 xl:px-40">
      <div className="p-6 lg:p-8 border border-gray-200 rounded-lg bg-white flex flex-col gap-6">
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
            <div className="flex flex-col gap-3 lg:flex-row lg:gap-4">
              {improvements.grammar.map((item, index) => (
                <Improvement improvement={item} key={index} />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3 items-start justify-start">
            <p className="text-sm font-medium px-2 py-1 rounded-md border border-indigo-200 text-indigo-600">
              Vocabulary
            </p>
            <div className="flex flex-col gap-3 lg:flex-row lg:gap-4">
              {improvements.vocabulary.map((item, index) => (
                <Improvement improvement={item} key={index} />
              ))}
            </div>
          </div>
        </main>
      </div>
    </section>
  );
}
