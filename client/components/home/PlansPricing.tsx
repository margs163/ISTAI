"use client";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import React, { useState } from "react";
import MainButton from "../MainButton";

export type Plan = {
  tier: "Free" | "Starter" | "Pro";
  price: number;
  description: string;
  audience: string;
  features: string[];
};

const plansAnnual: Plan[] = [
  {
    tier: "Free",
    price: 0,
    description: "Per user/month billed annualy",
    audience: "For trying our platform",
    features: [
      "30 test credits",
      "free analysis",
      "1 assistant available",
      "2 short practices",
    ],
  },
  {
    tier: "Starter",
    price: 5,
    description: "Per user/month billed annualy",
    audience: "Ideal for test preparation",
    features: [
      "300 test credits",
      "unlimited analysis",
      "unlimited export",
      "daily challenges",
      "10 daily pronunciation checks",
      "3 assistants available",
      "30 short practices",
    ],
  },
  {
    tier: "Pro",
    price: 11,
    description: "Per user/month billed annualy",
    audience: "Great for shared/long term use",
    features: [
      "800 test credits",
      "unlimited analysis",
      "unlimited export",
      "daily challenges",
      "30 daily pronunciation checks",
      "3 assistants available",
      "50 short practices",
    ],
  },
];

const plansMonthly: Plan[] = [
  {
    tier: "Free",
    price: 0,
    description: "Per user/month billed monthly",
    audience: "For trying our platform",
    features: [
      "30 test credits",
      "free analysis",
      "1 assistant available",
      "2 short practices",
    ],
  },
  {
    tier: "Starter",
    price: 7,
    description: "Per user/month billed monthly",
    audience: "Ideal for test preparation",
    features: [
      "300 test credits",
      "unlimited analysis",
      "unlimited export",
      "daily challenges",
      "10 daily pronunciation checks",
      "3 assistants available",
      "30 short practices",
    ],
  },
  {
    tier: "Pro",
    price: 14,
    description: "Per user/month billed monthly",
    audience: "Great for shared/long term use",
    features: [
      "800 test credits",
      "unlimited analysis",
      "unlimited export",
      "daily challenges",
      "30 daily pronunciation checks",
      "3 assistants available",
      "50 short practices",
    ],
  },
];

export function PlanCard({ plan }: { plan: Plan }) {
  return (
    <div className="flex flex-col items-start justify-start border-2 bvorder-gray-200 bg-white p-6 gap-8 lg:p-8 rounded-lg w-full">
      <h3 className="text-xl font-medium text-gray-800">{plan.tier}</h3>
      <div className="space-y-2">
        <h2 className="text-4xl lg:text-5xl font-semibold text-gray-800 tracking-wider">
          ${plan.price}
        </h2>
        <p className="text-sm lg:text-base text-gray-600 font-normal">
          {plan.description}
        </p>
      </div>
      <div className="space-y-4">
        <h3 className="text-sm lg:text-base font-medium text-gray-800">
          {plan.audience}
        </h3>
        <ul className="space-y-2">
          {plan.features.map((item, index) => (
            <li key={index} className="flex flex-row items-center gap-2">
              <div className="p-1 bg-gray-100 rounded-md flex items-center justify-center">
                <Check className="size-4 shrink-0 text-gray-500" />
              </div>
              <p className="text-xs lg:text-sm font-medium text-gray-600">
                {item}
              </p>
            </li>
          ))}
        </ul>
      </div>
      <button className="w-full text-sm cursor-pointer mt-auto border text-center border-gray-300 bg-white font-medium text-gray-800 py-2 rounded-lg hover:bg-gray-100 active:bg-gray-100 transition-colors">
        Get Started with {plan.tier}
      </button>
    </div>
  );
}

export default function PlansPricing() {
  const [activeTab, setActiveTab] = useState<"month" | "year">("year");
  return (
    <section className=" w-full flex flex-col items-center justify-center p-8 py-10 lg:px-20 xl:px-42 lg:py-20 gap-10 lg:gap-10">
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
            Save 35%
          </p>
        </div>
      </div>
      <main className="flex flex-col gap-8 lg:flex-row lg:gap-12 w-full px-2 mt-4 lg:mt-8">
        {activeTab === "year"
          ? plansAnnual.map((plan, index) => (
              <PlanCard plan={plan} key={index} />
            ))
          : plansMonthly.map((plan, index) => (
              <PlanCard plan={plan} key={index} />
            ))}
      </main>
    </section>
  );
}
