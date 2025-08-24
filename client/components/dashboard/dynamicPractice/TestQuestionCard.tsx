import { QuestionCardType } from "@/lib/types";
import { cn } from "@/lib/utils";
import React from "react";

const fallbackQuestionCard = {
  id: "d1ka8310nzi",
  part: 2,
  topic: "Describe a book you have recently",
  questions: [
    "What the book was about",
    "When you read it",
    "Why you chose to read it",
    "And explain whether you enjoyed reading it",
  ],
};

export default function TestQuestionCard({
  questionCard,
}: {
  questionCard: QuestionCardType;
}) {
  return (
    <section className="rounded-lg p-6 lg:p-8 flex flex-col gap-6 bg-white font-geist border border-slate-200/80">
      <header className="flex flex-row items-start justify-between">
        <h2 className="text-lg text-gray-800 font-semibold">
          Part 2 Question Card
        </h2>
        <h3
          className={cn(
            "px-2 py-1 text-start rounded-md border text-xs font-medium text-blue-600 bg-blue-50 border-blue-500"
          )}
        >
          Long Turn
        </h3>
      </header>
      <main className="flex flex-col gap-4 items-start justify-start p-5 rounded-md bg-blue-50/50 border-blue-100 border">
        <h2 className="text-base font-medium text-gray-800">
          {questionCard?.topic ?? fallbackQuestionCard.topic}
        </h2>
        <div className="space-y-2">
          <p className="text-sm font-normal text-gray-600">You should say:</p>
          <ul className="text-sm font-normal text-gray-600 gap-2 list-disc pl-3">
            {questionCard
              ? questionCard.questions.map((question, index) => (
                  <li key={index}>{question}</li>
                ))
              : fallbackQuestionCard.questions.map((question, index) => (
                  <li key={index}>{question}</li>
                ))}
          </ul>
        </div>
        <footer className="border border-indigo-200 p-3 rounded-lg bg-white space-y-1">
          <h3 className="text-xs font-medium text-blue-900">Instructions:</h3>
          <p className="text-xs font-normal text-blue-700">
            You will have 1 minute to prepare your talk and then you will need
            to talk for 1-2 minutes.
          </p>
        </footer>
      </main>
    </section>
  );
}
