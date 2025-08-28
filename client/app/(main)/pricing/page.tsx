"use client";
import PlansPricing from "@/components/home/PlansPricing";
import NavBar from "@/components/NavBar";
import { useUserStore } from "@/lib/userStorage";
import { initializePaddle, Paddle } from "@paddle/paddle-js";
import React, { useCallback, useEffect, useState } from "react";

export default function Page() {
  const [paddle, setPaddle] = useState<Paddle>();
  const userEmail = useUserStore((state) => state.email);
  const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_KEY;

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
    (priceId: string) => {
      console.log("Callback was hit with priceId:", priceId);
      paddle?.Checkout.open({
        items: [{ priceId: priceId, quantity: 1 }],
        settings: {
          successUrl: "http://localhost:3000/dashboard",
        },
        customer: {
          email: userEmail,
        },
      });
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
