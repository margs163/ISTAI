import clsx from "clsx";
import React from "react";
import { twMerge } from "tailwind-merge";

export default function ButtonSecondary({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      className={twMerge(
        "bg-white hover:bg-slate-100 transition-colors px-5 py-2.5 lg:px-7 lg:py-3  rounded-full text-xs font-medium lg:tracking-tighter lg:text-lg text-gray-800",
        className
      )}
    >
      {children}
    </button>
  );
}
