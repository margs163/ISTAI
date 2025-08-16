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
  TestSessionType,
  TranscribedMessage,
} from "@/lib/types";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function Page() {
  const setMetadata = useMetadataStore((state) => state.setMetadataData);
  const addMessage = useChatStore((state) => state.addMessage);
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

  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    if (!transcribeWebsocketRef.current && !chatWebsocketRef.current) {
      transcribeWebsocketRef.current = new WebSocket(
        "ws://localhost:8000/stt/ws"
      );
      chatWebsocketRef.current = new WebSocket("ws://localhost:8000/chat/ws");

      transcribeWebsocketRef.current.onmessage = (event: MessageEvent) => {
        const message = JSON.parse(event.data);
        const result = TranscribedMessage.safeParse(message);
        console.log("RECIEVED MESSAGE!");
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

            console.log("Converting blobs to an array buffer");

            reader.onloadend = () => {
              console.log("Sending an array buffer to server");
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
        mediaStream.current = null;
      }
      if (mediaRecorder.current) {
        mediaRecorder.current = null;
      }
      if (audioContext.current) {
        audioContext.current = null;
      }
    };
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
      console.log("Recording started:", mediaRecorder.current.state);
    }
  }, [optimizedUpdateVisualSlider]);

  const optimizedStopRecording = useCallback(() => {
    if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
      mediaRecorder.current.stop();
      // mediaStream.current?.getTracks().forEach((track) => track.stop());
      console.log("Stopped recording audio:", mediaRecorder.current.state);
    }

    audioChunks.current = [];
    if (animationId.current && volumeSlider.current) {
      cancelAnimationFrame(animationId.current);
      animationId.current = null;
      volumeSlider.current.style.width = "10%";
    }
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-col gap-6 bg-gray-50 py-6 font-geist lg:grid lg:grid-cols-[0.5fr_0.8fr_0.5fr] xl:grid-cols-[0.4fr_0.8fr_0.38fr] lg:justify-items-stretch lg:items-stretch lg:gap-6 lg:w-full lg:px-12 xl:px-25 xl:py-8">
      <div className="space-y-6">
        <TestSession />
        <TestProgress />
      </div>
      <div className="space-y-6">
        <div className="lg:hidden">
          <PartInfo currentPart={1} />
        </div>
        <CharacterSection
          volumeSliderRef={volumeSlider}
          startRecording={optimizedStartRecoring}
          stopRecording={optimizedStopRecording}
          isRecording={isRecording}
          setIsRecording={setIsRecording}
          videoRef={videoRef}
          audioContext={audioContext}
          activePart={1}
          timerActive={false}
        />
      </div>
      <div className="space-y-6">
        <Chat />
        <QuickTestActions />
      </div>
    </div>
  );
}
