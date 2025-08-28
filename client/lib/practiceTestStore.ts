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
}

type GlobalPracticeTestStore = {
  practice_tests: PracticeTestType[];
  addPracticeTest: (test: PracticeTestType) => void;
  removePracticeTest: (test_id: string) => void;
  setPracticeTests: (tests: PracticeTestType[]) => void;
  getPracticeByID: (id: string) => PracticeTestType | undefined;
};

const defaultValue = {
  id: "980a0a4b-e90c-44f0-95bc-ade31edc3ce4",
  result: null,
  status: "Finished",
  practice_name: "Test Practice 1",
  assistant: "Ron",
  transcription: {
    part_one: [
      {
        name: "Margs The Dev",
        text: " Hello, start this.",
        time: 106,
      },
      {
        name: "Ron",
        text: "Hello, I'm Ron, your IELTS Speaking examiner. What is your name?",
        time: 109,
      },
      {
        name: "Margs The Dev",
        text: " Hello, my name is Daniel.",
        time: 125,
      },
      {
        name: "Ron",
        text: "In the first part of the IELTS Speaking test, I will ask you some questions on general topics.\n",
        time: 128,
      },
      {
        name: "Margs The Dev",
        text: " OK, go ahead.",
        time: 139,
      },
      {
        name: "Ron",
        text: "In the first part of the IELTS Speaking test, I will ask you some questions on general topics. Now, let's talk about Hobbies. What do you like to do in your free time?",
        time: 142,
      },
      {
        name: "Margs The Dev",
        text: " In my free time I like to do some coding and also work on my projects and currently working on a project that I have been working on like a month",
        time: 170,
      },
      {
        name: "Ron",
        text: "That's interesting. Do you think coding will always be a hobby for you, or do you see it as something that could become a career in the future?",
        time: 173,
      },
      {
        name: "Margs The Dev",
        text: " hopefully I think coding will be my future career so I want to become a software developer yeah that's it",
        time: 198,
      },
      {
        name: "Ron",
        text: "What kind of projects do you enjoy working on the most, such as web development, mobile apps, or something else?",
        time: 200,
      },
      {
        name: "Margs The Dev",
        text: " so I'm a full stack developer so I enjoy doing web development but I also have tried mobile apps creating some mobile apps but I think that web development is much more interesting and there are more possibilities, more career options for web development",
        time: 239,
      },
    ],
    part_two: [
      {
        name: "Assistant",
        text: "Now I'm going to give you a topic and I'd like you to talk about it for one to two minutes. Here's your topic card. - Describe a time when someone apologized to you. and explain why they apologized to you.. You should say:\n\nwhen this happened\nwhat you were doing\nwho apologized to you",
        time: 450,
      },
      {
        name: "Margs The Dev",
        text: " so I remember sitting in a cafe and then so right as I sat on my chair and also my table like a waiter came to my table and he offered some drinks but right as he wanted to place those drinks on my table he actually spilled them and the drink I had a drink I had a drink it fell like it fell right on my jeans so my jeans were wet and then he proceeded by apologizing so he apologized and I accepted that apology of course and I was like",
        time: 323,
      },
    ],
    part_three: [
      {
        name: "Ron",
        text: "How did you feel about the waiter's apology, was it sincere, and did it change your perception of the cafe's service?",
        time: 325,
      },
      {
        name: "Margs The Dev",
        text: " yeah so after I left that cafe I actually never went back in it because I thought the cafe service was horrible because the waiter spilled coffee on my jeans but I think his apology was sincere but anyways I didn't really like the cafe as much after that incident",
        time: 374,
      },
      {
        name: "Ron",
        text: "Do you think the waiter's apology, even though it was sincere, was enough to make up for the inconvenience and damage caused, or should the cafe have offered some form of compensation?",
        time: 377,
      },
      {
        name: "Margs The Dev",
        text: " no I don't think so",
        time: 392,
      },
    ],
  },
  test_duration: 377,
  test_date: "2025-08-28T19:54:10.120261",
  part_one_card_id: null,
  part_two_card_id: null,
  part_one_card: null,
  part_two_card: {
    part: 2,
    id: "4eff7281-d4af-459c-878f-e15ef28bd0db",
    questions: [
      "when this happened",
      "what you were doing",
      "who apologized to you",
    ],
    topic:
      "Describe a time when someone apologized to you. and explain why they apologized to you.",
  },
  reading_cards: [
    {
      practice_id: null,
      id: "b67bfcc7-ca5a-4ac6-ad8d-1e7465c419a1",
      topic: "The North Wind and the Sun",
      text: "The North Wind and the Sun were disputing which was the stronger, when a traveler came along wrapped in a warm cloak. They agreed that the one who first succeeded in making the traveler take his cloak off should be considered stronger than the other. Then the North Wind blew as hard as he could, but the more he blew the more closely did the traveler fold his cloak around him; and at last the North Wind gave up the attempt. Then the Sun shined out warmly, and immediately the traveler took off his cloak. And so the North Wind was obliged to confess that the Sun was the stronger of the two.",
    },
  ],
  readingAudioPath: "",
  startDatetime: "2025-08-28T15:01:12.244Z",
  user_id: "09f50391-5aa8-440d-8315-7d44cac1033f",
};

export const useLocalPracticeTestStore = create<LocalPracticeTestStore>()(
  devtools((set) => ({
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
    setTranscriptions: (transcription) => set({ transcription: transcription }),
    setTestDuration: (duration) => set({ test_duration: duration }),
    setPartOneCard: (card) => set({ part_one_card: card }),
    setPartTwoCard: (card) => set({ part_two_card: card }),
    setReadingCards: (readingCard) => set({ reading_cards: readingCard }),
    setStatus: (status) => set({ status: status }),
    setTestData: (data: PracticeTestType) => set({ ...data }),
    setReadingAudioPath: (path: string) => set({ readingAudioPath: path }),
  }))
);

export const useGlobalPracticeTestsStore = create<GlobalPracticeTestStore>()(
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
  })
);
