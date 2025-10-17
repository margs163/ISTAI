"use client";
import Footer from "@/components/Footer";
import PlansPricing from "@/components/home/PlansPricing";
import NavBar from "@/components/NavBar";
import { openCheckoutRequest, requestTransactionCreation } from "@/lib/queries";
import { useUserStore } from "@/lib/userStorage";
import { initializePaddle, Paddle } from "@paddle/paddle-js";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState, useTransition } from "react";

export default function Page() {
  const userEmail = useUserStore((state) => state.email);
  const router = useRouter();

  const openCheckout = async (productId: string) => {
    if (!userEmail) {
      router.push("/signup");
    } else {
      await openCheckoutRequest(productId, userEmail);
    }
  };

  return (
    <div className=" w-full flex flex-col gap-10 lg:gap-10 pb-4 font-mont">
      <NavBar />
      <PlansPricing checkoutCallback={openCheckout} />
      <Footer className="mt-12" />
    </div>
  );
}
