import {
  BookOpen,
  Brain,
  CircleCheck,
  LucideProps,
  MessageSquare,
  Volume2,
} from "lucide-react";
import React from "react";

const strongPoints = [
  {
    title: "Fluency",
    icon: MessageSquare,
    aspects: [
      "Natural speech rhythm",
      "Minimal hesitation",
      "Good use of discourse markers",
    ],
  },
  {
    title: "Lexical Resource",
    icon: BookOpen,
    aspects: [
      "Appropriate vocabulary for context",
      "Some idiomatic expressions",
    ],
  },
  {
    title: "Grammatical Range",
    icon: Brain,
    aspects: ["Complex sentence structures", "Good tense usage"],
  },
  {
    title: "Pronunciation",
    icon: Volume2,
    aspects: ["Clear articulation", "Good word stress"],
  },
];

export function StrongAspect({
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
    <div className="border border-green-200 p-4 rounded-lg">
      <div className="space-y-4">
        <div className="flex flex-row items-center gap-2">
          <Icon className="text-green-600" strokeWidth={1.8} />
          <h3 className="font-semibold text-base text-gray-800">
            {aspect.title}
          </h3>
        </div>
        <ul className="flex flex-col gap-1 pl-0.5">
          {aspect.aspects.map((it, ind) => (
            <li key={ind} className="flex flex-row items-center gap-2">
              <CircleCheck className="fill-green-500 text-white size-4.5" />
              <p className="text-sm font-normal text-gray-600">{it}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function StrongAspects() {
  return (
    <section className="w-full px-6 lg:px-0">
      <div className="p-6 lg:p-8 border border-gray-200 rounded-lg bg-white flex flex-col gap-6 shadow-none">
        <header className="flex flex-row items-center gap-2">
          <CircleCheck className="size-6 text-green-600" strokeWidth={1.8} />
          <h3 className="font-semibold lg:text-xl text-gray-800 text-lg">
            Good Job with
          </h3>
        </header>
        <main className="flex flex-col gap-4 lg:gap-6">
          {strongPoints.map((item, index) => (
            <StrongAspect key={index} aspect={item} />
          ))}
        </main>
      </div>
    </section>
  );
}
