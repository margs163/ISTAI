import { create } from "zustand";

export type userData = {
  id: string;
  email: string;
  isActive: boolean;
  isSuperuser: boolean;
  isVerified: boolean;
};

type UserStoreType = {
  setUserData: (data: userData) => void;
} & userData;

export const useUserStore = create<UserStoreType>((set) => ({
  id: "",
  email: "",
  isActive: false,
  isSuperuser: false,
  isVerified: false,
  setUserData: (data: userData) => set({ ...data }),
}));
