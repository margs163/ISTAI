"use client";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import React, { useState } from "react";

export default function FaqItem({
  item,
}: {
  item: {
    title: string;
    description: string;
  };
}) {
  const [itemPressed, setItemPressed] = useState(false);
  return (
    <div className="flex flex-col gap-3">
      <div
        className="flex flex-row justify-between items-center gap-4 cursor-pointer"
        onClick={() => setItemPressed(!itemPressed)}
      >
        <h2 className="text-base font-medium lg:text-lg text-gray-800">
          {item.title}
        </h2>
        <ChevronDown
          className={`text-gray-600 p-2 size-5 lg:size-6 rounded-full box-content hover:bg-gray-50 ${
            itemPressed && "rotate-180"
          } transition-transform shrink-0`}
        />
      </div>
      <div
        className={`grid ${
          itemPressed ? "grid-rows-[1fr]" : " grid-rows-[0fr]"
        } overflow-hidden transition-[grid-template-rows]`}
      >
        <div className=" overflow-hidden">
          <p className="text-sm font-normal lg:font-normal lg:text-base text-gray-700">
            {item.description}
          </p>
        </div>
      </div>
      <hr
        className={cn(
          "w-full h-[2px] bg-gray-200 text-gray-200 rounded-full",
          itemPressed && "mt-2"
        )}
      />
    </div>
  );
}
