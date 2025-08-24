import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";
import React from "react";

function getStyle(
  status: "Improving" | "Needs Work" | "Strong" | "Good Progress"
) {
  switch (status) {
    case "Improving":
      return "text-orange-500 border-orange-200 bg-orange-50";
    case "Needs Work":
      return "text-red-500 border-red-200 bg-red-50";
    case "Strong":
      return "text-green-500 border-green-200 bg-green-50";
    case "Good Progress":
      return "text-blue-500 border-blue-200 bg-blue-50";
  }
}

type MistakeType = {
  type: string;
  frequency: number;
  example: {
    original: string;
    improved: string;
  };
};

const vocabularyMistakes = [
  {
    type: "Uncountable noun",
    frequency: 12,
    example: {
      original: "I have a lot of homeworks to do",
      improved: "I have a lot of homework to do",
    },
  },
  {
    type: "Collocation error",
    frequency: 8,
    example: {
      original: "She don't like coffee",
      improved: "She doesn't like coffee",
    },
  },
  {
    type: "Wrong preposition",
    frequency: 10,
    example: {
      original: "I am very interested about this topic",
      improved: "I am very interested in this topic",
    },
  },
];

function CommonVocabularyMistake({ mistake }: { mistake: MistakeType }) {
  return (
    <div className="bg-gray-50 border border-gray-100 flex flex-col gap-4 p-4 rounded-lg">
      <header className="flex flex-row justify-between items-center">
        <div className="bg-purple-50 px-2 py-1 rounded-md">
          <h3 className="text-xs font-medium text-purple-500">
            {mistake.type}
          </h3>
        </div>
        <h3
          className={cn(
            "px-2 py-1 rounded-lg border text-xs font-medium border-gray-200/80 bg-white text-gray-500"
          )}
        >
          {mistake.frequency} errors
        </h3>
      </header>
      <main className="space-y-1">
        <div className="flex flex-row gap-2 items-center justify-start">
          <X className="size-4 text-red-500" />
          <blockquote className=" line-through text-gray-500 text-sm font-medium">
            {mistake.example.original}
          </blockquote>
        </div>
        <div className="flex flex-row gap-2 items-center justify-start">
          <Check className="size-4 text-green-500" />
          <blockquote className="text-sm text-gray-800 font-medium">
            {mistake.example.original}
          </blockquote>
        </div>
      </main>
    </div>
  );
}

export default function VocabularyCommon() {
  const styles = getStyle("Improving");
  return (
    <section className="rounded-lg p-6 flex flex-col gap-6 bg-white font-geist border border-slate-200/80">
      <header className="flex flex-row items-center justify-between">
        <h2 className="text-lg text-gray-800 font-semibold">
          Vocabulary Inaccuracies
        </h2>
        <h3
          className={cn(
            "px-2 py-1 text-center rounded-md border text-xs font-medium",
            styles
          )}
        >
          Improving
        </h3>
      </header>
      <main className="space-y-4">
        {vocabularyMistakes.map((item, index) => (
          <CommonVocabularyMistake mistake={item} key={index} />
        ))}
      </main>
      <footer className="p-4 rounded-lg border border-blue-100 bg-blue-50 flex flex-row gap-2 items-start justify-start">
        <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-blue-900">Improvement Tip</h3>
          <p className="text-xs font-normal text-blue-600">
            Focus on past tense forms and third-person singular verbs. Practice
            with simple sentences first.
          </p>
        </div>
      </footer>
    </section>
  );
}
