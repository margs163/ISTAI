import MainButton from "@/components/MainButton";
import { cn, getLevelStyle } from "@/lib/utils";
import { Award, FileInput } from "lucide-react";
import React from "react";

export default function TestHeader({
  testName,
  testID,
  overallBand,
  handleExport,
}: {
  testName: string;
  testID: string;
  overallBand: number;
  handleExport: () => void;
}) {
  return (
    <section className="w-full flex flex-row justify-between items-center px-2 mb-2 lg:pt-6 rounded-lg bg-transparent border-slate-200/80">
      <div className="space-y-2">
        <h1 className="text-xl lg:text-3xl font-semibold text-gray-800">
          Speaking Test - {testName}
        </h1>
        <p className="text-xs lg:text-sm font-medium text-balance text-gray-600">
          Test ID: {testID}
        </p>
        <MainButton
          onClick={handleExport}
          variant="secondary"
          className={
            "bg-white border no-print border-gray-200 hover:bg-gray-50 active:bg-gray-50 hidden lg:flex ml-0 mt-4"
          }
        >
          <FileInput className=" text-gray-700 size-4.5" />
          Export PDF
        </MainButton>
      </div>
      <div className="flex flex-row gap-4 items-center">
        <div className="space-y-1">
          <h3
            className={cn(
              getLevelStyle(overallBand),
              "text-4xl font-bold text-end tracking-wider"
            )}
          >
            {overallBand.toFixed(1)}
          </h3>
          <p className="text-xs font-medium text-green-700 bg-green-50 px-2 py-1 border border-green-200 rounded-md">
            Overall Score
          </p>
        </div>
        <div className="p-4 bg-blue-500 rounded-full hidden lg:block">
          <Award className="text-white size-9 box-content" />
        </div>
      </div>
    </section>
  );
}
