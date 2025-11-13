"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotificationType } from "@/lib/types";
import { Check, Mail } from "lucide-react";
import { useNotificationsStore } from "@/lib/notificationStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markNotifications } from "@/lib/queries";
import { cn } from "@/lib/utils";

function NotificationItem({
  notification,
}: {
  notification: NotificationType;
}) {
  return (
    <div className="flex flex-row items-start gap-3 justify-start w-full">
      <div
        className={cn(
          notification.is_read ? "bg-gray-300" : "bg-indigo-500",
          "p-2 rounded-full flex items-center justify-center"
        )}
      >
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
      {notification.is_read && (
        <Check className="size-4.5 text-gray-400 ml-auto self-center mr-1 shrink-0" />
      )}
    </div>
  );
}

export default function NotificationComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = useQueryClient();
  const notifications = useNotificationsStore((state) => state.notifications);
  const setNotifications = useNotificationsStore(
    (state) => state.setNotifications
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const readMutation = useMutation({
    mutationKey: ["read-notifications"],
    mutationFn: markNotifications,
    onSuccess: (data, variables) => {
      if (data) {
        setNotifications(data);
      }
    },
  });

  const unreadNotifications = useMemo(() => {
    return notifications.filter((item) => !item.is_read);
  }, [notifications]);

  const sortedNotifications = useMemo(() => {
    const copy = structuredClone(notifications);
    copy.sort((a, b) => +b.is_read - +a.is_read);
    return copy;
  }, [notifications]);

  return (
    <DropdownMenu
      open={menuOpen}
      onOpenChange={async (open) => {
        if (open) {
          queryClient.invalidateQueries({ queryKey: ["notifications"] });

          const unreadIds = notifications
            .filter((item) => !item.is_read)
            .map((item) => item.id);

          if (unreadIds.length > 0) {
            readMutation.mutateAsync(unreadIds as string[]);
          }
        }
        setMenuOpen(open);
      }}
    >
      <DropdownMenuTrigger>
        <div className="relative">
          {children}
          {unreadNotifications.length > 0 && (
            <div className="absolute -top-2 -right-1.5 flex items-center justify-center px-[4px] py-[0.5px] bg-red-500 text-white text-[10px] font-medium rounded-full">
              <p className="shrink-0">{unreadNotifications.length}</p>
            </div>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="font-geist max-h-[500px] overflow-y-scroll min-w-[320px] max-w-[340px] mr-4 mt-4">
        <DropdownMenuLabel className="flex flex-col gap-0 items-start px-4 py-3">
          <h3 className="text-sm font-medium text-gray-800">Notifications</h3>
          <p className="text-xs font-normal text-gray-600">
            You have {notifications.length ?? 0} noitifications today.
          </p>
        </DropdownMenuLabel>
        {sortedNotifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            {sortedNotifications.map((item, index) => (
              <div key={index}>
                <DropdownMenuItem key={index} className="pl-5 py-2.5">
                  <NotificationItem notification={item} />
                </DropdownMenuItem>
                {index !== notifications.length - 1 && (
                  <DropdownMenuSeparator />
                )}
              </div>
            ))}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
