import Image from "next/image";
import React from "react";
import illustration from "@/assets/images/testIllustration.jpg";
import { PracticeTest } from "./RecentPracticeTests";
import MainButton from "../MainButton";
import { File, FileText, Plus } from "lucide-react";

const tests = [
  {
    practice_name: "Speaking Test 1",
    test_date: new Date().toISOString(),
    duration: 11,
    result: {
      overall_score: 7.5,
    },
    assistant: "Ron",
  },
  {
    practice_name: "Speaking Test 2",
    test_date: new Date().toISOString(),
    duration: 12,
    result: {
      overall_score: 6.0,
    },
    assistant: "Kate",
  },
  {
    practice_name: "Speaking Test 3",
    test_date: new Date().toISOString(),
    duration: 10,
    result: {
      overall_score: 7.0,
    },
    assistant: "Kate",
  },
  {
    practice_name: "Speaking Test 4",
    test_date: new Date().toISOString(),
    duration: 14,
    result: {
      overall_score: 8.0,
    },
    assistant: "Ron",
  },
  {
    practice_name: "Speaking Test 5",
    test_date: new Date().toISOString(),
    duration: 12,
    result: {
      overall_score: 6.5,
    },
    assistant: "Ron",
  },
];

export default function RecentTestsFallback() {
  return (
    <div className="flex flex-col items-center justify-start w-full p-2 gap-2 pb-6">
      <Image
        src={illustration}
        alt="test-fallback"
        className="size-36 lg:size-44"
      />
      <div className="text-center flex flex-col gap-2 items-center">
        <h1 className="text-lg lg:text-xl font-semibold text-gray-800">
          No Tests Taken Yet
        </h1>
        <p className="text-xs lg:text-sm font-normal text-gray-600 max-w-[340px]">
          Start your IELTS preparation journey by taking your first practice
          test. Track your progress and improve your band score over time.
        </p>
        <MainButton className={"ml-0 mt-4"}>
          <Plus className="size-4" />
          <span className="text-xs font-medium font-geist">
            Take your First Test
          </span>
        </MainButton>
      </div>
    </div>
  );
}
