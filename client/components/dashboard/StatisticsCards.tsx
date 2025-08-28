import { useAnalyticsStore } from "@/lib/userStorage";
import clsx from "clsx";
import {
  Clock,
  LaptopMinimalCheck,
  LucideProps,
  TrendingUp,
} from "lucide-react";
import React, { ForwardRefExoticComponent, RefAttributes } from "react";

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
    <div className="flex flex-row flex-1/4 gap-4 items-start justify-between p-5 px-6 bg-white border border-slate-200/80 rounded-lg">
      <div>
        <p className="text-sm font-normal text-gray-600">{stat.description}</p>
        <h3 className="text-xl text-gray-700 font-bold">{stat.stat}</h3>
      </div>
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
    </div>
  );
}

export default function StatisticsCards() {
  const practiceTime = Math.floor(
    useAnalyticsStore((state) => state.practice_time) / 60
  );
  const testsCompleted = useAnalyticsStore((state) => state.tests_completed);
  const currentBandScore = useAnalyticsStore(
    (state) => state.current_bandscore
  );

  const stats: Stat[] = [
    {
      icon: Clock,
      stat: `${
        Math.floor(practiceTime / 60) >= 1
          ? Math.floor(practiceTime / 60) + " hrs"
          : practiceTime + " mins"
      }`,
      description: "Practice Time",
      color: "blue",
    },
    {
      icon: LaptopMinimalCheck,
      stat: `${testsCompleted} tests`,
      description: "Tests Completed",
      color: "green",
    },
    {
      icon: TrendingUp,
      stat: `${currentBandScore.toFixed(1) ?? 0}`,
      description: "Current Band Score",
      color: "purple",
    },
  ];
  return (
    <section className="flex flex-col lg:flex-col flex-wrap gap-2 lg:gap-3 px-6 lg:pr-0">
      {stats.map((item, index) => (
        <StatisticCard key={index} stat={item} />
      ))}
    </section>
  );
}
