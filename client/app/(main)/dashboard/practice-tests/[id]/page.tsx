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
import DialogGrammarErrors from "@/components/dashboard/practiceDialog/DialogGrammarErrors";
import DialogPronunciationIssues from "@/components/dashboard/practiceDialog/DialogPronunciation";
import DialogRepetitions from "@/components/dashboard/practiceDialog/DialogRepetitions";
import DialogSentences from "@/components/dashboard/practiceDialog/DialogSentences";
import DialogStrongSides from "@/components/dashboard/practiceDialog/DialogStrongSides";
import DialogWeakSides from "@/components/dashboard/practiceDialog/DialogWeakSides";
import LoadingSmallUI from "@/components/loadingSmallUI";
import { useGlobalPracticeTestsStore } from "@/lib/practiceTestStore";
import { useUserStore } from "@/lib/userStorage";
import React, { use, useEffect, useMemo, useRef } from "react";
import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";
import { QuestionCardType } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { getWordsPronunciation } from "@/lib/queries";
import { useWordsTTSStore } from "@/lib/ttsStore";
import DashboardFooter from "@/components/dashboard/DashboardFooter";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const getTest = useGlobalPracticeTestsStore((state) => state.getPracticeByID);
  const practiceTest = useMemo(() => getTest(id), [id]);
  const firstName = useUserStore((state) => state.firstName);
  const lastName = useUserStore((state) => state.lastName);
  const printRef = useRef<HTMLDivElement>(null);
  const setTTSWords = useWordsTTSStore((state) => state.setUrls);

  useQuery({
    queryKey: ["tts-get"],
    queryFn: async () => {
      if (
        practiceTest &&
        practiceTest.result &&
        practiceTest.result.pronunciation_issues
      ) {
        const audioUrls = await getWordsPronunciation(
          practiceTest.result.pronunciation_issues.map((item) => item.word)
        );

        console.log(audioUrls);

        if (audioUrls) {
          setTTSWords(audioUrls);
        }

        return audioUrls;
      }
    },
    enabled: !!practiceTest,
  });

  if (!practiceTest || !practiceTest.result) {
    return <LoadingSmallUI />;
  }

  const handleExport = async () => {
    const element = printRef.current;
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      ignoreElements: (el) => el.classList?.contains("no-print"),
    });
    const imgData = canvas.toDataURL("image/jpeg");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgProps = pdf.getImageProperties(imgData);
    const imgWidth = pageWidth;
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

    let y = 0;
    let pageNum = 0;

    while (y < imgHeight) {
      if (pageNum > 0) pdf.addPage();

      pdf.addImage(imgData, "PNG", 0, -y, imgWidth, imgHeight);
      y += pageHeight;
      pageNum++;
    }

    pdf.save(`results-${practiceTest.practice_name}.pdf`);
  };

  return (
    <div className="w-full flex flex-col gap-6 bg-gray-50 pb-6">
      <DashboardHeader />
      <div
        ref={printRef}
        className="px-4 lg:px-8 grid grid-cols-1 gap-6 lg:grid-cols-1"
      >
        <TestHeader
          handleExport={handleExport}
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
          testDuration={practiceTest.test_duration ?? 0}
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
          <TestQuestionCard
            questionCard={practiceTest.part_two_card as QuestionCardType}
          />
          <TestReadingCard
            questionCard={
              practiceTest.reading_cards && practiceTest.reading_cards[0]
            }
          />
          <TestTranscripts transcriptions={practiceTest.transcription} />
        </div>
      </div>
      <DashboardFooter />
    </div>
  );
}
