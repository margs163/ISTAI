import clsx from "clsx";
import React from "react";
import { twMerge } from "tailwind-merge";

export default function ButtonPrimary({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      className={twMerge(
        "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-500 hover:to-purple-600 px-5 py-2.5 transition-colors lg:px-7 lg:py-3 tracking-tight rounded-full text-xs lg:text-lg lg:tracking-tighter font-medium text-white",
        className
      )}
    >
      {children}
    </button>
  );
}
