import Image from "next/image";
import React from "react";
import commonCallback from "@/assets/images/commonFallback.svg";
import { PracticeTest } from "./RecentPracticeTests";
import MainButton from "../MainButton";
import { File, FileText, Plus } from "lucide-react";

export default function CommonMistakesFallback() {
  return (
    <div className="flex flex-col mt-auto items-center justify-start w-full p-2 gap-2 pb-4 lg:pb-8">
      <Image
        src={commonCallback}
        alt="test-fallback"
        className="size-36 lg:size-44"
      />
      <div className="text-center flex flex-col gap-2 items-center">
        <h1 className="text-lg lg:text-xl font-semibold text-gray-800">
          No Data Available Yet
        </h1>
        <p className="text-xs lg:text-sm font-normal text-gray-600 max-w-[300px]">
          Start your IELTS preparation journey by taking your first practice
          test. Track your progress and improve your band score over time.
        </p>
        {/* <MainButton className={"ml-0 mt-4"}>
          <Plus className="size-4" />
          <span className="text-xs font-medium font-geist">
            Take your First Test
          </span>
        </MainButton> */}
      </div>
    </div>
  );
}
