"use client";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import React, { useState } from "react";
import MainButton from "../MainButton";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { plansAnnual, plansMonthly } from "@/lib/constants";
import { Plan } from "@/lib/constants";

export function PlanCard({
  plan,
  className,
  openCheckout,
  router,
}: {
  plan: Plan;
  className?: string;
  openCheckout: (productId: string) => void;
  router: AppRouterInstance;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-start justify-start border-2 border-slate-200/80 bg-white p-6 gap-6 lg:p-8 rounded-2xl w-full",
        className
      )}
    >
      <div className="space-y-2 inline-block">
        <h3 className="text-xl lg:text-2xl font-semibold text-gray-800">
          {plan.tier}
        </h3>
        <p className="text-sm lg:text-sm font-medium text-gray-600">
          {plan.audience}
        </p>
      </div>
      <div className="space-y-2">
        <h2 className="text-4xl lg:text-5xl font-semibold text-gray-800 tracking-wider">
          ${plan.price}
        </h2>
        <p className="text-sm lg:text-base text-gray-600 font-normal">
          {plan.description}
        </p>
      </div>
      <hr className="w-full h-[1px] bg-slate-100 rounded-xl" />
      <div className="space-y-4 mb-1">
        <p className="text-sm lg:text-sm font-medium text-gray-900">
          What&apos;s included:
        </p>
        <ul className="space-y-2">
          {plan.features.map((item, index) => (
            <li key={index} className="flex flex-row items-center gap-2">
              <div className="p-1 bg-gray-100 rounded-md flex items-center justify-center">
                <Check className="size-4 shrink-0 text-indigo-500 bg-indigo-50" />
              </div>
              <p className="text-xs lg:text-sm font-medium text-gray-600">
                {item}
              </p>
            </li>
          ))}
        </ul>
      </div>
      <button
        onClick={async () =>
          plan.productId
            ? await openCheckout(plan.productId)
            : router.replace("/dashboard")
        }
        className="w-full text-xs lg:text-sm cursor-pointer mt-auto border text-center border-gray-300 bg-slate-100 font-medium text-gray-800 py-2.5 lg:py-3 rounded-md lg:rounded-lg hover:bg-slate-200 active:bg-slate-100 transition-colors"
      >
        Get Started
      </button>
    </div>
  );
}

export default function PlansPricing({
  checkoutCallback,
}: {
  checkoutCallback: (productId: string) => void;
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"month" | "year">("year");

  return (
    <section className=" w-full flex flex-col items-center justify-center p-8 lg:p-20 gap-10 lg:gap-10 max-w-[1400px] mx-auto">
      <header className="space-y-2 lg:space-y-4">
        <h1 className="font-bold text-3xl lg:text-5xl text-gray-800 text-center leading-[1.3]">
          Plans and Pricing
        </h1>
        <p className="text-center font-medium tracking-tight leading-relaxed text-sm lg:text-lg text-gray-600 px-8 lg:max-w-[500px]">
          Recieve unlimited credits when you pay early and save on your plan
        </p>
      </header>
      <div className="px-4 py-2 bg-gray-100 rounded-xl flex flex-row items-center cursor-pointer">
        <div
          className={cn(
            "w-full rounded-xl px-6 py-2.5",
            activeTab === "month" && "bg-white"
          )}
          onClick={() => setActiveTab("month")}
        >
          <h3 className="text-gray-800 text-sm text-center font-medium">
            Monthly
          </h3>
        </div>
        <div
          onClick={() => setActiveTab("year")}
          className={cn(
            "flex flex-row items-center w-full px-6 py-2.5 rounded-xl gap-2",
            activeTab === "year" && "bg-white"
          )}
        >
          <h3 className="text-gray-800 text-sm font-medium text-center">
            Annual
          </h3>
          <p className="bg-gray-200 rounded-lg px-1 py-0.5 text-xs min-w-18 text-center font-medium text-gray-600">
            Save 20%
          </p>
        </div>
      </div>
      <main className="flex flex-col gap-8 lg:grid lg:grid-cols-[0.97fr_1fr_0.97fr] lg:gap-12 w-full px-2 mt-4 lg:mt-8">
        {activeTab === "year"
          ? plansAnnual.map((plan, index) =>
              index !== 1 ? (
                <PlanCard
                  openCheckout={checkoutCallback}
                  router={router}
                  plan={plan}
                  key={index}
                />
              ) : (
                <div
                  key={index}
                  className="rounded-2xl p-2 pt-4 grad-bg brightness-104 w-full"
                >
                  <h3 className="text-xs lg:text-sm tracking-wide text-center mb-2.5 font-semibold text-gray-700">
                    Recommended for your
                  </h3>
                  <PlanCard
                    router={router}
                    openCheckout={checkoutCallback}
                    plan={plan}
                  />
                </div>
              )
            )
          : plansMonthly.map((plan, index) =>
              index !== 1 ? (
                <PlanCard
                  router={router}
                  openCheckout={checkoutCallback}
                  plan={plan}
                  key={index}
                />
              ) : (
                <div
                  key={index}
                  className="rounded-2xl p-2 pt-4 grad-bg brightness-104 w-full"
                >
                  <h3 className="text-xs lg:text-sm text-center tracking-wide mb-2.5 font-semibold text-gray-700">
                    Recommended for your
                  </h3>
                  <PlanCard
                    router={router}
                    openCheckout={checkoutCallback}
                    plan={plan}
                  />
                </div>
              )
            )}
      </main>
    </section>
  );
}
