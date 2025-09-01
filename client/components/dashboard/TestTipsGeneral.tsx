"use client";

import { useState } from "react";
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

const speakingTestParts = [
  {
    id: "part1",
    title: "Part 1",
    subtitle: "Introduction & Interview",
    duration: "4-5 minutes",
    icon: MessageSquare,
    color: "bg-blue-50 text-blue-700 border-blue-200",
    description:
      "General questions about yourself, your home, work, studies, and familiar topics",
    tips: [
      "Give full answers with examples, not just yes/no responses",
      "Keep answers natural and conversational, avoid memorized responses",
      "Practice common topics: work, studies, hometown, hobbies, daily routine",
      "Extend answers by adding personal details and explanations",
      "Speak clearly at a natural pace - don't rush your responses",
    ],
  },
  {
    id: "part2",
    title: "Part 2",
    subtitle: "Long Turn (Cue Card)",
    duration: "3-4 minutes",
    icon: BookOpen,
    color: "bg-green-50 text-green-700 border-green-200",
    description:
      "Speak for 1-2 minutes on a given topic after 1 minute of preparation time",
    tips: [
      "Use the full preparation minute to plan - make notes for each bullet point",
      "Address all bullet points on the cue card in your response",
      "Speak for the complete 2 minutes - don't stop early",
      "Include specific examples and personal experiences to develop your ideas",
      "Use linking words to connect your ideas smoothly throughout",
    ],
  },
  {
    id: "part3",
    title: "Part 3",
    subtitle: "Two-way Discussion",
    duration: "4-5 minutes",
    icon: Users,
    color: "bg-purple-50 text-purple-700 border-purple-200",
    description:
      "Abstract discussion related to Part 2 topic with more complex questions",
    tips: [
      "Think before speaking - it's okay to pause and consider your answer",
      "Use complex sentence structures and advanced vocabulary",
      "Give balanced arguments and consider different perspectives",
      "Support opinions with logical reasoning and real-world examples",
      "Compare past, present, and future situations when relevant",
    ],
  },
];

export function TestTipsGeneral() {
  const [activePart, setActivePart] = useState("part1");

  const currentPart = speakingTestParts.find((part) => part.id === activePart);

  return (
    <div className="bg-white p-4 rounded-xl font-geist max-w-[320px] max-h-[400px] overflow-y-scroll">
      <header className="pb-4">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="h-5 w-5 text-orange-500" />
          <h2 className="text-lg font-semibold text-gray-900">
            IELTS Speaking Test Tips
          </h2>
        </div>

        {/* Part Selection Tabs */}
        <div className="flex gap-2">
          {speakingTestParts.map((part) => (
            <Button
              key={part.id}
              variant={activePart === part.id ? "default" : "outline"}
              size="sm"
              className={`gap-2 ${
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

      <main className="space-y-4">
        {currentPart && (
          <>
            {/* Part Header */}
            <div className="space-y-3">
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
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
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
