import { Award, BadgePlus, Mic } from "lucide-react";
import React from "react";

export default function Advantages() {
  return (
    <section className=" w-full flex flex-col items-center justify-center p-8 py-10 lg:px-20 xl:px-40 lg:py-20 gap-10 lg:gap-20">
      <h1 className="font-bold text-3xl lg:text-5xl text-gray-800 text-center leading-[1.3]">
        Smart AI Emulator with <br className="hidden lg:inline-block" />
        <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl">
          Real
        </span>{" "}
        Test Conditions
      </h1>
      <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 lg:gap-16">
        <div className="flex flex-col gap-4 lg:gap-8 items-center justify-start px-6">
          <BadgePlus className="size-8 lg:size-12 shrink-0 box-content p-3 lg:p-5 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full text-white shadow-lg shadow-purple-200" />
          <div className="text-center space-y-2">
            <h2 className="font-semibold text-xl lg:text-2xl">
              Create a Free Account
            </h2>
            <p className="text-sm font-normal text-gray-700 lg:text-base lg:font-medium">
              Sign Up in seconds no credit card needed and teams add
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-4 lg:gap-8 items-center justify-start px-6">
          <Mic className="size-8 lg:size-12 shrink-0 box-content p-3 lg:p-5 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full text-white shadow-lg shadow-purple-200" />
          <div className="text-center space-y-2">
            <h2 className="font-semibold text-xl lg:text-2xl">
              Pass a Practice Test
            </h2>
            <p className="text-sm font-normal text-gray-700 lg:text-base lg:font-medium">
              Pass your first practice test including all the official parts
              from the test
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-4 lg:gap-8 items-center justify-start px-6">
          <Award className="size-8 lg:size-12 shrink-0 box-content p-3 lg:p-5 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full text-white shadow-lg shadow-purple-200" />
          <div className="text-center space-y-2">
            <h2 className="font-semibold text-xl lg:text-2xl">
              Analyze your score
            </h2>
            <p className="text-sm font-normal text-gray-700 lg:text-base lg:font-medium">
              Reflect on your score and feedback with comprehensive analysis
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
