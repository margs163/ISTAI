import { create } from "zustand";
import { ChatMessageType } from "./types";
import { v4 as uuidv4 } from "uuid";

type ChatStore = {
  messages: ChatMessageType[];
  addMessage: (message: ChatMessageType) => void;
  restoreMessages: () => void;
};

export const useChatStore = create<ChatStore>((set) => ({
  messages: [
    {
      role: "Assistant",
      messageId: uuidv4(),
      text: "Hello, welcome to the Speaking Test! Press the microphone button to start speaking.",
      time: 100,
    },
    {
      role: "User",
      messageId: uuidv4(),
      text: "Click the microphone to start speaking",
      time: 200,
    },
  ],
  addMessage: (message: ChatMessageType) =>
    set((state) => ({ messages: [...state.messages, message] })),
  restoreMessages: () =>
    set({
      messages: [
        {
          role: "Assistant",
          messageId: uuidv4(),
          text: "Hello, welcome to the Speaking Test! Press the microphone button to start speaking.",
          time: 100,
        },
        {
          role: "User",
          messageId: uuidv4(),
          text: "Click the microphone to start speaking",
          time: 200,
        },
      ],
    }),
}));
