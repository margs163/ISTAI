import { create } from "zustand";

type AvatarStore = {
  url: string;
  setUrl: (url: string) => void;
};

export const useAvatarStore = create<AvatarStore>()((set) => ({
  url: "",
  setUrl: (url) => set({ url: url }),
}));
