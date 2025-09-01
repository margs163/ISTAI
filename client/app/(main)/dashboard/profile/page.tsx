"use client";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import AvatarInfo from "@/components/dashboard/profile/AvatarInfo";
import ProfileTitle from "@/components/dashboard/profile/ProfileTitle";
import UserBilling from "@/components/dashboard/profile/UserBilling";
import UserCreds from "@/components/dashboard/profile/UserCreds";
import UserInfo from "@/components/dashboard/profile/UserInfo";
import { useAvatarStore } from "@/lib/avatarStore";
import { deleteAvatar } from "@/lib/queries";
import { UpdateUserSchema, UpdateUserType } from "@/lib/types";
import { useUserStore } from "@/lib/userStorage";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function Page() {
  const {
    register,
    handleSubmit,
    formState: { errors, isLoading, isSubmitted },
  } = useForm<UpdateUserType>({
    resolver: zodResolver(UpdateUserSchema),
  });
  const setAvatarPath = useUserStore((state) => state.setAvatarPath);
  const setAvatarUrl = useAvatarStore((state) => state.setUrl);
  const onSubmit = useCallback(
    async (data: UpdateUserType) => {
      const cleanedUpdate = Object.fromEntries(
        Object.entries(data).filter(
          ([key, value]) => value && key !== "avatarFile"
        )
      );
      try {
        axios.patch(
          `http://${process.env.NEXT_PUBLIC_FASTAPI}/users/me`,
          cleanedUpdate,
          {
            withCredentials: true,
          }
        );

        if (data.avatarFile) {
          const formData = new FormData();
          formData.append("file", data.avatarFile);
          const response_avatar = await axios.put<{ filepath: string }>(
            `http://${process.env.NEXT_PUBLIC_FASTAPI}/avatar/me`,
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
              withCredentials: true,
            }
          );
          const filePath = response_avatar.data.filepath;
          setAvatarPath(filePath);
          sessionStorage.removeItem("avatar-url");
        }
        toast("Profile Changed", {
          description: "Profile was changed successfully",
        });
      } catch (error) {
        toast("Error Fetching Avatar", {
          description: "Could not fetch analytics",
          action: {
            label: "Log",
            onClick: () => console.log(error),
          },
        });
      }
    },
    [setAvatarPath]
  );

  const handleDeleteAvatar = useCallback(async () => {
    await deleteAvatar();
    setAvatarPath("");
    sessionStorage.removeItem("avatar-url");
    setAvatarUrl("");
  }, [setAvatarPath, setAvatarUrl]);
  return (
    <div className="w-full flex flex-col gap-6 lg:gap-8 bg-white font-geist pb-6">
      <DashboardHeader />
      <div className="space-y-6 lg:space-y-8 w-full max-w-[800px] lg:self-center pt-2">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 lg:space-y-8"
        >
          <ProfileTitle />
          <AvatarInfo
            handleDeleteAvatar={handleDeleteAvatar}
            errors={errors}
            register={register}
          />
          <UserInfo errors={errors} register={register} />
          <UserCreds errors={errors} register={register} />
        </form>
        <div className="space-y-6 lg:space-y-8">
          <UserBilling />
        </div>
      </div>
    </div>
  );
}
