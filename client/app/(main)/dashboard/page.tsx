"use client";
import BandScoreChart from "@/components/dashboard/BandScoreChart";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Greeting from "@/components/dashboard/Greeting";
import QuickActions from "@/components/dashboard/QuickActions";
import RadarChart from "@/components/dashboard/RadarChart";
import RecentPracticeTests from "@/components/dashboard/RecentPracticeTests";
import StatisticsCards from "@/components/dashboard/StatisticsCards";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  useAnalyticsStore,
  UserData,
  UserDataServer,
  useUserStore,
} from "@/lib/userStorage";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { fetchAnalytics, fetchUser } from "@/lib/queries";
import { useLocalPracticeTestStore } from "@/lib/practiceTestStore";
import { toast } from "sonner";

export default function Page() {
  const setUserData = useUserStore((state) => state.setUserData);
  const setAnalytics = useAnalyticsStore((state) => state.setAnalyticsData);

  const userState = useUserStore((state) => state);
  useEffect(() => {
    if (userState.email && !userState.isVerified) {
      toast("Please verify your email", {
        description: "We have sent you an account verification email!",
      });
    }
  }, [userState]);

  useQuery({
    queryKey: ["user"],
    queryFn: async () => await fetchUser(setUserData),
  });

  useQuery({
    queryKey: ["get-analytics"],
    queryFn: async () => await fetchAnalytics(setAnalytics),
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
