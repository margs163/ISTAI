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
      subscription_tier: "Free",
      total_money_spent: 0,
      credits_total_purchased: 0,
      credits_left: 0,
      billing_interval: "",
      billing_frequency: 0,
      paddle_product_id: "",
      paddle_subscription_id: "",
      paddle_price_id: "",
      paddle_subscription_status: "",
      subscription_created_at: "",
      subscription_next_billed_at: "",
      credit_card: {
        card_holder_name: "",
        card_type: "",
        last_four: "",
        expiry_year: 0,
        expiry_month: 0,
        country: "",
        id: "",
        payment_id: "",
        payment_method: "",
      },
      setSubData: (data) => set({ ...data }),
    }),
    {
      name: "subscription-store",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
