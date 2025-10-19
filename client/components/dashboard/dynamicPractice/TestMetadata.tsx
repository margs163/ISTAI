import { parseTimeString } from "@/lib/utils";
import {
  Bot,
  Calendar,
  CircleCheck,
  Clock,
  SquareChartGantt,
  Target,
  TimerReset,
  User,
  UserCircle,
} from "lucide-react";
import { Assistant } from "next/font/google";
import React from "react";

export default function TestMetadata({
  status,
  partsFinished,
  testDate,
  testDuration,
  testAssistant,
  userName,
}: {
  status: string;
  partsFinished: number;
  testDate: Date;
  testDuration: number;
  testAssistant: string;
  userName: string;
}) {
  return (
    <section className="p-6 rounded-xl border border-slate-200/80 space-y-6 bg-white">
      <div className="flex flex-row items-center gap-2">
        <h3 className="font-semibold text-gray-800 text-lg">
          Test Session Info
        </h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 lg:grid-cols-5">
        <div className="flex flex-row items-center justify-start gap-3 rounded-lg bg-slate-50 p-3 px-4">
          <Calendar className="text-green-500 size-6" strokeWidth={1.8} />
          <div className="flex flex-col items-start justify-start gap-1">
            <p className="text-sm font-normal text-gray-600">Test Date</p>
            <h3 className="text-gray-800 rounded-md font-normal text-sm">
              {testDate.toDateString()}
            </h3>
          </div>
        </div>
        <div className="flex flex-row items-center justify-start gap-3 rounded-lg bg-slate-50 p-3 px-4">
          <Clock className="text-blue-500 size-6" strokeWidth={1.8} />
          <div className="flex flex-col items-start justify-start gap-1">
            <p className="text-sm font-normal text-gray-600">Test Status</p>
            <h3 className="text-gray-800 rounded-md font-normal text-sm">
              {parseTimeString(testDuration)}
            </h3>
          </div>
        </div>
        <div className="flex flex-row items-center justify-start gap-3 rounded-lg bg-slate-50 p-3 px-4">
          <User className="text-purple-500 size-6" strokeWidth={1.8} />
          <div className="flex flex-col items-start justify-start gap-1">
            <p className="text-sm font-normal text-gray-600">Test Status</p>
            <h3 className="text-gray-800 rounded-md font-normal text-sm">
              {userName}
            </h3>
          </div>
        </div>
        <div className="flex flex-row items-center justify-start gap-3 rounded-lg bg-slate-50 p-3 px-4">
          <Bot className="text-orange-500 size-6" strokeWidth={1.8} />
          <div className="flex flex-col items-start justify-start gap-1">
            <p className="text-sm font-normal text-gray-600">Test Status</p>
            <h3 className="text-gray-800 rounded-md font-normal text-sm">
              {testAssistant}
            </h3>
          </div>
        </div>
        <div className="flex flex-row items-center justify-start gap-3 rounded-lg bg-slate-50 p-3 px-4">
          <CircleCheck className="text-green-500 size-6" strokeWidth={1.8} />
          <div className="flex flex-col items-start justify-start gap-1">
            <p className="text-sm font-normal text-gray-600">Test Status</p>
            <h3 className="text-green-600 px-2 py-0.5 rounded-md font-normal text-sm bg-green-100">
              {status}
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
}
