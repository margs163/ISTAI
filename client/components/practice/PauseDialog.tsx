import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTestSessionStore } from "@/lib/testSessionStore";
import { useMutation } from "@tanstack/react-query";
import { useLocalPracticeTestStore } from "@/lib/practiceTestStore";
import { useRouter } from "next/navigation";
import { useChatStore } from "@/lib/chatStore";
import { useTestTranscriptionStore } from "@/lib/testTranscriptionStore";
import { cancellPracticeTest } from "@/lib/queries";

export default function PauseDialog({
  dialogOpen,
  setDialogOpen,
}: {
  dialogOpen: boolean;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const restoreChatMessages = useChatStore((state) => state.restoreMessages);
  const restoreTranscriptions = useTestTranscriptionStore(
    (state) => state.restoreTranscriptions
  );
  const resetLocalPracticeTest = useLocalPracticeTestStore(
    (state) => state.resetLocalPracticeTest
  );
  const resetTranscriptions = useTestTranscriptionStore(
    (state) => state.restoreTranscriptions
  );
  const resetChatMessages = useChatStore((state) => state.restoreMessages);
  const setTestStatus = useTestSessionStore((state) => state.setStatus);
  const status = useTestSessionStore((state) => state.status);
  const testState = useLocalPracticeTestStore((state) => state.status);
  const testId = useLocalPracticeTestStore((state) => state.id);
  const router = useRouter();
  const quitMutation = useMutation({
    mutationKey: ["cancel-test"],
    mutationFn: cancellPracticeTest,
    onSuccess: () => {
      resetChatMessages();
      resetLocalPracticeTest();
      resetTranscriptions();
    },
  });
  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={() => {
        if (status === "inactive") {
          setTestStatus("active");
        }
        setDialogOpen((prev) => !prev);
      }}
    >
      <DialogContent className="font-geist">
        <DialogHeader className="items-start text-left">
          <DialogTitle className="text-base text-gray-800 font-semibold">
            {status === "inactive" && testState !== "Finished"
              ? "Want a break? Test is paused."
              : "Are you sure you want to quit?"}
          </DialogTitle>
          <DialogDescription className="text-sm font-normal">
            {status === "inactive" && testState !== "Finished"
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
                  if (status === "inactive" && testState !== "Finished") {
                    setTestStatus("active");
                  } else {
                    quitMutation.mutate(testId);
                    restoreChatMessages();
                    restoreTranscriptions();
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
