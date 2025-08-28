import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";
import React from "react";
import CommonMistakesFallback from "../CommonFallback";
import { GrammarCommonMistakeType } from "@/lib/types";
import { useAnalyticsStore } from "@/lib/userStorage";

function getStyle(
  status: "Improving" | "Innacurate" | "Strong" | "Good Progress"
) {
  switch (status) {
    case "Improving":
      return "text-orange-500 border-orange-200 bg-orange-50";
    case "Innacurate":
      return "text-red-500 border-red-200 bg-red-50";
    case "Strong":
      return "text-green-500 border-green-200 bg-green-50";
    case "Good Progress":
      return "text-blue-500 border-blue-200 bg-blue-50";
  }
}

const grammarMistakes: GrammarCommonMistakeType[] = [
  {
    identified_mistakes: [{ mistake_type: "Verb Tenses", description: "" }],
    frequency: 12,
    original_sentence: "I was went to the store yesterday",
    suggested_improvement: "I went to the store yesterday",
    explanation: "",
  },
  {
    identified_mistakes: [
      { mistake_type: "Subject-Verb Agreement", description: "" },
    ],
    frequency: 8,
    original_sentence: "She don't like coffee",
    suggested_improvement: "She doesn't like coffee",
    explanation: "",
  },
  {
    identified_mistakes: [
      { mistake_type: "Pronoun-anteceedent agreement", description: "" },
    ],
    frequency: 10,
    original_sentence: "I went to university",
    suggested_improvement: "I went to the university",
    explanation: "",
  },
];

function CommonGrammarMistake({
  mistake,
}: {
  mistake: GrammarCommonMistakeType;
}) {
  return (
    <div className="bg-gray-50 border border-gray-100 flex flex-col gap-4 p-4 rounded-lg">
      <header className="flex flex-row justify-between items-center">
        <div className="flex flex-row gap-2 items-center">
          <span className="w-2 h-2 rounded-full bg-amber-400"></span>
          <h3 className="text-sm font-medium text-gray-800">
            {mistake.identified_mistakes[0].mistake_type}
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
          <X className="size-4 text-red-500 shrink-0" />
          <blockquote className=" line-through text-gray-500 text-sm font-medium">
            {mistake.original_sentence}
          </blockquote>
        </div>
        <div className="flex flex-row gap-2 items-center justify-start">
          <Check className="size-4 text-green-500 shrink-0" />
          <blockquote className="text-sm text-gray-800 font-medium">
            {mistake.suggested_improvement}
          </blockquote>
        </div>
      </main>
    </div>
  );
}

export default function GrammarCommon() {
  const styles = getStyle("Innacurate");
  const grammarCommonMistakes = useAnalyticsStore(
    (state) => state.grammar_common_mistakes
  );

  return (
    <section className="rounded-lg p-6 flex flex-col gap-6 bg-white font-geist border border-slate-200/80">
      <header className="flex flex-row items-start justify-between">
        <h2 className="text-lg text-gray-800 font-semibold">
          Grammatical Range & Accuracy
        </h2>
        <h3
          className={cn(
            "px-2 py-1 text-start rounded-md border text-xs font-medium",
            styles
          )}
        >
          Innacurate
        </h3>
      </header>
      {!grammarCommonMistakes ? (
        <CommonMistakesFallback />
      ) : (
        <div className="flex flex-col gap-6">
          <main className="space-y-4">
            {grammarCommonMistakes.map((item, index) => (
              <CommonGrammarMistake mistake={item} key={index} />
            ))}
          </main>
          <footer className="p-4 rounded-lg border border-blue-100 bg-blue-50 flex flex-row gap-2 items-start justify-start">
            <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-blue-900">
                Improvement Tip
              </h3>
              <p className="text-xs font-normal text-blue-600">
                Focus on past tense forms and third-person singular verbs.
                Practice with simple sentences first.
              </p>
            </div>
          </footer>
        </div>
      )}
    </section>
  );
}
