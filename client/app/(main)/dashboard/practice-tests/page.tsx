import DashboardHeader from "@/components/dashboard/DashboardHeader";
import AllTestsHeader from "@/components/dashboard/practice-tests/AllTestsHeader";
import AllPracticeTests from "@/components/dashboard/PracticeTests";
import React from "react";

export default function Page() {
  return (
    <div className="w-full flex flex-col gap-6 bg-gray-50 pb-6">
      <DashboardHeader />
      <AllTestsHeader />
      <AllPracticeTests />
    </div>
  );
}
