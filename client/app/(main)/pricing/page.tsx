"use client";
import PlansPricing from "@/components/home/PlansPricing";
import NavBar from "@/components/NavBar";
import { setTransactionEmail } from "@/lib/actions";
import { openCheckoutRequest, requestTransactionCreation } from "@/lib/queries";
import { useUserStore } from "@/lib/userStorage";
import { initializePaddle, Paddle } from "@paddle/paddle-js";
import { useMutation } from "@tanstack/react-query";
import React, { useCallback, useEffect, useState, useTransition } from "react";

export default function Page() {
  const userEmail = useUserStore((state) => state.email);

  const openCheckout = async (productId: string) => {
    if (!userEmail) return;
    await openCheckoutRequest(productId, userEmail);
  };

  return (
    <div className=" w-full flex flex-col gap-10 lg:gap-10 pb-4 font-mont">
      <NavBar />
      <PlansPricing checkoutCallback={openCheckout} />
    </div>
  );
}
