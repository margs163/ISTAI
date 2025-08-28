import { Plan } from "@/components/home/PlansPricing";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import React from "react";

const starterPlan = {
  tier: "Starter",
  price: 4,
  description: "Per user/month billed annualy",
  audience: "Ideal for students with regular preparation",
  features: [
    "300 test credits",
    "unlimited analysis",
    "unlimited export",
    "daily challenges",
    "10 daily pronunciation checks",
    "3 assistants available",
    "30 short practices",
  ],
  priceId: "pri_01k3naxj8kbs1mcqmmbstk3wk2",
};

export function StarterPlan({
  className,
  openCheckout,
}: {
  className?: string;
  openCheckout: (priceId: string) => void;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-start justify-start border-2 border-slate-200/80 bg-white p-6 gap-6 lg:p-8 rounded-2xl w-full",
        className
      )}
    >
      <div className="space-y-0 inline-block">
        <h3 className="text-base lg:text-xl font-semibold text-gray-800">
          {starterPlan.tier}
        </h3>
        <p className="text-sm lg:text-sm font-medium text-gray-600">
          {starterPlan.audience}
        </p>
      </div>
      <div className="space-y-2">
        <h2 className="text-3xl lg:text-4xl font-semibold text-gray-800 tracking-wider">
          ${starterPlan.price}
        </h2>
        <p className="text-sm lg:text-sm text-gray-600 font-normal">
          {starterPlan.description}
        </p>
      </div>
      <div className="space-y-4 mb-1">
        <p className="text-sm lg:text-sm font-medium text-gray-900">
          What&apos;s included:
        </p>
        <ul className="gap-y-2 gap-x-4 grid-cols-1 lg:grid-cols-2 grid">
          {starterPlan.features.map((item, index) => (
            <li key={index} className="flex flex-row items-center gap-2">
              <div className="p-1 bg-gray-100 rounded-md flex items-center justify-center">
                <Check className="size-4 shrink-0 text-indigo-500 bg-indigo-50" />
              </div>
              <p className="text-xs lg:text-xs font-medium text-gray-600">
                {item}
              </p>
            </li>
          ))}
        </ul>
      </div>
      <button
        onClick={() =>
          starterPlan.priceId ? openCheckout(starterPlan.priceId) : null
        }
        className="w-full text-xs lg:text-sm cursor-pointer mt-auto border text-center border-gray-300 bg-slate-100 font-medium text-gray-800 py-2.5 rounded-md lg:rounded-lg hover:bg-slate-200 active:bg-slate-100 transition-colors"
      >
        Get Started
      </button>
    </div>
  );
}
