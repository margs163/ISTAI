"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import SearchPages from "./SearchPages";
import CouponHeader from "./CouponHeader";

export default function DashboardHeader() {
  const avatarPath = useUserStore((state) => state.avatar_path);
  const avatarState = useAvatarStore((state) => state);
  const creditsLeft = useSubscriptionStore((state) => state.credits_left);

  const [openDiscount, setOpenDiscount] = useState(true);

  useEffect(() => {
    const value = sessionStorage.getItem("close-discount");
    if (!value) {
      sessionStorage.setItem("close-discount", JSON.stringify(true));
      setOpenDiscount(true);
    } else {
      setOpenDiscount(JSON.parse(value));
    }
  }, []);

  const closeDiscount = useCallback(() => {
    const closeSession = sessionStorage.getItem("close-discount");
    if (!closeSession) {
      sessionStorage.setItem("close-discount", JSON.stringify(false));
    } else {
      sessionStorage.removeItem("close-discount");
      sessionStorage.setItem("close-discount", JSON.stringify(false));
    }
    setOpenDiscount(false);
  }, []);

  useQuery({
    queryKey: ["avatar-fetch"],
    queryFn: async () => {
      if (!avatarPath) return null;
      return await fetchAvatar(avatarPath, avatarState.setUrl);
    },
    enabled: !!avatarPath,
  });
  return (
    <div>
      {openDiscount && <CouponHeader closeFn={closeDiscount} />}
      <div className="p-4 py-4 lg:py-4 w-full bg-white flex flex-row justify-between items-center gap-4 lg:gap-4 lg:px-6 border-b-1 border-gray-200 sticky top-0 z-10">
        <SidebarTrigger />
        <SearchPages />
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
    </div>
  );
}
