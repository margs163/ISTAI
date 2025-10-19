"use client";

import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Lightbulb,
  Clock,
  MessageSquare,
  Users,
  BookOpen,
  CheckCircle,
} from "lucide-react";
import Tag from "../home/Tag";
import { speakingTestParts } from "@/lib/constants";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import MainButton from "../MainButton";

export function TestTipsGeneral() {
  const [activePart, setActivePart] = useState("part1");

  const currentPart = useMemo(
    () => speakingTestParts.find((part) => part.id === activePart),
    [activePart]
  );

  return (
    <div className="bg-white p-4 space-y-2 rounded-xl font-geist max-w-[320px] lg:max-w-[330px] max-h-[400px] overflow-y-scroll hide-scroll">
      <header className="pb-4">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="h-6 w-6 text-orange-500" />
          <h2 className="text-lg font-semibold text-gray-900">
            IELTS Speaking Test Tips
          </h2>
        </div>

        {/* Part Selection Tabs */}
        <div className="flex gap-2 justify-stretch">
          {speakingTestParts.map((part) => (
            <Button
              key={part.id}
              variant={activePart === part.id ? "default" : "outline"}
              size="sm"
              className={`gap-2 flex-1/3 ${
                activePart === part.id
                  ? "bg-indigo-500 hover:bg-indigo-600 text-white"
                  : "bg-transparent hover:bg-gray-50"
              }`}
              onClick={() => setActivePart(part.id)}
            >
              <part.icon className="h-4 w-4" />
              {part.title}
            </Button>
          ))}
        </div>
      </header>

      <main className="space-y-6">
        {currentPart && (
          <>
            {/* Part Header */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${currentPart.color
                      .replace("text-", "bg-")
                      .replace("border-", "")}`}
                  >
                    <currentPart.icon
                      className={`h-5 w-5 ${currentPart.color.split(" ")[1]}`}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {currentPart.title}: {currentPart.subtitle}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-3 w-3 text-gray-500" />
                      <span className="text-xs text-gray-600">
                        {currentPart.duration}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                {currentPart.description}
              </p>
            </div>

            {/* Tips List */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 text-sm">Key Tips:</h4>
              <div className="space-y-2">
                {currentPart.tips.map((tip, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-1.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {tip}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Reference */}
            <div className="mt-6 p-4 bg-blue-50/50 border border-blue-100 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Lightbulb className="w-3 h-3 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-blue-900 mb-1">
                    Quick Reminder
                  </h4>
                  <p className="text-sm text-blue-800 leading-relaxed">
                    {activePart === "part1" &&
                      "Keep answers natural and personal. Aim for 2-3 sentences per response."}
                    {activePart === "part2" &&
                      "Use the full preparation time and speak for the complete 2 minutes."}
                    {activePart === "part3" &&
                      "Think critically and provide well-reasoned arguments with examples."}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export function TestTipsDialog({
  dialogOpen,
  setDialogOpen,
  children,
}: {
  dialogOpen: boolean;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
}) {
  const [activePart, setActivePart] = useState("part1");

  const currentPart = useMemo(
    () => speakingTestParts.find((part) => part.id === activePart),
    [activePart]
  );
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="font-geist max-h-[600px] space-y-2 overflow-y-scroll max-w-[350px] lg:max-w-[460px] px-6.5 lg:p-8 lg:px-9 pb-0 lg:pb-0">
        <DialogHeader className="items-start text-left">
          <DialogTitle className="text-base text-gray-800 font-semibold">
            <div className="flex items-center gap-2 mb-0">
              <Lightbulb className="h-6 w-6 text-orange-500" />
              <h2 className="text-lg font-semibold text-gray-900">
                IELTS Speaking Test Tips
              </h2>
            </div>
          </DialogTitle>
          <DialogDescription className="text-sm font-normal">
            This is how you can improve your test experience. Consider these
            tips when passing your test.
          </DialogDescription>
        </DialogHeader>
        {/* Part Selection Tabs */}
        <div className="flex gap-2 justify-stretch">
          {speakingTestParts.map((part) => (
            <Button
              key={part.id}
              variant={activePart === part.id ? "default" : "outline"}
              size="sm"
              className={`gap-2 flex-1/3 ${
                activePart === part.id
                  ? "bg-indigo-500 hover:bg-indigo-600 text-white"
                  : "bg-transparent hover:bg-gray-50"
              }`}
              onClick={() => setActivePart(part.id)}
            >
              <part.icon className="h-4 w-4 lg:h-5" />
              {part.title}
            </Button>
          ))}
        </div>
        <main className="space-y-6 mt-2">
          {currentPart && (
            <>
              {/* Part Header */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${currentPart.color
                        .replace("text-", "bg-")
                        .replace("border-", "")}`}
                    >
                      <currentPart.icon
                        className={`h-5 w-5 ${currentPart.color.split(" ")[1]}`}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {currentPart.title}: {currentPart.subtitle}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-3 w-3 text-gray-500" />
                        <span className="text-xs text-gray-600">
                          {currentPart.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {currentPart.description}
                </p>
              </div>

              {/* Tips List */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 text-sm">Key Tips:</h4>
                <div className="space-y-2">
                  {currentPart.tips.map((tip, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-1.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {tip}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Reference */}
              <div className="mt-6 p-4 bg-blue-50/50 border border-blue-100 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Lightbulb className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-blue-900 mb-1">
                      Quick Reminder
                    </h4>
                    <p className="text-sm text-blue-800 leading-relaxed">
                      {activePart === "part1" &&
                        "Keep answers natural and personal. Aim for 2-3 sentences per response."}
                      {activePart === "part2" &&
                        "Use the full preparation time and speak for the complete 2 minutes."}
                      {activePart === "part3" &&
                        "Think critically and provide well-reasoned arguments with examples."}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
        <DialogFooter className="mt-4 sticky bottom-0 bg-white w-full pt-4 lg:pt-6 py-6">
          <div className="flex flex-row gap-2 items-start justify-end">
            <DialogClose asChild>
              <MainButton variant="secondary" className="ml-0 self-end">
                Cancel
              </MainButton>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
