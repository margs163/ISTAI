import { HatGlasses, TriangleAlert } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function UpgradePro({ plan }: { plan: "free" | "pro" }) {
  return (
    <div className="px-2">
      <div className="border border-gray-200 p-3 rounded-md bg-gray-50 flex flex-row gap-1 items-center justify-start">
        {plan === "free" ? (
          <TriangleAlert className="fill-yellow-500 text-gray-50 size-5" />
        ) : (
          <HatGlasses className="text-blue-600 size-5" />
        )}
        {plan === "free" ? (
          <p className="text-gray-600 text-sm">Free Trial</p>
        ) : (
          <p className="text-gray-600 text-sm">Pro Member</p>
        )}
        <Link
          href={"#"}
          className="text-blue-700 text-sm font-normal hover:text-blue-600 active:text-blue-600 transition-colors ml-auto"
        >
          Upgrade
        </Link>
      </div>
    </div>
  );
}
