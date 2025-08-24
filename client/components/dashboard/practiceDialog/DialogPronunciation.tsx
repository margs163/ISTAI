import { useLocalPracticeTestStore } from "@/lib/practiceTestStore";
import { PronunciationErrorType } from "@/lib/types";
import { Info, Mic, Volume2 } from "lucide-react";
import React from "react";

const pronunMistakes = [
  {
    word: "comfortable",
    issue: "Missing syllable",
    correction: "COM-for-ta-ble",
  },
  {
    word: "specific",
    issue: "Wrong stress",
    correction: "spe-CI-fic",
  },
];

export function DialogPronunMistake({
  mistake,
}: {
  mistake: {
    word: string;
    accuracy: number;
    user_phonemes: string;
    correct_phonemes: string;
  };
}) {
  return (
    <div className="flex flex-col gap-4 lg:gap-4 justify-start items-start p-6 lg:p-6 w-full bg-purple-50/50 border border-gray-200 rounded-md">
      <div className="flex flex-row gap-3 items-center justify-start">
        <div className="flex items-center justify-center bg-purple-100 rounded-full p-2.5 lg:px-3 lg:py-[13px]">
          <Volume2 className="text-purple-600 shrink-0 size-5 lg:size-6" />
        </div>
        <h3 className="text-base lg:text-lg font-medium">{mistake.word}</h3>
      </div>
      <div className="space-y-1">
        <div className="text-red-600 flex flex-row gap-2 justify-start items-center">
          <Info className="size-4" />
          <p className="font-normal text-sm lg:text-base">
            Issue: {mistake.user_phonemes}
          </p>
        </div>
        <div className="text-green-600 flex flex-row gap-2 justify-start items-center">
          <Info className="size-4" />
          <p className="font-normal text-sm lg:text-base">
            Correct: {mistake.correct_phonemes}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function DialogPronunciationIssues({
  pronunIssues,
}: {
  pronunIssues: PronunciationErrorType[];
}) {
  return (
    <section className="w-full lg:col-span-2">
      <div className="p-6 lg:p-8 border border-gray-200 rounded-lg bg-white flex flex-col gap-4 shadow-none">
        <header className="flex flex-row items-center gap-2">
          <Mic className="size-6 text-indigo-600" />
          <h3 className="font-semibold lg:text-lg text-gray-800 text-lg">
            Pronunciation Issues
          </h3>
        </header>
        <main className="flex flex-col gap-4 lg:flex-row lg:gap-6">
          {pronunIssues?.map((item, index) => (
            <DialogPronunMistake mistake={item} key={index} />
          ))}
        </main>
      </div>
    </section>
  );
}
