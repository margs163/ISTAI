import React from "react";
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
import ButtonPrimary from "../home/ButtonPrimary";
import MainButton from "../MainButton";
import Link from "next/link";
import { useLocalPracticeTestStore } from "@/lib/practiceTestStore";

export default function IntroductionDialog({
  dialogOpen,
  setIsOpen,
  setDialogOpen,
  dialogInfo,
  currentPart,
  status,
}: {
  dialogOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  dialogInfo: {
    title: string;
    description: string;
    options: string[];
  }[];
  currentPart: 1 | 2 | 3 | number;
  status: "Finished" | "Cancelled" | "Ongoing" | "Paused";
}) {
  const audioPath = useLocalPracticeTestStore(
    (state) => state.readingAudioPath
  );
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="font-geist">
        <DialogHeader className="items-start text-left">
          <DialogTitle className="text-base text-gray-800 font-semibold">
            {status === "Finished"
              ? dialogInfo[3].title
              : dialogInfo[currentPart - 1].title}
          </DialogTitle>
          <DialogDescription className="text-sm font-normal">
            {status === "Finished"
              ? dialogInfo[3].description
              : dialogInfo[currentPart - 1].description}
            Before proceeding to the test, do you want to walkthrough a
            tutorial, explaining the user interface of the test?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="">
          {currentPart === 1 ? (
            <div className="flex flex-row gap-2 items-start justify-end">
              <DialogClose asChild>
                <button className="px-4 py-2 rounded-sm bg-gray-200 text-gray-800 font-medium text-xs hover:bg-gray-400 active:bg-gray-300 transition-colors">
                  {dialogInfo[currentPart - 1].options[0]}
                </button>
              </DialogClose>
              <DialogClose asChild>
                <button
                  onClick={() => setIsOpen(true)}
                  className="px-4 py-2 rounded-sm bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-600 transition-colors text-white font-medium text-xs"
                >
                  {dialogInfo[currentPart - 1].options[1]}
                </button>
              </DialogClose>
            </div>
          ) : (
            <div className="flex flex-row gap-2 items-start justify-end">
              <DialogClose asChild>
                {status === "Finished" ? (
                  <Link href={"/results"} aria-disabled={!audioPath} replace>
                    <button
                      aria-disabled={!audioPath}
                      className="px-4 py-2 rounded-sm bg-gray-200 text-gray-800 font-medium text-xs hover:bg-gray-400 active:bg-gray-300 transition-colors"
                    >
                      {!audioPath ? "Wait..." : dialogInfo[3].options[0]}
                    </button>
                  </Link>
                ) : (
                  <button className="px-4 py-2 rounded-sm bg-gray-200 text-gray-800 font-medium text-xs hover:bg-gray-400 active:bg-gray-300 transition-colors">
                    {dialogInfo[currentPart - 1].options[0]}
                  </button>
                )}
              </DialogClose>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
