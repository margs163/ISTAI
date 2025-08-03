import AppSidebar from "@/components/dashboard/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";

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
