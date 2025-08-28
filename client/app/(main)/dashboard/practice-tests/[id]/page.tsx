"use client";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import TestHeader from "@/components/dashboard/dynamicPractice/TestHeader";
import TestMetadata from "@/components/dashboard/dynamicPractice/TestMetadata";
import TestQuestionCard from "@/components/dashboard/dynamicPractice/TestQuestionCard";
import TestReadingCard from "@/components/dashboard/dynamicPractice/TestReadingCard";
import TestTranscripts from "@/components/dashboard/dynamicPractice/TestTranscripts";
import DialogAdvancedVocabulary from "@/components/dashboard/practiceDialog/DialogAdvanedVocab";
import DialogCriterionScores from "@/components/dashboard/practiceDialog/DialogCriteriaScores";
import DialogImprovementTips from "@/components/dashboard/practiceDialog/DialogGeneralTips";
import DialogGrammarErrors, {
  DialogGrammarError,
} from "@/components/dashboard/practiceDialog/DialogGrammarErrors";
import DialogPronunciationIssues from "@/components/dashboard/practiceDialog/DialogPronunciation";
import DialogRepetitions, {
  DialogRepetition,
} from "@/components/dashboard/practiceDialog/DialogRepetitions";
import DialogSentences from "@/components/dashboard/practiceDialog/DialogSentences";
import DialogStrongSides from "@/components/dashboard/practiceDialog/DialogStrongSides";
import DialogWeakSides from "@/components/dashboard/practiceDialog/DialogWeakSides";
import LoadingSmallUI from "@/components/loadingSmallUI";
import { useGlobalPracticeTestsStore } from "@/lib/practiceTestStore";
import { useUserStore } from "@/lib/userStorage";
import React, { use } from "react";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const getTest = useGlobalPracticeTestsStore((state) => state.getPracticeByID);
  const practiceTest = getTest(id);
  const firstName = useUserStore((state) => state.firstName);
  const lastName = useUserStore((state) => state.lastName);

  console.log(practiceTest);

  if (!practiceTest || !practiceTest.result) {
    return <LoadingSmallUI />;
  }
  return (
    <div className="w-full flex flex-col gap-6 bg-gray-50 pb-6">
      <DashboardHeader />
      <div className="px-4 lg:px-6 grid grid-cols-1 gap-6 lg:grid-cols-1">
        <TestHeader
          testName={practiceTest.practice_name}
          testID={practiceTest.id}
          overallBand={practiceTest.result?.overall_score}
        />
        <TestMetadata
          testAssistant={practiceTest.assistant}
          userName={firstName + " " + lastName}
          status={practiceTest.status}
          partsFinished={3}
          testDate={new Date(practiceTest.test_date)}
          testDuration={practiceTest.test_duration}
        />
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 pt-0 h-full w-full lg:justify-items-start-start lg:items-start">
          <DialogCriterionScores
            criteria={practiceTest.result.criterion_scores}
          />
          <DialogStrongSides strongSides={practiceTest.result.strong_points} />
          <DialogWeakSides weakSides={practiceTest.result.weak_sides} />
          <DialogSentences
            sentences={practiceTest.result.sentence_improvements}
          />
          <DialogGrammarErrors grammar={practiceTest.result.grammar_errors} />
          <DialogAdvancedVocabulary
            vocabulary={practiceTest.result.vocabulary_usage}
          />
          <DialogRepetitions repetitions={practiceTest.result.repeated_words} />
          <DialogPronunciationIssues
            pronunIssues={practiceTest.result.pronunciation_issues}
          />
          <DialogImprovementTips
            generalTips={practiceTest.result.general_tips}
          />
          <TestQuestionCard questionCard={practiceTest.part_two_card} />
          <TestReadingCard questionCard={practiceTest.reading_cards[0]} />
          <TestTranscripts transcriptions={practiceTest.transcription} />
        </div>
      </div>
    </div>
  );
}
