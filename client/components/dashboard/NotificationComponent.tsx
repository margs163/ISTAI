"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotificationType } from "@/lib/types";
import { Mail } from "lucide-react";
import { useNotificationsStore } from "@/lib/notificationStore";

function NotificationItem({
  notification,
}: {
  notification: NotificationType;
}) {
  return (
    <div className="flex flex-row items-start gap-3 justify-start">
      <div className="p-2 rounded-full flex items-center justify-center bg-indigo-500">
        <Mail className="text-white size-4.5 shrink-0" />
      </div>
      <div className="space-y-0.5">
        <h3 className="text-sm font-medium text-gray-800">
          {notification.type}
        </h3>
        <p className="text-xs font-normal text-balance text-gray-600">
          {notification.message}
        </p>
        <p className="text-xs font-normal text-gray-400">
          {new Date(notification?.time as string).toDateString()}
        </p>
      </div>
    </div>
  );
}

export default function NotificationComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  const notifications = useNotificationsStore((state) => state.notifications);
  if (notifications) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger>{children}</DropdownMenuTrigger>
        <DropdownMenuContent className="font-geist max-h-[500px] overflow-y-scroll min-w-[320px] max-w-[340px] mr-4 mt-4">
          <DropdownMenuLabel className="flex flex-col gap-0 items-start px-4 py-3">
            <h3 className="text-sm font-medium text-gray-800">Notifications</h3>
            <p className="text-xs font-normal text-gray-600">
              You have {notifications.length} noitifications today.
            </p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {notifications.map((item, index) => (
            <div key={index}>
              <DropdownMenuItem key={index} className="pl-5 py-2.5">
                <NotificationItem notification={item} />
              </DropdownMenuItem>
              {index !== notifications.length - 1 && <DropdownMenuSeparator />}
            </div>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
}
