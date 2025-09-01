"use client";
import React from "react";
import { SidebarTrigger } from "../ui/sidebar";
import { BadgeCheck, Bell, FolderPlus, Plus, Search } from "lucide-react";
import ProfileLink from "../ProfileLink";
import NewTest from "./NewTest";
import MainButton from "../MainButton";
import Image from "next/image";
import token from "@/assets/images/token.svg";
import { useUserStore } from "@/lib/userStorage";
import { useQuery } from "@tanstack/react-query";
import { fetchAvatar } from "@/lib/queries";
import { useAvatarStore } from "@/lib/avatarStore";
import { useSubscriptionStore } from "@/lib/subscriptionStore";
import NotificationComponent from "./NotificationComponent";

export default function DashboardHeader() {
  const avatarPath = useUserStore((state) => state.avatar_path);
  const avatarState = useAvatarStore((state) => state);
  const creditsLeft = useSubscriptionStore((state) => state.credits_left);
  useQuery({
    queryKey: ["avatar-fetch"],
    queryFn: async () => {
      if (!avatarPath) return null;
      return await fetchAvatar(avatarPath, avatarState.setUrl);
    },
    enabled: !!avatarPath,
  });
  return (
    <div className="p-4 py-4 lg:py-4 w-full bg-white flex flex-row justify-between items-center gap-4 lg:gap-4 lg:px-6 border-b-1 border-gray-200 sticky top-0 z-10">
      <SidebarTrigger />
      <div className=" px-4 py-2 border border-transparent focus-within:border-gray-300 bg-gray-100 rounded-lg hidden lg:flex flex-row gap-2 items-center transition-all">
        <Search className="size-4 text-gray-500" />
        <input
          type="text"
          placeholder="Search or type a command"
          name="search"
          className="w-full text-sm font-normal text-gray-700 focus-within:outline-0"
        />
      </div>
      <div className="flex flex-row gap-1 items-center px-2.5 py-1.5 bg-white border-gray-200 border rounded-md ml-auto">
        <Image src={token} alt="token" className="fill-gray-700 size-5" />
        <h2 className="text-sm font-semibold text-gray-800">{creditsLeft}</h2>
      </div>
      <NewTest>
        <MainButton
          variant="secondary"
          className={
            "ml-0 border border-gray-200 hover:border-gray-300 active:border-gray-300"
          }
        >
          <Plus className="size-4" />
          <span className="text-xs font-medium font-geist">New Test</span>
        </MainButton>
      </NewTest>
      <NotificationComponent>
        <Bell className="size-4" />
      </NotificationComponent>
      <ProfileLink avatarUrl={avatarState.url} />
    </div>
  );
}
