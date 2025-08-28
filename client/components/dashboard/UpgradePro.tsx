import { Gem, HatGlasses, TriangleAlert } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function UpgradePro({
  plan,
}: {
  plan: "Free" | "Starter" | "Pro";
}) {
  return (
    <div className="px-2">
      <div className="border border-gray-200 p-3 rounded-md bg-gray-50 flex flex-row gap-2 items-center justify-start">
        {plan === "Free" ? (
          <TriangleAlert className="fill-yellow-500 text-gray-50 size-4.5" />
        ) : (
          <Gem className="text-indigo-600 size-4.5" />
        )}
        {plan === "Free" ? (
          <p className="text-gray-600 text-sm">Free Trial</p>
        ) : (
          <p className="text-gray-600 text-sm">Pro Member</p>
        )}
        <Link
          href={"/pricing"}
          className="text-indigo-700 text-sm font-normal hover:text-indigo-600 active:text-indigo-600 transition-colors ml-auto"
        >
          Upgrade
        </Link>
      </div>
    </div>
  );
}
