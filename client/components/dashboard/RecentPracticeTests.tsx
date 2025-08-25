"use client";
import { useGlobalPracticeTestsStore } from "@/lib/practiceTestStore";
import { fetchPracticeTests } from "@/lib/queries";
import { cn, getPreciseTimeAgo } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import {
  BookText,
  Bot,
  BriefcaseBusiness,
  ChartColumn,
  Ellipsis,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import LoadingSmallUI from "../loadingSmallUI";
import { PracticeTestType } from "@/lib/types";
import RecentTestsFallback from "./RecentTestsFallback";

function parseTime(time: number) {
  const minutes = Math.floor(time / 60);
  const seconds = time - minutes * 60;

  return `${minutes < 10 ? 0 : ""}${minutes}:${
    seconds < 10 ? 0 : ""
  }${seconds}`;
}

type Test = {
  practice_name: string;
  timeAgo: string;
  duration: number;
  band: number;
  assistant: "Ron" | "Kate";
};

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

export function PracticeTest({ test }: { test: PracticeTestType }) {
  return (
    <div className="border border-gray-100 rounded-lg w-full px-5 py-3 lg:py-3.5 flex flex-row justify-between items-center hover:bg-slate-50 transition-colors active:bg-slate-50">
      <Link
        href={`/dashboard/practice-tests/${test.id}`}
        className="flex flex-row gap-3 items-center"
      >
        <div className="p-2 rounded-lg bg-indigo-100">
          <BookText className="size-5 text-indigo-600 shrink-0" />
        </div>
        <div>
          <h3 className="font-medium text-gray-800 text-sm">
            {test.practice_name}
          </h3>
          <p className="text-xs font-normal text-gray-600 hidden lg:block">
            {getPreciseTimeAgo(test.test_date)} •{" "}
            {parseTime(test.test_duration ?? 1200)}
          </p>
        </div>
      </Link>
      <div
        className={cn(
          "px-2.5 py-1 rounded-xl border hidden lg:inline-block",
          test.result?.overall_score > 6.0
            ? "border-green-300 bg-green-50"
            : test.result?.overall_score >= 4.5
            ? "border-yellow-300 bg-yellow-50"
            : "border-red-300 bg-red-50"
        )}
      >
        <p
          className={cn(
            "text-xs font-medium",
            test.result?.overall_score > 6.0
              ? "text-green-600"
              : test.result?.overall_score >= 4.5
              ? "text-yellow-600"
              : "text-red-600"
          )}
        >
          Band {test.result?.overall_score.toFixed(1)}
        </p>
      </div>
      <h3 className="text-sm font-medium text-gray-800 flex-row items-center gap-1 hidden lg:flex">
        <Bot className="size-4" />
        {test.assistant}
      </h3>
      <div className="flex flex-row gap-2 items-center">
        <Link href={"#"}>
          <ChartColumn className="size-4 p-1.5 rounded-full hover:bg-gray-100 active:bg-gray-100 text-gray-800 hover:text-gray-700 active:text-gray-700 transition-colors box-content" />
        </Link>
        <Link href={"#"}>
          <Ellipsis className="size-4 p-1.5 rounded-full hover:bg-gray-100 active:bg-gray-100 text-gray-800 hover:text-gray-700 active:text-gray-700 transition-colors box-content" />
        </Link>
      </div>
    </div>
  );
}

export default function RecentPracticeTests() {
  const setGlobalPracticeTests = useGlobalPracticeTestsStore(
    (state) => state.setPracticeTests
  );
  const { data, isLoading, error } = useQuery({
    queryKey: ["practice-tests"],
    queryFn: async () => await fetchPracticeTests(setGlobalPracticeTests),
  });

  if (isLoading) return <LoadingSmallUI />;

  const recentTests = data && data.filter((item) => item.result);
  const lastFive =
    recentTests && recentTests.length > 5
      ? recentTests.slice(recentTests.length - 10, recentTests.length - 5)
      : recentTests;
  return (
    <section className="px-6 lg:pr-0 w-full flex flex-col gap-6">
      <div className="p-5 w-full flex flex-col gap-6 bg-white rounded-lg border border-gray-200/80 min-h-[320px]">
        <header className="w-full flex flex-row justify-between items-center px-1">
          <div className="flex flex-row items-center justify-start gap-2">
            <h3 className="font-semibold text-lg text-gray-800">
              Recent Tests
            </h3>
          </div>
          <Link href={"/dashboard/practice-tests"}>
            <p className="font-medium text-xs text-gray-800 p-1 hover:text-gray-700 active:text-gray-700">
              See All
            </p>
          </Link>
        </header>
        <div className="space-y-3">
          {data && data.length > 0 && lastFive ? (
            lastFive.map((item, index) => (
              <PracticeTest key={index} test={item} />
            ))
          ) : (
            <RecentTestsFallback />
          )}
        </div>
      </div>
    </section>
  );
}
