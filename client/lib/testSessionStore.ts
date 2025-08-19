import { create } from "zustand";
import { TestSessionType } from "./types";

type TestSessionStore = {
  setSessionData: (data: TestSessionType) => void;
  setStatus: (status: "active" | "inactive") => void;
} & TestSessionType;

export const useTestSessionStore = create<TestSessionStore>((set) => ({
  testName: "",
  status: "active",
  currentPart: 1,
  startedTime: "",
  duration: 0,
  assistant: null,
  user: null,
  setSessionData: (data: TestSessionType) => set({ ...data }),
  setStatus: (status) => set({ status: status }),
}));
