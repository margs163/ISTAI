import { cn } from "@/lib/utils";
import { Flame } from "lucide-react";
import React from "react";

export default function DailyStreak({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        " rounded-xl flex flex-row items-center gap-2 lg:pr-6",
        className
      )}
    >
      <Flame
        className="fill-orange-500 text-orange-600 size-8 lg:size-9"
        strokeWidth={3}
      />
      <div className="">
        <p className="text-xs lg:text-sm text-gray-600">Daily Streak</p>
        <h3 className="text-base lg:text-lg lg:leading-[1.45] font-semibold text-gray-800">
          0 Days Streak
        </h3>
      </div>
    </div>
  );
}
