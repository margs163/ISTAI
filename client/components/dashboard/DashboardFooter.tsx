import { cn } from "@/lib/utils";
import Link from "next/link";

export default function DashboardFooter({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-row flex-wrap items-center justify-start gap-4 lg:gap-6 w-full px-6 py-0 lg:py-0.5 lg:px-8 pb-0",
        className
      )}
    >
      <Link
        href={"/privacy"}
        className="text-gray-400 hover:text-gray-500 active:text-gray-500 transition-colors text-xs font-normal"
      >
        Privacy policy
      </Link>
      <hr className="w-[2px] h-4 text-gray-200 bg-gray-200" />
      <Link
        href={"/terms-of-use"}
        className="text-gray-400 hover:text-gray-500 active:text-gray-500 text-xs transition-colors font-normal"
      >
        Terms of Use
      </Link>
      <hr className="w-[2px] h-4 text-gray-200 bg-gray-200" />
      <Link
        href={"/cookie-policy"}
        className="text-gray-400 hover:text-gray-500 active:text-gray-500 transition-colors text-xs font-normal"
      >
        Cookies policy
      </Link>
      <hr className="w-[2px] h-4 text-gray-200 bg-gray-200" />
      <Link
        href={"#"}
        className=" text-gray-400 hover:text-gray-500 active:text-gray-500 transition-colors text-xs font-normal"
      >
        @ Copyright 2025 All rights reserved
      </Link>
    </div>
  );
}
