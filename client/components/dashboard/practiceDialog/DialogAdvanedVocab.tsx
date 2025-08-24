import { useLocalPracticeTestStore } from "@/lib/practiceTestStore";
import { VocabUsageType } from "@/lib/types";
import { BookOpen, Star } from "lucide-react";
import React from "react";

export function DialogPhrase({
  usage,
}: {
  usage: {
    word_or_phrase: string;
    cefr_level: string;
  };
}) {
  return (
    <div className="border border-green-300 rounded-md flex flex-row items-center justify-start gap-3 p-4 lg:p-5 bg-white ">
      <div className="rounded-full bg-green-100/80 flex items-center justify-center p-2.5">
        <BookOpen className="text-green-600 size-5 shrink-0" />
      </div>
      <div className="">
        <h3 className="text-sm lg:text-base font-medium text-gray-800">
          {usage.word_or_phrase}
        </h3>
        <p className="text-xs lg:text-sm text-gray-600">
          {"Used appropriately in a formal context"}
        </p>
      </div>
      <h3 className="text-green-700 bg-green-50 text-sm  font-medium px-2 py-1 rounded-md ml-auto">
        {usage.cefr_level}
      </h3>
    </div>
  );
}

export default function DialogAdvancedVocabulary({
  vocabulary,
}: {
  vocabulary: VocabUsageType[];
}) {
  return (
    <section className="w-full lg:col-span-2">
      <div className="p-6 lg:p-8 border border-gray-200 rounded-lg bg-white flex flex-col gap-6 shadow-none">
        <header className="flex flex-row items-center gap-2">
          <Star className="size-6 text-green-600" />
          <h3 className="font-semibold lg:text-xl text-gray-700 text-lg">
            Advanced Vocabulary Used
          </h3>
        </header>
        <main className="flex flex-col gap-2 lg:gap-4 lg:grid lg:grid-cols-2">
          {vocabulary?.map((item, index) => (
            <DialogPhrase key={index} usage={item} />
          ))}
        </main>
      </div>
    </section>
  );
}
