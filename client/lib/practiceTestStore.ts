import { create } from "zustand";
import { persist, createJSONStorage, devtools } from "zustand/middleware";
import {
  PracticeTestType,
  QuestionCardType,
  ReadingCardType,
  ResultType,
  TestTranscriptionsType,
} from "./types";

interface LocalPracticeTestStore extends Omit<PracticeTestType, "user_id"> {
  setTestResult: (result: ResultType) => void;
  setTranscriptions: (transcriptions: TestTranscriptionsType) => void;
  setTestDuration: (duration: number) => void;
  setPartOneCard: (card: QuestionCardType) => void;
  setPartTwoCard: (card: QuestionCardType) => void;
  setReadingCards: (readingCard: ReadingCardType[]) => void;
  setTestData: (data: PracticeTestType) => void;
  setStatus: (status: "Ongoing" | "Cancelled" | "Finished" | "Paused") => void;
  readingAudioPath?: string;
  setReadingAudioPath: (path: string) => void;
  startDatetime: Date;
  setStartDateTime: (date: Date) => void;
}

type GlobalPracticeTestStore = {
  practice_tests: PracticeTestType[];
  addPracticeTest: (test: PracticeTestType) => void;
  removePracticeTest: (test_id: string) => void;
  setPracticeTests: (tests: PracticeTestType[]) => void;
  getPracticeByID: (id: string) => PracticeTestType | undefined;
};

export const useLocalPracticeTestStore = create<LocalPracticeTestStore>()(
  persist(
    (set) => ({
      id: "",
      result: null,
      status: "Ongoing",
      practice_name: "",
      assistant: "Ron",
      transcription: null,
      test_duration: null,
      test_date: "",
      part_one_card_id: null,
      part_two_card_id: null,
      part_one_card: null,
      part_two_card: null,
      reading_cards: [],
      readingAudioPath: "",
      startDatetime: new Date(),
      setTestResult: (result) => set({ result: result }),
      setTranscriptions: (transcription) =>
        set({ transcription: transcription }),
      setTestDuration: (duration) => set({ test_duration: duration }),
      setStartDateTime: (date: Date) => set({ startDatetime: date }),
      setPartOneCard: (card) => set({ part_one_card: card }),
      setPartTwoCard: (card) => set({ part_two_card: card }),
      setReadingCards: (readingCard) => set({ reading_cards: readingCard }),
      setStatus: (status) => set({ status: status }),
      setTestData: (data: PracticeTestType) => set({ ...data }),
      setReadingAudioPath: (path: string) => set({ readingAudioPath: path }),
    }),
    {
      name: "local-practice-store",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export const useGlobalPracticeTestsStore = create<GlobalPracticeTestStore>()(
  persist(
    (set, get) => ({
      practice_tests: [],
      addPracticeTest: (test) =>
        set((state) => ({
          practice_tests: [...state.practice_tests, test],
        })),
      removePracticeTest: (test_id) =>
        set((state) => {
          const tests_copy: PracticeTestType[] = JSON.parse(
            JSON.stringify(state.practice_tests)
          );
          return {
            practice_tests: tests_copy.filter((item) => item.id !== test_id),
          };
        }),
      setPracticeTests: (tests) => set({ practice_tests: tests }),
      getPracticeByID: (id) => {
        const test = get().practice_tests.find((item) => item.id === id);
        return test;
      },
    }),
    {
      name: "global-practice-store",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
