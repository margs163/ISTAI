import React from "react";
import result1 from "@/assets/images/phoneResult1.png";
import result2 from "@/assets/images/phoneResult2.png";
import Image from "next/image";
import { BookMarked, BookOpen, Megaphone, Mic } from "lucide-react";
import Criteria from "./Criteria";

const criteria = [
  {
    criterion: "Fluency & Coherence",
    description: "",
    icon: Megaphone,
    color: "indigo",
  },
  {
    criterion: "Grammatical Range",
    description: "",
    icon: BookOpen,
    color: "indigo",
  },
  {
    criterion: "Lexical Resource",
    description: "",
    icon: BookMarked,
    color: "indigo",
  },
  {
    criterion: "Pronunciation",
    description: "",
    icon: Mic,
    color: "indigo",
  },
];

export default function FeedbackInfo() {
  return (
    <section className="w-full flex flex-col items-center p-8 lg:p-20 gap-8 lg:flex-row lg:gap-12 xl:gap-20 max-w-[1400px] mx-auto">
      <div className="grad-bg p-6 lg:p-2 rounded-3xl lg:rounded-4xl h-[300px] lg:h-[500px] lg:max-w-[580px] overflow-hidden flex flex-row justify-center gap-0 lg:flex-1/2 xl:flex-1/2 lg:pt-12">
        <Image
          src={result2}
          alt="phoneDamn"
          className="min-h-[360px] w-auto lg:min-h-[500px] rounded-3xl xl:rounded-4xl relative left-14 lg:left-20 -bottom-16"
        />
        <Image
          src={result1}
          alt="phoneDamn"
          className="min-h-[360px] w-auto lg:min-h-[540px] rounded-3xl xl:rounded-4xl relative right-14 lg:right-20"
        />
      </div>
      <div className="space-y-8 lg:space-y-10 lg:block lg:flex-1/2 lg:p-8">
        <h2 className="font-semibold text-3xl lg:text-5xl lg:font-semibold">
          Comperehensive Analysis of Your Speech
        </h2>
        <p className="text-xs font-normal text-gray-700 leading-relaxed tracking-wide lg:text-base lg:font-medium lg:max-w-[540px]">
          Our simulator evaluates your speaking performance across official
          IELTS criteria, providing clear insights into your strengths and areas
          for improvement. With instant, actionable feedback and detailed
          analysis, you can track your progress and maximize your score.
        </p>
        <div className="flex flex-row lg:grid lg:grid-cols-2 item-stretch justify-stretch flex-wrap gap-4">
          {criteria.map((item, index) => {
            return (
              <Criteria
                key={index}
                criterion={item.criterion}
                description={item.description}
                color={item.color}
                icon={item.icon}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
