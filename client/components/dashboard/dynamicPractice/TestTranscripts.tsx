import MainButton from "@/components/MainButton";
import { TestTranscriptionsType, TranscriptionMessageType } from "@/lib/types";
import { cn, parseTimeInt } from "@/lib/utils";
import { Download } from "lucide-react";
import React from "react";

const fallback = [
  {
    part: "Part 1",
    title: "Introduction and Interview",
    duration: 400,
    texts: [
      {
        name: "Assistant",
        text: "Hello, my name is Sarah. Can you tell me your full name please?",
        time: 300,
      },
      { name: "User", text: "Hi, my name is John Smith.", time: 302 },
      {
        name: "Assistant",
        text: "Thank you. Can I see your identification please?",
        time: 305,
      },
      { name: "User", text: "Yes, here is my passport.", time: 307 },
      {
        name: "Assistant",
        text: "Perfect. Now, let's talk about your hometown. Where are you from?",
        time: 310,
      },
      {
        name: "User",
        text: "I'm from Manchester, which is in the north of England. It's a quite large city with about 500,000 people.",
        time: 320,
      },
    ],
  },
  {
    part: "Part 2",
    title: "Long Turn",
    duration: 500,
    texts: [
      {
        name: "Assistant",
        text: "Now I'm going to give you a topic and I'd like you to talk about it for one to two minutes. Here's your topic card.",
        time: 450,
      },
      { name: "User", text: "Thank you.", time: 455 },
      {
        name: "Assistant",
        text: "You have one minute to think about what you're going to say. You can make some notes if you wish. Do you understand?",
        time: 460,
      },
      { name: "User", text: "Yes, I understand.", time: 465 },
      {
        name: "User",
        text: "I'd like to talk about my favorite book, which is '1984' by George Orwell. I first read this book when I was in university, about five years ago. It was recommended by my English literature professor...",
        time: 470,
      },
    ],
  },
  {
    part: "Part 3",
    title: "Discussion",
    duration: 500,
    texts: [
      {
        name: "Assistant",
        text: "We've been talking about books and reading. I'd like to discuss with you one or two more general questions related to this topic.",
        time: 610,
      },
      { name: "User", text: "Okay, sounds good.", time: 605 },
      {
        name: "Assistant",
        text: "Do you think people read less nowadays compared to the past?",
        time: 620,
      },
      {
        name: "User",
        text: "That's an interesting question. I think in some ways yes, people might read fewer traditional books, but they're reading more online content, social media posts, and digital articles...",
        time: 630,
      },
    ],
  },
];

function TestPart({
  part,
  transcriptions,
  title,
}: {
  part: 1 | 2 | 3;
  transcriptions: TranscriptionMessageType[];
  title: string;
}) {
  console.log(transcriptions.at(1)?.time);
  return (
    <div className="p-5 rounded-lg border border-gray-200/80 bg-white space-y-4">
      <header className="flex flex-row gap-2 items-center">
        <h3 className="px-2 py-1 rounded-lg border border-blue-200 bg-blue-50 text-blue-600 text-xs">
          Part {part}
        </h3>
        <h2 className="text-sm font-medium text-gray-800">{title}</h2>
      </header>
      <main className="flex flex-col gap-6 items-start overflow-y-scroll max-h-[300px] py-2 px-1 pr-6">
        {transcriptions.map((item, index) => (
          <div
            key={index}
            className="flex flex-row gap-4 items-start justify-start"
          >
            <p className="text-xs text-gray-600 font-normal">
              {parseTimeInt(item.time)}
            </p>
            <div className="flex flex-col gap-2 items-start">
              <h3
                key={index}
                className={cn(
                  "px-2 py-1 rounded-sm text-xs",
                  item.name === "User"
                    ? "bg-green-50 text-green-600"
                    : "bg-purple-50 text-purple-600"
                )}
              >
                {item.name}
              </h3>
              <p className="text-sm font-normal text-gray-600">{item.text}</p>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}

export default function TestTranscripts({
  transcriptions,
}: {
  transcriptions?: TestTranscriptionsType | null;
}) {
  return (
    <section className="rounded-lg no-print p-6 lg:p-8 lg:col-span-2 flex flex-col gap-6 bg-white font-geist border border-slate-200/80">
      <header className="flex flex-row items-start justify-between">
        <h2 className="text-lg text-gray-800 font-semibold">
          Test Transcriptions
        </h2>
        <MainButton variant="secondary">
          <Download className="size-4" />
          <span className="text-xs font-medium font-geist">Export All</span>
        </MainButton>
      </header>
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <TestPart
          part={1}
          title="Introduction and Interview"
          transcriptions={transcriptions?.part_one ?? fallback[0].texts}
        />
        <TestPart
          part={2}
          title="Long Turn"
          transcriptions={transcriptions?.part_two ?? fallback[1].texts}
        />
        <TestPart
          part={3}
          title="Discussion"
          transcriptions={transcriptions?.part_three ?? fallback[2].texts}
        />
      </main>
    </section>
  );
}
