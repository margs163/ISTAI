import { Info, Timer } from "lucide-react";
import React from "react";

const infoParts = {
  1: {
    title: "Part 1: Short Introduction & Interview",
    description:
      "In part 1, the examiner will first introduce themselves and ask you to confirm your own identity. They will then ask you some general questions on familiar topics such as home, family, work, studies and interests.",
    time: "4 - 5 min speaking",
  },
  2: {
    title: "Part 2: Individual Long Turn",
    description:
      "In Part 2, also known as the 'long turn', requires candidates to speak for 1-2 minutes on a given topic, following a one-minute preparation period. The examiner provides a task card with a specific topic and prompts to guide the candidate's response. ",
    time: "1 min prep + 2 min speaking",
  },
  3: {
    title: "Part 3: Further Dialog and Discussion",
    description:
      "In part 3 of the Speaking test the examiner will ask further questions which are connected to the topics discussed in part 2. This part of the test is designed to give you the opportunity to talk about more abstract issues and ideas.",
    time: "4 - 5 min speaking",
  },
};

export default function PartInfo({ currentPart }: { currentPart: 1 | 2 | 3 }) {
  return (
    <section className="p-6 py-0 max-w-[600px] lg:mx-0 lg:max-w-max lg:px-0">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 xl:px-7 flex flex-col gap-5 items-start justify-start">
        <div className="flex flex-row justify-start items-center gap-3">
          <div className="p-3 bg-blue-400 rounded-xl shrink-0">
            <Info className="text-white size-7" />
          </div>
          <h3 className="text-lg xl:text-xl font-semibold text-white w-full">
            {infoParts[currentPart].title}
          </h3>
        </div>
        <div className="flex flex-col items-start justify-start gap-6">
          <p className="text-sm xl:text-[0.92rem] font-normal text-gray-100 tracking-wide">
            {infoParts[currentPart].description}
          </p>
          <div className="flex flex-row gap-2 items-start">
            <Timer className="size-4.5 text-blue-100" />
            <p className="text-sm font-medium text-gray-100">
              {infoParts[currentPart].time}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
