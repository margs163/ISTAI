import { create } from "zustand";
import { NotificationType } from "./types";

type NotificationsStoreType = {
  notifications: NotificationType[];
  addNotification: (item: NotificationType) => void;
  setNotifications: (items: NotificationType[]) => void;
  removeNotification: (id: string) => void;
};

export const useNotificationsStore = create<NotificationsStoreType>()(
  (set) => ({
    notifications: [],
    setNotifications: (items) => set({ notifications: items }),
    addNotification: (item) =>
      set((state) => ({
        notifications: [...state.notifications, item],
      })),
    removeNotification: (id) =>
      set((state) => {
        const copyState = [...state.notifications];
        return { notifications: copyState.filter((item) => item.id !== id) };
      }),
  })
);
