import Image from "next/image";
import React from "react";
import NoData from "@/assets/images/NoData.svg";
import NoData2 from "@/assets/images/NoData2.svg";
import NoData3 from "@/assets/images/NoData3.svg";
import { PracticeTest } from "./RecentPracticeTests";
import MainButton from "../MainButton";
import { File, FileText, Plus } from "lucide-react";
import NewTest from "./NewTest";

export default function CommonMistakesFallback({
  order,
}: {
  order: 1 | 2 | 3;
}) {
  return (
    <div className="flex flex-col mt-auto items-center justify-start w-full p-2 gap-2 pb-4 lg:pb-6">
      <Image
        src={order === 1 ? NoData : order === 2 ? NoData2 : NoData3}
        alt="test-fallback"
        className="size-44 lg:size-52"
      />
      <div className="text-center flex flex-col gap-2 items-center">
        <h1 className="text-lg lg:text-xl font-semibold text-gray-800">
          No Data Available Yet
        </h1>
        <p className="text-xs lg:text-sm font-normal text-gray-600 max-w-[300px]">
          Start your IELTS preparation journey by taking your first practice
          test. Track your progress and improve your band score over time.
        </p>
        <NewTest>
          <MainButton
            className={"ml-0 mt-4 lg:mt-8 lg:text-sm lg:px-6 lg:py-2.5"}
          >
            <span className="text-xs font-medium font-geist">
              Take your First Test
            </span>
            <Plus className="size-4" />
          </MainButton>
        </NewTest>
      </div>
    </div>
  );
}
