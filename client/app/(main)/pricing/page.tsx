"use client";
import PlansPricing from "@/components/home/PlansPricing";
import NavBar from "@/components/NavBar";
import { setTransactionEmail } from "@/lib/actions";
import { requestTransactionCreation } from "@/lib/queries";
import { useUserStore } from "@/lib/userStorage";
import { initializePaddle, Paddle } from "@paddle/paddle-js";
import { useMutation } from "@tanstack/react-query";
import React, { useCallback, useEffect, useState } from "react";

export default function Page() {
  const [paddle, setPaddle] = useState<Paddle>();
  const [priceId, setPriceId] = useState<string>();
  const userEmail = useUserStore((state) => state.email);
  const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_KEY;

  const mutation = useMutation({
    mutationFn: requestTransactionCreation,
    mutationKey: ["create-transaction"],
    onSuccess: async (data) => {
      if (!data) return;
      if (!priceId) return;

      await setTransactionEmail(data, userEmail);

      paddle?.Checkout.open({
        transactionId: data,
        settings: {
          successUrl: process.env.NEXT_PUBLIC_PADDLE_REDIRECT_URI,
        },
        customer: {
          email: userEmail,
        },
      });
    },
  });

  useEffect(() => {
    async function InitPaddle() {
      if (!paddle) {
        const paddleInstance = await initializePaddle({
          environment: "sandbox",
          token: token as string,
          debug: true,
        });
        if (paddleInstance) {
          setPaddle(paddleInstance);
        }
      }
    }

    InitPaddle();
  }, [token, paddle]);

  const openCheckout = useCallback(
    async (priceId: string) => {
      setPriceId(priceId);
      await mutation.mutateAsync(priceId);
    },
    [paddle, userEmail]
  );

  return (
    <div className=" w-full flex flex-col gap-10 lg:gap-10 pb-4 font-mont">
      <NavBar />
      <PlansPricing checkoutCallback={openCheckout} />
    </div>
  );
}
