"use client";

import { Mic, Pause, RotateCcw, X } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import PartInfo from "./PartInfo";
import Floater from "react-floater";
import { cn } from "@/lib/utils";
import QuestionCard from "./QuestionCard";
import { useTestSessionStore } from "@/lib/testSessionStore";
import { useLocalPracticeTestStore } from "@/lib/practiceTestStore";
import ReadingCard from "./ReadingCard";

export default function CharacterSection({
  activePart = 1,
  timerActive,
  setTimerActive,
  startRecording,
  stopRecording,
  isRecording,
  setIsRecording,
  videoRef,
  audioContext,
  volumeSliderRef,
  setPartTwoTime,
  partTwoTime,
  setControlsDialogOpen,
  setIsAnsweringQuestion,
  openReadingCard,
  setOpenReadingCard,
}: {
  activePart: 1 | 2 | 3;
  timerActive: boolean;
  setTimerActive: React.Dispatch<React.SetStateAction<boolean>>;
  startRecording: () => void;
  stopRecording: () => void;
  isRecording: boolean;
  setIsRecording: React.Dispatch<React.SetStateAction<boolean>>;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  audioContext: React.RefObject<AudioContext | null>;
  volumeSliderRef: React.RefObject<HTMLDivElement | null>;
  setPartTwoTime: React.Dispatch<React.SetStateAction<number>>;
  partTwoTime: number;
  setControlsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsAnsweringQuestion: React.Dispatch<React.SetStateAction<boolean>>;
  openReadingCard: boolean;
  setOpenReadingCard: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <section className="p-6 py-0 max-w-[600px] lg:mx-0 lg:max-w-max lg:px-0 lg:h-full">
      <div className="p-6 pb-3 rounded-xl border border-gray-200 flex flex-col justify-between bg-white lg:h-full">
        <div className="lg:grid grid-cols-[0.58fr_0.42fr] gap-4 items-start lg:mb-6">
          <div className="hidden lg:block">
            <PartInfo currentPart={activePart} />
          </div>
          <QuestionCard
            partTwoTime={partTwoTime}
            setPartTwoTime={setPartTwoTime}
            setTimerActive={setTimerActive}
            setIsAnsweringQuestion={setIsAnsweringQuestion}
          />
        </div>
        <Character
          videoRef={videoRef}
          openReadingCard={openReadingCard}
          setOpenReadingCard={setOpenReadingCard}
        />
        <TestControls
          volumeSliderRef={volumeSliderRef}
          isRecording={isRecording}
          setIsRecording={setIsRecording}
          startRecording={startRecording}
          stopRecording={stopRecording}
          activePart={activePart}
          audioContext={audioContext}
          timerActive={timerActive}
          setControlsDialogOpen={setControlsDialogOpen}
        />
      </div>
    </section>
  );
}

export function TestControls({
  activePart = 1,
  timerActive,
  isRecording,
  setIsRecording,
  startRecording,
  stopRecording,
  audioContext,
  volumeSliderRef,
  setControlsDialogOpen,
}: {
  activePart?: 1 | 2 | 3;
  timerActive: boolean;
  isRecording: boolean;
  setIsRecording: React.Dispatch<React.SetStateAction<boolean>>;
  startRecording: () => void;
  stopRecording: () => void;
  audioContext: React.RefObject<AudioContext | null>;
  volumeSliderRef: React.RefObject<HTMLDivElement | null>;
  setControlsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const setStatus = useTestSessionStore((state) => state.setStatus);
  const ToggleRecording = useCallback(async () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
    setIsRecording((prev) => {
      console.log("Toggled recording: ", isRecording);
      return !prev;
    });

    if (audioContext.current?.state !== "running") {
      await audioContext.current?.resume();
    }
  }, [
    isRecording,
    startRecording,
    stopRecording,
    audioContext,
    setIsRecording,
  ]);
  console.log("Timer is active:", timerActive);
  return (
    <div className="rounded-2xl pt-1.5 bg-white border border-gray-200 relative -top-2 fifth-step">
      <div className="p-4 flex flex-col gap-6">
        <div className="rounded-3xl w-full h-2 bg-gray-300">
          <div
            ref={volumeSliderRef}
            className={cn(
              " bg-indigo-400 h-full rounded-tl-3xl rounded-bl-3xl volume-slider"
            )}
          ></div>
        </div>
        <div className=" flex flex-row justify-center items-center gap-6">
          <button
            className="p-3 rounded-[50%] hover:bg-gray-100 active:bg-gray-100 transition-colors"
            onClick={() => {
              setStatus("inactive");
              setControlsDialogOpen(true);
            }}
          >
            <Pause size={22} className=" text-neutral-600" />
          </button>
          {activePart === 2 ? (
            <button
              disabled={timerActive}
              className={cn(
                isRecording
                  ? "p-4 rounded-[50%] transition-colors hover:bg-red-600 bg-red-500 text-gray-50 cursor-pointer"
                  : "p-4 rounded-[50%] transition-colors hover:bg-indigo-600 text-indigo-600 bg-indigo-50 hover:text-indigo-50 curor-pointer",
                timerActive &&
                  "bg-gray-100 text-gray-500 hover:bg-gray-100 hover:text-gray-500 cursor-not-allowed"
              )}
            >
              <Mic
                size={30}
                className="sm:w-8"
                onClick={async () => {
                  if (!timerActive) {
                    await ToggleRecording();
                  }
                }}
                aria-disabled={timerActive}
              />
            </button>
          ) : (
            <button
              className={cn(
                isRecording
                  ? "p-4 rounded-[50%] transition-colors hover:bg-red-600 bg-red-500 text-gray-50 cursor-pointer"
                  : "p-4 rounded-[50%] transition-colors hover:bg-indigo-600 text-indigo-600 bg-indigo-50 hover:text-indigo-50 curor-pointer",
                timerActive &&
                  "bg-gray-100 text-gray-500 hover:bg-gray-50 hover:text-gray-500 cursor-not-allowed"
              )}
            >
              <Mic size={30} className="sm:w-8" onClick={ToggleRecording} />
            </button>
          )}
          <button
            className="p-3 rounded-[50%] hover:bg-gray-100 active:bg-gray-100 transition-colors"
            onClick={() => setControlsDialogOpen(true)}
          >
            <X size={22} className=" text-neutral-600" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function Character({
  videoRef,
  openReadingCard,
  setOpenReadingCard,
}: {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  openReadingCard: boolean;
  setOpenReadingCard: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div className="relative -bottom-4 lg:-bottom-12 xl:-bottom-6 flex justify-center items-center">
      <Floater
        component={ReadingCard}
        open={openReadingCard}
        placement="center"
        styles={{
          floater: {
            borderRadius: 10,
          },
          arrow: {
            color: "#fff",
          },
        }}
        callback={(action, props) => {
          if (action === "close") setOpenReadingCard(false);
        }}
      />
      <video
        src={"/assisstant.mp4"}
        ref={videoRef}
        width={280}
        height={280}
        className="w-full lg:max-w-[300px] xl:max-w-[360px] object-cover"
        id="assistant-playback"
        controls={false}
      />
    </div>
  );
}
