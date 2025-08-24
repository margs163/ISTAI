"use client";
import { ArrowLeft, Clock, FileInput, Share2 } from "lucide-react";
import Link from "next/link";
import React from "react";
import MainButton from "../MainButton";

function clearSessionStorage() {
  const item = sessionStorage.getItem("local-practice-test");
  if (item) {
    sessionStorage.removeItem("local-practice-test");
  }
}

export default function ResultsHeader() {
  return (
    <header className="text-gray-800 w-full bg-white mb-4 lg:mb-8 fixed top-0">
      <div className="w-full flex flex-row gap-3 lg:gap-12 px-6 lg:px-20 xl:px-24 py-2.5 lg:py-3 items-center justify-start">
        <Link
          href={"/dashboard"}
          onClick={clearSessionStorage}
          className="p-1 lg:p-2 rounded-md hover:bg-gray-50 active:bg-gray-50 flex flex-row items-center gap-2"
        >
          <ArrowLeft className="size-4.5  shrink-0 box-content transition-colors" />
          <p className="text-gray-800 text-sm font-medium hidden lg:block">
            Back to Dashboard
          </p>
        </Link>
        <div className="flex flex-col items-start">
          <h3 className="text-base lg:text-lg font-semibold">
            Speaking Test Result
          </h3>
          <p className="text-xs lg:text-sm font-normal text-gray-600 flex flex-row items-center justify-start gap-1">
            <Clock className="text-gray-600 size-4" />
            {new Date().toDateString()}
            <span>• 14 min</span>
          </p>
        </div>
        <div className="flex flex-row items-center gap-4 ml-auto">
          <MainButton
            variant="secondary"
            className={
              "bg-white border border-gray-200 hover:bg-gray-50 active:bg-gray-50 text-xs lg:text-sm hidden lg:flex ml-0"
            }
          >
            <Share2 className=" text-gray-700 size-4 lg:size-5" />
            Share
          </MainButton>
          <MainButton
            variant="secondary"
            className={
              "bg-white border border-gray-200 hover:bg-gray-50 active:bg-gray-50 flex text-xs lg:text-sm ml-0"
            }
          >
            <FileInput className=" text-gray-700 size-4 lg:size-5" />
            Export
          </MainButton>
        </div>
      </div>
      <hr className="w-full h-[1px] text-gray-300" />
    </header>
  );
}
