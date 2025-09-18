"use client";
import CharacterSection from "@/components/practice/CharacterSection";
import Chat from "@/components/practice/Chat";
import PartInfo from "@/components/practice/PartInfo";
import QuickTestActions from "@/components/practice/QuickTestActions";
import TestProgress from "@/components/practice/TestProgress";
import TestSession from "@/components/practice/TestSession";
import { useChatStore } from "@/lib/chatStore";
import { useMetadataStore } from "@/lib/metadataStore";
import { useTestSessionStore } from "@/lib/testSessionStore";
import {
  ChatMessageType,
  ChatSocketMessage,
  ChatSocketResponseSchema,
  TranscribedMessage,
  TranscriptionMessageType,
} from "@/lib/types";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import CustomTooltip from "@/components/practice/CustomTooltip";
import IntroductionDialog from "@/components/practice/IntroductionDialog";
import { tourSteps, dialogInfo } from "@/lib/constants";
import dynamic from "next/dynamic";
import PauseDialog from "@/components/practice/PauseDialog";
import { useQuery } from "@tanstack/react-query";
import { useLocalPracticeTestStore } from "@/lib/practiceTestStore";
import { toast } from "sonner";
import { useTestTranscriptionStore } from "@/lib/testTranscriptionStore";
import Confetti from "react-confetti";
import {
  fetchPart1QuestionCard,
  fetchPart2QuestionCard,
  fetchReadingCard,
  sendReadingCardSpeech,
} from "@/lib/queries";
import { useWindowSize } from "react-use";
import { getSecondsDifference } from "@/lib/utils";

const Joyride = dynamic(() => import("react-joyride"), { ssr: false });

