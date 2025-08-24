"use client";
import { useGlobalPracticeTestsStore } from "@/lib/practiceTestStore";
import { fetchPracticeTests } from "@/lib/queries";
import { cn, getPreciseTimeAgo } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { BookText, Bot, ChartColumn, Ellipsis } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import LoadingSmallUI from "../loadingSmallUI";
import PracticeTestDialogInfo from "./PracticeTestDialogInfo";
import { PracticeTestType } from "@/lib/types";

function parseTime(time: number) {
  const minutes = Math.floor(time / 60);
  const seconds = time - minutes * 60;

  return `${minutes < 10 ? 0 : ""}${minutes}:${
    seconds < 10 ? 0 : ""
  }${seconds}`;
}

type Test = {
  name: string;
  timeAgo: string;
  duration: number;
  band: number;
  assistant: "Ron" | "Kate";
};

const tests: Test[] = [
  {
    name: "Speaking Test 1",
    timeAgo: "2 hours ago",
    duration: 11,
    band: 7.0,
    assistant: "Ron",
  },
  {
    name: "Speaking Test 2",
    timeAgo: "6 hours ago",
    duration: 12,
    band: 6.5,
    assistant: "Kate",
  },
  {
    name: "Speaking Test 3",
    timeAgo: "1 day ago",
    duration: 10,
    band: 7.5,
    assistant: "Kate",
  },
  {
    name: "Speaking Test 4",
    timeAgo: "2 days ago",
    duration: 14,
    band: 5.5,
    assistant: "Ron",
  },
  {
    name: "Speaking Test 5",
    timeAgo: "3 days ago",
    duration: 12,
    band: 7.0,
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

  if (error)
    return (
      <h1 className="text-sm text-center font-medium text-red-800">
        Error: {error.message}
      </h1>
    );

  if (!data) return <LoadingSmallUI />;

  const recentTests = data.filter((item) => item.result);
  console.log(recentTests);
  const lastFive =
    recentTests.length > 5
      ? recentTests.slice(recentTests.length - 10, recentTests.length - 5)
      : recentTests;

  return (
    <section className="px-6 lg:pr-0 w-full flex flex-col gap-6">
      <div className="p-5 w-full flex flex-col gap-6 bg-white rounded-lg border border-gray-200/80">
        <header className="w-full flex flex-row justify-between items-center px-1">
          <div className="flex flex-row items-center justify-start gap-2">
            {/* <BriefcaseBusiness className="size-5 text-gray-700" /> */}
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
          {lastFive.map((item, index) => (
            <PracticeTest key={index} test={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
