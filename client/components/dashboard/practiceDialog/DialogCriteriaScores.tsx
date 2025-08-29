"use client";
import { CriterionScoresType } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Brain,
  ChartColumn,
  LucideProps,
  MessageSquare,
  Volume2,
} from "lucide-react";
import React from "react";

type CriterionScore = {
  band: number;
  title: string;
  level: string;
  code: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
};
const scores = {
  2.0: {
    level: "Beginner",
    code: "A1",
  },
  2.5: {
    level: "Beginner",
    code: "A1",
  },
  3.0: {
    level: "Elementary",
    code: "A2",
  },
  3.5: {
    level: "Elementary",
    code: "A2",
  },
  4.0: {
    level: "Intermediate",
    code: "B1",
  },
  4.5: {
    level: "Intermediate",
    code: "B1",
  },
  5.0: {
    level: "Intermediate",
    code: "B1",
  },
  5.5: {
    level: "Upper Intermediate",
    code: "B2",
  },
  6.0: {
    level: "Upper Intermediate",
    code: "B2",
  },
  6.5: {
    level: "Upper Intermediate",
    code: "B2",
  },
  7.0: {
    level: "Advanced",
    code: "C1",
  },
  7.5: {
    level: "Advanced",
    code: "C1",
  },
  8.0: {
    level: "Advanced",
    code: "C1",
  },
  8.5: {
    level: "Proficient",
    code: "C2",
  },
  9.0: {
    level: "Proficient",
    code: "C2",
  },
};

export function DialogCriterionBand({ score }: { score: CriterionScore }) {
  const band = score.band;
  const Icon = score.icon;
  return (
    <div className="flex flex-row gap-4 flex-1/4 items-center justify-start p-4 bg-white border border-slate-200/80 rounded-xl">
      <div
        className={cn(
          "p-3 rounded-lg box-content",
          band > 4.5 && band < 5.5
            ? "bg-red-50 "
            : band >= 5.5 && band < 7.0
            ? "bg-amber-50"
            : band >= 7.0 && "bg-blue-50"
        )}
      >
        <Icon
          className={cn(
            "size-5 box-content",
            band > 4.5 && band < 5.5
              ? "text-red-600 "
              : band >= 5.5 && band < 7.0
              ? "text-yellow-500"
              : band >= 7.0 && "text-blue-600"
          )}
        />
      </div>
      <div>
        <h3 className="text-xl lg:text-2xl tracking-wider text-gray-800 font-bold">
          {band.toFixed(1)}
        </h3>
        <p className="text-xs lg:text-xs font-normal text-gray-600">
          {score.title}
        </p>
      </div>
      <p
        className={cn(
          "py-2 px-3 rounded-xl bg-gray-50 font-semibold text-lg ml-auto",
          band > 4.5 && band < 5.5
            ? "text-red-600 "
            : band >= 5.5 && band < 7.0
            ? "text-yellow-500"
            : band >= 7.0 && "text-blue-600"
        )}
      >
        {score.code}
      </p>
    </div>
  );
}

export default function DialogCriterionScores({
  criteria,
}: {
  criteria: CriterionScoresType;
}) {
  const criterionScores = [
    {
      ...scores[criteria?.fluency as 7],
      band: criteria?.fluency,
      title: "Fluency",
      icon: MessageSquare,
    },
    {
      ...scores[criteria?.grammar as 7],
      band: criteria?.grammar,
      title: "Grammar",
      icon: BookOpen,
    },
    {
      ...scores[criteria?.lexis as 7],
      band: criteria?.lexis,
      title: "Lexis",
      icon: Brain,
    },
    {
      ...scores[criteria?.pronunciation as 7],
      band: criteria?.pronunciation,
      title: "Pronunciation",
      icon: Volume2,
    },
  ];

  return (
    <section className="lg:col-span-2">
      <div className="p-6 border border-gray-200 rounded-lg bg-white flex flex-col gap-4 shadow-none">
        <header className="flex flex-row items-center gap-2">
          <ChartColumn className="size-5 text-indigo-600" />
          <h3 className="font-semibold text-gray-800 text-lg">
            Individual Criterion Scores
          </h3>
        </header>
        <main className="flex flex-col lg:flex-row lg:p-2 lg:py-4 gap-4">
          {criterionScores.map((item, index) => (
            // @ts-expect-error it is expected
            <DialogCriterionBand score={item} key={index} />
          ))}
        </main>
      </div>
    </section>
  );
}
