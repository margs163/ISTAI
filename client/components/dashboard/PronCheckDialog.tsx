import React, { useCallback, useEffect, useRef, useState } from "react";
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
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  fetchReadingCard,
  PostPronunciationTest,
  sendReadingCardSpeech,
} from "@/lib/queries";
import LoadingSmallUI from "../loadingSmallUI";
import { toast } from "sonner";
import { PronCheckControls } from "./PronCheckControls";
import MainButton from "../MainButton";
import PronunCheckCard from "./PronunCheckCard";
import { cn } from "@/lib/utils";
import Loading from "@/app/(auth)/login/loading";
import { PronunciationTestType } from "@/lib/types";
import PronCheckResults from "./PronCheckResults";

export default function PronCheckDialog({
  dialogOpen,
  setDialogOpen,
}: {
  dialogOpen: boolean;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const mediaStream = useRef<MediaStream>(null);
  const mediaRecorder = useRef<MediaRecorder>(null);
  const audioContext = useRef<AudioContext>(null);
  const audioChunks = useRef<Array<Blob>>([]);
  const audioBlobs = useRef<Blob>(null);
  const animationId = useRef<number>(null);
  const audioAnalyzer = useRef<AnalyserNode>(null);
  const volumeSlider = useRef<HTMLDivElement>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [readingAudioPath, setReadingAudioPath] = useState<string>("");
  const [testResults, setTestResults] = useState<
    PronunciationTestType | undefined
  >();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["reading-card"],
    queryFn: async () => await fetchReadingCard(),
    staleTime: Infinity,
    enabled: dialogOpen,
  });

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["pronunciation-check"],
    mutationFn: PostPronunciationTest,
  });

  const recorderStopHandler = useCallback(async () => {
    audioBlobs.current = new Blob(audioChunks.current, {
      type: "audio/webm",
    });

    const filePath = await sendReadingCardSpeech(audioBlobs.current);
    if (filePath) {
      setReadingAudioPath(filePath);
    }

    audioBlobs.current = null;
  }, [setReadingAudioPath]);

  const initializeMediaRecorder = useCallback(async () => {
    if (navigator.mediaDevices && !mediaStream.current) {
      try {
        mediaStream.current = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        mediaRecorder.current = new MediaRecorder(mediaStream.current);

        audioContext.current = new AudioContext();
        const audioSource = audioContext.current.createMediaStreamSource(
          mediaStream.current
        );

        audioAnalyzer.current = audioContext.current.createAnalyser();
        audioSource.connect(audioAnalyzer.current);

        mediaRecorder.current.ondataavailable = (event: BlobEvent) => {
          if (event.data.size > 0) {
            audioChunks.current.push(event.data);
          }
        };

        mediaRecorder.current.onstop = recorderStopHandler;
      } catch (error) {
        toast("Failed to capture microphone", {
          description: "Could not initialize media stream",
          action: {
            label: "Log",
            onClick: () => console.log(error),
          },
        });
      }
    } else {
      toast("Browser does not support Media Devices", {
        description: "Could not initialize media stream",
        action: {
          label: "Log",
          onClick: () => console.log("Browser does not support Media Devices"),
        },
      });
    }
  }, []);

  const optimizedUpdateVisualSlider = useCallback(function updateVisualSlider(
    analyzer: AnalyserNode
  ) {
    const fbcArray = new Uint8Array(analyzer.frequencyBinCount);
    analyzer.getByteFrequencyData(fbcArray);

    let level =
      fbcArray.reduce((accum, val) => accum + val, 0) / fbcArray.length;

    if (level > 100) {
      level = 95;
    }

    if (volumeSlider.current) {
      volumeSlider.current.style.width = `${level}%`;
    }

    animationId.current = requestAnimationFrame(() =>
      updateVisualSlider(analyzer)
    );
  },
  []);

  const optimizedStartRecoring = useCallback(() => {
    if (mediaRecorder.current && audioAnalyzer.current) {
      mediaRecorder.current.start();
      optimizedUpdateVisualSlider(audioAnalyzer.current);
    }
  }, [optimizedUpdateVisualSlider]);

  const optimizedStopRecording = useCallback(() => {
    if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
      mediaRecorder.current.stop();
    }
    audioChunks.current = [];
    if (animationId.current && volumeSlider.current) {
      cancelAnimationFrame(animationId.current);
      animationId.current = null;
      volumeSlider.current.style.width = "10%";
    }
  }, []);

  const ToggleRecording = useCallback(async () => {
    if (isRecording) {
      optimizedStopRecording();
    } else {
      optimizedStartRecoring();
    }
    setIsRecording((prev) => {
      console.log("Toggled recording: ", !isRecording);
      return !prev;
    });

    if (audioContext.current?.state !== "running") {
      await audioContext.current?.resume();
    }
  }, [
    isRecording,
    optimizedStartRecoring,
    optimizedStopRecording,
    audioContext,
  ]);

  useEffect(() => {
    if (dialogOpen) {
      initializeMediaRecorder();
    }

    return () => {
      if (mediaStream.current) {
        mediaStream.current.getTracks().forEach((track) => track.stop());
        mediaStream.current = null;
      }
      if (mediaRecorder.current) {
        mediaRecorder.current.stop();
        mediaRecorder.current = null;
      }
      if (audioContext.current) {
        audioContext.current = null;
      }
    };
  }, [dialogOpen]);

  const handleAnalyzeClick = async () => {
    if (audioChunks.current.length === 0 || !readingAudioPath || !data) {
      return;
    }

    const results = await mutateAsync({
      audioPath: readingAudioPath,
      readingCard: data,
    });
    setReadingAudioPath("");
    if (!results) {
      return;
    }

    console.log(results);
    setTestResults(results);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="font-geist max-h-[600px] overflow-y-scroll max-w-[800px]">
        <DialogHeader className="items-start text-left">
          <DialogTitle className="text-base text-gray-800 font-semibold">
            Pronunciation Check
          </DialogTitle>
          <DialogDescription className="text-sm font-normal">
            You are gonna recieve a reading card. You will need to record
            yourself reading this card.
          </DialogDescription>
        </DialogHeader>
        {testResults ? (
          <PronCheckResults testResults={testResults} />
        ) : isPending ? (
          <LoadingSmallUI />
        ) : (
          <main className="space-y-4 mt-4">
            {isLoading && <LoadingSmallUI />}
            {data && (
              <div className="flex flex-col gap-4">
                <PronunCheckCard questionCard={data}>
                  <PronCheckControls
                    isRecording={isRecording}
                    volumeSliderRef={volumeSlider}
                    ToggleRecording={ToggleRecording}
                  />
                </PronunCheckCard>
              </div>
            )}
          </main>
        )}
        <DialogFooter className="mt-4">
          <div className="flex flex-row gap-2 items-start justify-end">
            <MainButton
              onClick={handleAnalyzeClick}
              disabled={!readingAudioPath || isPending}
              className=" self-end bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-600 ml-0 disabled:cursor-not-allowed disabled:bg-indigo-400 disabled:text-gray-100"
            >
              Analyze
            </MainButton>
            <DialogClose asChild>
              <MainButton variant="secondary" className="ml-0 self-end">
                Cancel
              </MainButton>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
