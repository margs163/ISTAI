"use client";
import BandScoreChart from "@/components/dashboard/BandScoreChart";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Greeting from "@/components/dashboard/Greeting";
import QuickActions from "@/components/dashboard/QuickActions";
import RadarChart from "@/components/dashboard/RadarChart";
import RecentPracticeTests from "@/components/dashboard/RecentPracticeTests";
import StatisticsCards from "@/components/dashboard/StatisticsCards";
import React, { useEffect, useRef, useState } from "react";
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
import { useAvatarStore } from "@/lib/avatarStore";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";

export default function Page() {
  const setUserData = useUserStore((state) => state.setUserData);
  const avatarPath = useUserStore((state) => state.avatar_path);
  const setAnalytics = useAnalyticsStore((state) => state.setAnalyticsData);
  const setSubscription = useSubscriptionStore((state) => state.setSubData);
  const setAvatarUrl = useAvatarStore((state) => state.setUrl);
  const setNotifications = useNotificationsStore(
    (state) => state.setNotifications
  );

  const printRef = useRef<HTMLDivElement>(null);

  const userState = useUserStore((state) => state);
  useEffect(() => {
    if (userState.email && !userState.isVerified) {
      toast("Please verify your email", {
        description: "We have sent you an account verification email!",
      });
    }
  }, []);

  // const handleExport = async () => {
  //   const element = printRef.current;
  //   if (!element) return;

  //   const canvas = await html2canvas(element, {
  //     scale: 2,
  //     ignoreElements: (el) => el.classList?.contains("no-print"),
  //   });
  //   const imgData = canvas.toDataURL("image/jpeg");

  //   const pdf = new jsPDF({
  //     orientation: "portrait",
  //     unit: "px",
  //     format: "a4",
  //   });

  //   const pageWidth = pdf.internal.pageSize.getWidth();
  //   const imgProps = pdf.getImageProperties(imgData);
  //   const imgWidth = pageWidth;
  //   const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

  //   pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
  //   pdf.save(`stats.pdf`);
  // };

  useQuery({
    queryKey: ["user"],
    queryFn: async () => await fetchUser(setUserData),
  });

  useQuery({
    queryKey: ["get-analytics"],
    queryFn: async () => await fetchAnalytics(setAnalytics),
  });

  useQuery({
    queryKey: ["avatar-fetch"],
    queryFn: async () => {
      if (!avatarPath) return;
      await fetchAvatar(avatarPath, setAvatarUrl);
    },
    enabled: !!avatarPath,
  });

  useQuery({
    queryKey: ["subscription-fetch"],
    queryFn: async () => await fetchSubscription(setSubscription),
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
      <div
        className="w-full flex flex-col gap-6 lg:grid lg:grid-cols-[0.24fr_0.49fr_0.32fr] lg:justify-items-stretch"
        ref={printRef}
      >
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
