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
import { useTestSessionStore } from "@/lib/testSessionStore";
import { useMutation } from "@tanstack/react-query";
import { useLocalPracticeTestStore } from "@/lib/practiceTestStore";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function PauseDialog({
  dialogOpen,
  setDialogOpen,
}: {
  dialogOpen: boolean;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const setTestStatus = useTestSessionStore((state) => state.setStatus);
  const status = useTestSessionStore((state) => state.status);
  const testId = useLocalPracticeTestStore((state) => state.id);
  const router = useRouter();
  const quitMutation = useMutation({
    mutationKey: ["cancel-test"],
    mutationFn: () =>
      axios
        .put(
          `http://localhost:8000/practice_test/${testId}`,
          { status: "Cancelled" },
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        )
        .then((response) => {
          if (response.status !== 200) {
            console.log("Could not update a practice test");
          }
          return response.data;
        })
        .catch((error) =>
          console.log("Could not update a practice test: ", error)
        ),
  });
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="font-geist">
        <DialogHeader className="items-start text-left">
          <DialogTitle className="text-base text-gray-800 font-semibold">
            {status === "inactive"
              ? "Want a break? Test is paused."
              : "Are you sure you want to quit?"}
          </DialogTitle>
          <DialogDescription className="text-sm font-normal">
            {status === "inactive"
              ? "The test is paused. If you want to continue press the 'resume' button to resume the test."
              : "If you want to cancell the test click on the button below, your progress won't be saved."}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="">
          <div className="flex flex-row gap-2 items-start justify-end">
            <DialogClose asChild>
              <button
                className="px-4 py-2 rounded-sm bg-gray-200 text-gray-800 font-medium text-xs hover:bg-gray-400 active:bg-gray-300 transition-colors"
                onClick={() => {
                  if (status === "inactive") {
                    setTestStatus("active");
                  } else {
                    quitMutation.mutate();
                    router.replace("/dashboard");
                  }
                }}
              >
                {status === "inactive" ? "Resume" : "Quit Early"}
              </button>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
