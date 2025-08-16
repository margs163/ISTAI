import { create } from "zustand";
import { ChatMessageType } from "./types";
import { v4 as uuidv4 } from "uuid";

type ChatStore = {
  messages: ChatMessageType[];
  addMessage: (message: ChatMessageType) => void;
};

export const useChatStore = create<ChatStore>((set) => ({
  messages: [
    {
      role: "Assistant",
      messageId: uuidv4(),
      text: "Hello, my name is Ron and I will be your test examiner today! Can you please start by introducing yourself",
    },
    {
      role: "User",
      messageId: uuidv4(),
      text: "Click the microphone to start speaking",
    },
  ],
  addMessage: (message: ChatMessageType) =>
    set((state) => ({ messages: [...state.messages, message] })),
}));
