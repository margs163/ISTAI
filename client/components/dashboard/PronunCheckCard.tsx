import { ReadingCardType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export default function PronunCheckCard({
  questionCard,
  children,
}: {
  questionCard?: ReadingCardType | null;
  children: ReactNode;
}) {
  const readingCard = {
    ...questionCard,
    focus: ["Word Stress", "Consonant Clusters", "Intonation"],
  };
  return (
    <section className="flex flex-col gap-4 items-start justify-start">
      {/* <h2 className="text-base font-medium text-gray-800">
        Read the following passage
      </h2> */}
      <div className="space-y-2 p-5 lg:p-6 rounded-lg bg-white border-indigo-200 border">
        <blockquote className="text-sm leading-[1.5] text-balance font-light lg:font-normal text-gray-600">
          {readingCard?.text}
        </blockquote>
      </div>
      <footer className="border border-indigo-100 p-3 rounded-lg bg-white space-y-2 w-full">
        {children}
      </footer>
    </section>
  );
}
