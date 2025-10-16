import { cn } from "@/lib/utils";
import { Plan } from "@/lib/constants";
import { Check } from "lucide-react";
import React from "react";

const proPlan = {
  tier: "Pro",
  price: 10,
  description: "Per user/month billed annualy",
  audience: "Greate for shared users with intensive preparation",
  features: [
    "800 test credits",
    "unlimited analysis",
    "unlimited export",
    "daily challenges",
    "30 daily pronunciation checks",
    "3 assistants available",
    "50 short practices",
  ],
  priceId: "pri_01k3nb5c4wgc1tjewzye9yxg62",
};

export function ProPlan({
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
          {proPlan.tier}
        </h3>
        <p className="text-sm lg:text-sm font-medium text-gray-600">
          {proPlan.audience}
        </p>
      </div>
      <div className="space-y-2">
        <h2 className="text-3xl lg:text-4xl font-semibold text-gray-800 tracking-wider">
          ${proPlan.price}
        </h2>
        <p className="text-sm lg:text-sm text-gray-600 font-normal">
          {proPlan.description}
        </p>
      </div>
      <div className="space-y-4 mb-1">
        <p className="text-sm lg:text-sm font-medium text-gray-900">
          What&apos;s included:
        </p>
        <ul className="gap-y-2 gap-x-4 grid-cols-1 lg:grid-cols-2 grid">
          {proPlan.features.map((item, index) => (
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
        onClick={() => (proPlan.priceId ? openCheckout(proPlan.priceId) : null)}
        className="w-full text-xs lg:text-sm cursor-pointer mt-auto border text-center border-gray-300 bg-slate-100 font-medium text-gray-800 py-2.5 rounded-md lg:rounded-lg hover:bg-slate-200 active:bg-slate-100 transition-colors"
      >
        Get Started
      </button>
    </div>
  );
}
