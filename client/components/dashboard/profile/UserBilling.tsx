import { Plus } from "lucide-react";
import React from "react";
import visa from "@/assets/images/visa.png";
import Image from "next/image";
import Link from "next/link";
import token from "@/assets/images/token.svg";
import { useSubscriptionStore } from "@/lib/subscriptionStore";
import { getPreciseTimeAgo, getPreciseTimeFuture } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { fetchSubscription } from "@/lib/queries";
import UpgradePlan from "./UpgradePlan";

export default function UserBilling() {
  const creditsLeft = useSubscriptionStore((state) => state.credits_left);
  const subscription = useSubscriptionStore((state) => state);
  const creditCard = useSubscriptionStore((state) => state.credit_card);
  const nextBillingDate = subscription.subscription_next_billed_at;
  const setSubscription = useSubscriptionStore((state) => state.setSubData);

  const resetDay = getPreciseTimeFuture(
    nextBillingDate ?? new Date().toISOString()
  );

  useQuery({
    queryKey: ["subscription-fetch"],
    queryFn: async () => await fetchSubscription(setSubscription),
    staleTime: 1000 * 60 * 5,
  });

  return (
    <section className="flex flex-col gap-6 lg:gap-8 items-start px-6 lg:px-12 w-full">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">Billing and Usage</h2>
        <p className="text-sm font-normal text-gray-600">
          Track you credits and manage your billing info
        </p>
      </div>
      {/* <hr className="h-[1px] bg-slate-100 rounded-sm px-6 my-0 w-full" /> */}
      <div className="flex flex-col gap-8 items-start w-full">
        <div className="space-y-2 w-full">
          <h3 className="text-xs font-normal text-gray-500">Current Plan</h3>
          <div className="p-5 rounded-lg border-slate-200 bg-white flex flex-row justify-between items-start border w-full gap-4">
            <div className="space-y-0">
              <h2 className="text-base font-medium text-gray-800">
                {subscription.subscription_tier} Plan{" "}
                <span className="pl-2 text-sm font-normal text-gray-600">
                  {subscription.subscription_tier === "Free"
                    ? "$0/mo"
                    : subscription.subscription_tier === "Starter"
                    ? "$6/mo"
                    : "$12/mo"}
                </span>
              </h2>
              <p className="text-sm font-normal text-balance text-gray-600">
                {subscription.subscription_tier === "Free"
                  ? "Includes 20 credits for personal use"
                  : subscription.subscription_tier === "Starter"
                  ? "Includes 300 credits for personal use"
                  : "Includes 800 credits for personal use"}
              </p>
            </div>
            <div className=" flex flex-col lg:flex-row gap-2 items-end">
              <Link href={"/pricing"}>
                <button className="rounded-md border border-gray-200 hover:bg-gray-50 active:bg-gray-50 bg-white px-4 py-2 cursor-pointer text-xs font-medium">
                  View Plans
                </button>
              </Link>
              <UpgradePlan />
            </div>
          </div>
        </div>
        <div className="flex flex-row items-start justify-between w-full">
          <div>
            <h2 className="font-medium text-base text-gray-800">
              Credit Balance
            </h2>
            <p className="text-sm font-normal text-balance text-gray-600">
              Your monthly credits reset in <strong>{resetDay}</strong>.
            </p>
          </div>
          <div className="flex flex-row gap-1 items-center px-4 py-2 bg-white border-gray-200 border rounded-md">
            <Image src={token} alt="token" className="fill-gray-700 size-6" />
            <h2 className="text-lg font-semibold text-gray-800">
              {creditsLeft}
            </h2>
          </div>
        </div>
        <hr className="h-[1px] bg-slate-100 rounded-sm px-6 mt-1 w-full" />
        <div className="flex flex-col items-start gap-6 w-full">
          <div>
            <h2 className="font-medium text-base text-gray-800">
              Card Details
            </h2>
            <p className="text-sm font-normal text-balance text-gray-600">
              Your payment methods
            </p>
          </div>
          {creditCard && nextBillingDate && (
            <div className="flex flex-row gap-4 items-start p-5 w-full rounded-md border border-blue-200 bg-blue-50">
              <Image
                src={visa}
                className="w-7 bg-white rounded-md px-1 box-content"
                alt="visa"
              />
              <div className="space-y-1">
                <h3 className="text-blue-900 font-medium text-sm">
                  {creditCard.card_type[0].toUpperCase() +
                    creditCard.card_type.slice(1)}{" "}
                  ending in {creditCard.last_four}
                </h3>
                <p className="text-blue-800 font-normal text-sm">
                  Expiry {creditCard.expiry_month}/{creditCard.expiry_year}
                </p>
                <p className="mt-2 text-gray-600 font-normal text-sm">
                  Next billing on{" "}
                  <strong>{new Date(nextBillingDate).toDateString()}</strong>
                </p>
              </div>
            </div>
          )}
          {/* <div className="max-w-[320px] lg:max-w-full mt-4">
            <BillingHistory />
            </div> */}
          <Link
            href={"#"}
            className="flex flex-row items-center gap-2 self-end"
          >
            <Plus className="size-4 text-gray-600" />{" "}
            <p className="text-gray-600 font-normal text-sm">
              Change payment method
            </p>
          </Link>
        </div>
      </div>
    </section>
  );
}
