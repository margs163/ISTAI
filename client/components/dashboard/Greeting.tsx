import { ExternalLink, File, FileInput, Flame } from "lucide-react";
import React from "react";
import MainButton from "../MainButton";
import DailyStreak from "./DailyStreak";

const currentDate = new Date();

export default function Greeting() {
  return (
    <section className="w-full px-6 pl-8 flex flex-row justify-between items-center">
      <div>
        <p className="text-sm font-normal text-gray-600">
          {currentDate.toDateString()}
        </p>
        <h2 className="text-xl lg:text-2xl font-gray-800 font-semibold">
          {currentDate.getHours() > 12 && currentDate.getHours() < 18
            ? "Good Day!"
            : currentDate.getHours() > 6 && currentDate.getHours() < 12
            ? "Good Morning!"
            : "Good Evening!"}{" "}
          John
        </h2>
      </div>
      <div className="flex flex-row gap-4 items-end lg:px-1">
        <DailyStreak />
        <MainButton
          variant="secondary"
          className={
            "bg-white border border-gray-200 hover:bg-gray-50 active:bg-gray-50 hidden lg:flex"
          }
        >
          <ExternalLink className=" text-gray-700 size-4.5" />
          Share
        </MainButton>
        <MainButton
          variant="secondary"
          className={
            "bg-white border border-gray-200 hover:bg-gray-50 active:bg-gray-50 hidden lg:flex"
          }
        >
          <FileInput className=" text-gray-700 size-4.5" />
          Export
        </MainButton>
      </div>
    </section>
  );
}
