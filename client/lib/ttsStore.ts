import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type TTSUrl = {
  word: string;
  url: string;
};

type WordsTTSStore = {
  urls: TTSUrl[];
  appendUrl: (url: TTSUrl) => void;
  setUrls: (urls: TTSUrl[]) => void;
  resetUrls: () => void;
};

export const useWordsTTSStore = create<WordsTTSStore>()(
  persist(
    (set) => ({
      urls: [],
      appendUrl: (url) => set((state) => ({ urls: [...state.urls, url] })),
      setUrls: (urls) => set({ urls: urls }),
      resetUrls: () => set({ urls: [] }),
    }),
    {
      name: "wordstts-store",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
