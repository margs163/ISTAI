import { create } from "zustand";
import { TranscriptionMessageType } from "./types";

type TestTranscriptionStore = {
  partOne: TranscriptionMessageType[];
  partTwo: TranscriptionMessageType[];
  partThree: TranscriptionMessageType[];
  addTranscription: (
    part: "partOne" | "partTwo" | "partThree",
    message: TranscriptionMessageType
  ) => void;
  restoreTranscriptions: () => void;
};

export const useTestTranscriptionStore = create<TestTranscriptionStore>(
  (set) => ({
    partOne: [],
    partTwo: [],
    partThree: [],
    addTranscription: (part, message) =>
      set((state) => ({ [part]: [...state[part], message] })),
    restoreTranscriptions: () =>
      set({ partOne: [], partTwo: [], partThree: [] }),
  })
);
