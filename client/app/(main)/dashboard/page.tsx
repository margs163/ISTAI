import BandScoreChart from "@/components/dashboard/BandScoreChart";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Greeting from "@/components/dashboard/Greeting";
import QuickActions from "@/components/dashboard/QuickActions";
import RadarChart from "@/components/dashboard/RadarChart";
import RecentPracticeTests from "@/components/dashboard/RecentPracticeTests";
import StatisticsCards from "@/components/dashboard/StatisticsCards";
import React from "react";

export default function Page() {
  return (
    <div className="w-full flex flex-col gap-6 bg-gray-50 pb-6">
      <DashboardHeader />
      <Greeting />
      <div className="w-full flex flex-col gap-6 lg:grid lg:grid-cols-[0.4fr_0.34fr_0.26fr]">
        <BandScoreChart />
        <RadarChart />
        <StatisticsCards />
      </div>
      <div className="w-full flex flex-col gap-6 lg:grid lg:grid-cols-[0.7fr_0.3fr] lg:gap-6">
        <RecentPracticeTests />
        <QuickActions />
      </div>
    </div>
  );
}
