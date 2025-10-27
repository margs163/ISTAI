import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type refundStoreType = {
  practiceRefunded: boolean;
  resultsRefunded: boolean;
  setPracticeRefunded: (refund: boolean) => void;
  setResultsRefunded: (refund: boolean) => void;
};

export const useRefundStore = create<refundStoreType>()(
  persist(
    (set, get) => ({
      practiceRefunded: false,
      resultsRefunded: false,
      setPracticeRefunded: (refund: boolean) =>
        set({ practiceRefunded: refund }),
      setResultsRefunded: (refund: boolean) => set({ resultsRefunded: refund }),
    }),
    {
      name: "refund-store",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
