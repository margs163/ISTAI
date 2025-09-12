import { scores } from "@/lib/constants";
import { PronunciationTestType } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  CheckCircle,
  Info,
  Lightbulb,
  Volume2,
} from "lucide-react";
import React from "react";

export default function PronCheckResults({
  testResults,
}: {
  testResults: PronunciationTestType;
}) {
  const band = testResults.pronunciation_score;
  return (
    <section className="flex flex-col gap-8">
      <div className="flex flex-row gap-4 p-2 bg-white border-slate-200/80 rounded-xl">
        <div
          className={cn(
            "p-3 rounded-lg lg:p-4 box-content",
            band > 4.5 && band < 5.5
              ? "bg-red-50 "
              : band >= 5.5 && band < 7.0
              ? "bg-amber-50"
              : band >= 7.0 && "bg-blue-50"
          )}
        >
          <Volume2
            className={cn(
              "size-5 lg:size-6 box-content",
              band > 4.5 && band < 5.5
                ? "text-red-600 "
                : band >= 5.5 && band < 7.0
                ? "text-yellow-500"
                : band >= 7.0 && "text-blue-600"
            )}
          />
        </div>
        <div>
          <h3 className="text-2xl lg:text-3xl tracking-wider text-gray-800 font-bold">
            {band.toFixed(1)}
          </h3>
          <p className="text-xs lg:text-sm font-normal text-gray-600">
            Pronunciation
          </p>
        </div>
        <p
          className={cn(
            "py-2 px-3 lg:py-3 lg:px-4 lg:text-xl rounded-xl bg-gray-50 font-semibold text-lg ml-auto",
            band > 4.5 && band < 5.5
              ? "text-red-600 bg-red-50"
              : band >= 5.5 && band < 7.0
              ? "text-yellow-500 bg-yellow-50"
              : band >= 7.0 && "text-blue-600 bg-blue-50"
          )}
        >
          {scores[band as 2].code}
        </p>
      </div>
      <div className="space-y-3 px-2">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <h3 className="text-sm font-medium text-gray-900">Strong Points</h3>
        </div>
        <div className="space-y-1">
          {testResults.pronunciation_strong_points.map((strength, index) => (
            <div key={index} className="flex items-start gap-2 text-sm">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-700">{strength}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Mistakes */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <h3 className="text-sm font-medium text-gray-900">
            Areas to Improve
          </h3>
        </div>
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
          {testResults.pronunciation_mistakes.map((mistake, index) => (
            <div
              key={index}
              className="flex flex-row justify-between items-center bg-orange-50 border border-orange-100 rounded-md p-3"
            >
              <div className="space-y-0.5">
                <div className="text-xs font-medium text-orange-800 mb-1">
                  {mistake.mistake_type}
                </div>
                <div className="text-base font-medium text-orange-900 mb-1">
                  {mistake.word[0].toUpperCase() + mistake.word.slice(1)}
                </div>
                <div className="text-xs text-orange-700">
                  Incorrect: {mistake.user_phonemes}, Correct:{" "}
                  {mistake.correct_phonemes}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="space-y-2 px-2">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-blue-600" />
          <h3 className="text-sm font-medium text-gray-900">Practice Tips</h3>
        </div>
        <div className="space-y-1">
          {testResults.pronunciation_tips.map((tip, index) => (
            <div key={index} className="flex items-start gap-2 text-sm">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-700">{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