export default function Page() {
  const { width, height } = useWindowSize();
  const setMetadata = useMetadataStore((state) => state.setMetadataData);
  const addTranscriptionsLocal = useLocalPracticeTestStore(
    (state) => state.setTranscriptions
  );
  const setTestDuration = useLocalPracticeTestStore(
    (state) => state.setTestDuration
  );
  const addTranscription = useTestTranscriptionStore(
    (state) => state.addTranscription
  );
  const restoreChatMessages = useChatStore((state) => state.restoreMessages);
  const transcriptionsState = useTestTranscriptionStore((state) => state);
  const addMessage = useChatStore((state) => state.addMessage);
  const messages = useChatStore((state) => state.messages);
  const sessionState = useTestSessionStore((state) => state);
  const setSession = useTestSessionStore((state) => state.setSessionData);
  const startTime = useLocalPracticeTestStore((state) => state.startDatetime);
  const setStartTime = useLocalPracticeTestStore(
    (state) => state.setStartDateTime
  );
  const setPart2Question = useLocalPracticeTestStore(
    (state) => state.setPartTwoCard
  );
  const part2Question = useLocalPracticeTestStore(
    (state) => state.part_two_card
  );
  const setReadingCard = useLocalPracticeTestStore(
    (state) => state.setReadingCards
  );
  const setReadingAudioPath = useLocalPracticeTestStore(
    (state) => state.setReadingAudioPath
  );
  const testStatus = useLocalPracticeTestStore((state) => state.status);
  const setStatus = useLocalPracticeTestStore((state) => state.setStatus);
  const transcribeWebsocketRef = useRef<WebSocket>(null);
  const chatWebsocketRef = useRef<WebSocket>(null);

  const mediaStream = useRef<MediaStream>(null);
  const mediaRecorder = useRef<MediaRecorder>(null);
  const audioContext = useRef<AudioContext>(null);
  const audioChunks = useRef<Array<Blob>>([]);
  const audioBlobs = useRef<Blob>(null);
  const animationId = useRef<number>(null);
  const audioAnalyzer = useRef<AnalyserNode>(null);

  const volumeSlider = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioFile = useRef<HTMLAudioElement>(null);
  const instructionsAudio = useRef<HTMLAudioElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [partTwoTime, setPartTwoTime] = useState(20);
  const [dialogOpen, setDialogOpen] = useState(true);
  const [runTour, setRunTour] = useState(false);
  const [controlsDialogOpen, setControlsDialogOpen] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const [isAnsweringQuestion, setIsAnsweringQuestion] = useState(false);
  const [greetingPlayed, setGreetingPlayed] = useState(false);
  const [openReadingCard, setOpenReadingCard] = useState(false);
  const [runConfetti, setRunConfetti] = useState(false);
  const [firstMesssage, setFirstMessage] = useState(true);

  const { data } = useQuery({
    queryKey: ["part1-card"],
    queryFn: fetchPart1QuestionCard,
  });

  useQuery({
    queryKey: ["question-card-2"],
    queryFn: async () => await fetchPart2QuestionCard(setPart2Question),
    enabled: sessionState.currentPart === 2,
  });

  useQuery({
    queryKey: ["reading-card"],
    queryFn: async () => await fetchReadingCard(setReadingCard),
  });

  const playTTSAudio = useCallback(
    async (fileKey: string) => {
      try {
        const response = await fetch(`/api/tts?fileKey=${fileKey}`);
        if (!response.ok) {
          throw new Error("Could not fetch audio");
        }
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        if (audioFile.current) {
          audioFile.current.src = url;
        } else {
          audioFile.current = new Audio(url);
        }

        audioFile.current.oncanplaythrough = () => {
          if (
            instructionsAudio.current &&
            !instructionsAudio.current?.paused &&
            sessionState.currentPart === 3
          ) {
            instructionsAudio.current.onended = () => {
              audioFile.current?.play();
            };
          } else {
            audioFile.current?.play();
          }
        };

        audioFile.current.onplay = () => {
          if (videoRef.current) {
            videoRef.current.play();
            videoRef.current.muted = true;
          }
        };

        audioFile.current.ontimeupdate = () => {
          if (audioFile.current?.ended) {
            if (videoRef.current) {
              videoRef.current.pause();
              videoRef.current.currentTime = 0;
            }
          }
        };
      } catch {
        toast("Failed TTS fetch", {
          description: "Could not fetch TTS blobs",
          action: {
            label: "Log",
            onClick: () => console.log("Could not fetch TTS blobs"),
          },
        });
      }
    },
    [sessionState.currentPart]
  );

  const playInstructionsAudioWithVideo = useCallback(
    (
      src:
        | "part2switch.mp3"
        | "part3switch.mp3"
        | "greeting.mp3"
        | "reading.mp3"
    ) => {
      const source = src.split(".")[0] + sessionState.assistant + ".mp3";
      if (instructionsAudio.current) {
        instructionsAudio.current.src = source;
      } else {
        instructionsAudio.current = new Audio(source);
      }

      instructionsAudio.current.oncanplaythrough = () => {
        instructionsAudio.current?.play();
        if (videoRef.current) {
          videoRef.current.play();
          videoRef.current.muted = true;
        }
      };

      instructionsAudio.current.ontimeupdate = () => {
        if (instructionsAudio.current?.ended) {
          if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
          }
        }
      };
    },
    []
  );

  const sendChatWebsocketMessage = useCallback(
    (message: ChatSocketMessage) => {
      if (sessionState.currentPart !== 2) {
        chatWebsocketRef.current?.send(JSON.stringify(message));
      } else {
        playInstructionsAudioWithVideo("part3switch.mp3");
        const copySession = { ...sessionState };
        copySession.currentPart = 3;
        chatWebsocketRef.current?.send(JSON.stringify(message));
        setSession(copySession);
        setDialogOpen(true);
      }
    },
    [playInstructionsAudioWithVideo, sessionState, setSession]
  );

  const transcribeSocketMessageHandler = useCallback(
    (event: MessageEvent) => {
      const message = JSON.parse(event.data);
      const result = TranscribedMessage.safeParse(message);

      if (!result.success) {
        toast("Failed parsing", {
          description: "Could not parse TTS websocket message",
          action: {
            label: "Log",
            onClick: () => console.log(result.error),
          },
        });
        return;
      }

      const text = result.data.text;
      const metadata = {
        no_speech_prob: result.data.no_speech_prob,
        avg_logprob: result.data.avg_logprob,
        compression_ratio: result.data.compression_ratio,
        count: 1,
      };

      setMetadata(metadata);

      const userMessage: ChatMessageType = {
        role: "User",
        messageId: uuidv4(),
        text: text,
        time: getSecondsDifference(startTime, new Date()),
      };

      const transcription: TranscriptionMessageType = {
        name: sessionState.user as string,
        text: text,
        time: getSecondsDifference(startTime, new Date()),
      };
      const part =
        sessionState.currentPart === 1
          ? "partOne"
          : sessionState.currentPart === 2
          ? "partTwo"
          : "partThree";
      addTranscription(part, transcription);
      addMessage(userMessage);
      let chatSocketMessage: null | ChatSocketMessage = null;

      if (sessionState.currentPart === 1 && firstMesssage && data) {
        chatSocketMessage = {
          type: "userResponse",
          part: sessionState.currentPart as 1 | 2 | 3,
          assistant: sessionState.assistant as string,
          text: `${text}\nTopic:${data.topic}, questions: ${data.questions}`,
        };
        console.log(data);
        console.log(chatSocketMessage);
        setFirstMessage(false);
      } else if (sessionState.currentPart === 2 && part2Question) {
        chatSocketMessage = {
          type: "part2QuestionCard",
          part: 3,
          text: text,
          assistant: sessionState.assistant as "Ron" | "Emma",
          questionCard: part2Question,
        };
      } else {
        chatSocketMessage = {
          type: "userResponse",
          part: sessionState.currentPart as 1 | 2 | 3,
          assistant: sessionState.assistant as string,
          text: text,
        };
      }
      sendChatWebsocketMessage(chatSocketMessage);
    },
    [
      startTime,
      addMessage,
      addTranscription,
      part2Question,
      sendChatWebsocketMessage,
      sessionState.currentPart,
      sessionState.user,
      setMetadata,
      sessionState.assistant,
    ]
  );

  const chatWebsocketMessageHandler = useCallback(
    (event: MessageEvent) => {
      const message = JSON.parse(event.data);
      const result = ChatSocketResponseSchema.safeParse(message);
      if (!result.success) {
        toast("Failed parsing", {
          description: "Could not parse chat websocket message",
          action: {
            label: "Log",
            onClick: () => console.log(result.error),
          },
        });
        return;
      }

      const data = result.data;

      switch (data.type) {
        case "endTest":
          playInstructionsAudioWithVideo("reading.mp3");
          setOpenReadingCard(true);
          break;

        case "ttsFileName":
          const assistantMessage: ChatMessageType = {
            role: "Assistant",
            messageId: uuidv4(),
            text: data.text,
            time: getSecondsDifference(startTime, new Date()),
          };
          const transcription: TranscriptionMessageType = {
            name: sessionState.assistant as "Ron" | "Emma",
            text: data.text,
            time: getSecondsDifference(startTime, new Date()),
          };
          const part =
            sessionState.currentPart === 1
              ? "partOne"
              : sessionState.currentPart === 2
              ? "partTwo"
              : "partThree";
          addTranscription(part, transcription);
          addMessage(assistantMessage);
          if (data.filename && !openReadingCard) {
            console.log("PLAYING TTS");
            playTTSAudio(data.filename);
          }
          break;

        case "switchToPart2":
          playInstructionsAudioWithVideo("part2switch.mp3");
          const copySession = { ...sessionState };
          copySession.currentPart = 2;
          setSession(copySession);
          setDialogOpen(true);
          break;
      }
    },
    [startTime, playInstructionsAudioWithVideo, playTTSAudio, sessionState]
  );

  const recorderStopHandler = useCallback(async () => {
    audioBlobs.current = new Blob(audioChunks.current, { type: "audio/webm" });

    if (openReadingCard) {
      const filePath = await sendReadingCardSpeech(audioBlobs.current);
      if (filePath) {
        setReadingAudioPath(filePath);
      }
      setOpenReadingCard(false);
    } else {
      const reader = new FileReader();
      reader.readAsArrayBuffer(audioBlobs.current);

      reader.onloadend = () => {
        if (transcribeWebsocketRef.current && reader.result) {
          transcribeWebsocketRef.current.send(reader.result);
        }
      };
    }
    audioBlobs.current = null;
  }, [openReadingCard]);

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

  useEffect(() => {
    if (!transcribeWebsocketRef.current && !chatWebsocketRef.current) {
      transcribeWebsocketRef.current = new WebSocket(
        `${process.env.NEXT_PUBLIC_FASTAPI}/stt/ws`
      );
      chatWebsocketRef.current = new WebSocket(
        `${process.env.NEXT_PUBLIC_FASTAPI}/chat/ws`
      );
      setStartTime(new Date());
    }

    initializeMediaRecorder();

    return () => {
      if (transcribeWebsocketRef.current?.OPEN) {
        transcribeWebsocketRef.current.close();
        transcribeWebsocketRef.current = null;
      }
      if (chatWebsocketRef.current?.OPEN) {
        chatWebsocketRef.current.close();
        chatWebsocketRef.current = null;
      }
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
  }, [initializeMediaRecorder]);

  useEffect(() => {
    if (transcribeWebsocketRef.current) {
      transcribeWebsocketRef.current.addEventListener(
        "message",
        transcribeSocketMessageHandler
      );
    }

    if (chatWebsocketRef.current) {
      chatWebsocketRef.current.addEventListener(
        "message",
        chatWebsocketMessageHandler
      );
    }

    if (mediaRecorder.current) {
      mediaRecorder.current.addEventListener("stop", recorderStopHandler);
    }

    return () => {
      if (transcribeWebsocketRef.current) {
        transcribeWebsocketRef.current.removeEventListener(
          "message",
          transcribeSocketMessageHandler
        );
      }
      if (chatWebsocketRef.current) {
        chatWebsocketRef.current.removeEventListener(
          "message",
          chatWebsocketMessageHandler
        );
      }
      if (mediaRecorder.current) {
        mediaRecorder.current.removeEventListener("stop", recorderStopHandler);
      }
    };
  }, [
    chatWebsocketMessageHandler,
    transcribeSocketMessageHandler,
    dialogOpen,
    greetingPlayed,
    playInstructionsAudioWithVideo,
    recorderStopHandler,
    runTour,
  ]);

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

    if (sessionState.currentPart === 2) {
      setIsAnsweringQuestion(false);
    }

    if (openReadingCard) {
      const copySession2 = { ...sessionState };
      copySession2.status = "inactive";
      setSession(copySession2);
      setDialogOpen(true);
      setStatus("Finished");
      const finalTranscriptions = {
        part_one: transcriptionsState.partOne,
        part_two: [
          {
            name: "Assistant",
            text: `Now I'm going to give you a topic and I'd like you to talk about it for one to two minutes. Here's your topic card. - ${
              part2Question?.topic
            }. You should say:\n${part2Question?.questions.reduce(
              (prev, current) => prev + "\n" + current,
              ""
            )}`,
            time: getSecondsDifference(startTime, new Date()),
          },
          ...transcriptionsState.partTwo,
        ],
        part_three: transcriptionsState.partThree,
      };
      console.log(`Final Transcriptions:\n${finalTranscriptions}`);
      setRunConfetti(true);
      addTranscriptionsLocal(finalTranscriptions);
      setTestDuration(sessionState.duration);
      restoreChatMessages();
      transcriptionsState.restoreTranscriptions();
    }

    audioChunks.current = [];
    if (animationId.current && volumeSlider.current) {
      cancelAnimationFrame(animationId.current);
      animationId.current = null;
      volumeSlider.current.style.width = "10%";
    }
  }, [
    startTime,
    part2Question,
    openReadingCard,
    sessionState,
    transcriptionsState,
  ]);

  useEffect(() => {
    const staringdialogClosed = !runTour && !dialogOpen;
    if (staringdialogClosed && !greetingPlayed) {
      playInstructionsAudioWithVideo("greeting.mp3");
      setGreetingPlayed(true);
    }

    if (isAnsweringQuestion && !isRecording) {
      optimizedStartRecoring();
      setIsRecording(true);
    }

    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [
    isAnsweringQuestion,
    isRecording,
    optimizedStartRecoring,
    runTour,
    dialogOpen,
    playInstructionsAudioWithVideo,
    greetingPlayed,
    messages,
  ]);

  return (
    <div className="w-full min-h-screen flex flex-col gap-6 bg-gray-50 py-6 font-geist lg:grid lg:grid-cols-[0.5fr_0.8fr_0.5fr] xl:grid-cols-[0.38fr_0.84fr_0.38fr] lg:justify-items-stretch lg:items-stretch lg:gap-6 lg:w-full max-w-[1420px] mx-auto xl:py-8">
      <div className="space-y-6">
        <TestSession />
        <TestProgress />
        <Joyride
          // @ts-expect-error tour object is always error
          steps={tourSteps}
          run={runTour}
          continuous={true}
          scrollToFirstStep={true}
          showProgress={true}
          showSkipButton={true}
          callback={(data) => {
            if (data.status === "finished" || data.status === "skipped") {
              playInstructionsAudioWithVideo("greeting.mp3");
              setRunTour(false);
            }
          }}
          styles={{
            options: {
              primaryColor: "#3b82f6",
              zIndex: 1000,
            },
          }}
          floaterProps={{
            styles: {
              floater: {
                transition: "opacity 0.3s ease-in-out",
              },
            },
          }}
          tooltipComponent={CustomTooltip}
        />
      </div>
      <div className="space-y-6">
        <div className="lg:hidden">
          <PartInfo currentPart={1} />
        </div>
        <CharacterSection
          openReadingCard={openReadingCard}
          setOpenReadingCard={setOpenReadingCard}
          setControlsDialogOpen={setControlsDialogOpen}
          setPartTwoTime={setPartTwoTime}
          partTwoTime={partTwoTime}
          volumeSliderRef={volumeSlider}
          startRecording={optimizedStartRecoring}
          stopRecording={optimizedStopRecording}
          isRecording={isRecording}
          setIsRecording={setIsRecording}
          videoRef={videoRef}
          audioContext={audioContext}
          activePart={1}
          timerActive={timerActive}
          setTimerActive={setTimerActive}
          setIsAnsweringQuestion={setIsAnsweringQuestion}
        />
      </div>
      <div className="space-y-6">
        <Chat chatRef={chatRef} />
        <QuickTestActions
          audioFile={audioFile}
          instructionsAduio={instructionsAudio}
        />
        <IntroductionDialog
          setDialogOpen={setDialogOpen}
          setIsOpen={setRunTour}
          dialogOpen={dialogOpen}
          dialogInfo={dialogInfo}
          currentPart={sessionState.currentPart}
          status={testStatus}
        />
        <PauseDialog
          dialogOpen={controlsDialogOpen}
          setDialogOpen={setControlsDialogOpen}
        />
        <Confetti run={runConfetti} width={width} height={height} />
      </div>
    </div>
  );
}
