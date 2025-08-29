import React, { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { initializePaddle, Paddle } from "@paddle/paddle-js";
import { useUserStore } from "@/lib/userStorage";
import { StarterPlan } from "./StarterPlan";
import { ProPlan } from "./ProPlan";

export default function UpgradePlan() {
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
          successUrl: "https://ielts-fluency.vercel.app/dashboard",
        },
        customer: {
          email: userEmail,
        },
      });
    },
    [paddle, userEmail]
  );
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="rounded-md bg-gray-100 hover:bg-gray-200 active:bg-gray-200 transition-colors cursor-pointer px-4 py-2 text-xs font-medium">
          Upgrade
        </button>
      </DialogTrigger>
      <DialogContent className="space-y-2 font-geist">
        <DialogHeader>
          <DialogTitle>Plan Upgrade</DialogTitle>
          <DialogDescription>
            Want to purchase more credits and upgrade your plan?
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="starter" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="starter">Starter</TabsTrigger>
            <TabsTrigger value="pro">Pro</TabsTrigger>
          </TabsList>
          <TabsContent value="starter">
            <StarterPlan openCheckout={openCheckout} />
          </TabsContent>
          <TabsContent value="pro">
            <ProPlan openCheckout={openCheckout} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
