import { useLocalPracticeTestStore } from "@/lib/practiceTestStore";
import {
  BookOpen,
  Brain,
  CircleCheck,
  Info,
  LucideProps,
  MessageSquare,
  TriangleAlert,
  Volume2,
} from "lucide-react";
import React from "react";

export function WeakAspect({
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
    <div className="border border-amber-300 bg-white p-5 rounded-lg">
      <div className="space-y-4">
        <div className="flex flex-row items-center gap-2">
          <Icon
            className="text-amber-600 box-content shrink-0"
            strokeWidth={1.8}
          />
          <h3 className="font-semibold text-base text-gray-800">
            {aspect.title}
          </h3>
        </div>
        <ul className="flex flex-col gap-2 pl-0.5">
          {aspect.aspects.map((it, ind) => (
            <li key={ind} className="flex flex-row items-start gap-2">
              <Info className="fill-amber-500 text-white size-4.5 mt-0.5 box-content shrink-0" />
              <p className="text-sm font-normal text-gray-600">{it}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function WeakAspects() {
  const weakSides = useLocalPracticeTestStore(
    (state) => state.result?.weak_sides
  );
  const weakPoints = [
    {
      title: "Fluency",
      icon: MessageSquare,
      aspects: weakSides?.fluency ?? ["aspect"],
    },
    {
      title: "Grammatical Range",
      icon: BookOpen,
      aspects: weakSides?.grammar ?? ["aspect"],
    },
    {
      title: "Lexical Resource",
      icon: Brain,
      aspects: weakSides?.lexis ?? ["aspect"],
    },
    {
      title: "Pronunciation",
      icon: Volume2,
      aspects: weakSides?.pronunciation ?? ["aspect"],
    },
  ];
  return (
    <section className="w-full px-6 lg:px-0">
      <div className="p-6 lg:p-8 border border-gray-200 rounded-lg bg-white/60 flex flex-col gap-6 shadow-none">
        <header className="flex flex-row items-center gap-2">
          <TriangleAlert className="size-6 text-amber-600" strokeWidth={1.8} />
          <h3 className="font-semibold lg:text-xl text-gray-800 text-lg">
            Things to Improve
          </h3>
        </header>
        <main className="flex flex-col gap-4 lg:gap-6">
          {weakPoints.map((item, index) => (
            <WeakAspect key={index} aspect={item} />
          ))}
        </main>
      </div>
    </section>
  );
}
