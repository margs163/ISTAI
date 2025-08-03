import clsx from "clsx";
import { BookA, BookMarked, LucideProps, Megaphone, Mic } from "lucide-react";
import React, { ForwardRefExoticComponent, RefAttributes } from "react";

const scores: Score[] = [
  {
    icon: Mic,
    stat: 7.0,
    description: "Fluency & Cohesion",
    color: "blue",
    trend: "up",
  },
  {
    icon: BookMarked,
    stat: 6.5,
    description: "Grammatical Range",
    color: "green",
    trend: "up",
  },
  {
    icon: BookA,
    stat: 7.0,
    description: "Lexical Resource",
    color: "purple",
    trend: "down",
  },
  {
    icon: Megaphone,
    stat: 7.0,
    description: "Pronunciation",
    color: "orange",
    trend: "up",
  },
];

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
        <h3 className="text-xl text-green-600 font-semibold ml-auto">+ 0.5</h3>
      ) : (
        // <ArrowBigDownDash
        //   strokeWidth={1.5}
        //   className="size-10 text-red-600 ml-auto"
        // />
        <h3 className="text-xl text-red-600 font-semibold ml-auto">- 0.5</h3>
      )}
    </div>
  );
}
export default function BandScoreCards() {
  return (
    <section className="flex flex-col lg:flex-row gap-2 lg:gap-3 px-6">
      {scores.map((item, index) => (
        <BandScoreCard key={index} score={item} />
      ))}
    </section>
  );
}
