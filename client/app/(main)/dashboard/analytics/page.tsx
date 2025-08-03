import BandScoreCards from "@/components/dashboard/BandScoreCards";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { CommonMistakes } from "@/components/dashboard/MistakesCard";
import React from "react";

export default function page() {
  return (
    <div className="w-full flex flex-col gap-6 bg-gray-50 pb-6">
      <DashboardHeader />
      <BandScoreCards />
      <CommonMistakes />
    </div>
  );
}
