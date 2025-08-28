import { cn } from "@/lib/utils";
import { type ClassValue } from "clsx";
import React, { ButtonHTMLAttributes } from "react";

type MainButtonProps = {
  children: React.ReactNode;
  className?: ClassValue;
  type?: "submit" | "button" | "reset";
  variant?: "primary" | "secondary";
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function MainButton({
  children,
  className,
  type = "button",
  variant = "primary",
  ...props
}: MainButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "px-3 py-2 rounded-md text-sm font-medium flex flex-row gap-2 items-center transition-colors ml-auto",
        variant === "primary"
          ? "bg-gray-800 brightness-95 hover:bg-gray-900 active:bg-gray-900 text-white"
          : "bg-gray-100 hover:bg-gray-200 active:bg-gray-200 text-gray-800",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
