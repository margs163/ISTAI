"use client";
import Footer from "@/components/Footer";
import LoadingUI from "@/components/loadingUI";
import AdvancedVocabulary from "@/components/results/AdvancedVocabulary";
import CriterionScores from "@/components/results/CriterionScores";
import GrammarErrors from "@/components/results/GrammarErrors";
import ImprovementTips from "@/components/results/ImprovementTips";
import Overall from "@/components/results/Overall";
import PronunciationIssues from "@/components/results/PronunciationIssues";
import RepeatedWords from "@/components/results/Repetitions";
import ResultsHeader from "@/components/results/ResultsHeader";
import SentenceImprovements from "@/components/results/SentenceImprovements";
import StrongAspects from "@/components/results/StrongAspects";
import WeakAspects from "@/components/results/WeakAspects";
import { useLocalPracticeTestStore } from "@/lib/practiceTestStore";
import {
  postTestResults,
  updateAnalytics,
  updatePracticeTest,
} from "@/lib/queries";
import { ResultType } from "@/lib/types";
import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useRef } from "react";
import { toast } from "sonner";

export default function Page() {
  const localPracticeTest = useLocalPracticeTestStore((state) => state);
  const setResults = useLocalPracticeTestStore((state) => state.setTestResult);
  const results = useLocalPracticeTestStore((state) => state.result);
  const postedRef = useRef<boolean>(false);

  const mutation = useMutation({
    mutationKey: ["analytics-update"],
    mutationFn: updateAnalytics,
    onError: (error: Error) => {
      toast("Error posting results", {
        description: "Could not post test results",
        action: {
          label: "Log",
          onClick: () => console.error(error),
        },
      });
    },
  });

  const mutation_test = useMutation({
    mutationKey: ["test-update"],
    mutationFn: updatePracticeTest,
    onError: (error: Error) => {
      toast("Error updating practice test", {
        description: "Could not update practice test",
        action: {
          label: "Log",
          onClick: () => console.error(error),
        },
      });
    },
  });

  const { mutateAsync, isPending, isError, isSuccess, error, data } =
    useMutation({
      mutationKey: ["results"],
      mutationFn: postTestResults,
      onSuccess: async (data: ResultType) => {
        setResults(data);
        if (!localPracticeTest.test_duration) {
          toast("Error posting results", {
            description: "Could not post test results",
            action: {
              label: "Log",
              onClick: () => console.error(error),
            },
          });
        } else {
          await mutation.mutateAsync({
            practice_time: localPracticeTest.test_duration,
            tests_completed: 1,
            current_bandscore: data.overall_score,
            average_band_scores: data.criterion_scores,
            average_band: data.overall_score,
            streak_days: 1,
            grammar_common_mistakes: data.grammar_errors.grammar_analysis.map(
              (item) => ({ ...item, frequency: 1 })
            ),
            lexis_common_mistakes:
              data.sentence_improvements.vocabulary_enhancements.map(
                (item) => ({
                  ...item,
                  frequency: 1,
                })
              ),
            pronunciation_common_mistakes: data.pronunciation_issues.map(
              (item) => ({ ...item, frequency: 1 })
            ),
          });
        }
      },
      onError: (error) => {
        toast("Error posting results", {
          description: "Could not post test results",
          action: {
            label: "Log",
            onClick: () => console.log(error),
          },
        });
      },
    });

  useEffect(() => {
    const readingCards = localPracticeTest.reading_cards;
    const audioPath = localPracticeTest.readingAudioPath;
    const transcription = localPracticeTest.transcription;
    const readyParams =
      readingCards &&
      readingCards.length > 0 &&
      typeof audioPath === "string" &&
      transcription;

    const resultSession = sessionStorage.getItem("local-practice-test");

    async function sendResults() {
      if (resultSession) {
        setResults(JSON.parse(resultSession));
        console.log("We have got the results session");
      } else if (readyParams && !postedRef.current) {
        console.log("mutating");
        postedRef.current = true;
        await mutation_test.mutateAsync({
          data: {
            transcription: transcription,
            part_two_card_id: localPracticeTest?.part_two_card?.id,
            test_duration: localPracticeTest.test_duration,
            status: localPracticeTest.status,
            reading_cards: localPracticeTest.reading_cards,
          },
          practiceTestId: localPracticeTest.id,
        });
        await mutateAsync({
          readingCard: readingCards[0],
          readingCardAudioPath: audioPath,
          transcription: transcription,
          testId: localPracticeTest.id,
        });

        console.log("mutation were run");
      }
    }

    sendResults();
  }, []);

  if (isError)
    return (
      <h1 className="text-3xl text-gray-800">
        Could not create results: {error.message}
      </h1>
    );

  if (isPending) return <LoadingUI />;

  if (isSuccess || results) {
    if (isSuccess) {
      console.log("Session storage JSON was set");
      sessionStorage.setItem("local-practice-test", JSON.stringify(data));
    }
    return (
      <div className="font-geist w-full min-h-screen flex flex-col gap-6 lg:gap-10 bg-gray-50 pt-24 lg:pt-32 pb-0">
        <ResultsHeader />
        <Overall score={results?.overall_score ?? 6.0} />
        <CriterionScores />
        <div className="lg:px-20 lg:grid-cols-2 lg:grid lg:gap-6 space-y-6 lg:space-y-0 xl:px-36">
          <StrongAspects />
          <WeakAspects />
        </div>
        <SentenceImprovements />
        <GrammarErrors />
        <div className="lg:px-20 lg:grid-cols-2 lg:grid lg:gap-6 space-y-6 xl:px-36 lg:space-y-0">
          <AdvancedVocabulary />
          <RepeatedWords />
        </div>
        <PronunciationIssues />
        <ImprovementTips />
        <Footer />
      </div>
    );
  }
}
