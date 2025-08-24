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
import LoadingSmallUI from "../loadingSmallUI";
import DialogCriterionScores from "./practiceDialog/DialogCriteriaScores";
import DialogStrongSides from "./practiceDialog/DialogStrongSides";
import DialogWeakSides from "./practiceDialog/DialogWeakSides";
import { PracticeTestType } from "@/lib/types";
import DialogSentences from "./practiceDialog/DialogSentences";
import DialogGrammarErrors from "./practiceDialog/DialogGrammarErrors";
import DialogAdvancedVocabulary, {
  DialogPhrase,
} from "./practiceDialog/DialogAdvanedVocab";
import DialogRepetitions from "./practiceDialog/DialogRepetitions";
import DialogPronunciationIssues from "./practiceDialog/DialogPronunciation";
import DialogImprovementTips from "./practiceDialog/DialogGeneralTips";

export default function PracticeTestDialogInfo({
  open,
  test,
  setOpen,
}: {
  open: boolean;
  test: PracticeTestType;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  if (!test.result) {
    return <LoadingSmallUI />;
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className=" max-h-[640px] lg:min-w-[1080px] font-geist overflow-y-scroll p-0">
        <DialogHeader className="sticky top-0 bg-white w-full p-6">
          <DialogTitle className="text-start">
            Practice test - {test?.practice_name}
          </DialogTitle>
          <DialogDescription className="text-start">
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <main className="flex flex-col lg:grid lg:grid-cols-2 p-6 lg:p-8 gap-8 pt-0 h-full w-full lg:justify-items-start-start lg:items-start">
          <DialogCriterionScores criteria={test?.result?.criterion_scores} />
          <DialogStrongSides strongSides={test?.result.strong_points} />
          <DialogWeakSides weakSides={test?.result.weak_sides} />
          <DialogSentences sentences={test?.result.sentence_improvements} />
          <DialogGrammarErrors grammar={test?.result?.grammar_errors} />
          <DialogAdvancedVocabulary
            vocabulary={test?.result?.vocabulary_usage}
          />
          <DialogRepetitions repetitions={test.result.repeated_words} />
          <DialogPronunciationIssues
            pronunIssues={test.result.pronunciation_issues}
          />
          <DialogImprovementTips generalTips={test.result.general_tips} />
        </main>
        <DialogFooter className="p-6 lg:p-8">
          <DialogClose asChild>
            <button className="bg-indigo-500 text-white rounded-md px-4 py-2 font-medium text-sm">
              close
            </button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
