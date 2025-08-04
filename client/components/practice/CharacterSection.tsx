"use client";

import { Mic, RotateCcw, X } from "lucide-react";
import React, { useRef, useState } from "react";
import PartInfo from "./PartInfo";
import QuickActions from "../dashboard/QuickActions";
import QuickTestActions from "./QuickTestActions";

export default function CharacterSection({
  activePart = 1,
  timerActive = false,
}: {
  activePart?: 1 | 2 | 3;
  timerActive: boolean;
}) {
  const [isRecording, setIsRecording] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  return (
    <section className="p-6 py-0 max-w-[600px] lg:mx-0 lg:max-w-max lg:px-0 lg:h-full">
      <div className="p-6 pb-3 rounded-xl border border-gray-200 flex flex-col justify-between bg-white lg:h-full">
        <div className="hidden lg:block lg:mb-6">
          <PartInfo currentPart={2} />
        </div>
        <Character videoRef={videoRef} />
        <TestControls
          isRecording={isRecording}
          setIsRecording={setIsRecording}
          activePart={activePart}
          timerActive={timerActive}
        />
      </div>
    </section>
  );
}

export function TestControls({
  activePart = 1,
  timerActive = true,
  isRecording,
  setIsRecording,
}: {
  activePart?: 1 | 2 | 3;
  timerActive: boolean;
  isRecording: boolean;
  setIsRecording: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div className="rounded-2xl pt-1.5 bg-white border border-gray-200 relative -top-2">
      <div className="p-4 flex flex-col gap-6">
        <div className="rounded-3xl w-full h-2 bg-gray-300">
          <div className="w-1/2 bg-indigo-400 h-full rounded-tl-3xl rounded-bl-3xl volume-slider"></div>
        </div>
        <div className=" flex flex-row justify-center items-center gap-6">
          <button className="p-3 rounded-[50%] hover:bg-gray-100 active:bg-gray-100 transition-colors">
            <RotateCcw size={22} className=" text-neutral-600" />
          </button>
          {activePart === 2 ? (
            <button
              disabled={timerActive ? true : false}
              className={
                isRecording
                  ? `p-4 bg-red-500 rounded-[50%] hover:bg-red-600 text-gray-50 transition-colors ${
                      timerActive ? "cursor-not-allowed" : "cursor-pointer"
                    }`
                  : `p-4 bg-indigo-50 rounded-[50%] text-indigo-600 ${
                      timerActive ? "cursor-not-allowed" : "cursor-pointer"
                    }`
              }
            >
              <Mic
                size={30}
                className="sm:w-8"
                onClick={() => setIsRecording(!isRecording)}
              />
            </button>
          ) : (
            <button
              className={
                isRecording
                  ? "p-4 bg-red-500 rounded-[50%] hover:bg-red-600 text-gray-50 cursor-pointer transition-colors"
                  : "p-4 bg-indigo-50 rounded-[50%] hover:bg-indigo-600 text-indigo-600 hover:text-indigo-50 cursor-pointer transition-colors"
              }
            >
              <Mic
                size={30}
                className="sm:w-8"
                onClick={() => () => setIsRecording(!isRecording)}
              />
            </button>
          )}
          <button className="p-3 rounded-[50%] hover:bg-gray-100 active:bg-gray-100 transition-colors">
            <X size={22} className=" text-neutral-600" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function Character({
  videoRef,
}: {
  videoRef: React.RefObject<HTMLVideoElement | null>;
}) {
  return (
    <div className="relative -bottom-4 lg:-bottom-12 xl:-bottom-6 flex justify-center items-center">
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
