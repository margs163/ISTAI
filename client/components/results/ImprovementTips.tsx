import {
  BookOpen,
  Brain,
  CircleCheck,
  Lightbulb,
  LucideProps,
  MessageSquare,
  Volume2,
  Zap,
} from "lucide-react";
import React from "react";

const strongPoints = [
  {
    title: "Fluency",
    icon: MessageSquare,
    aspects: [
      "Practice speaking for 2-3 minutes without stopping",
      "Use linking words to connect ideas smoothly",
      "Record yourself to identify hesitation patterns",
    ],
  },
  {
    title: "Lexical Resource",
    icon: BookOpen,
    aspects: [
      "Learn topic-specific vocabulary daily",
      "Practice paraphrasing common words",
      "Use collocations and idiomatic expressions",
    ],
  },
  {
    title: "Grammatical Range",
    icon: Brain,
    aspects: [
      "Practice complex sentence structures",
      "Focus on conditional and subjunctive forms",
      "Review tense consistency in narratives",
    ],
  },
  {
    title: "Pronunciation",
    icon: Volume2,
    aspects: [
      "Practice word stress patterns daily",
      "Work on consonant clusters",
      "Use pronunciation apps for feedback",
    ],
  },
];

export function Tip({
  aspect,
}: {
  aspect: {
    title: string;
    icon: React.ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
    >;
    aspects: string[];
  };
}) {
  const Icon = aspect.icon;
  return (
    <div className="border border-blue-200 p-4 lg:p-6 rounded-lg">
      <div className="space-y-4">
        <div className="flex flex-row items-center gap-2">
          <Icon className="text-blue-600 size-6 lg:size-7" strokeWidth={1.8} />
          <h3 className="font-semibold text-base lg:text-lg  text-gray-800">
            {aspect.title}
          </h3>
        </div>
        <ul className="flex flex-col gap-1 lg:gap-2 pl-0.5">
          {aspect.aspects.map((it, ind) => (
            <li key={ind} className="flex flex-row items-center gap-2">
              <Zap className="text-blue-500 size-5" />
              <p className="text-sm font-normal lg:font-normal lg:text-base text-gray-600">
                {it}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function ImprovementTips() {
  return (
    <section className="w-full px-6 lg:px-20 xl:px-36 shadow-none mb-8 lg:mb-16">
      <div className="p-6 lg:p-8 border border-gray-200 rounded-lg bg-white flex flex-col gap-6 shadow-none">
        <header className="flex flex-row items-center gap-2">
          <Lightbulb className="size-6 text-blue-600" strokeWidth={1.8} />
          <h3 className="font-semibold lg:text-xl text-gray-800 text-lg">
            General Improvement Tips
          </h3>
        </header>
        <main className="flex flex-col gap-4 lg:gap-8 lg:grid lg:grid-cols-2">
          {strongPoints.map((item, index) => (
            <Tip key={index} aspect={item} />
          ))}
        </main>
      </div>
    </section>
  );
}
