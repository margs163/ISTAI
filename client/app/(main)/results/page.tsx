"use client";
import Footer from "@/components/Footer";
import AdvancedVocabulary from "@/components/results/AdvancedVocabulary";
import CriterionScores from "@/components/results/CriterionScores";
import { FeedbackPoster } from "@/components/results/Feedback";
import GrammarErrors from "@/components/results/GrammarErrors";
import ImprovementTips from "@/components/results/ImprovementTips";
import LoadingProgress from "@/components/results/LoadingProgress";
import Overall from "@/components/results/Overall";
import PronunciationIssues from "@/components/results/PronunciationIssues";
import RepeatedWords from "@/components/results/Repetitions";
import ResultsHeader from "@/components/results/ResultsHeader";
import SentenceImprovements from "@/components/results/SentenceImprovements";
import StrongAspects from "@/components/results/StrongAspects";
import WeakAspects from "@/components/results/WeakAspects";
import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";
import { useLocalPracticeTestStore } from "@/lib/practiceTestStore";
import {
  checkFeedbackRecord,
  getWordsPronunciation,
  updateAnalytics,
  updatePracticeTest,
  updateSubscription,
} from "@/lib/queries";
import { useWordsTTSStore } from "@/lib/ttsStore";
import {
  QuestionCardType,
  ReadingCardType,
  ResultSchema,
  TestTranscriptionsType,
} from "@/lib/types";
import { useUserStore } from "@/lib/userStorage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, {
  useEffect,
  useRef,
  useCallback,
  useState,
  useTransition,
} from "react";
import { toast } from "sonner";
import { useRefundStore } from "@/lib/refundStore";
import { useTestTranscriptionStore } from "@/lib/testTranscriptionStore";
import { useChatStore } from "@/lib/chatStore";
import UnexpectedError from "@/components/UnexpectedError";

