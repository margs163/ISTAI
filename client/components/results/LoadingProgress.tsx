import React from "react";
import illustration from "@/assets/images/linegraphFallback.svg";
import Image from "next/image";
import { Progress } from "../ui/progress";

const progressTitles = [
  "Performing General Assessment",
  "Analyzing Mistakes",
  "Transcribing Reading Audio",
  "Assessing Pronunciation",
];

export default function LoadingProgress({
  progress,
  step,
}: {
  progress: number;
  step: 1 | 2 | 3 | 4;
}) {
  return (
    <section className="h-screen mx-auto w-full flex-col items-center justify-center gap-2 font-geist flex px-6">
      <Image
        src={illustration}
        alt="test-fallback"
        className="size-50 lg:size-64 object-cover aspect-auto"
      />
      <div className="flex flex-col gap-4 lg:gap-4 items-center text-center px-2">
        <h1 className="text-xl lg:text-2xl lg:mb-4 font-semibold text-gray-800 max-w-[300px] lg:max-w-max">
          {progressTitles[step - 1]}
        </h1>
        <Progress
          value={progress}
          className="w-[98%] lg:w-[90%] color-indigo-600"
        />
        <p className="text-xs lg:text-sm font-medium text-gray-500">
          This may take few minutes
        </p>

        <h3 className="px-4 py-2 bg-amber-50 border lg:mt-4 rounded-xl border-amber-300 text-amber-600 text-xs font-medium">
          Note: Do not refresh, close or click back button in this page. Your
          data might loose
        </h3>
      </div>
    </section>
  );
}
