import { create } from "zustand";

export type UserData = {
  id: string;
  email: string;
  isActive: boolean;
  isSuperuser: boolean;
  isVerified: boolean;
  firstName: string;
  lastName: string | undefined;
};

export type UserDataServer = {
  id: string;
  email: string;
  is_active: boolean;
  is_superuser: boolean;
  is_verified: boolean;
  first_name: string;
  last_name: string | undefined;
};

type UserStoreType = {
  setUserData: (data: UserData) => void;
} & UserData;

export const useUserStore = create<UserStoreType>((set) => ({
  id: "",
  email: "",
  isActive: false,
  isSuperuser: false,
  isVerified: false,
  firstName: "",
  lastName: "",
  setUserData: (data: UserData) => set({ ...data }),
}));
