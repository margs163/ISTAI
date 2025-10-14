import Image from "next/image";
import React from "react";
import MainButton from "../MainButton";
import { File, FileText, Plus } from "lucide-react";
import lineGraphFallback from "@/assets/images/linegraphFallback.svg";

export default function BandScoreFallback() {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-start lg:justify-center w-full p-2 gap-4 pt-0 pb-8 lg:pb-7">
      <Image
        src={lineGraphFallback}
        alt="test-fallback"
        className="size-40 lg:size-46"
      />
      <div className="text-center lg:text-start flex flex-col gap-2">
        <h1 className="text-base lg:text-xl font-semibold text-gray-800">
          Take at least 2 practice tests
        </h1>
        <p className="text-xs lg:text-sm font-normal text-gray-600 max-w-[300px] px-4 lg:px-0">
          We need enough data to track your progress. Start by taking at least 2
          practice tests to see your band score progress
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
