import { useLocalPracticeTestStore } from "@/lib/practiceTestStore";
import React, { type MouseEventHandler } from "react";

type CloseFunction<T = HTMLElement> = MouseEventHandler<T>;

export default function ReadingCard({ closeFn }: { closeFn: CloseFunction }) {
  const readingCard = useLocalPracticeTestStore((state) => state.reading_cards);
  return (
    <section className="flex flex-col gap-2 items-start justify-start bg-white p-6 lg:p-8 rounded-lg font-geist min-w-[320px] lg:max-w-[600px]">
      <div className="flex flex-col gap-2 items-start justify-start">
        <p className="text-xs font-medium text-indigo-600">Reading Card</p>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-800">
            {readingCard && readingCard?.length > 0 && readingCard[0].topic}
          </h3>
          <p className="text-sm font-normal text-gray-800 w-full tracking-wide leading-[1.5]">
            {readingCard && readingCard?.length > 0 && readingCard[0].text}
          </p>
        </div>
      </div>
    </section>
  );
}
