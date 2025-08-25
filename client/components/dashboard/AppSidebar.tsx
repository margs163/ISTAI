"use client";
import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "../ui/sidebar";
import Link from "next/link";
import {
  BadgeCheck,
  BarChart3,
  FileText,
  FolderPlus,
  HelpCircle,
  Home,
  LogIn,
  Mail,
  MessageCircle,
  Mic,
  Plus,
  Settings,
  Share,
  TrendingUp,
  User,
} from "lucide-react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "../ui/menubar";
import LogoWithIcon from "../LogoWithIcon";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import UpgradePro from "./UpgradePro";

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
    isActive: true,
  },
  {
    title: "Practice Tests",
    url: "/dashboard/practice-tests",
    icon: Mic,
  },
  {
    title: "Analysis & Scores",
    url: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    title: "Progress Trends",
    url: "/dashboard/progress",
    icon: TrendingUp,
  },
  {
    title: "Transcriptions",
    url: "/dashboard/transcriptions",
    icon: FileText,
  },
];

const bottomMenuItems = [
  {
    title: "Account Settings",
    url: "/dashboard/profile",
    icon: Settings,
  },
  {
    title: "Help & Support",
    url: "/dashboard/profile",
    icon: HelpCircle,
  },
];

export default function AppSidebar() {
  const currentLink = usePathname();
  return (
    <Sidebar className="font-geist bg-white">
      <SidebarHeader className="px-6 py-6 pt-8">
        <LogoWithIcon />
      </SidebarHeader>
      <SidebarContent className="px-3 font-geist">
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className="text-gray-700 data-[true=active]:text-gray-800 transition-colors"
                      isActive={currentLink === item.url}
                    >
                      <Link href={item.url}>
                        <div className="flex flex-row gap-2 items-center justify-start">
                          <item.icon className="size-4" />
                          <h3 className="text-sm lg:font-normal">
                            {item.title}
                          </h3>
                        </div>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator className="my-4 max-w-[90%]" />
        <SidebarGroup>
          <SidebarGroupContent>
            <button className="px-4 py-2.5 rounded-md bg-gray-800 hover:bg-gray-700 active:bg-gray-700 text-sm font-medium text-white flex flex-row gap-2 items-center transition-colors">
              <Plus className="size-4" />
              <span className="text-xs font-medium font-geist">
                New Practice Test
              </span>
            </button>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="space-y-4 font-geist">
        <SidebarMenu className="px-3">
          {bottomMenuItems.map((item) => {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  className="data-[true=active]:text-gray-800 text-gray-700 transition-colors"
                >
                  <Link href={item.url}>
                    <div className="flex flex-row gap-2 items-center justify-start">
                      <item.icon className="size-4" />
                      <h3 className="text-sm">{item.title}</h3>
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
        <UpgradePro plan="free" />
        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
            className="px-4 py-2 rounded-lg w-full hover:bg-gray-100 active:bg-gray-100 transition-colors data-[state=open]:bg-gray-100"
          >
            <div className="flex flex-row gap-3 items-center justify-start w-full">
              <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center">
                <User className="size-4 text-white shrink-0" />
              </div>
              <div className="space-y-0 flex flex-col items-start">
                <h3 className="text-sm font-medium text-gray-800">
                  Aldanov Daniyal
                </h3>
                <p className="text-xs font-normal text-gray-600">
                  Intermediate level
                </p>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="font-geist min-w-[160px]">
            <DropdownMenuItem>Account</DropdownMenuItem>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Subscription</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Log Out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
