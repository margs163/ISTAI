"use client";
import LoadingUI from "@/components/loadingUI";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { use, useEffect, useState } from "react";

export default function Page({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const router = useRouter();
  const { mutate, isError } = useMutation({
    mutationKey: ["verify-email"],
    mutationFn: async () => {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_FASTAPI}/auth/verify`,
          {
            token: token,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          router.replace("/dashboard");
        }
      } catch (error) {
        console.error(error);
      }
    },
  });
  useEffect(() => {
    if (!token || token.length < 256) {
      router.replace("/");
    } else {
      mutate();
    }
  }, []);

  if (isError) {
    return (
      <div className="flex flex-col space-y-4 items-center">
        <div className="flex items-center justify-center shrink-0 bg-red-500 rounded-full p-2">
          <X className="size-9 text-white" />
        </div>
        <div className="space-y-1 text-center">
          <h1 className="font-semibold text-xl text-gray-800">
            Sorry, we could not verify your email
          </h1>
          <p className="text-xs text-gray-600 font-medium">
            Please wait some time and try again!
          </p>
        </div>
      </div>
    );
  }
  return <LoadingUI />;
}
