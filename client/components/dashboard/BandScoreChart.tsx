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

const chartData = [
  { test: 1, bandScore: 5.0 },
  { test: 2, bandScore: 6.0 },
  { test: 3, bandScore: 6.0 },
  { test: 4, bandScore: 6.5 },
  { test: 5, bandScore: 5.5 },
  { test: 6, bandScore: 6.5 },
  { test: 7, bandScore: 7.0 },
];

const chartConfig = {
  bandScore: {
    label: "Practice test",
    color: "var(--color-indigo-600)",
  },
} satisfies ChartConfig;

export default function BandScoreChart() {
  return (
    <section className="px-6 lg:px-0 w-full flex flex-col gap-4">
      <div className=" w-full flex flex-col gap-4 bg-white rounded-lg border border-gray-200 h-full">
        <header className="p-5 px-6 w-full flex flex-row justify-between items-start gap-20">
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
          className="aspect-auto h-[160px] my-auto lg:min-h-[200px] w-full px-2 lg:px-4 pb-5"
        >
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 0, right: 28 }}
          >
            <YAxis
              domain={[4, 7.5]} // Sets min and max values for the axis
              tickCount={5} // Number of ticks
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
        </ChartContainer>
      </div>
    </section>
  );
}
