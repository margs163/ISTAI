import Image from "next/image";
import React from "react";
import phoneMain from "@/assets/images/phoneEdited1.png";
import phoneMain2 from "@/assets/images/phoneEdited2.png";

export default function TestInfo() {
  return (
    <section className="w-full flex flex-col items-center p-8 lg:p-20 gap-8 lg:flex-row lg:gap-12 xl:gap-20 max-w-[1400px] mx-auto">
      <div className="space-y-4 lg:space-y-10 hidden lg:block lg:flex-1/2 lg:p-8">
        <h2 className="font-semibold text-3xl lg:text-5xl lg:font-semibold">
          Our AI powered Test Simulator is Ideal for Preparation
        </h2>
        <p className="text-sm font-normal text-gray-700 leading-relaxed tracking-wide lg:text-base lg:font-medium lg:max-w-[540px]">
          Our AI-powered IELTS Speaking Test Simulator is designed to closely
          mirror the official exam experience. You&apos;ll practice with
          authentic question types, strict timing, and realistic test scenarios,
          just like the real IELTS Speaking Test.
        </p>
        <div className="flex flex-row items-start justify-start gap-8 lg:gap-16 mt-6 lg:mt-16">
          <div className="space-y-2">
            <h2 className="text-4xl lg:text-6xl font-semibold">80%</h2>
            <p className="text-xs lg:text-lg lg:font-medium">
              times band score increase{" "}
            </p>
          </div>
          <div className="space-y-2">
            <h2 className="text-4xl lg:text-6xl font-semibold">95%</h2>
            <p className="text-xs lg:text-lg lg:font-medium">
              score prediction accuracy
            </p>
          </div>
        </div>
      </div>
      <div className="grad-bg p-6 lg:p-2 rounded-3xl lg:rounded-4xl h-[300px] lg:h-[500px] max-w-[580px] overflow-hidden flex flex-row justify-center gap-0 lg:flex-1/2 xl:flex-1/2 lg:pt-12">
        <Image
          src={phoneMain2}
          alt="phoneDamn"
          className="min-h-[360px] w-auto lg:min-h-[500px] rounded-3xl xl:rounded-4xl relative left-14 lg:left-20 -bottom-16"
        />
        <Image
          src={phoneMain}
          alt="phoneDamn"
          className="min-h-[360px] w-auto lg:min-h-[540px] rounded-3xl xl:rounded-4xl relative right-14 lg:right-20"
        />
      </div>
      <div className="space-y-4 lg:hidden max-w-[500px]">
        <h2 className="font-semibold text-3xl">
          Our AI powered Test Simulator is Ideal for Preparation
        </h2>
        <p className="text-xs font-normal text-gray-700 leading-relaxed tracking-wide">
          Our AI-powered IELTS Speaking Test Simulator is designed to closely
          mirror the official exam experience. You’ll practice with authentic
          question types, strict timing, and realistic test scenarios, just like
          the real IELTS Speaking Test.
        </p>
        <div className="flex flex-row items-start justify-start gap-8 mt-6">
          <div>
            <h2 className="text-4xl font-semibold">80%</h2>
            <p className="text-xs">times band score increase </p>
          </div>
          <div>
            <h2 className="text-4xl font-semibold">95%</h2>
            <p className="text-xs">score prediction accuracy</p>
          </div>
        </div>
      </div>
    </section>
  );
}
