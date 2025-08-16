import { create } from "zustand";
import { TestSessionType } from "./types";

type TestSessionStore = {
  setSessionData: (data: TestSessionType) => void;
} & TestSessionType;

export const useTestSessionStore = create<TestSessionStore>((set) => ({
  testName: "",
  status: "active",
  currentPart: 1,
  startedTime: new Date().toLocaleString("en-GB", {
    hour: "numeric",
    minute: "numeric",
  }),
  duration: "11-14 min",
  assistant: null,
  user: null,
  setSessionData: (data: TestSessionType) => set({ ...data }),
}));
