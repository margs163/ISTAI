import clsx from "clsx";
import {
  Calendar,
  Lightbulb,
  LucideProps,
  Timer,
  Volume1,
  Volume2,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { ForwardRefExoticComponent, RefAttributes, useCallback } from "react";

function getColor(color: string): [string, string] {
  return [`bg-${color}-50`, `text-${color}-600`];
}

type Action = {
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  title: string;
  description: string;
  popular?: boolean;
  new?: boolean;
  color: string;
};

const actions: Action[] = [
  {
    title: "Replay Instructions",
    description: "Test your pronunciation accuracy",
    icon: Volume2,
    color: "gray",
  },
  {
    title: "Check Remaining Time",
    description: "Today's speaking challenge",
    icon: Timer,
    color: "gray",
  },
  {
    title: "Replay the Question",
    description: "Get personalized improvement tips",
    icon: Volume1,
    color: "gray",
  },
  {
    title: "Show some Tips",
    description: "Get personalized improvement tips",
    icon: Lightbulb,
    color: "gray",
  },
];

export function TestAction({
  action,
  callback,
}: {
  action: Action;
  callback: () => void;
}) {
  const Icon = action.icon;
  const styles = getColor(action.color);
  return (
    <div
      className="flex flex-row gap-3 items-center justify-start py-1.5 px-2 rounded-lg hover:bg-gray-50 active:bg-gray-50 select-none"
      onClick={callback}
    >
      <div className={clsx("p-2 rounded-lg shrink-0 box-content", styles[0])}>
        <Icon className={clsx("size-4.5", styles[1])} />
      </div>
      <div className="flex flex-col items-start justify-start gap-0.5">
        <div className="flex flex-row gap-2 items-center">
          <h3 className="text-sm font-medium text-gray-800">{action.title}</h3>
          <p
            className={clsx(
              "px-2 py-0.5 rounded-3xl box-content text-xs font-medium",
              action.popular
                ? "bg-amber-100 text-amber-700"
                : action.new
                ? "bg-green-100 text-green-700"
                : "hidden"
            )}
          >
            {action.popular ? "Popular" : action.new && "New"}
          </p>
        </div>
        <p className="text-xs font-normal text-gray-600">
          {action.description}
        </p>
      </div>
    </div>
  );
}

export default function QuickTestActions({
  instructionsAduio,
  audioFile,
}: {
  instructionsAduio: React.RefObject<HTMLAudioElement | null>;
  audioFile: React.RefObject<HTMLAudioElement | null>;
}) {
  const replayInstructions = useCallback(() => {
    if (instructionsAduio.current && instructionsAduio.current.paused) {
      instructionsAduio.current.play();
    }
  }, [instructionsAduio]);

  const replayQuestion = useCallback(() => {
    if (audioFile.current && audioFile.current.paused) {
      audioFile.current.play();
    }
  }, [audioFile]);
  return (
    <section className="p-6 py-0 max-w-[600px] lg:px-0">
      <div className="p-6 w-full flex flex-col gap-5 bg-white rounded-lg border border-gray-200 seventh-step">
        <header className="w-full flex flex-row justify-between items-center px-1">
          <header className="flex flex-row items-center gap-2">
            <Zap className="size-6 text-indigo-600" />
            <h3 className="font-semibold text-gray-800 text-lg">
              Quick Actions
            </h3>
          </header>
          {/* <Link href={"#"}>
            <p className="font-medium text-xs text-gray-800 p-1 hover:text-gray-700 active:text-gray-700">
              5 available
            </p>
          </Link> */}
        </header>
        <div className="space-y-2 lg:space-y-3">
          {actions.map((item, index) => (
            <TestAction
              callback={
                index === 0
                  ? replayInstructions
                  : index === 2
                  ? replayQuestion
                  : () => null
              }
              key={index}
              action={item}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
