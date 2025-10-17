import { infoParts } from "@/lib/constants";
import { Info, Timer } from "lucide-react";
import React from "react";

export default function PartInfo({ currentPart }: { currentPart: 1 | 2 | 3 }) {
  return (
    <section className="p-6 py-0 max-w-[600px] lg:mx-0 lg:max-w-max lg:px-0">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 xl:px-7 flex flex-col gap-5 items-start justify-start third-step">
        <div className="flex flex-row justify-start items-center gap-3">
          <div className="p-3 bg-blue-400 rounded-xl shrink-0">
            <Info className="text-white size-7" />
          </div>
          <h3 className="text-lg xl:text-xl font-semibold text-white w-full">
            {infoParts[currentPart].title}
          </h3>
        </div>
        <div className="flex flex-col items-start justify-start gap-6">
          <p className="text-sm xl:text-[0.92rem] font-normal text-gray-100 tracking-wide">
            {infoParts[currentPart].description}
          </p>
          <div className="flex flex-row gap-2 items-start">
            <Timer className="size-4.5 text-blue-100" />
            <p className="text-sm font-medium text-gray-100">
              {infoParts[currentPart].time}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