export default function Page() {
  const queryClient = useQueryClient();
  const readingCards = useLocalPracticeTestStore(
    (state) => state.reading_cards
  );
  const user_id = useUserStore((state) => state.id);
  const transcriptions = useLocalPracticeTestStore(
    (state) => state.transcription
  );
  const audioPath = useLocalPracticeTestStore(
    (state) => state.readingAudioPath
  );
  const testId = useLocalPracticeTestStore((state) => state.id);
  const status = useLocalPracticeTestStore((state) => state.status);
  const practiceName = useLocalPracticeTestStore(
    (state) => state.practice_name
  );
  const testDuration = useLocalPracticeTestStore(
    (state) => state.test_duration
  );
  const printRef = useRef<HTMLDivElement>(null);
  const partTwoCard = useLocalPracticeTestStore((state) => state.part_two_card);
  const setTTSWords = useWordsTTSStore((state) => state.setUrls);
  const refunded = useRefundStore((state) => state.practiceRefunded);
  const setRefunded = useRefundStore((state) => state.setPracticeRefunded);
  const restoreChatMessages = useChatStore((state) => state.restoreMessages);
  const resetTranscriptions = useTestTranscriptionStore(
    (state) => state.restoreTranscriptions
  );
  const resetLocalPracticeTest = useLocalPracticeTestStore(
    (state) => state.resetLocalPracticeTest
  );

  const [isPending, startTransition] = useTransition();

  const setResults = useLocalPracticeTestStore((state) => state.setTestResult);
  const results = useLocalPracticeTestStore((state) => state.result);
  const socketRef = useRef<WebSocket>(null);
  const [posted, setPosted] = useState<boolean>(false);

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [progress, setProgress] = useState(13);
  const [refundMutated, setRefundMutated] = useState(false);
  const [error, setError] = useState<{ message: string }>();

  const { data } = useQuery({
    queryKey: ["feedback-get"],
    queryFn: checkFeedbackRecord,
  });

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
      setError({ message: "Could not update a practice test" });
      // toast("Error updating practice test", {
      //   description: "Could not update practice test",
      //   action: {
      //     label: "Log",
      //     onClick: () => console.error(error),
      //   },
      // });
    },
  });

  const reclaimMutation = useMutation({
    mutationKey: ["refund-practice"],
    mutationFn: updateSubscription,
  });

  useEffect(() => {
    if (error?.message) {
      if (!refundMutated && !refunded) {
        reclaimMutation.mutate({ refund_credits: 10 });
        setRefundMutated(true);
        setRefunded(true);

        restoreChatMessages();
        resetTranscriptions();
        resetLocalPracticeTest();

        queryClient.invalidateQueries({ queryKey: ["subscription-fetch"] });
      }
    }
  }, [refundMutated, refunded, error?.message]);

  const sendResults = useCallback(
    (
      transcriptions: TestTranscriptionsType,
      readingCards: ReadingCardType[],
      testId: string,
      audioPath: string,
      status: "Ongoing" | "Cancelled" | "Finished" | "Paused",
      testDuration: number,
      partTwoCard: QuestionCardType
    ) => {
      console.log("Sending results");

      const body = {
        readingCard: {
          topic: readingCards[0].topic,
          text: readingCards[0].text,
        },
        transcription: {
          test_id: testId,
          part_one: transcriptions.part_one,
          part_two: transcriptions.part_two,
          part_three: transcriptions.part_three,
        },
        reading_audio_path: audioPath,
        score_threshold: 0.5,
        user_id: user_id,
      };

      console.log("SocketRef readyState:", socketRef.current?.readyState);
      if (socketRef.current && socketRef.current.readyState == WebSocket.OPEN) {
        console.log("Sending JSON to websocket");
        socketRef.current.send(JSON.stringify(body));
        mutation_test.mutate({
          data: {
            transcription: transcriptions,
            part_two_card_id: partTwoCard?.id,
            test_duration: testDuration,
            status: status,
            reading_cards: readingCards,
          },
          practiceTestId: testId,
        });
        setPosted(true);
      }

      console.log("Updating practice test");
    },
    [user_id]
  );

  const messageHandler = useCallback(
    async (event: MessageEvent) => {
      let data;
      try {
        data = JSON.parse(event.data);
      } catch {
        switch (event.data) {
          case "Invoking general graph":
            setProgress(30);
            setStep(1);
            break;
          case "Invoking sentences graph":
            setProgress(50);
            setStep(2);
            break;
          case "Transcribing reading speech":
            setProgress(70);
            setStep(3);
            break;
          case "Invoking pronunciation agent":
            setProgress(90);
            setStep(4);
            break;
          default:
            break;
        }
        return;
      }

      if (data && data.data) {
        const validated = await ResultSchema.safeParseAsync(data.data);

        if (validated.error) {
          setError({ message: "Could not vaidate a results schema" });
          // toast.error("Validation Error", {
          //   description: "Could not validate a results schema",
          //   action: {
          //     label: "Log",
          //     onClick: () => console.log(validated.error.message),
          //   },
          // });
          return;
        }

        setResults(validated.data);
        sessionStorage.setItem(
          "local-practice-test",
          JSON.stringify(validated.data)
        );

        if (!testDuration) {
          setError({ message: "Could not post rest results" });
          // toast.error("Error posting results", {
          //   description: "Could not post test results",
          //   action: {
          //     label: "Log",
          //     onClick: () => console.error("No test duration"),
          //   },
          // });
          return;
        }

        const audioUrls = await getWordsPronunciation(
          validated.data.pronunciation_issues.map((item) => item.word)
        );

        if (audioUrls) {
          setTTSWords(audioUrls);
        }

        await mutation.mutateAsync({
          practice_time: testDuration,
          tests_completed: 1,
          current_bandscore: validated.data.overall_score,
          average_band_scores: validated.data.criterion_scores,
          average_band: validated.data.overall_score,
          streak_days: 1,
          grammar_common_mistakes:
            validated.data.grammar_errors.grammar_analysis.map((item) => ({
              ...item,
              frequency: 1,
            })),
          lexis_common_mistakes:
            validated.data.sentence_improvements.vocabulary_enhancements.map(
              (item) => ({
                ...item,
                frequency: 1,
              })
            ),
          pronunciation_common_mistakes:
            validated.data.pronunciation_issues.map((item) => ({
              ...item,
              frequency: 1,
            })),
        });
      }
    },
    [testDuration, sendResults]
  );

  const onOpenHandler = useCallback(() => {
    const readyParams =
      readingCards &&
      readingCards.length > 0 &&
      typeof audioPath === "string" &&
      transcriptions &&
      testDuration &&
      partTwoCard;

    const resultSession = sessionStorage.getItem("local-practice-test");
    console.log(
      readyParams,
      `ReadyParams. Reading Cards:\n${readingCards}\n\nAudio Path:\n${audioPath}\n\nTranscriptions:\n${transcriptions}`
    );

    if (resultSession) {
      setResults(JSON.parse(resultSession));
    } else if (!posted && readyParams) {
      sendResults(
        transcriptions,
        readingCards,
        testId,
        audioPath,
        status,
        testDuration,
        partTwoCard
      );
    }
  }, [
    readingCards,
    audioPath,
    transcriptions,
    testDuration,
    partTwoCard,
    posted,
    status,
    testId,
  ]);

  const handleExport = useCallback(async () => {
    startTransition(async () => {
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

      pdf.save(`results-${practiceName}.pdf`);
    });
  }, [practiceName]);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = new WebSocket(
        `${process.env.NEXT_PUBLIC_WS_URL}/results/ws`
      );
    }

    socketRef.current.onopen = onOpenHandler;
    socketRef.current.onmessage = messageHandler;
  }, [onOpenHandler, messageHandler]);

  if (mutation_test.isError)
    return (
      <h1 className="text-3xl text-gray-800">
        Could not update a practice test: {mutation_test.error.message}
      </h1>
    );

  if (mutation.isError)
    return (
      <h1 className="text-3xl text-gray-800">
        Could not update analytics: {mutation.error.message}
      </h1>
    );

  if (!results) return <LoadingProgress step={step} progress={progress} />;

  return (
    <>
      {error?.message ? (
        <div className="flex flex-col gap-6 items-center justify-center min-h-screen w-full font-geist">
          <UnexpectedError setRefunded={setRefunded} />
        </div>
      ) : (
        <div
          className="font-geist w-full min-h-screen flex flex-col gap-6 lg:gap-10 bg-gray-50 pt-24 lg:pt-32 pb-0"
          ref={printRef}
        >
          <ResultsHeader
            handleExport={handleExport}
            testTime={testDuration ?? 0}
          />
          <Overall score={results.overall_score} />
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
          {!data && <FeedbackPoster hasFeedback={data} />}
          <Footer />
        </div>
      )}
    </>
  );
}
