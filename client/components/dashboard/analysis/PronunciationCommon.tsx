import { cn } from "@/lib/utils";
import React from "react";
import CommonMistakesFallback from "../CommonFallback";
import { PronunciationCommonMistakeType } from "@/lib/types";
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

const pronunciationMistakes = [
  {
    mistake_type: "Word Stress",
    frequency: 12,
    word: "photograph",
    user_phonemes: "/ˈfoʊtəɡræf/",
    accuracy: 85,
    correct_phonemes: "/fəˈtɑɡrəfi/",
    // description: "PHOtograph vs phoTOgraphy stress patterns",
  },
  {
    mistake_type: "Consonant Sounds",
    frequency: 8,
    word: "think",
    accuracy: 85,
    user_phonemes: "think /θɪŋk/",
    correct_phonemes: "fink /fɪŋk/",
    // description: "Confusing /θ/ and /f/ sounds",
  },
  {
    mistake_type: "Vowel Phoneme Errors",
    frequency: 10,
    word: "adventure",
    accuracy: 85,
    user_phonemes: "/ədˈvɛn.tʃəz/",
    correct_phonemes: "/ədˈvɛn.tʃɚz/",
    // description: "Flat intonation in questions",
  },
];

function CommonPronunciationMistake({
  mistake,
}: {
  mistake: PronunciationCommonMistakeType;
}) {
  return (
    <div className="bg-gray-50 border border-gray-100 flex flex-col gap-4 p-4 rounded-lg">
      <header className="flex flex-row justify-between items-center">
        <div className="flex flex-row gap-2 items-center">
          <span className="w-2 h-2 rounded-full bg-amber-400"></span>
          <h3 className="text-sm font-medium text-gray-800">
            {mistake.mistake_type}
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
      {/* <p className="text-sm font-medium text-gray-600">{mistake.}</p> */}
      <main className="space-y-1 p-4 rounded-md flex flex-col gap-1 items-start bg-white w-full">
        <h3 className="text-xs font-medium text-gray-600">Phonetic Guide:</h3>
        <div className="flex justify-between w-full items-center">
          <p className="text-sm font-medium text-gray-800">
            {mistake.word[0].toUpperCase() + mistake.word.slice(1)}
          </p>
          <code className="text-xs text-purple-800 font-medium border border-purple-200 bg-purple-50 rounded-sm py-1.5 px-3">
            <span>{mistake.user_phonemes}</span> vs{" "}
            <span>{mistake.correct_phonemes}</span>
          </code>
        </div>
      </main>
    </div>
  );
}

export default function PronunciationCommon() {
  const styles = getStyle("Improving");
  const pronunciationCommonMistake = useAnalyticsStore(
    (state) => state.pronunciation_common_mistakes
  );
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
      {!pronunciationCommonMistake ? (
        <CommonMistakesFallback order={2} />
      ) : (
        <div className="flex flex-col gap-6">
          <main className="space-y-4">
            {pronunciationCommonMistake.map((item, index) => (
              <CommonPronunciationMistake mistake={item} key={index} />
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
