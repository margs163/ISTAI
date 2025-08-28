import { useAvatarStore } from "@/lib/avatarStore";
import { fetchAvatar } from "@/lib/queries";
import { UpdateUserType } from "@/lib/types";
import { useUserStore } from "@/lib/userStorage";
import { useQuery } from "@tanstack/react-query";
import { User } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";

export default function AvatarInfo({
  register,
  errors,
  handleDeleteAvatar,
}: {
  register: UseFormRegister<UpdateUserType>;
  errors: FieldErrors<UpdateUserType>;
  handleDeleteAvatar: () => void;
}) {
  const avatarPath = useUserStore((state) => state.avatar_path);
  const avatarState = useAvatarStore((state) => state);
  useQuery({
    queryKey: ["avatar-fetch", avatarPath],
    queryFn: async () => {
      if (!avatarPath) return null;
      return await fetchAvatar(avatarPath, avatarState.setUrl);
    },
    enabled: !!avatarPath,
  });
  return (
    <section className="px-6 lg:px-12 flex flex-col lg:flex-row lg:items-center lg:justify-between items-start gap-6 justify-start w-full">
      <div className="flex flex-row gap-4 items-center">
        {avatarState.url ? (
          <Image
            width={200}
            height={200}
            src={avatarState.url}
            alt="avatar"
            className="object-cover shrink-0 h-18 w-18 rounded-full border-2 border-gray-200"
          />
        ) : (
          <div className="h-18 w-18 rounded-full bg-indigo-600 flex items-center justify-center hover:bg-indigo-600 active:bg-indigo-600 transition-colors">
            <User className="size-7 lg:size-8 text-white shrink-0" />
          </div>
        )}
        <div className="flex flex-col gap-1 items-start">
          <h1 className="text-lg font-semibold text-gray-800">
            Profile Picture
          </h1>
          <p className="text-sm font-normal text-gray-600">
            PNG, JPEG under 5MB
          </p>
          {errors.avatarFile && (
            <p className="text-red-700 font-normal text-xs">
              {errors.avatarFile.message}
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-row gap-2 items-stretch justify-start">
        <label className="rounded-md border border-gray-200 bg-white hover:bg-gray-50 active:bg-gray-50 transition-colors cursor-pointer px-4 py-2 text-sm font-medium">
          <input
            className="hidden"
            accept="image/png,image/jpeg"
            type="file"
            {...register("avatarFile")}
          />
          Upload New Image
        </label>
        <button
          onClick={handleDeleteAvatar}
          className="rounded-md bg-gray-100 hover:bg-gray-200 active:bg-gray-200 transition-colors cursor-pointer px-4 py-2 text-sm font-medium"
        >
          Delete
        </button>
      </div>
    </section>
  );
}
