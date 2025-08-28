import { create } from "zustand";
import { AnalyticsType } from "./types";
import { createJSONStorage, persist } from "zustand/middleware";

export type UserData = {
  id: string;
  email: string;
  isActive: boolean;
  isSuperuser: boolean;
  isVerified: boolean;
  firstName: string;
  lastName: string | undefined;
  avatar_path: string | undefined;
  updatedAt?: Date;
  createdAt?: Date;
};

export type UserDataServer = {
  id: string;
  email: string;
  is_active: boolean;
  is_superuser: boolean;
  is_verified: boolean;
  first_name: string;
  last_name: string | undefined;
  avatar_path: string | undefined;
  updatedAt: Date;
  createdAt: Date;
};

interface UserStoreType extends UserData {
  setUserData: (data: UserData) => void;
  setAvatarPath: (path: string) => void;
}

interface AnalyticsStoreType extends Omit<AnalyticsType, "user_id"> {
  setAnalyticsData: (data: AnalyticsType) => void;
}

export const useUserStore = create<UserStoreType>()(
  persist(
    (set) => ({
      id: "",
      email: "",
      isActive: false,
      isSuperuser: false,
      isVerified: false,
      firstName: "",
      lastName: "",
      avatar_path: "",
      updatedAt: undefined,
      createdAt: undefined,
      setUserData: (data: UserData) => set({ ...data }),
      setAvatarPath: (path: string) => set({ avatar_path: path }),
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export const useAnalyticsStore = create<AnalyticsStoreType>()(
  persist(
    (set) => ({
      id: "",
      practice_time: 0,
      tests_completed: 0,
      current_band_scores: {
        fluency: 0,
        grammar: 0,
        lexis: 0,
        pronunciation: 0,
      },
      average_band_scores: {
        fluency: 0,
        grammar: 0,
        lexis: 0,
        pronunciation: 0,
      },
      current_bandscore: 0,
      average_band: 0,
      streak_days: 0,
      grammar_common_mistakes: [],
      lexis_common_mistakes: [],
      pronunciation_common_mistakes: [],
      setAnalyticsData: (data) => set({ ...data }),
    }),
    {
      name: "analytics-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
