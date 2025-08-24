import { StrongPointsType } from "@/lib/types";
import {
  BookOpen,
  Brain,
  CircleCheck,
  LucideProps,
  MessageSquare,
  Volume2,
} from "lucide-react";
import React from "react";

export function StrongSide({
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
    <div className="border border-green-300 bg-white p-4 rounded-lg">
      <div className="space-y-4">
        <div className="flex flex-row items-center gap-2">
          <Icon className="text-green-600" strokeWidth={1.8} />
          <h3 className="font-semibold text-base text-gray-800">
            {aspect.title}
          </h3>
        </div>
        <ul className="flex flex-col gap-1 pl-0.5">
          {aspect.aspects.map((it, ind) => (
            <li key={ind} className="flex flex-row items-start gap-2">
              <CircleCheck className="fill-green-500 text-white size-4.5 box-content shrink-0" />
              <p className="text-sm leading-[1.5] font-normal text-gray-600">
                {it}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function DialogStrongSides({
  strongSides,
}: {
  strongSides: StrongPointsType;
}) {
  const mappedStrongSides = [
    {
      title: "Fluency",
      icon: MessageSquare,
      aspects: strongSides?.fluency ?? ["aspcet"],
    },
    {
      title: "Grammatical Range",
      icon: BookOpen,
      aspects: strongSides?.grammar ?? ["aspect"],
    },
    {
      title: "Lexical Resource",
      icon: Brain,
      aspects: strongSides?.lexis ?? ["aspect"],
    },
    {
      title: "Pronunciation",
      icon: Volume2,
      aspects: strongSides?.pronunciation ?? ["aspect"],
    },
  ];
  return (
    <section className="w-full">
      <div className="p-6 lg:p-8 border border-gray-200 rounded-lg bg-white/60 flex flex-col gap-6 shadow-none">
        <header className="flex flex-row items-center gap-2">
          <CircleCheck className="size-6 text-green-600" strokeWidth={1.8} />
          <h3 className="font-semibold lg:text-lg text-gray-800 text-lg">
            Good Job with
          </h3>
        </header>
        <main className="flex flex-col gap-4 lg:gap-6">
          {mappedStrongSides.map((item, index) => (
            <StrongSide key={index} aspect={item} />
          ))}
        </main>
      </div>
    </section>
  );
}
