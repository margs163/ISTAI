import clsx from "clsx";
import {
  AlertTriangle,
  BookOpen,
  Calendar,
  Clock,
  LucideProps,
  Pause,
  RefreshCw,
  RotateCcw,
  Users,
  Zap,
} from "lucide-react";
import React from "react";

type Mistake = {
  name: string;
  status: string;
  mistakes: {
    name: string;
    repetition: number;
    explanation: string;
    frequency: number;
    icon: React.ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
    >;
  }[];
  tip: string;
};

const commonMistakes: Mistake[] = [
  {
    name: "Fluency & Cohesion",
    status: "Needs Work",
    mistakes: [
      {
        name: "Long Pauses",
        repetition: 12,
        explanation: "Frequent pauses longer than 3 seconds",
        frequency: 80,
        icon: Pause,
      },
      {
        name: "Repetetion",
        repetition: 8,
        explanation: "Repeating words: 'I think... I think...'",
        frequency: 60,
        icon: RotateCcw,
      },
      {
        name: "Slow Speech Rate",
        repetition: 6,
        explanation: "Speaking below 120 words per minute",
        frequency: 40,
        icon: Clock,
      },
    ],
    tip: "Practice speaking continuously for 2 minutes without stopping",
  },
  {
    name: "Grammatical Range & Accuracy",
    status: "Improving",
    mistakes: [
      {
        name: "Verb Tenses",
        repetition: 15,
        explanation: "`I was went to the store yesterday`",
        frequency: 70,
        icon: Calendar,
      },
      {
        name: "Subject-Verb Agreement",
        repetition: 9,
        explanation: "'She don't like coffee'",
        frequency: 55,
        icon: Users,
      },
      {
        name: "Article Usage",
        repetition: 7,
        explanation: "`I went to university (missing 'the')`",
        frequency: 40,
        icon: AlertTriangle,
      },
    ],
    tip: "Focus on past tense forms and third-person singular verbs",
  },
  {
    name: "Lexical Resource",
    status: "Good Progress",
    mistakes: [
      {
        name: "Word Repetition",
        repetition: 11,
        explanation: "Using 'good' 8 times instead of varied adjectives",
        frequency: 80,
        icon: RefreshCw,
      },
      {
        name: "Basic Vocabulary",
        repetition: 8,
        explanation: "Using 'big' instead of 'enormous', 'substantial'",
        frequency: 60,
        icon: BookOpen,
      },
      {
        name: "Inappropriate Usage",
        repetition: 10,
        explanation: "Using 'funny' when meaning 'strange'",
        frequency: 75,
        icon: Zap,
      },
    ],
    tip: "Learn 3 synonyms for commonly used words each day",
  },
  {
    name: "Pronunciation",
    status: "Strong",
    mistakes: [
      {
        name: "Word Stress",
        repetition: 13,
        explanation: "PHOtograph vs phoTOgraphy stress patterns",
        frequency: 85,
        icon: Calendar,
      },
      {
        name: "Consonant Sounds",
        repetition: 10,
        explanation: "Confusing /θ/ and /f/ sounds (think vs fink)",
        frequency: 70,
        icon: Users,
      },
      {
        name: "Intonation",
        repetition: 7,
        explanation: "Flat intonation in questions",
        frequency: 50,
        icon: AlertTriangle,
      },
    ],
    tip: "Record yourself reading aloud and compare with native speakers",
  },
];

export function ProgressBar({
  frequency,
}: {
  frequency: number;
}): React.JSX.Element {
  return (
    <div className="w-full h-2 bg-gray-200 rounded-full">
      <div
        className={clsx(` h-full rounded-full bg-gray-700 z-10`)}
        style={{ width: `${frequency}%` }}
      ></div>
    </div>
  );
}

export function CommonMistakeCard({
  mistakeObj,
}: {
  mistakeObj: Mistake;
}): React.JSX.Element {
  return (
    <div className="p-6 rounded-xl bg-white border border-gray-200 space-y-4 lg:flex-1/4">
      <div className="flex flex-row items-start justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800">
          {mistakeObj.name}
        </h2>
        <div
          className={clsx(
            "px-2 py-0.5 rounded-2xl text-xs border text-center",
            mistakeObj.status === "Needs Work"
              ? "bg-red-50 text-red-700 border-red-200"
              : mistakeObj.status === "Improving"
              ? "bg-orange-50 text-orange-700 border-orange-200"
              : mistakeObj.status === "Good Progress"
              ? "bg-blue-50 text-blue-700 border-blue-200"
              : mistakeObj.status === "Strong"
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-gray-50 text-gray-700 border-gray-200"
          )}
        >
          <p className="text-semibold">{mistakeObj.status}</p>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {mistakeObj.mistakes.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="flex flex-col gap-2 items-start">
              <div className="flex flex-row items-center justify-between w-full">
                <Icon
                  className={clsx(
                    " size-4 mr-1.5",
                    index === 0
                      ? "text-red-600"
                      : index === 1
                      ? "text-orange-600"
                      : "text-yellow-600"
                  )}
                />
                <p className="text-gray-800 font-medium text-sm mr-auto">
                  {item.name}
                </p>
                <p className="text-xs font-normal text-gray-600 ml-auto">
                  {item.repetition}{" "}
                  {mistakeObj.name === "Fluency & Cohesion"
                    ? "times"
                    : mistakeObj.name === "Grammatical Range & Accuracy"
                    ? "errors"
                    : mistakeObj.name === "Lexical Resource"
                    ? "instances"
                    : "issues"}
                </p>
              </div>
              <ProgressBar frequency={item.frequency} />
              <p className="text-xs font-normal italic text-gray-600">
                {item.explanation}
              </p>
            </div>
          );
        })}
      </div>
      <hr className="h-[1px] w-full text-gray-300" />
      <p className="font-normal text-gray-600 text-xs">
        <strong>Tip: </strong>
        {mistakeObj.tip}
      </p>
    </div>
  );
}

export function CommonMistakes() {
  return (
    <section className="px-6  w-full flex flex-col lg:flex-row gap-6 lg:gap-4">
      {commonMistakes.map((itemMistake, index) => (
        <CommonMistakeCard mistakeObj={itemMistake} key={index} />
      ))}
    </section>
  );
}
