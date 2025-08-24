import { useLocalPracticeTestStore } from "@/lib/practiceTestStore";
import { VocabRepetitionType } from "@/lib/types";
import { LetterText, RefreshCcw } from "lucide-react";
import React from "react";

export function Alternative({ word }: { word: string }) {
  return (
    <p className="bg-orange-100/80 px-2 py-1 text-xs lg:text-sm font-medium rounded-md inline-block text-orange-700">
      {word}
    </p>
  );
}

export function DialogRepetition({
  repetition,
}: {
  repetition: {
    word_or_phrase: string;
    count: number;
    suggested_synonyms: string[];
  };
}) {
  return (
    <div className="border border-orange-200 rounded-md flex flex-col items-start justify-start gap-4 p-4 bg-white ">
      <div className="flex flex-row items-center justify-start gap-2.5 lg:gap-4 w-full">
        <div className="rounded-full bg-orange-100/80 flex items-center justify-center p-2.5">
          <LetterText className="text-orange-600 size-5 shrink-0" />
        </div>
        <h3 className="text-base lg:text-lg font-medium text-gray-800">
          {repetition.word_or_phrase}
        </h3>
        <h3 className="text-orange-700 bg-white text-xs font-medium px-2 py-1 rounded-md ml-auto border border-orange-200">
          {repetition.count} times
        </h3>
      </div>
      <div className="space-y-2">
        <p className="text-sm text-gray-600">Alternatives:</p>
        <div className="flex flex-row flex-wrap gap-1 items-center justify-start">
          {repetition.suggested_synonyms.map((item, index) => (
            <Alternative word={item} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function DialogRepetitions({
  repetitions,
}: {
  repetitions: VocabRepetitionType[];
}) {
  return (
    <section className="w-full lg:col-span-2">
      <div className="p-6 lg:p-8 border border-gray-200 rounded-lg bg-white flex flex-col gap-6 shadow-none">
        <header className="flex flex-row items-center gap-2">
          <RefreshCcw className="size-6 text-orange-600" />
          <h3 className="font-semibold text-gray-700 text-lg">
            Repeated Words & Phrases
          </h3>
        </header>
        <main className="flex flex-col gap-2 lg:gap-4 lg:grid lg:grid-cols-2">
          {repetitions?.map((item, index) => (
            <DialogRepetition key={index} repetition={item} />
          ))}
        </main>
      </div>
    </section>
  );
}
