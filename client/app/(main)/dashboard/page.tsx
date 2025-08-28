"use client";
import BandScoreChart from "@/components/dashboard/BandScoreChart";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Greeting from "@/components/dashboard/Greeting";
import QuickActions from "@/components/dashboard/QuickActions";
import RadarChart from "@/components/dashboard/RadarChart";
import RecentPracticeTests from "@/components/dashboard/RecentPracticeTests";
import StatisticsCards from "@/components/dashboard/StatisticsCards";
import React, { useEffect, useState } from "react";
import { useAnalyticsStore, useUserStore } from "@/lib/userStorage";
import { useQuery } from "@tanstack/react-query";
import {
  fetchAnalytics,
  fetchAvatar,
  fetchNotifications,
  fetchSubscription,
  fetchUser,
} from "@/lib/queries";
import { toast } from "sonner";
import { useSubscriptionStore } from "@/lib/subscriptionStore";
import { useNotificationsStore } from "@/lib/notificationStore";

export default function Page() {
  const setUserData = useUserStore((state) => state.setUserData);
  const userId = useUserStore((state) => state.id);
  const avatarPath = useUserStore((state) => state.avatar_path);
  const setAnalytics = useAnalyticsStore((state) => state.setAnalyticsData);
  const analyticsId = useAnalyticsStore((state) => state.id);
  const setSubscription = useSubscriptionStore((state) => state.setSubData);
  const setNotifications = useNotificationsStore(
    (state) => state.setNotifications
  );

  const userState = useUserStore((state) => state);
  useEffect(() => {
    if (userState.email && !userState.isVerified) {
      toast("Please verify your email", {
        description: "We have sent you an account verification email!",
      });
    }
  }, []);

  useQuery({
    queryKey: ["user"],
    queryFn: async () => await fetchUser(setUserData),
    staleTime: 1000 * 60 * 2,
  });

  useQuery({
    queryKey: ["get-analytics"],
    queryFn: async () => await fetchAnalytics(setAnalytics),
    staleTime: 1000 * 60 * 2,
  });

  useQuery({
    queryKey: ["avatar-fetch", avatarPath],
    queryFn: async () => {
      if (!avatarPath) return null;
      await fetchAvatar(avatarPath, setAvatarUrl);
    },
    enabled: !!avatarPath,
  });

  useQuery({
    queryKey: ["subscription-fetch"],
    queryFn: async () => await fetchSubscription(setSubscription),
    staleTime: 1000 * 60 * 2,
  });

  useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const data = await fetchNotifications();
      if (data) {
        setNotifications(data);
      }
      return data;
    },
  });

  return (
    <div className="w-full flex flex-col gap-6 bg-gray-50 pb-6">
      <DashboardHeader />
      <Greeting />
      <div className="w-full flex flex-col gap-6 lg:grid lg:grid-cols-[0.24fr_0.49fr_0.32fr] lg:justify-items-stretch">
        <StatisticsCards />
        <BandScoreChart />
        <RadarChart />
      </div>
      <div className="w-full flex flex-col gap-6 lg:grid lg:grid-cols-[0.7fr_0.3fr] lg:gap-6">
        <RecentPracticeTests />
        <QuickActions />
      </div>
    </div>
  );
}
