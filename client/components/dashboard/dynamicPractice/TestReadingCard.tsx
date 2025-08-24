import { QuestionCardType, ReadingCardType } from "@/lib/types";
import { cn } from "@/lib/utils";
import React from "react";

interface UIReadingCard extends ReadingCardType {
  focus: string[];
}

const fallbackReadingCard: UIReadingCard = {
  id: "d1ka8310nzi",
  topic: "Summer Photograph",
  text: "The photograph was taken during our family vacation last summer. We visited several interesting places including museums,restaurants, and historical sites. The weather wasparticularly pleasant, which made our trip even more enjoyable. My comfortable shoes helped me walk long distances without getting tired",
  focus: ["Word Stress", "Consonant Clusters", "Intonation"],
};

export default function TestReadingCard({
  questionCard,
}: {
  questionCard: ReadingCardType;
}) {
  const readingCard = {
    ...questionCard,
    focus: ["Word Stress", "Consonant Clusters", "Intonation"],
  };
  return (
    <section className="rounded-lg p-6 lg:p-8 flex flex-col gap-6 bg-white font-geist border border-slate-200/80">
      <header className="flex flex-row items-start justify-between">
        <h2 className="text-lg text-gray-800 font-semibold">
          Pronunciation Reading Card
        </h2>
        <h3
          className={cn(
            "px-2 py-1 text-start rounded-md border text-xs font-medium text-purple-600 bg-blue-50 border-purple-500"
          )}
        >
          Assessment
        </h3>
      </header>
      <main className="flex flex-col gap-4 items-start justify-start p-5 rounded-md bg-purple-50/50 border-purple-100 border">
        <h2 className="text-base font-medium text-gray-800">
          You have read the following passage
        </h2>
        <div className="space-y-2 p-5 rounded-lg bg-white border-purple-200 border">
          <blockquote className="text-sm font-normal text-gray-600">
            {readingCard?.text ?? fallbackReadingCard.text}
          </blockquote>
        </div>
        <footer className="border border-indigo-100 p-3 rounded-lg bg-white space-y-2 w-full">
          <h3 className="text-xs font-medium text-purple-900">Focus area:</h3>
          <div className="flex flex-row gap-2 ">
            {readingCard.focus.map((item, index) => (
              <h3
                key={index}
                className="px-2 py-1 bg-purple-50 text-purple-600 rounded-sm text-xs"
              >
                {item}
              </h3>
            ))}
          </div>
        </footer>
      </main>
    </section>
  );
}
