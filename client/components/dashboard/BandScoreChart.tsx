"use client";
import React from "react";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import Link from "next/link";
import { useGlobalPracticeTestsStore } from "@/lib/practiceTestStore";
import lineGraphFallback from "@/assets/images/linegraphFallback.svg";
import BandScoreFallback from "./BandScoreFallback";
import { cn } from "@/lib/utils";

const chartConfig = {
  bandScore: {
    label: "Practice test",
    color: "var(--color-indigo-600)",
  },
} satisfies ChartConfig;

export default function BandScoreChart() {
  const practices = useGlobalPracticeTestsStore(
    (state) => state.practice_tests
  );

  const filtered = practices.filter((item) => item.result);
  const chartScores = filtered.map((item, index) => ({
    test: index,
    bandScore: item.result?.overall_score,
  }));
  const lastTen =
    chartScores.length <= 10 ? chartScores : chartScores.slice(-11, -1);

  return (
    <section className="px-6 lg:px-0 w-full flex flex-col gap-4">
      <div className=" w-full flex flex-col gap-4 lg:pb-1 lg:gap-4 bg-white rounded-lg border border-gray-200">
        <header
          className={cn(
            "p-5 lg:pb-5 px-6 w-full flex flex-row justify-between items-start gap-20",
            filtered.length < 2 ? "pb-2" : "pb-5"
          )}
        >
          <div className="flex flex-col items-start justify-start gap-0">
            <h3 className="font-semibold text-lg text-gray-800">
              Band Score Trend
            </h3>
            <p className="text-xs font-medium text-gray-600">
              Track you speaking band score progress
            </p>
          </div>
          <Link href={"#"}>
            <p className="font-medium text-xs text-gray-800 p-1 hover:text-gray-700 active:text-gray-700">
              More
            </p>
          </Link>
        </header>
        <ChartContainer
          config={chartConfig}
          className={cn(
            "aspect-auto lg:min-h-[224px] w-full px-2 lg:px-4 pb-5",
            filtered.length < 2 ? "min-h-[160px]" : "h-[160px]"
          )}
        >
          {filtered.length < 2 ? (
            <BandScoreFallback />
          ) : (
            <LineChart
              accessibilityLayer
              data={lastTen}
              margin={{ left: 0, right: 30 }}
            >
              <YAxis
                domain={[3, 9]} // Sets min and max values for the axis
                tickCount={6} // Number of ticks
                tickLine={false}
                tickMargin={20}
                axisLine={false}
                minTickGap={2}
                tickFormatter={(value) => value.toFixed(1)} // Format tick labels
              />
              <XAxis
                dataKey="test"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                minTickGap={20}
                //   tickFormatter={(value) => {
                //     const date = new Date(value)
                //     return date.toLocaleDateString("en-US", {
                //       month: "short",
                //       day: "numeric",
                //     })
                //   }}
              />
              <Line
                type="monotone"
                dataKey="bandScore"
                stroke={chartConfig.bandScore.color}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <CartesianGrid vertical={false} />
            </LineChart>
          )}
        </ChartContainer>
      </div>
    </section>
  );
}
