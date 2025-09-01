import { cn } from "@/lib/utils";
import { BookOpen, Check } from "lucide-react";
import React, { useEffect, useState } from "react";
import { ProgressBar } from "../dashboard/MistakesCard";
import { useTestSessionStore } from "@/lib/testSessionStore";
import { Progress } from "../ui/progress";

export default function TestProgress() {
  const currentPart = useTestSessionStore((state) => state.currentPart);
  const testStatus = useTestSessionStore((state) => state.status);
  const [testProgress, setTestProgress] = useState([
    {
      name: "Part 1",
      status: "completed",
      duration: "4-5 minutes",
      description: "Introduction & interview",
      score: 7.5,
    },
    {
      name: "Part 2",
      status: "ongoing",
      duration: "3-4 minutes",
      description: "Individual Long Turn",
    },
    {
      name: "Part 3",
      staus: "unknown",
      duration: "4-5 minutes",
      description: "Two-way Discussion",
    },
  ]);

  useEffect(() => {
    setTestProgress((prev) => {
      const copiedProgress = [...prev];
      for (let i = 0; i < copiedProgress.length; i++) {
        if (
          i < currentPart - 1 ||
          (testStatus === "inactive" && currentPart === 3)
        ) {
          copiedProgress[i].status = "completed";
        } else if (i === currentPart - 1) {
          copiedProgress[i].status = "ongoing";
        } else {
          copiedProgress[i].status = "unknown";
        }
      }
      return copiedProgress;
    });
  }, [currentPart, testStatus]);

  const completedCount = testProgress.filter(
    (item) => item.status === "completed"
  ).length;

  return (
    <section className="p-6 py-0 max-w-[600px] lg:px-0">
      <div className="p-6 rounded-xl border border-gray-200 space-y-6 bg-white second-step">
        <header className="flex flex-row items-center gap-2">
          <BookOpen className="size-6 text-indigo-600" />
          <h3 className="font-semibold text-gray-800 text-lg">
            Test Structure
          </h3>
        </header>
        <main className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            {testProgress.map((item, index) => {
              return (
                <div
                  key={index}
                  className={cn(
                    "p-4 rounded-lg border flex flex-row gap-3 items-center justify-start",
                    item.status === "completed"
                      ? "border-green-200 bg-green-50"
                      : item.status === "ongoing"
                      ? "border-blue-200 bg-blue-50"
                      : "border-gray-200 bg-gray-50"
                  )}
                >
                  <div
                    className={cn(
                      "p-1 box-content shrink-0 rounded-full flex items-center justify-center",
                      item.status === "completed"
                        ? "bg-green-400"
                        : item.status === "ongoing"
                        ? "bg-blue-400"
                        : "bg-gray-300"
                    )}
                  >
                    {item.status === "completed" ? (
                      <Check className="text-white size-4 box-content p-0.5" />
                    ) : item.status === "ongoing" ? (
                      <span className="text-white font-medium box-content px-[7px] py-0.5 text-sm shrink-0">
                        {index + 1}
                      </span>
                    ) : (
                      <span className="text-gray-600 font-medium box-content px-[7px] py-0.5 text-sm shrink-0">
                        {index + 1}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-0 items-start justify-center">
                    <div className="flex flex-row gap-2 items-center justify-start">
                      <h3 className="text-base font-medium text-gray-800">
                        Part {index + 1}
                      </h3>
                      <p className="text-sm font-normal text-gray-500">
                        • {" " + item.duration}
                      </p>
                    </div>
                    <p className="text-sm font-normal text-gray-600">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="p-4 rounded-lg bg-gray-50 flex flex-col gap-2">
            <div className="flex flex-row justify-between items-center">
              <h3 className="text-sm">Test Progress</h3>
              <span className="font-medium">{completedCount * 33}%</span>
            </div>
            <Progress value={Math.round(100 / (4 - completedCount))} />
          </div>
        </main>
      </div>
    </section>
  );
}
