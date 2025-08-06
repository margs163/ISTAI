import { cn } from "@/lib/utils";
import {
  BookA,
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
const scores: CriterionScore[] = [
  {
    band: 7.5,
    title: "Fluency",
    level: "Advanced",
    code: "C1",
    icon: MessageSquare,
  },
  {
    band: 7.0,
    title: "Lexical Resource",
    level: "Advanced",
    code: "C1",
    icon: BookOpen,
  },
  {
    band: 6.5,
    title: "Grammatical Range",
    level: "Upper Intermediate",
    code: "B2",
    icon: Brain,
  },
  {
    band: 7.0,
    title: "Pronunciation",
    level: "Advanced",
    code: "C1",
    icon: Volume2,
  },
];

export function CriterionBand({ score }: { score: CriterionScore }) {
  const band = score.band;
  const Icon = score.icon;
  return (
    <div className="flex flex-row flex-1/4 gap-4 items-center justify-start p-5 lg:p-5 lg:px-7 bg-white border border-slate-200/80 rounded-xl">
      <div
        className={cn(
          "p-3 rounded-lg lg:p-4 box-content",
          band > 4.5 && band < 5.5
            ? "bg-red-50 "
            : band >= 5.5 && band < 7.0
            ? "bg-amber-50"
            : band >= 7.0 && "bg-blue-50"
        )}
      >
        <Icon
          className={cn(
            "size-5 lg:size-6 box-content",
            band > 4.5 && band < 5.5
              ? "text-red-600 "
              : band >= 5.5 && band < 7.0
              ? "text-yellow-500"
              : band >= 7.0 && "text-blue-600"
          )}
        />
      </div>
      <div>
        <h3 className="text-2xl lg:text-3xl tracking-wider text-gray-800 font-bold">
          {band.toFixed(1)}
        </h3>
        <p className="text-xs lg:text-sm font-normal text-gray-600">
          {score.title}
        </p>
      </div>
      <p
        className={cn(
          "py-2 px-3 lg:py-3 lg:px-4 lg:text-xl rounded-xl bg-gray-50 font-semibold text-lg ml-auto",
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

export default function CriterionScores() {
  return (
    <section className="w-full px-6 lg:px-20 xl:px-40">
      <div className="p-6 lg:p-8 border border-gray-200 rounded-lg bg-white flex flex-col gap-6">
        <header className="flex flex-row items-center gap-2">
          <ChartColumn className="size-6 text-indigo-600" />
          <h3 className="font-semibold lg:text-xl text-gray-800 text-lg">
            Individual Criterion Scores
          </h3>
        </header>
        <main className="flex flex-col lg:flex-row gap-4">
          {scores.map((item, index) => (
            <CriterionBand score={item} key={index} />
          ))}
        </main>
      </div>
    </section>
  );
}
