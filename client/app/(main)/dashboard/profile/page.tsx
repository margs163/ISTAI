import DashboardHeader from "@/components/dashboard/DashboardHeader";
import AvatarInfo from "@/components/dashboard/profile/AvatarInfo";
import ProfileTitle from "@/components/dashboard/profile/ProfileTitle";
import UserBilling from "@/components/dashboard/profile/UserBilling";
import UserCreds from "@/components/dashboard/profile/UserCreds";
import UserInfo from "@/components/dashboard/profile/UserInfo";
import React from "react";

export default function page() {
  return (
    <div className="w-full flex flex-col gap-8 bg-white font-geist pb-6">
      <DashboardHeader />
      <div className="space-y-6 w-full lg:grid lg:grid-cols-2">
        <ProfileTitle />
        <div>
          <AvatarInfo />
          <UserInfo />
          <UserCreds />
        </div>
        <div>
          <UserBilling />
        </div>
      </div>
    </div>
  );
}
