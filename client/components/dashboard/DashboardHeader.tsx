import React from "react";
import { SidebarTrigger } from "../ui/sidebar";
import { BadgeCheck, Bell, FolderPlus, Plus, Search } from "lucide-react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "../ui/menubar";
import ProfileLink from "../ProfileLink";
import NewTest from "./NewTest";
import MainButton from "../MainButton";

export default function DashboardHeader() {
  return (
    <div className="p-4 py-4 lg:py-4 w-full bg-white flex flex-row justify-between items-center gap-4 lg:gap-4 lg:px-6 border-b-1 border-gray-200">
      <SidebarTrigger />
      <div className=" px-4 py-2 border border-transparent focus-within:border-gray-300 bg-gray-100 rounded-lg hidden lg:flex flex-row gap-2 items-center transition-all">
        <Search className="size-4 text-gray-500" />
        <input
          type="text"
          placeholder="Search or type a command"
          name="search"
          className="w-full text-sm font-normal text-gray-700 focus-within:outline-0"
        />
      </div>
      <NewTest>
        <MainButton>
          <Plus className="size-4" />
          <span className="text-xs font-medium font-geist">New Test</span>
        </MainButton>
      </NewTest>
      <Menubar className=" p-0 h-auto border-0 font-geist">
        <MenubarMenu>
          <MenubarTrigger className="p-2 rounded-full w-full border-0">
            <Bell className="size-4" />
          </MenubarTrigger>
          <MenubarContent className="p-3">
            <MenubarItem className="text-sm lg:font-medium text-gray-700 flex flex-row items-center">
              <BadgeCheck className="shrink-0 size-5" />{" "}
              <div>
                <h3 className="text-sm font-medium text-gray-700">
                  Please verify your account!
                </h3>
                <p className="text-xs font-normal text-gray-600">
                  Pass the verification
                </p>
              </div>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem className="text-sm lg:font-medium text-gray-700 flex flex-row items-center gap-2">
              <FolderPlus className="shrink-0 size-5" />
              <div>
                <h3 className="text-sm font-medium text-gray-700">
                  Create a new project
                </h3>
                <p className="text-xs font-normal text-gray-600">
                  Start by creating a new project
                </p>
              </div>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
      <ProfileLink />
    </div>
  );
}
