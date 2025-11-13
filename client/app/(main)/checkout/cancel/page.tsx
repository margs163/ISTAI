"use client";
import MainButton from "@/components/MainButton";
import { Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

export default function Page() {
  const router = useRouter();

  return (
    <div className="w-full h-screen flex items-center justify-center p-4 font-geist">
      <div className="flex flex-col space-y-4 items-center max-w-[500px]">
        <div className="flex items-center justify-center shrink-0 bg-red-500 rounded-full p-2">
          <X className="size-12 lg:size-16 text-white" />
        </div>
        <div className="space-y-4 text-center">
          <h1 className="font-semibold text-xl lg:text-3xl text-gray-800">
            Sorry, we could not process your payment
          </h1>
          <p className="text-sm lg:text-base text-gray-600 font-medium">
            Please try again or contact your bank for more information. You can
            now return to the dashboard.
          </p>
          <MainButton
            onClick={() => {
              router.replace("/dashboard");
            }}
            variant="primary"
            className={"mx-auto text-sm px-6 mt-6"}
          >
            Return
          </MainButton>
        </div>
      </div>
    </div>
  );
}
