"use client";
import { useAnalyticsStore } from "@/lib/userStorage";
import clsx from "clsx";
import {
  BookA,
  BookMarked,
  LucideProps,
  Megaphone,
  Mic,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import React, { ForwardRefExoticComponent, RefAttributes } from "react";

type Score = {
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  stat: number;
  description: string;
  color: string;
  trend: "up" | "down";
};

export function BandScoreCard({ score }: { score: Score }) {
  const Icon = score.icon;
  return (
    <div className="flex flex-row flex-1/4 gap-4 items-center justify-start p-5 bg-white border border-slate-200/80 rounded-xl">
      <div
        className={clsx(
          "p-3 rounded-lg",
          score.color === "yellow"
            ? "bg-yellow-50"
            : score.color === "green"
            ? "bg-green-50"
            : "bg-blue-50"
        )}
      >
        <Icon
          className={clsx(
            "size-5",
            score.color === "yellow"
              ? "text-yellow-500"
              : score.color === "green"
              ? "text-green-600"
              : " text-blue-600"
          )}
        />
      </div>
      <div>
        <h3 className="text-2xl tracking-wider text-gray-800 font-bold">
          {score.stat.toFixed(1)}
        </h3>
        <p className="text-xs font-normal text-gray-600">{score.description}</p>
      </div>
      {score.trend === "up" ? (
        // <ArrowBigUpDash
        //   strokeWidth={1.5}
        //   className="size-10 text-green-600 ml-auto"
        // />
        <h3 className="text-xl text-green-500 font-semibold ml-auto flex flex-row items-center gap-2">
          <TrendingUp className="text-green-500 size-5.5" /> 0.5
        </h3>
      ) : (
        // <ArrowBigDownDash
        //   strokeWidth={1.5}
        //   className="size-10 text-red-600 ml-auto"
        // />
        <h3 className="text-xl text-red-500 font-semibold ml-auto flex flex-row items-center gap-2">
          <TrendingDown className="text-red-500 size-5.5" /> 0.5
        </h3>
      )}
    </div>
  );
}
export default function BandScoreCards() {
  const averageScores = useAnalyticsStore((state) => state.average_band_scores);
  const scores: Score[] = [
    {
      icon: Mic,
      stat: averageScores.fluency,
      description: "Fluency & Cohesion",
      color: "blue",
      trend: "up",
    },
    {
      icon: BookMarked,
      stat: averageScores.grammar,
      description: "Grammatical Range",
      color: "green",
      trend: "up",
    },
    {
      icon: BookA,
      stat: averageScores.lexis,
      description: "Lexical Resource",
      color: "purple",
      trend: "down",
    },
    {
      icon: Megaphone,
      stat: averageScores.pronunciation,
      description: "Pronunciation",
      color: "orange",
      trend: "up",
    },
  ];
  return (
    <section className="flex flex-col lg:flex-row gap-2 lg:gap-3 px-6">
      {scores.map((item, index) => (
        <BandScoreCard key={index} score={item} />
      ))}
    </section>
  );
}
