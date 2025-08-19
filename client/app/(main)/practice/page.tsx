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
  QuestionCardType,
  TranscribedMessage,
} from "@/lib/types";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import CustomTooltip from "@/components/practice/CustomTooltip";
import IntroductionDialog from "@/components/practice/IntroductionDialog";
import { tourSteps, dialogInfo } from "@/lib/metadata";
import dynamic from "next/dynamic";
import PauseDialog from "@/components/practice/PauseDialog";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useLocalPracticeTestStore } from "@/lib/practiceTestStore";
import { toast } from "sonner";

const Joyride = dynamic(() => import("react-joyride"), { ssr: false });

export default function Page() {
  const setMetadata = useMetadataStore((state) => state.setMetadataData);
  const addMessage = useChatStore((state) => state.addMessage);
  const sessionState = useTestSessionStore((state) => state);
  const setSession = useTestSessionStore((state) => state.setSessionData);
  const setPart2Question = useLocalPracticeTestStore(
    (state) => state.setPartTwoCard
  );
  const part2Question = useLocalPracticeTestStore(
    (state) => state.part_two_card
  );
  const testStatus = useLocalPracticeTestStore((state) => state.status);
  const setStatus = useLocalPracticeTestStore((state) => state.setStatus);
  const transcribeWebsocketRef = useRef<WebSocket>(null);
  const chatWebsocketRef = useRef<WebSocket>(null);

  useQuery({
    queryKey: ["question-card"],
    queryFn: () =>
      axios
        .get<{ questions: QuestionCardType[] }>(
          "http://localhost:8000/questions/?part=2",
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        )
        .then((response) => {
          if (response.status === 200) {
            const question = response.data.questions[0];
            setPart2Question(question);
            console.log("WE SET THE QUESTION: ", question);
            return question;
          }
        })
        .catch((error) => console.error(error)),
  });

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

  const [isRecording, setIsRecording] = useState(false);
  const [partTwoTime, setPartTwoTime] = useState(20);
  const [dialogOpen, setDialogOpen] = useState(true);
  const [runTour, setRunTour] = useState(false);
  const [controlsDialogOpen, setControlsDialogOpen] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const [isAnsweringQuestion, setIsAnsweringQuestion] = useState(false);

  const playTTSAudio = useCallback((fileKey: string) => {
    fetch(`/api/tts?fileKey=${fileKey}`)
      .then((response) => {
        if (!response.ok) {
          console.error("Could not fetch an audio.");
        }
        return response.blob();
      })
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        audioFile.current = new Audio();
        audioFile.current.src = url;
        audioFile.current.play();

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
      })
      .catch((error) => console.error(error));
  }, []);

  const playInstructionsAudioWithVideo = useCallback(
    (src: "part2switch.mp3" | "part3switch.mp3" | "greeting.mp3") => {
      if (instructionsAudio.current) {
        instructionsAudio.current.src = src;
      } else {
        instructionsAudio.current = new Audio(src);
      }
      instructionsAudio.current.oncanplaythrough = () => {
        instructionsAudio.current?.play();
        if (videoRef.current) {
          videoRef.current.play();
          videoRef.current.muted = false;
        }
      };

      instructionsAudio.current.ontimeupdate = () => {
        if (audioFile.current?.ended) {
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
      };

      addMessage(userMessage);
      let chatSocketMessage: null | ChatSocketMessage = null;

      if (!part2Question) {
        toast("Question card absence", {
          description: "No Part 2 question card found",
          action: {
            label: "Log",
            onClick: () => console.log("No Part 2 question card found"),
          },
        });
        return;
      }
      if (sessionState.currentPart === 2) {
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
      addMessage,
      part2Question,
      sendChatWebsocketMessage,
      sessionState.currentPart,
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
        case "ttsFileName":
          const assistantMessage: ChatMessageType = {
            role: "Assistant",
            messageId: uuidv4(),
            text: data.text,
          };

          addMessage(assistantMessage);
          if (data.filename) {
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

        case "endTest":
          const copySession2 = { ...sessionState };
          copySession2.status = "inactive";
          setSession(copySession2);
          setStatus("Finished");
          setDialogOpen(true);
      }
    },
    [
      addMessage,
      playInstructionsAudioWithVideo,
      playTTSAudio,
      sessionState,
      setSession,
      setStatus,
    ]
  );

  useEffect(() => {
    if (!transcribeWebsocketRef.current && !chatWebsocketRef.current) {
      transcribeWebsocketRef.current = new WebSocket(
        "ws://localhost:8000/stt/ws"
      );
      chatWebsocketRef.current = new WebSocket("ws://localhost:8000/chat/ws");

      transcribeWebsocketRef.current.onmessage = (event: MessageEvent) => {
        const message = JSON.parse(event.data);
        const result = TranscribedMessage.safeParse(message);
        if (!result.success) {
          console.error(`Could not parse stt websocket data: ${result.error}`);
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
        };

        addMessage(userMessage);

        if (sessionState.currentPart !== 2) {
          const chatSocketMessage: ChatSocketMessage = {
            type: "userResponse",
            part: sessionState.currentPart as 1 | 2 | 3,
            assistant: sessionState.assistant as string,
            text: text,
          };

          if (chatWebsocketRef.current) {
            chatWebsocketRef.current.send(JSON.stringify(chatSocketMessage));
          }
        } else {
          const copySession = { ...sessionState };
          copySession.currentPart = 3;
          if (instructionsAudio.current) {
            instructionsAudio.current.src = "/part3switch.mp3";
          } else {
            instructionsAudio.current = new Audio("/part3switch.mp3");
          }
          if (!part2Question) {
            console.error("No question card found");
          } else {
            const chatSocketMessage: ChatSocketMessage = {
              type: "part2QuestionCard",
              part: 3,
              assistant: sessionState.assistant as string,
              text: "Start part 3.",
              questionCard: {
                topic: part2Question.topic,
                questions: part2Question.questions,
              },
            };
            chatWebsocketRef.current?.send(JSON.stringify(chatSocketMessage));
          }
          setSession(copySession);
          setTimeout(() => {
            setDialogOpen(true);
          }, 0);
          instructionsAudio.current.oncanplaythrough = () => {
            instructionsAudio.current?.play();
          };
        }
      };

      chatWebsocketRef.current.onmessage = (event: MessageEvent) => {
        const message = JSON.parse(event.data);
        const parsed = ChatSocketResponseSchema.safeParse(message);

        if (!parsed.success) {
          console.error("Could not parse the message");
          return;
        }

        const data = parsed.data;

        if (data.type === "ttsFileName" && data.filename) {
          const assistantMessage: ChatMessageType = {
            role: "Assistant",
            messageId: uuidv4(),
            text: data.text,
          };

          addMessage(assistantMessage);
          playTTSAudio(data.filename);
        } else if (data.type === "switchToPart2") {
          if (instructionsAudio.current) {
            instructionsAudio.current.src = "/part2switch.mp3";
          } else {
            instructionsAudio.current = new Audio("/part2switch.mp3");
          }
          const updatedSession = { ...sessionState };
          updatedSession.currentPart = 2;
          setSession(updatedSession);
          setTimeout(() => {
            setDialogOpen(true);
          }, 0);
          instructionsAudio.current.oncanplaythrough = () => {
            instructionsAudio.current?.play();
          };
        } else if (data.type === "endTest") {
          const updatedSession = { ...sessionState };
          updatedSession.status = "inactive";
          setSession(updatedSession);
          setStatus("Finished");
          setTimeout(() => {
            setDialogOpen(true);
          }, 0);
        }
      };
    }

    if (
      navigator.mediaDevices &&
      navigator.mediaDevices.getUserMedia &&
      mediaStream.current === null
    ) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          mediaStream.current = stream;
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

          mediaRecorder.current.onstop = (event: Event) => {
            const recordedBlob = new Blob(audioChunks.current, {
              type: "audio/webm",
            });
            audioBlobs.current = recordedBlob;

            const reader = new FileReader();
            reader.readAsArrayBuffer(audioBlobs.current);

            reader.onloadend = () => {
              if (transcribeWebsocketRef.current && reader.result) {
                transcribeWebsocketRef.current.send(reader.result);
              }
            };
            audioBlobs.current = null;
          };
        })
        .catch((error) => console.error("Could not access user media:", error));
    } else {
      console.error("Browser does not support media devices");
    }

    if (!runTour && !dialogOpen && sessionState.currentPart === 1) {
      instructionsAudio.current = new Audio("/greeting.mp3");
      instructionsAudio.current.oncanplaythrough = () => {
        instructionsAudio.current?.play();
      };
    }

    if (instructionsAudio.current) {
      instructionsAudio.current.onplay = () => {
        if (videoRef.current) {
          videoRef.current.play();
          videoRef.current.muted = true;
        }
      };

      instructionsAudio.current.ontimeupdate = () => {
        if (audioFile.current?.ended) {
          if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
          }
        }
      };
    }
    return () => {
      if (transcribeWebsocketRef.current?.OPEN && !part2Question) {
        transcribeWebsocketRef.current.close();
        transcribeWebsocketRef.current = null;
      }
      if (chatWebsocketRef.current?.OPEN && !part2Question) {
        chatWebsocketRef.current.close();
        chatWebsocketRef.current = null;
      }
      if (mediaStream.current) {
        mediaStream.current = null;
      }
      if (mediaRecorder.current) {
        mediaRecorder.current = null;
      }
      if (audioContext.current) {
        audioContext.current = null;
      }
    };
  }, [runTour, dialogOpen, part2Question]);

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
      if (sessionState.currentPart === 2) {
        setIsAnsweringQuestion(false);
      }
      mediaRecorder.current.start();
      optimizedUpdateVisualSlider(audioAnalyzer.current);
    }
  }, [optimizedUpdateVisualSlider, sessionState.currentPart]);

  const optimizedStopRecording = useCallback(() => {
    if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
      mediaRecorder.current.stop();
      // mediaStream.current?.getTracks().forEach((track) => track.stop());
    }

    audioChunks.current = [];
    if (animationId.current && volumeSlider.current) {
      cancelAnimationFrame(animationId.current);
      animationId.current = null;
      volumeSlider.current.style.width = "10%";
    }
  }, []);

  useEffect(() => {
    if (isAnsweringQuestion && !isRecording) {
      optimizedStartRecoring();
      setIsRecording(true);
    }
  }, [isAnsweringQuestion, isRecording, optimizedStartRecoring]);

  return (
    <div className="w-full min-h-screen flex flex-col gap-6 bg-gray-50 py-6 font-geist lg:grid lg:grid-cols-[0.5fr_0.8fr_0.5fr] xl:grid-cols-[0.38fr_0.84fr_0.38fr] lg:justify-items-stretch lg:items-stretch lg:gap-6 lg:w-full max-w-[1420px] mx-auto xl:py-8">
      <div className="space-y-6">
        <TestSession />
        <TestProgress />
        <Joyride
          steps={tourSteps}
          run={runTour}
          continuous={true}
          scrollToFirstStep={true}
          showProgress={true}
          showSkipButton={true}
          callback={(data) => {
            if (data.status === "finished" || data.status === "skipped") {
              instructionsAudio.current = new Audio("/greeting.mp3");
              instructionsAudio.current.oncanplaythrough = () => {
                instructionsAudio.current?.play();
              };
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
            autoOpen: true,
          }}
          tooltipComponent={CustomTooltip}
        />
      </div>
      <div className="space-y-6">
        <div className="lg:hidden">
          <PartInfo currentPart={1} />
        </div>
        <CharacterSection
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
        <Chat />
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
      </div>
    </div>
  );
}
