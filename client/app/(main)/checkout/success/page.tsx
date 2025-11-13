"use client";
import MainButton from "@/components/MainButton";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

export default function Page() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return (
    <div className="w-full h-screen flex items-center justify-center p-4 font-geist">
      <div className="flex flex-col space-y-4 items-center max-w-[500px]">
        <div className="flex items-center justify-center shrink-0 bg-green-500 rounded-full p-2">
          <Check className="size-12 lg:size-16 text-white" />
        </div>
        <div className="space-y-4 text-center">
          <h1 className="font-semibold text-xl lg:text-3xl text-gray-800">
            Success! Thank you for your purchase
          </h1>
          <p className="text-sm lg:text-base text-gray-600 font-medium">
            We have sent you an email with the receipt and details of your
            purchase. You can now return to the dashboard and start using your
            subscription.
          </p>
          <MainButton
            onClick={() => {
              queryClient.invalidateQueries({
                queryKey: ["subscription-fetch"],
              });
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
