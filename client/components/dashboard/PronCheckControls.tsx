import { cn } from "@/lib/utils";
import { Mic } from "lucide-react";
import React, { useCallback } from "react";

export function PronCheckControls({
  isRecording,
  volumeSliderRef,
  ToggleRecording,
}: {
  isRecording: boolean;
  volumeSliderRef: React.RefObject<HTMLDivElement | null>;
  ToggleRecording: () => void;
}) {
  return (
    <div className=" w-full">
      <div className="p-2 lg:p-4 flex flex-row items-center gap-6">
        <div className="w-full space-y-2">
          <div className="rounded-3xl w-full h-1.5 bg-gray-300">
            <div
              ref={volumeSliderRef}
              className={cn(
                " bg-indigo-400 h-full rounded-tl-3xl rounded-bl-3xl volume-slider"
              )}
            ></div>
          </div>
          <p className="text-sm font-normal text-gray-500">
            Record your reading speech
          </p>
        </div>
        <div className=" flex flex-row justify-center items-center gap-6">
          <button
            className={cn(
              isRecording
                ? "p-4 rounded-[50%] transition-colors hover:bg-red-600 bg-red-500 text-gray-50 cursor-pointer"
                : "p-4 rounded-[50%] transition-colors hover:bg-indigo-600 text-indigo-600 bg-indigo-50 hover:text-indigo-50 curor-pointer"
            )}
          >
            <Mic size={30} className="sm:w-8" onClick={ToggleRecording} />
          </button>
        </div>
      </div>
    </div>
  );
}
