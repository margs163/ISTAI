import clsx from "clsx";
import {
  Clock,
  LaptopMinimalCheck,
  LucideProps,
  TrendingUp,
  Watch,
} from "lucide-react";
import React, { ForwardRefExoticComponent, RefAttributes } from "react";

const stats: Stat[] = [
  {
    icon: Clock,
    stat: "24hrs",
    description: "Practice Time",
    color: "blue",
  },
  {
    icon: LaptopMinimalCheck,
    stat: 12,
    description: "Tests Completed",
    color: "green",
  },
  {
    icon: TrendingUp,
    stat: 7.0,
    description: "Current Band Score",
    color: "purple",
  },
];

type Stat = {
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  stat: string | number;
  description: string;
  color: string;
};

export function StatisticCard({ stat }: { stat: Stat }) {
  const Icon = stat.icon;
  return (
    <div className="flex flex-row flex-1/4 gap-4 items-start justify-start p-5 bg-white border border-slate-200/80 rounded-xl">
      <div
        className={clsx(
          "p-3 rounded-lg",
          stat.color === "yellow"
            ? "bg-yellow-50"
            : stat.color === "green"
            ? "bg-green-50"
            : "bg-blue-50"
        )}
      >
        <Icon
          className={clsx(
            "size-5",
            stat.color === "yellow"
              ? "text-yellow-500"
              : stat.color === "green"
              ? "text-green-600"
              : " text-blue-600"
          )}
        />
      </div>
      <div>
        <h3 className="text-xl text-gray-800 font-bold">{stat.stat}</h3>
        <p className="text-xs font-normal text-gray-600">{stat.description}</p>
      </div>
    </div>
  );
}

export default function StatisticsCards() {
  return (
    <section className="flex flex-col lg:flex-col flex-wrap gap-2 lg:gap-3 px-6 lg:pl-0">
      {stats.map((item, index) => (
        <StatisticCard key={index} stat={item} />
      ))}
    </section>
  );
}
