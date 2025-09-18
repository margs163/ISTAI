import React, { useEffect } from "react";
import type { QuestionCardType } from "@/lib/types";
import Tag from "../home/Tag";
import { useTestSessionStore } from "@/lib/testSessionStore";
import { cn } from "@/lib/utils";
import { useLocalPracticeTestStore } from "@/lib/practiceTestStore";

function parseTime(time: number) {
  const minutes = Math.floor(time / 60);
  const seconds = time - minutes * 60;

  return `${minutes < 10 ? 0 : ""}${minutes}:${
    seconds < 10 ? 0 : ""
  }${seconds}`;
}

export default function QuestionCard({
  partTwoTime,
  setPartTwoTime,
  setTimerActive,
  setIsAnsweringQuestion,
}: {
  partTwoTime: number;
  setPartTwoTime: React.Dispatch<React.SetStateAction<number>>;
  setTimerActive: React.Dispatch<React.SetStateAction<boolean>>;
  setIsAnsweringQuestion: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const currentPart = useTestSessionStore((state) => state.currentPart);
  const card = useLocalPracticeTestStore((state) => state.part_two_card);
  useEffect(() => {
    if (currentPart === 2) {
      setTimerActive(true);
      const intervalId = setInterval(() => {
        setPartTwoTime((prev) => {
          if (prev - 1 === 0) {
            setTimerActive(false);
            setIsAnsweringQuestion(true);
          }
          return Math.max(0, prev - 1);
        });
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [currentPart]);
  console.log(card);
  return (
    <section className="">
      <div className="p-6 rounded-xl bg-gray-100 space-y-2 shadow-sm fourth-step">
        <div className="flex flex-row items-start justify-between">
          <p className="text-xs font-medium text-indigo-600">Question Card</p>
          <div className="flex flex-row box-content items-center text-sm font-medium text-gray-700 gap-2">
            <span className="w-2 h-2 shrink-0 rounded-full bg-red-500 animate-pulse box-content"></span>
            {parseTime(partTwoTime)}
          </div>
        </div>
        <h3 className="text-base font-semibold text-gray-800">
          {currentPart === 2 && card
            ? card.topic
            : "Part 2 Question Card will be here"}
        </h3>
        <ul
          className={cn(
            "flex flex-col gap-1 text-gray-600 list-disc",
            currentPart === 2 && "pl-3"
          )}
        >
          {currentPart === 2 && card ? (
            card.questions.map((question, index) => (
              <li key={index} className=" text-sm font-medium">
                {question}
              </li>
            ))
          ) : (
            <p className="text-sm font-medium">
              Waiting for Part 2 of the test
            </p>
          )}
        </ul>
      </div>
    </section>
  );
}
