import { cn } from "@/lib/utils";
import { Award } from "lucide-react";
import React from "react";

function getLevel(score: number): string {
  return score <= 4
    ? "Elementary"
    : score >= 4.5 && score < 5.5
    ? "Intermediate"
    : score >= 5.5 && score < 7.0
    ? "Upper Intermediate"
    : score >= 7.0 && score < 8.5
    ? "Advanced"
    : "Proficient";
}

export default function Overall({ score }: { score: number }) {
  return (
    <section className="w-full px-6 flex flex-col gap-4 items-center mb-4">
      <div className="p-4 lg:p-5 bg-blue-500 rounded-full">
        <Award className="text-white size-8 lg:size-10 box-content" />
      </div>
      <div className="flex flex-col items-center justify-start gap-4">
        <h1 className="font-bold text-3xl text-gray-800">Overall Band Score</h1>
        <h3
          className={cn(
            "text-5xl font-bold",
            score > 4.5 && score < 5.5
              ? "text-red-500"
              : score >= 5.5 && score < 7.0
              ? "text-yellow-500"
              : score >= 7.0 && "text-blue-500"
          )}
        >
          {score.toFixed(1)}
        </h3>
        <p
          className={cn(
            "text-base px-4 py-2 rounded-lg font-semibold",
            score > 4.5 && score < 5.5
              ? "text-red-600 bg-red-100"
              : score >= 5.5 && score < 7.0
              ? "text-yellow-600 bg-yellow-100"
              : score >= 7.0 && "text-blue-600 bg-blue-100"
          )}
        >
          {getLevel(score)}
        </p>
      </div>
    </section>
  );
}
