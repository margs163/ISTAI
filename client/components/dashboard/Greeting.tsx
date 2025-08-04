import { ExternalLink, File, FileInput, Flame } from "lucide-react";
import React from "react";
import ButtonSecondary from "../home/ButtonSecondary";
import MainButton from "../MainButton";

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
        <div className=" rounded-xl flex flex-row items-center gap-2 lg:pr-6">
          <Flame
            className="fill-orange-500 text-orange-600 size-8 lg:size-9"
            strokeWidth={3}
          />
          <div className="">
            <p className="text-xs lg:text-sm text-gray-600">Daily Streak</p>
            <h3 className="text-base lg:text-lg lg:leading-[1.45] font-semibold text-gray-800">
              0 Days Streak
            </h3>
          </div>
        </div>
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
