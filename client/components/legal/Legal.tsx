import { cn } from "@/lib/utils";
import React from "react";

export function MainLegalHeader({
  children,
  tag,
  className,
  updateDate,
}: {
  children: string;
  tag: string;
  className?: string;
  updateDate: string;
}) {
  return (
    <section className={cn("space-y-8 text-center lg:text-left", className)}>
      <div className="space-y-4">
        <p className="text-sm font-normal text-gray-600">{tag}</p>
        <h1 className="text-2xl tracking-tight scroll-m-20 font-bold text-gray-800 lg:text-3xl first:mt-0">
          {children}
        </h1>
      </div>
      <p>Last updated: {updateDate}</p>
    </section>
  );
}

export function RegularLegalParagraph({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "text-sm lg:text-base leading-7 [&:not(:first-child)]:mt-6 font-normal text-gray-600",
        className
      )}
    >
      {children}
    </p>
  );
}

export function RegularLegalHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3
      className={cn(
        "text-lg mb-4 lg:text-xl tracking-tight scroll-m-20 font-bold text-gray-800",
        className
      )}
    >
      {children}
    </h3>
  );
}

export function LegalBullitLi({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <li
      className={cn(
        "text-sm lg:text-base font-normal leading-6 text-gray-700",
        className
      )}
    >
      {children}
    </li>
  );
}

export function LegalBullitList({
  children,
  className,
  description,
}: {
  children: React.ReactNode;
  className?: string;
  description?: string;
}) {
  return (
    <div className={cn("space-y-4")}>
      {description && (
        <p className="text-sm mt-4 lg:text-base font-normal text-gray-700">
          {description}
        </p>
      )}
      <ul className={cn("my-6 ml-6 list-disc [&>li]:mt-4", className)}>
        {children}
      </ul>
    </div>
  );
}
