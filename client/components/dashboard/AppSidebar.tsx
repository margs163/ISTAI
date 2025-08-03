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
    url: "#",
    icon: Settings,
  },
  {
    title: "Help & Support",
    url: "#",
    icon: HelpCircle,
  },
];

export default function AppSidebar() {
  const currentLink = usePathname();
  return (
    <Sidebar className="font-geist">
      <SidebarHeader className="px-6 py-6">
        <LogoWithIcon />
      </SidebarHeader>

      <SidebarContent className="px-3 font-geist">
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item, index) => {
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={currentLink === item.url}
                    >
                      <Link href={item.url}>
                        <div className="flex flex-row gap-2 items-center justify-start">
                          <item.icon className="size-4" />
                          <h3 className="text-sm lg:font-medium text-gray-800">
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
          {bottomMenuItems.map((item, index) => {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link href={item.url}>
                    <div className="flex flex-row gap-2 items-center justify-start">
                      <item.icon className="size-4" />
                      <h3 className="text-sm lg:font-medium text-gray-800">
                        {item.title}
                      </h3>
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
        <Menubar className="w-full py-0.5 h-auto border-1 bg-white font-geist">
          <MenubarMenu>
            <MenubarTrigger className="px-4 py-2 w-full border-0">
              <div className="flex flex-row gap-3 items-center justify-start">
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
            </MenubarTrigger>
            <MenubarContent className="p-2">
              <MenubarItem className="text-sm lg:font-medium text-gray-700">
                <BadgeCheck /> Account <MenubarShortcut>⌘A</MenubarShortcut>
              </MenubarItem>
              <MenubarItem
                disabled
                className="text-sm lg:font-medium text-gray-700"
              >
                <FolderPlus />
                New Window
              </MenubarItem>
              <MenubarSeparator />
              <MenubarSub>
                <MenubarSubTrigger className="text-sm lg:font-medium text-gray-700">
                  <Share className="size-4 mr-2" />
                  Share
                </MenubarSubTrigger>
                <MenubarSubContent>
                  <MenubarItem className="text-sm lg:font-medium text-gray-700">
                    <Mail />
                    Email link
                  </MenubarItem>
                  <MenubarItem className="text-sm lg:font-medium text-gray-700">
                    <MessageCircle />
                    Messages
                  </MenubarItem>
                </MenubarSubContent>
              </MenubarSub>
              <MenubarSeparator />
              <MenubarItem className="text-sm lg:font-medium text-gray-700">
                <LogIn className="size-4" />
                Log Out
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </SidebarFooter>
    </Sidebar>
  );
}
