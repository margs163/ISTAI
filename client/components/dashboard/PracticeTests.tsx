"use client";
import { BookText, Bot, ChartColumn, Ellipsis, Search } from "lucide-react";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import { useGlobalPracticeTestsStore } from "@/lib/practiceTestStore";
import RecentTestsFallback from "./RecentTestsFallback";
import { PracticeTestType } from "@/lib/types";
import { cn, getPreciseTimeAgo, parseTimeInt } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function PracticeTest({ test }: { test: PracticeTestType }) {
  if (!test.result) return;
  return (
    <div className="border border-gray-100 rounded-lg w-full px-5 py-3 lg:py-3.5 flex flex-row justify-between items-center hover:bg-slate-50 transition-colors active:bg-slate-50">
      <Link
        href={`/dashboard/practice-tests/${test.id}`}
        className="flex flex-row gap-3 items-center w-[200px] md:w-[220px] lg:w-[220px]"
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
            {parseTimeInt(test.test_duration ?? 0)}
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

export default function AllPracticeTests() {
  const allPracticeTests = useGlobalPracticeTestsStore(
    (state) => state.practice_tests
  );
  const [sort, setSort] = useState<"recent" | "score" | "duration">("recent");
  const [search, setSearch] = useState("");
  const onValueChange = (value: "recent" | "score" | "duration") =>
    setSort(value);

  const searched = useMemo(() => {
    const filtered = allPracticeTests.filter((test) => test.result);
    const searched = filtered.filter((item) =>
      item.practice_name.includes(search)
    );
    return searched.sort((a, b) => {
      if (sort === "recent") {
        return (
          new Date(b.test_date).getTime() - new Date(a.test_date).getTime()
        );
      } else if (sort === "score") {
        return (
          Number(a.result?.overall_score) - Number(a.result?.overall_score)
        );
      } else {
        return Number(b.test_duration) - Number(a.test_duration);
      }
    });
  }, [allPracticeTests]);

  return (
    <section className="px-4 lg:px-6 w-full flex flex-col gap-6">
      <div className="p-5 w-full flex flex-col gap-6 bg-white rounded-lg border border-gray-200/80">
        <header className="w-full flex flex-row justify-between items-center px-1 gap-4">
          <div className="flex flex-row items-center justify-start gap-2">
            {/* <BriefcaseBusiness className="size-5 text-gray-700" /> */}
            <h3 className="font-semibold text-lg text-gray-800">
              Practice Tests
            </h3>
          </div>
          <div className=" px-4 py-2 border border-slate-200 focus-within:border-gray-300 bg-gray-50 focus-within:bg-gray-100 rounded-md hidden lg:flex flex-row gap-2 items-center transition-all ml-auto">
            <Search className="size-4 text-gray-500" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              type="text"
              placeholder="Practice Name"
              name="search"
              className="w-full text-sm font-normal text-gray-700 focus-within:outline-0"
            />
          </div>
          <Select
            defaultValue="recent"
            onValueChange={onValueChange}
            value={sort}
          >
            <SelectTrigger className="w-[180px] hidden lg:inline-flex">
              <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent className="font-geist">
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="score">Band Score</SelectItem>
              <SelectItem value="duration">Duration</SelectItem>
            </SelectContent>
          </Select>
          <Link href={"#"}>
            <p className="font-medium text-sm text-gray-800 p-1 hover:text-gray-700 active:text-gray-700">
              {searched.length} tests
            </p>
          </Link>
        </header>
        <div className="space-y-3">
          {allPracticeTests && searched.length > 2 ? (
            searched.map((item, index) => (
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
