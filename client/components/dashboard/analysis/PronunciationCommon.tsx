import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";
import React from "react";

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

type MistakeType = {
  type: string;
  frequency: number;
  example: {
    original: string;
    improved: string;
  };
  description: string;
};

const pronunciationMistakes = [
  {
    type: "Word Stress",
    frequency: 12,
    example: {
      original: "/ˈfoʊtəɡræf/",
      improved: "/fəˈtɑɡrəfi/",
    },
    description: "PHOtograph vs phoTOgraphy stress patterns",
  },
  {
    type: "Consonant Sounds",
    frequency: 8,
    example: {
      original: "think /θɪŋk/",
      improved: "fink /fɪŋk/",
    },
    description: "Confusing /θ/ and /f/ sounds",
  },
  {
    type: "Vowel Phoneme Errors",
    frequency: 10,
    example: {
      original: "/ədˈvɛn.tʃəz/",
      improved: "/ədˈvɛn.tʃɚz/",
    },
    description: "Flat intonation in questions",
  },
];

function CommonPronunciationMistake({ mistake }: { mistake: MistakeType }) {
  return (
    <div className="bg-gray-50 border border-gray-100 flex flex-col gap-4 p-4 rounded-lg">
      <header className="flex flex-row justify-between items-center">
        <div className="flex flex-row gap-2 items-center">
          <span className="w-2 h-2 rounded-full bg-amber-400"></span>
          <h3 className="text-sm font-medium text-gray-800">{mistake.type}</h3>
        </div>
        <h3
          className={cn(
            "px-2 py-1 rounded-lg border text-xs font-medium border-gray-200/80 bg-white text-gray-500"
          )}
        >
          {mistake.frequency} errors
        </h3>
      </header>
      <p className="text-sm font-medium text-gray-600">{mistake.description}</p>
      <main className="space-y-1 p-4 rounded-md flex flex-col gap-1 items-start bg-white">
        <h3 className="text-xs font-medium text-gray-600">Phonetic Guide:</h3>
        <code className="text-xs text-purple-800 font-medium border border-purple-200 bg-purple-50 rounded-sm py-1.5 px-3">
          <span>{mistake.example.original}</span> vs{" "}
          <span>{mistake.example.improved}</span>
        </code>
      </main>
    </div>
  );
}

export default function PronunciationCommon() {
  const styles = getStyle("Improving");
  return (
    <section className="rounded-lg p-6 flex flex-col gap-6 bg-white font-geist border border-slate-200/80">
      <header className="flex flex-row items-start justify-between">
        <h2 className="text-lg text-gray-800 font-semibold">
          Pronunciation Innacuracies
        </h2>
        <h3
          className={cn(
            "px-2 py-1 text-start rounded-md border text-xs font-medium",
            styles
          )}
        >
          Improving
        </h3>
      </header>
      <main className="space-y-4">
        {pronunciationMistakes.map((item, index) => (
          <CommonPronunciationMistake mistake={item} key={index} />
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
