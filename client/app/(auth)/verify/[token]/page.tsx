"use client";
import LoadingUI from "@/components/loadingUI";
import MainButton from "@/components/MainButton";
import { useUserStore } from "@/lib/userStorage";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { MoveRight, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { use, useEffect, useState } from "react";
import { toast } from "sonner";

export default function Page({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const router = useRouter();
  const userEmail = useUserStore((state) => state.email);
  const verifiedStatus = useUserStore((state) => state.email);

  const [cooldownTimer, setCooldownTimer] = useState(30);
  const { mutate, error } = useMutation({
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
          toast.success("Successfully verified your email", {
            description: "Proceed to the dashboard",
          });
          router.replace("/dashboard");
        }
      } catch (error) {
        toast.error("Could not verify your email", {
          description: "Invalid token or already verified",
        });
        throw error;
      }
    },
  });

  const verificationMutation = useMutation({
    mutationKey: ["retry-verify"],
    mutationFn: async () => {
      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_FASTAPI}/auth/request-verify-token`,
          {
            email: userEmail,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        toast.info("Verification email was sent", {
          description: "Check your email for verification",
        });
      } catch (error) {
        toast.error("Could not send a verification email", {
          description: "Sorry try again later",
        });
        throw error;
      }
    },
  });
  useEffect(() => {
    if (!token || token.length < 180) {
      router.replace("/");
    } else {
      mutate();
    }
  }, [token]);

  useEffect(() => {
    if (error && cooldownTimer !== 0) {
      const intervalId = setInterval(() => {
        setCooldownTimer((prev) => {
          return Math.max(0, prev - 1);
        });
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [error, cooldownTimer]);

  if (error) {
    return (
      <div className="flex flex-col gap-4 lg:gap-6 justify-center items-center min-h-screen w-full font-geist">
        <div className="flex items-center justify-center shrink-0 bg-red-500 rounded-full p-3">
          <X className="size-10 text-white" />
        </div>
        <div className="space-y-2 text-center max-w-[280px] lg:max-w-[320px]">
          <h1 className="font-semibold text-xl lg:text-2xl lg:font-semibold text-gray-800">
            Sorry, we could not verify your email
          </h1>
          <p className="text-sm text-gray-600 font-medium lg:text-base">
            An expected error has happened. You may wait some time and try
            again.
          </p>
        </div>
        <div
          className={cn(
            "flex flex-col lg:flex-row w-48 lg:w-max gap-3 items-stretch lg:items-center mt-6 lg:mt-8"
          )}
        >
          <MainButton
            variant="secondary"
            disabled={cooldownTimer !== 0}
            onClick={async () => {
              if (!verificationMutation.isPending) {
                await verificationMutation.mutateAsync();
                setCooldownTimer(60);
              }
            }}
            className={
              "ml-0 cursor-pointer py-2.5 justify-center lg:w-46 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
            }
          >
            Request again in {cooldownTimer} sec
          </MainButton>
          <Link
            href={"/"}
            replace
            className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-600 transition-colors text-sm font-medium text-white flex items-center justify-center rounded-md gap-2 cursor-pointer"
          >
            Go to dashboard <MoveRight className="size-5" />
          </Link>
        </div>
      </div>
    );
  }
  return <LoadingUI />;
}
