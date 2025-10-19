"use client";
import clsx from "clsx";
import { Calendar, Lightbulb, LucideProps, Volume2, Zap } from "lucide-react";
import Link from "next/link";
import { ForwardRefExoticComponent, RefAttributes, useState } from "react";
import { FloaterAction, TipsFloaterAction } from "./FloaterAction";
import MainButton from "../MainButton";
import PronCheckDialog from "./PronCheckDialog";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSubscriptionStore } from "@/lib/subscriptionStore";
import { toast } from "sonner";

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
  soon?: boolean;
  color: string;
};

const actions: Action[] = [
  {
    title: "Quick 5-min Practice",
    description: "Fast speaking drill to warm up",
    icon: Zap,
    soon: true,
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
    soon: true,
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
                : action.soon
                ? "bg-gray-100 text-gray-700"
                : "hidden"
            )}
          >
            {action.popular
              ? "Popular"
              : action.new
              ? "New"
              : action.soon && "Soon"}
          </p>
        </div>
        <p className="text-xs font-normal text-gray-600">
          {action.description}
        </p>
      </div>
    </div>
  );
}

const notEnoughCreditsCallback = () => {
  toast.warning("You don't have enough credits", {
    description: "Could not create a practice test",
  });
};

export function PronunciationAction({
  action,
  setDialogOpen,
}: {
  action: Action;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const Icon = action.icon;
  const styles = getColor(action.color);
  const pronunciationChecks = useSubscriptionStore(
    (state) => state.pronunciation_tests_left
  );

  return (
    <FloaterAction
      checksLeft={pronunciationChecks}
      startCallback={
        pronunciationChecks <= 0 ? notEnoughCreditsCallback : setDialogOpen
      }
      title="Want to start a pronunciation check?"
      desc={`You have ${pronunciationChecks} checks left`}
    >
      <div className="flex flex-row gap-3 items-center justify-start py-1.5 px-2 rounded-lg hover:bg-gray-50 active:bg-gray-50">
        <div className={clsx("p-2 rounded-lg shrink-0 box-content", styles[0])}>
          <Icon className={clsx("size-4.5", styles[1])} />
        </div>
        <div className="flex flex-col items-start justify-start gap-0.5">
          <div className="flex flex-row gap-2 items-center">
            <h3 className="text-sm font-medium text-gray-800">
              {action.title}
            </h3>
            <p
              className={clsx(
                "px-2 py-0.5 rounded-3xl box-content text-xs font-medium",
                action.popular
                  ? "bg-amber-100 text-amber-700"
                  : action.new
                  ? "bg-green-100 text-green-700"
                  : action.soon
                  ? "bg-gray-100 text-gray-700"
                  : "hidden"
              )}
            >
              {action.popular
                ? "Popular"
                : action.new
                ? "New"
                : action.soon && "Soon"}
            </p>
          </div>
          <p className="text-xs font-normal text-gray-600">
            {action.description}
          </p>
        </div>
      </div>
    </FloaterAction>
  );
}

export function TipsAction({ action }: { action: Action }) {
  const Icon = action.icon;
  const styles = getColor(action.color);

  return (
    <TipsFloaterAction>
      <div className="flex flex-row gap-3 items-center justify-start py-1.5 px-2 rounded-lg hover:bg-gray-50 active:bg-gray-50 mr-4">
        <div className={clsx("p-2 rounded-lg shrink-0 box-content", styles[0])}>
          <Icon className={clsx("size-4.5", styles[1])} />
        </div>
        <div className="flex flex-col items-start justify-start gap-0.5">
          <div className="flex flex-row gap-2 items-center">
            <h3 className="text-sm font-medium text-gray-800">
              {action.title}
            </h3>
            <p
              className={clsx(
                "px-2 py-0.5 rounded-3xl box-content text-xs font-medium",
                action.popular
                  ? "bg-amber-100 text-amber-700"
                  : action.new
                  ? "bg-green-100 text-green-700"
                  : action.soon
                  ? "bg-gray-100 text-gray-700"
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
    </TipsFloaterAction>
  );
}

export default function QuickActions() {
  const [openPronDialog, setOpenPronDialog] = useState(false);
  return (
    <section className="px-6 lg:pl-0 w-full flex flex-col gap-4">
      <PronCheckDialog
        dialogOpen={openPronDialog}
        setDialogOpen={setOpenPronDialog}
      />
      <div className="p-5 w-full flex flex-col gap-5 bg-white rounded-lg border border-gray-200">
        <header className="w-full flex flex-row justify-between items-center px-1">
          <div className="flex flex-row items-center justify-start gap-2">
            <h3 className="font-semibold text-lg text-gray-800">
              Quick Actions
            </h3>
          </div>
          <Link href={"#"}>
            <p className="font-medium text-xs text-gray-800 p-1 hover:text-gray-700 active:text-gray-700">
              4 available
            </p>
          </Link>
        </header>
        <div className="space-y-4">
          {actions.map((item, index) =>
            item.title === "Pronunciation Check" ? (
              <PronunciationAction
                setDialogOpen={setOpenPronDialog}
                key={index}
                action={item}
              />
            ) : item.title === "Speaking Tips" ? (
              <TipsAction key={index} action={item} />
            ) : (
              <Action key={index} action={item} />
            )
          )}
        </div>
        <hr className="h-[1px] text-gray-300 w-[95%] mx-auto" />
        <QuickActionsDialog
          openPronDialog={openPronDialog}
          setOpenPronDialog={setOpenPronDialog}
        />
      </div>
    </section>
  );
}

export function QuickActionsDialog({
  openPronDialog,
  setOpenPronDialog,
}: {
  openPronDialog: boolean;
  setOpenPronDialog: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <Dialog>
      <DialogTrigger>
        <div className="text-sm font-medium text-gray-800 px-4 py-2 border rounded-md border-gray-300 text-center">
          View All Features
        </div>
      </DialogTrigger>
      <DialogContent className="lg:w-[450px]">
        <DialogHeader className="text-start">
          <div className="flex flex-row items-center justify-start gap-2">
            <DialogTitle className="font-semibold text-lg text-gray-800">
              Quick Actions
            </DialogTitle>
          </div>
          <Link href={"#"}>
            <p className="font-medium text-xs text-gray-800 p-1 hover:text-gray-700 active:text-gray-700">
              4 available
            </p>
          </Link>
        </DialogHeader>
        <div className="space-y-4 mb-4">
          {actions.map((item, index) =>
            item.title === "Pronunciation Check" ? (
              <PronunciationAction
                setDialogOpen={setOpenPronDialog}
                key={index}
                action={item}
              />
            ) : item.title === "Speaking Tips" ? (
              <TipsAction key={index} action={item} />
            ) : (
              <Action key={index} action={item} />
            )
          )}
        </div>
        <DialogFooter className="mt-0">
          <div className="flex flex-row gap-2 items-start justify-end">
            <DialogClose asChild>
              <MainButton variant="secondary" className="ml-0 self-end text-xs">
                Close
              </MainButton>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
