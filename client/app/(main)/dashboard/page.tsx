"use client";
import BandScoreChart from "@/components/dashboard/BandScoreChart";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Greeting from "@/components/dashboard/Greeting";
import QuickActions from "@/components/dashboard/QuickActions";
import RadarChart from "@/components/dashboard/RadarChart";
import RecentPracticeTests from "@/components/dashboard/RecentPracticeTests";
import StatisticsCards from "@/components/dashboard/StatisticsCards";
import React, { useEffect } from "react";
import axios from "axios";
import { UserData, UserDataServer, useUserStore } from "@/lib/userStorage";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export default function Page() {
  const setUserData = useUserStore((state) => state.setUserData);
  useQuery({
    queryKey: ["user"],
    queryFn: () =>
      axios
        .get<UserDataServer>("http://localhost:8000/users/me", {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          const data = response.data;
          const user = {
            id: data.id,
            email: data.email,
            isActive: data.is_active,
            isVerified: data.is_verified,
            isSuperuser: data.is_superuser,
            firstName: data.first_name,
            lastName: data.last_name,
          };
          setUserData(user);
          return user;
        })
        .catch((error) => {
          console.error(error);
        }),
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
