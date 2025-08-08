import Image, { StaticImageData } from "next/image";
import React from "react";
import feature1 from "@/assets/images/sentenceImrpovements.png";
import feature2 from "@/assets/images/repeatedWords.png";
import feature3 from "@/assets/images/pronunIssues.png";
import feature4 from "@/assets/images/tips.png";

const powerful = [
  {
    src: feature1,
    alt: "sentenceImrpovements",
    title: "Specific Sentence Improvements",
    description:
      "We analyze your speech and provide detailed examples with possible improvements",
  },
  {
    src: feature2,
    alt: "repeatedWords",
    title: "Analysis of Word Repetitions",
    description:
      "We analyze your speech and identify word repetitions, suggest synonyms",
  },
  {
    src: feature3,
    alt: "pronunIssues",
    title: "Word Pronunciation Issues",
    description:
      "We analyze your speech and correct your word pronunciation mistakes",
  },
  {
    src: feature4,
    alt: "tips",
    title: "Speech Enhancement Tips",
    description: "We give recommendations on individual criterion improvements",
  },
];

export function Feature({
  src,
  alt,
  title,
  description,
}: {
  src: StaticImageData;
  alt: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-6 lg:gap-8 items-start justify-start lg:max-w-[500px]">
      <div className="p-6 lg:p-8 lg:pb-2 pb-2 bg-gray-50 rounded-lg">
        <Image
          src={src}
          alt={alt}
          className="max-w-full max-h-[240px] lg:max-h-[320px] object-cover object-top rounded-sm shadow-md lg:shadow-lg shadow-gray-200/60"
        />
      </div>
      <div className="space-y-2 lg:px-1">
        <h3 className="text-xl lg:text-2xl font-semibold text-gray-800">
          {title}
        </h3>
        <p className="text-gray-600 lg:text-gray-500 text-sm lg:text-base lg:font-medium font-normal">
          {description}
        </p>
      </div>
    </div>
  );
}

export default function PowerfulFeatures() {
  return (
    <section className=" w-full flex flex-col items-center justify-center p-8 py-10 lg:px-20 xl:px-42 lg:py-20 gap-10 lg:gap-20">
      <header className="space-y-2 lg:space-y-4">
        <h1 className="font-bold text-3xl lg:text-5xl text-gray-800 text-center leading-[1.3]">
          Powerful Test <br className="lg:block hiddden" />
          <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl">
            Analysis
          </span>{" "}
          Features
        </h1>
        <p className="text-center font-medium tracking-tight leading-relaxed text-sm lg:text-lg text-gray-600 px-8 lg:max-w-[500px]">
          Features built to help you analyze your Speaking skills and identify
          mistakes.
        </p>
      </header>
      <main className="flex flex-col gap-8 lg:gap-24 lg:w-full lg:justify-items-center lg:grid lg:grid-cols-2">
        {powerful.map((item, index) => (
          <Feature key={index} {...item} />
        ))}
      </main>
    </section>
  );
}
