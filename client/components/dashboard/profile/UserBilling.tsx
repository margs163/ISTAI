import { CircleDollarSign, Plus } from "lucide-react";
import React from "react";
import visa from "@/assets/images/visa.png";
import Image from "next/image";
import Link from "next/link";
import BillingHistory from "./BillingHistory";

export default function UserBilling() {
  return (
    <section className="flex flex-col gap-6 items-start px-6">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">Billing and Usage</h2>
        <p className="text-sm font-normal text-gray-600">
          Track you credits and manage your billing info
        </p>
      </div>
      <div className="flex flex-col gap-8 items-start">
        <div className="space-y-2 w-full">
          <h3 className="text-xs font-normal text-gray-500">Current Plan</h3>
          <div className="p-5 rounded-lg border-slate-200 bg-white flex flex-row justify-between items-start border w-full gap-4">
            <div className="space-y-1">
              <h2 className="text-base font-medium text-gray-800">
                Free Plan{" "}
                <span className="text-sm font-normal text-gray-600">$0/mo</span>
              </h2>
              <p className="text-sm font-normal text-balance text-gray-600">
                Includes 300 credits for personal use
              </p>
            </div>
            <div className=" flex flex-col gap-2 items-end">
              <button className="rounded-md border border-gray-200 bg-white px-4 py-2 text-xs font-medium">
                View Plans
              </button>
              <button className="rounded-md bg-gray-100 px-4 py-2 text-xs font-medium">
                Upgrade
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-row items-start justify-between">
          <div>
            <h2 className="font-medium text-base text-gray-800">
              Credit Balance
            </h2>
            <p className="text-sm font-normal text-balance text-gray-600">
              Your monthly credits reset in <strong>15</strong> days.
            </p>
          </div>
          <div className="flex flex-row gap-1 items-center px-4 py-2 bg-white border-gray-200 border rounded-md">
            <CircleDollarSign className="text-gray-700 size-5" />
            <h2 className="text-lg font-semibold text-gray-800">150</h2>
          </div>
        </div>
        <hr className="h-[1px] bg-slate-100 rounded-sm px-6 mt-4 w-full" />
        <div className="flex flex-col items-start gap-6 w-full">
          <div>
            <h2 className="font-medium text-base text-gray-800">
              Card Details
            </h2>
            <p className="text-sm font-normal text-balance text-gray-600">
              Your payment methods
            </p>
          </div>
          <div className="flex flex-row gap-4 items-start w-full p-5 rounded-md border border-blue-200 bg-blue-50">
            <Image
              src={visa}
              className="w-7 bg-white rounded-md px-1 box-content"
              alt="visa"
            />
            <div className="space-y-1">
              <h3 className="text-blue-900 font-medium text-sm">
                Visa ending in 3142
              </h3>
              <p className="text-blue-800 font-normal text-sm">
                Expiry 06/2024
              </p>
              <p className="mt-2 text-gray-600 font-normal text-sm">
                Next billing on <strong>July 01, 2019</strong>
              </p>
            </div>
          </div>
          <Link href={"#"} className="flex flex-row items-center gap-2">
            <Plus className="size-4 text-gray-600" />{" "}
            <p className="text-gray-600 font-normal text-sm">
              Add new payment method
            </p>
          </Link>
          <div className="max-w-[320px] lg:max-w-full mt-4">
            <BillingHistory />
          </div>
        </div>
      </div>
    </section>
  );
}
