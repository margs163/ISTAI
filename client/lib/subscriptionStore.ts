import { create } from "zustand";
import { SubscriptionType } from "./types";
import { createJSONStorage, persist } from "zustand/middleware";

interface SubscriptionStoreType extends SubscriptionType {
  setSubData: (data: SubscriptionType) => void;
}

export const useSubscriptionStore = create<SubscriptionStoreType>()(
  persist(
    (set) => ({
      id: "",
      user_id: "",
      status: null,
      polar_product_id: null,
      polar_subscription_id: null,
      polar_customer_id: null,
      polar_price_id: null,
      subscription_tier: "Free",
      polar_subscription_status: null,
      subscription_created_at: null,
      subscription_next_billed_at: null,
      subscription_cancelled_at: null,
      cancellation_reason: null,
      cancellation_comment: null,
      total_money_spent: 0,
      credits_total_purchased: 0,
      credits_left: 0,
      pronunciation_tests_left: 0,
      billing_interval: null,
      billing_frequency: null,
      setSubData: (data) => set({ ...data }),
    }),
    {
      name: "subscription-store",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
