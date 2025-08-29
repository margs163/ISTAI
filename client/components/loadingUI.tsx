import React from "react";
import { BeatLoader } from "react-spinners";

export default function LoadingUI() {
  return (
    <div className="h-screen mx-auto w-full flex-col items-center justify-center gap-2 font-geist flex">
      <BeatLoader
        className="text-indigo-500 size-24 scale-190 flex items-center justify-center self-center"
        color="#4f39f6"
        aria-label="Loading"
        cssOverride={{
          marginInline: "auto",
          alignSelf: "center",
          marginBlock: "2rem",
        }}
        loading
      />
      <div className="text-center gap-2">
        <h1 className="text-2xl font-semibold text-gray-800">
          Loading resources...
        </h1>
        <p className="text-lg font-medium text-gray-600">
          Please wait while the page is loading
        </p>
      </div>
    </div>
  );
}
