"use client";
import React from "react";
import { PolarAngleAxis, PolarGrid, Radar } from "recharts";
import { RadarChart as RChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import Link from "next/link";

const chartData = [
  { criterion: "Fluency", score: 7.0 },
  { criterion: "Cohesion", score: 6.5 },
  { criterion: "Pronunciation", score: 7.0 },
  { criterion: "Grammatical Range", score: 6.5 },
  { criterion: "Lexical Resource", score: 6.0 },
];

const chartConfig = {
  score: {
    label: "Score",
    color: "var(--color-indigo-200)",
  },
} satisfies ChartConfig;

export default function RadarChart() {
  return (
    <section className="px-6 lg:px-0 w-full flex flex-col gap-4">
      <div className=" w-full flex flex-col gap-6 bg-white rounded-lg border border-gray-200">
        <header className="p-5 px-6 w-full flex flex-row justify-between items-start gap-20">
          <div className="flex flex-col items-start justify-start gap-0">
            <h3 className="font-semibold text-lg text-gray-800">
              Criterion Features
            </h3>
            <p className="text-xs font-medium text-gray-600">
              Track you individual feature score
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
          className="aspect-square h-[160px] lg:min-h-[200px] w-full pl-6 pr-2 lg:px-4 pb-5 mx-auto"
        >
          <RChart data={chartData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey="criterion" />
            <PolarGrid />
            <Radar
              dataKey="score"
              fill="var(--color-indigo-600)"
              fillOpacity={0.6}
              dot={{
                r: 4,
                fillOpacity: 0.8,
              }}
            />
          </RChart>
        </ChartContainer>
      </div>
    </section>
  );
}
