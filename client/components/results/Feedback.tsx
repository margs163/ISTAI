import React, { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Star } from "lucide-react";
import { useForm, UseFormRegister } from "react-hook-form";
import { FeedbackSchema, FeedbackType } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { Textarea } from "../ui/textarea";
import MainButton from "../MainButton";
import { feedbackResults } from "@/lib/queries";
import { useMutation } from "@tanstack/react-query";

const questions = [
  "How would you rate the user interface intuitivity?",
  "How would you rate the accuracy and quality of your feedback?",
  "How would you rate the test similiarity to the official Speaking test session?",
];

export function FeedbackPoster({ hasFeedback }: { hasFeedback?: boolean }) {
  const [feedbackOpenDialog, setFeedbackOpenDialog] = useState(false);

  return (
    <div className="flex flex-col justify-center items-center text-center gap-6 w-full px-6 lg:px-20 xl:px-36 mb-8 relative -top-4">
      <h3 className="text-2xl font-semibold text-gray-800">
        Share you user experience
      </h3>
      <Feedback
        openDialog={feedbackOpenDialog}
        setOpenDialog={setFeedbackOpenDialog}
      />
    </div>
  );
}

export function Feedback({
  openDialog,
  setOpenDialog,
}: {
  openDialog: boolean;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [testExperience, setTestExperience] = useState<number | undefined>();
  const [uiInt, setUiInt] = useState<number | undefined>();
  const [evalAccuracy, setEvalAccuracy] = useState<number | undefined>();
  const [suggestion, setSuggestion] = useState<string | undefined>();

  const { isPending, data, mutateAsync } = useMutation({
    mutationKey: ["feedback-post"],
    mutationFn: feedbackResults,
  });

  const canSend = testExperience && uiInt && evalAccuracy && suggestion;

  const handleSubmit = async () => {
    const allFieldsFilled = testExperience && uiInt && evalAccuracy;

    if (!allFieldsFilled) return;

    const data = {
      test_experience: testExperience,
      ui_intuitivity: uiInt,
      eval_accuracy: evalAccuracy,
      suggestion: suggestion,
    };

    await mutateAsync(data);
    setOpenDialog(false);
  };

  const handleDialogClose = () => {
    setTestExperience(undefined);
    setUiInt(undefined);
    setEvalAccuracy(undefined);
    setSuggestion(undefined);
    setOpenDialog(false);
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <MainButton className={"ml-0"}>Leave Feedback</MainButton>
      </DialogTrigger>
      <DialogContent className="font-geist lg:px-8">
        <DialogHeader className="text-start">
          <Star className="size-6 text-yellow-400 mb-4" strokeWidth={2.2} />
          <DialogTitle className="">Rate your experience</DialogTitle>
          <DialogDescription>
            We value your feedback! Rate your experience and let us know how we
            can improve.
          </DialogDescription>
        </DialogHeader>
        <main className="flex flex-col gap-4 mt-2">
          {questions.map((item, index) => (
            <FeedbackRow
              key={index}
              title={item}
              isLoading={isPending}
              score={
                index === 0
                  ? uiInt
                  : index === 1
                  ? evalAccuracy
                  : testExperience
              }
              setScore={
                index === 0
                  ? setUiInt
                  : index === 1
                  ? setEvalAccuracy
                  : setTestExperience
              }
            />
          ))}
          <div className="mt-2 space-y-2">
            <h2 className="text-sm font-medium text-gray-500">
              Additional Suggestions
            </h2>
            <Textarea
              placeholder="Type your suggestion here"
              value={suggestion}
              disabled={isPending}
              className=" focus-visible:ring-gray-400/90 focus-visible:border-gray-500"
              onChange={(event) => setSuggestion(event.target.value)}
            />
          </div>
        </main>
        <DialogFooter className="flex flex-row ml-auto mt-2 lg:mt-4">
          <MainButton
            className={"ml-0"}
            variant="secondary"
            onClick={handleDialogClose}
          >
            Cancel
          </MainButton>
          <MainButton
            className={"ml-0"}
            variant="primary"
            disabled={isPending || !canSend}
            onClick={handleSubmit}
          >
            {isPending ? "Sending..." : "Send"}
          </MainButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function FeedbackRow({
  title,
  setScore,
  score,
  isLoading,
}: {
  title: string;
  score?: number;
  setScore: React.Dispatch<React.SetStateAction<number | undefined>>;
  isLoading: boolean;
}) {
  return (
    <div className="space-y-2">
      <h2 className="text-sm font-normal text-gray-500">{title}</h2>
      <div className="flex flex-row items-stretch justify-start gap-1 lg:gap-1.5">
        {Array.from({ length: 5 }).map((item, index) => (
          <div
            key={index}
            className={cn(
              "flex items-center justify-center py-1.5 px-3 lg:py-2 lg:px-4 cursor-pointer rounded-md border border-gray-300 text-gray-600 text-sm lg:text-base font-semibold hover:border-gray-400 hover:text-gray-700 transition-colors",
              score === index + 1 && "border-gray-500 text-gray-800"
            )}
            aria-disabled={isLoading}
            onClick={() => setScore(index + 1)}
          >
            {index + 1}
          </div>
        ))}
      </div>
    </div>
  );
}
