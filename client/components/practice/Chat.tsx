import { cn } from "@/lib/utils";
import {
  ClosedCaption,
  MessageSquareText,
  Speaker,
  User,
  Volume2,
} from "lucide-react";
import React from "react";

type ChatMessageType = {
  sender: "AI" | "User";
  senderName: string;
  message: string;
};

const chatMessages: ChatMessageType[] = [
  {
    sender: "AI",
    senderName: "Ron",
    message:
      "Hello, my name is Ron and I will be your test examiner today! Can you please start by introducing yourself",
  },
  {
    sender: "User",
    senderName: "John",
    message: "Click the microphone to start speaking",
  },
  {
    sender: "User",
    senderName: "John",
    message: "Hello, my name is Daniyal",
  },
];

export function ChatMessage({
  message,
  prev,
}: {
  message: ChatMessageType;
  prev?: "User" | "AI" | undefined;
}) {
  if (message.sender === "AI") {
    return (
      <div
        className={cn(
          "rounded-lg px-4 py-3 bg-indigo-500/95 flex flex-col gap-2 ml-auto max-w-[240px]",
          prev && prev !== message.sender && "mt-4"
        )}
      >
        <div className="flex flex-row gap-2 items-center justify-start">
          <Volume2 className="size-4 text-white" />
          <h3 className="text-sm font-medium text-white">
            {message.senderName + " (AI Examiner)"}
          </h3>
        </div>
        <p className="text-sm font-normal text-gray-100">{message.message}</p>
      </div>
    );
  }
  return (
    <div
      className={cn(
        "rounded-lg px-4 py-3 bg-gray-100 flex flex-col gap-2 mr-auto max-w-[240px]",
        prev && prev !== message.sender && "mt-4"
      )}
    >
      <div className="flex flex-row gap-2 items-center justify-start">
        <User className="size-4 text-gray-500" />
        <h3 className="text-sm font-medium text-gray-800">{"Your Response"}</h3>
      </div>
      <p className="text-sm font-normal text-gray-800">{message.message}</p>
    </div>
  );
}

export default function Chat() {
  return (
    <section className="p-6 py-0 max-w-[600px] lg:px-0">
      <div className="p-4 pb-6 rounded-xl border border-gray-200 space-y-4 bg-white">
        <header className="p-2 flex flex-row items-center gap-2">
          <MessageSquareText className="size-6 text-indigo-600" />
          <h3 className="font-semibold text-gray-800 text-lg">
            Test Transcription
          </h3>
        </header>
        <main className="flex flex-col gap-2 items-center max-h-[250px] overflow-y-scroll px-3">
          {chatMessages.map((item, index) => (
            <ChatMessage
              message={item}
              key={index}
              prev={index - 1 >= 0 ? chatMessages[index - 1].sender : undefined}
            />
          ))}
        </main>
      </div>
    </section>
  );
}
