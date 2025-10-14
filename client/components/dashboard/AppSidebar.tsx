"use client";
import React, { useCallback } from "react";
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
import { usePathname, useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import UpgradePro from "./UpgradePro";
import { logOutUser } from "@/lib/queries";
import { useUserStore } from "@/lib/userStorage";
import { useSubscriptionStore } from "@/lib/subscriptionStore";
import { useAvatarStore } from "@/lib/avatarStore";
import Image from "next/image";
import MainButton from "../MainButton";
import NewTest from "./NewTest";

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
  const router = useRouter();
  const firstName = useUserStore((state) => state.firstName);
  const lastName = useUserStore((state) => state.lastName);

  const subscription_tier = useSubscriptionStore(
    (state) => state.subscription_tier
  );
  const resetUserData = useUserStore((state) => state.resetUserData);
  const avatarUrl = useAvatarStore((state) => state.url);

  const handleLogout = useCallback(async () => {
    const loggedOut = await logOutUser();
    if (loggedOut) {
      resetUserData();
      router.replace("/");
    }
  }, [router]);
  return (
    <Sidebar className="font-geist bg-white">
      <SidebarHeader className="px-6 py-6">
        <LogoWithIcon />
      </SidebarHeader>
      <SidebarContent className="px-2 font-geist">
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                return (
                  <SidebarMenuItem
                    key={item.title}
                    className="data-[state=open]:hover:bg-slate-200"
                  >
                    <SidebarMenuButton
                      asChild
                      className="text-gray-700 data-[true=active]:text-gray-800 transition-colors py-4.5 px-3"
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
            <NewTest>
              <MainButton variant="primary" className={"ml-0"}>
                <Plus className="size-4" />
                <span className="text-xs font-medium font-geist">
                  New Practice Test
                </span>
              </MainButton>
            </NewTest>
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
        <UpgradePro plan={subscription_tier} />
        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
            className="px-4 py-2 rounded-lg w-full hover:bg-gray-100 active:bg-gray-100 transition-colors data-[state=open]:bg-gray-100"
          >
            <div className="flex flex-row gap-3 items-center justify-start w-full">
              {avatarUrl ? (
                <Image
                  width={200}
                  height={200}
                  src={avatarUrl}
                  alt="avatar"
                  className="object-cover shrink-0 h-8.5 w-8.5 aspect-square overflow-hidden rounded-full border border-gray-300"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center hover:bg-indigo-600 active:bg-indigo-600 transition-colors">
                  <User className="size-4 text-white shrink-0" />
                </div>
              )}
              <div className="space-y-0 flex flex-col items-start">
                <h3 className="text-sm font-medium text-gray-800">
                  {firstName} {lastName}
                </h3>
                <p className="text-xs font-normal text-gray-600">
                  {subscription_tier}
                </p>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="font-geist min-w-[160px]">
            <DropdownMenuItem>
              <Link href={"/dashboard/profile"}>Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Log Out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
