"use client";

import UnexpectedError from "@/components/UnexpectedError";
import { updateSubscription } from "@/lib/queries";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [mutated, setMutated] = useState(false);
  const mutation = useMutation({
    mutationKey: ["refund-practice"],
    mutationFn: updateSubscription,
  });
  useEffect(() => {
    if (!mutated) {
      mutation.mutate({ refund_credits: 10 });
      setMutated(true);
    }
  }, [mutated]);

  return (
    <div className="flex flex-col gap-6 items-center justify-center min-h-screen w-full font-geist">
      <UnexpectedError error={error} />
    </div>
  );
}
