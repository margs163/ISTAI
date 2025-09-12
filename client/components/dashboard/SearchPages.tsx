import { BarChart3, Home, Mic, Search, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React, { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
    isActive: true,
  },
  {
    title: "Practice Tests",
    url: "/dashboard/practice-tests",
    icon: Mic,
  },
  {
    title: "Analysis & Scores",
    url: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    title: "Account Settings",
    url: "/dashboard/profile",
    icon: Settings,
  },
];

export default function SearchPages() {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);

  return (
    <section className="flex flex-col gap-2 items-start relative">
      <div className=" px-4 py-2 border border-transparent focus-within:border-gray-300 bg-gray-100 rounded-lg hidden lg:flex flex-row gap-2 items-center transition-all">
        <Search className="size-4 text-gray-500" />
        <input
          type="text"
          placeholder="Search or type a command"
          name="search"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full text-sm font-normal text-gray-700 focus-within:outline-0"
        />
      </div>
      <div
        className={cn(
          "flex flex-col absolute top-12 w-full border border-gray-200 border-b-0 rounded-sm z-30 shadow-md",
          !text && "hidden"
        )}
      >
        {text &&
          menuItems
            .filter((item) =>
              item.title.toLowerCase().includes(text.toLowerCase())
            )
            .map((item, index) => {
              const Icon = item.icon;
              return (
                <Link
                  href={item.url}
                  className="p-4 py-3 border-b border-gray-200 bg-white flex flex-row justify-between items-center gap-2 w-full select-none cursor-pointer hover:bg-slate-50 active:slate-50 transition-colors"
                  key={index}
                >
                  <h3 className="text-sm font-normal text-gray-800">
                    {item.title}
                  </h3>
                  <Icon className="size-4 text-gray-600" />
                </Link>
              );
            })}
      </div>
    </section>
  );
}
