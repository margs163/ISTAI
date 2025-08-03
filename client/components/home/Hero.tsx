import React from "react";
import Tag from "./Tag";
import ButtonPrimary from "./ButtonPrimary";
import ButtonSecondary from "./ButtonSecondary";
import phoneImage from "@/assets/images/phoneISTAI.png";
import tabletImage from "@/assets/images/tabletISTAI.png";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="flex flex-col gap-4 justify-center items-center px-2 relative mb-52 lg:mb-84">
      <Tag className="lg:text-sm lg:px-4 lg:py-2 lg:rounded-3xl to-indigo-500">
        Speak with Confidence
      </Tag>
      <div className="flex flex-col gap-4 lg:gap-5 lg:max-w-[1000px] xl:max-w-[1200px] px-4 md:px-20">
        <h1 className="font-bold text-5xl lg:text-[6rem] text-gray-800 tracking-tighter text-center leading-[1.05]">
          Master <span className="text-gray-800">IELTS</span> Speaking with Real
          Practice
        </h1>
        <p className="text-center font-medium tracking-tight leading-relaxed text-base lg:text-lg text-gray-800 px-8">
          Practice your speaking by using our AI powered IELTS test simulator.
          <span className="hidden lg:inline">
            <br />
            Get instant feedback and improve your score with realistic practice
            sessions.
          </span>
        </p>
      </div>
      <div className="mt-4 lg:mt-6 lg:space-x-4 space-x-2">
        <Link href={"/signup"}>
          <ButtonPrimary>Start Free Trial</ButtonPrimary>
        </Link>
        <Link href={"/signup"}>
          <ButtonSecondary>See How it Works</ButtonSecondary>
        </Link>
      </div>
      <div className="flex flex-row gap-2 items-center justify-center absolute w-full mt-8 px-3 -bottom-88 lg:-bottom-160">
        <Image
          src={tabletImage}
          className=" w-84 lg:w-[540px] rounded-xl relative -right-20 lg:-right-4 lg:-top-18 shadow-md"
          alt="phoneIstai"
        />
        <Image
          src={phoneImage}
          className=" w-40 lg:w-[290px] rounded-[1.7rem] relative -left-20 z-10 shadow-md"
          alt="phoneIstai"
        />
      </div>
    </section>
  );
}
