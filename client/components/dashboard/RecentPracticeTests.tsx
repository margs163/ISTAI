import {
  BookText,
  Bot,
  BriefcaseBusiness,
  ChartColumn,
  Ellipsis,
} from "lucide-react";
import Link from "next/link";
import React from "react";

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
    band: 7.0,
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

export function PracticeTest({ test }: { test: Test }) {
  return (
    <div className="border border-gray-100 rounded-lg w-full px-5 py-2.5 flex flex-row justify-between items-center hover:bg-slate-50 transition-colors active:bg-slate-50">
      <Link href={"#"} className="flex flex-row gap-3 items-center">
        <div className="p-2 rounded-lg bg-indigo-100">
          <BookText className="size-5 text-indigo-600 shrink-0" />
        </div>
        <div>
          <h3 className="font-medium text-gray-800 text-sm">{test.name}</h3>
          <p className="text-xs font-normal text-gray-600 hidden lg:block">
            {test.timeAgo} • {test.duration}
          </p>
        </div>
      </Link>
      <div className="px-2.5 py-1 rounded-full bg-green-100 hidden lg:inline-block">
        <p className="text-xs font-medium text-green-700">
          band {test.band.toFixed(1)}
        </p>
      </div>
      <h3 className="text-sm font-medium text-gray-800 flex-row items-center gap-1 hidden lg:flex">
        <Bot className="size-4" />
        {test.assistant}
      </h3>
      <div className="flex flex-row gap-2 items-center">
        <Link href={"#"}>
          <ChartColumn className="size-4 p-1.5 rounded-full hover:bg-gray-50 active:bg-gray-50 text-gray-800 hover:text-gray-700 active:text-gray-700 transition-colors box-content" />
        </Link>
        <Link href={"#"}>
          <Ellipsis className="size-4 p-1.5 rounded-full hover:bg-gray-50 active:bg-gray-50 text-gray-800 hover:text-gray-700 active:text-gray-700 transition-colors box-content" />
        </Link>
      </div>
    </div>
  );
}

export default function RecentPracticeTests() {
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
          {tests.map((item, index) => (
            <PracticeTest key={index} test={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
