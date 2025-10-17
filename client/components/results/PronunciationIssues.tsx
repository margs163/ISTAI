"use client";
import { useLocalPracticeTestStore } from "@/lib/practiceTestStore";
import { useWordsTTSStore } from "@/lib/ttsStore";
import { Info, Mic, Volume2 } from "lucide-react";
import React, { useCallback, useEffect, useRef } from "react";

export function PronunMistake({
  mistake,
  url,
}: {
  mistake: {
    word: string;
    accuracy: number;
    mistake_type: string;
    user_phonemes: string;
    correct_phonemes: string;
  };
  url?: string;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);

  const playCallback = useCallback(() => {
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current?.play();
    }
  }, []);

  useEffect(() => {
    if (!audioRef.current && url) {
      audioRef.current = new Audio(url);
    }
  }, [url]);

  return (
    <div className="flex flex-col gap-4 lg:gap-6 justify-start items-start p-6 lg:p-8 w-full bg-purple-50/50 border border-gray-200 rounded-md lg:flex-1/4">
      <div className="flex flex-row gap-3 items-center justify-start">
        <div
          className="flex items-center justify-center bg-purple-100 aria-disabled:bg-gray-100 aria-disabled:cursor-not-allowed rounded-full p-2.5 lg:px-3 lg:py-[13px] active:bg-purple-200/80 hover:bg-purple-200/80 transition-colors"
          onClick={playCallback}
          aria-disabled={!url}
        >
          <Volume2 className="text-purple-600 shrink-0 size-6 lg:size-7" />
        </div>
        <h3 className="text-base lg:text-lg font-medium">{mistake.word}</h3>
      </div>
      <div className="space-y-1">
        <div className="text-red-600 flex flex-row gap-2 justify-start items-center">
          <Info className="size-4" />
          <p className="font-normal text-sm lg:text-base">
            Issue: {mistake.user_phonemes}
          </p>
        </div>
        <div className="text-green-600 flex flex-row gap-2 justify-start items-center">
          <Info className="size-4" />
          <p className="font-normal text-sm lg:text-base">
            Correct: {mistake.correct_phonemes}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PronunciationIssues() {
  const pronunIssues = useLocalPracticeTestStore(
    (state) => state.result?.pronunciation_issues
  );
  const wordsTTS = useWordsTTSStore((state) => state.urls);
  return (
    <section className="w-full px-6 lg:px-20 xl:px-36">
      <div className="p-6 lg:p-8 border border-gray-200 rounded-lg bg-white flex flex-col gap-6 shadow-none">
        <header className="flex flex-row items-center gap-2">
          <Mic className="size-6 text-indigo-600" />
          <h3 className="font-semibold lg:text-xl text-gray-800 text-lg">
            Pronunciation Issues
          </h3>
        </header>
        <main className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:gap-6">
          {pronunIssues?.map((item, index) => (
            <PronunMistake
              url={
                wordsTTS.find(
                  (tts) => tts.word.toLowerCase() === item.word.toLowerCase()
                )?.url
              }
              mistake={item}
              key={index}
            />
          ))}
        </main>
      </div>
    </section>
  );
}
