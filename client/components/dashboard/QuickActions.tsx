import clsx from "clsx";
import { Calendar, Lightbulb, LucideProps, Volume2, Zap } from "lucide-react";
import Link from "next/link";
import { ForwardRefExoticComponent, RefAttributes } from "react";

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
    title: "Quick 5-min Practice",
    description: "Fast speaking drill to warm up",
    icon: Zap,
    popular: true,
    color: "yellow",
  },
  {
    title: "Pronunciation Check",
    description: "Test your pronunciation accuracy",
    icon: Volume2,
    color: "blue",
  },
  {
    title: "Daily Challenge",
    description: "Today's speaking challenge",
    icon: Calendar,
    new: true,
    color: "green",
  },
  {
    title: "Speaking Tips",
    description: "Get personalized improvement tips",
    icon: Lightbulb,
    color: "purple",
  },
];

export function Action({ action }: { action: Action }) {
  const Icon = action.icon;
  const styles = getColor(action.color);
  return (
    <div className="flex flex-row gap-3 items-center justify-start py-1.5 px-2 rounded-lg hover:bg-gray-50 active:bg-gray-50">
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

export default function QuickActions() {
  return (
    <section className="px-6 lg:pl-0 w-full flex flex-col gap-4">
      <div className="p-5 w-full flex flex-col gap-5 bg-white rounded-lg border border-gray-200">
        <header className="w-full flex flex-row justify-between items-center px-1">
          <div className="flex flex-row items-center justify-start gap-2">
            <h3 className="font-semibold text-lg text-gray-800">
              Quick Actions
            </h3>
          </div>
          <Link href={"#"}>
            <p className="font-medium text-xs text-gray-800 p-1 hover:text-gray-700 active:text-gray-700">
              5 available
            </p>
          </Link>
        </header>
        <div className="space-y-4">
          {actions.map((item, index) => (
            <Action key={index} action={item} />
          ))}
        </div>
        <hr className="h-[1px] text-gray-300 w-[95%] mx-auto" />
        <div className="text-sm font-medium text-gray-800 px-4 py-2 border rounded-md border-gray-300 text-center">
          View All Features
        </div>
      </div>
    </section>
  );
}
