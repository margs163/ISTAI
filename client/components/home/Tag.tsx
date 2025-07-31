import React, { PropsWithChildren } from "react";
import { clsx } from "clsx";

export default function Tag({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={clsx(
        "px-3 py-1.5 rounded-2xl bg-gradient-to-b from-blue-500 to-indigo-400 text-xs",
        className
      )}
    >
      <h3 className="font-medium text-white tracking-wide">{children}</h3>
    </div>
  );
}
