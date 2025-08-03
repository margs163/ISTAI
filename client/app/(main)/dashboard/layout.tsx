import AppContent from "@/components/dashboard/DashboardHeader";
import AppSidebar from "@/components/dashboard/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Inter } from "next/font/google";
import React from "react";
import { headers } from "next/headers";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={"font-geist"}>
      <SidebarProvider>
        <AppSidebar />
        {children}
      </SidebarProvider>
    </div>
  );
}
