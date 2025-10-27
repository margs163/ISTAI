"use client";

import UnexpectedError from "@/components/UnexpectedError";
import { useChatStore } from "@/lib/chatStore";
import { useLocalPracticeTestStore } from "@/lib/practiceTestStore";
import { updateSubscription } from "@/lib/queries";
import { useRefundStore } from "@/lib/refundStore";
import { useTestTranscriptionStore } from "@/lib/testTranscriptionStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const refunded = useRefundStore((state) => state.resultsRefunded);
  const setRefunded = useRefundStore((state) => state.setResultsRefunded);
  const restoreChatMessages = useChatStore((state) => state.restoreMessages);
  const resetTranscriptions = useTestTranscriptionStore(
    (state) => state.restoreTranscriptions
  );
  const resetLocalPracticeTest = useLocalPracticeTestStore(
    (state) => state.resetLocalPracticeTest
  );
  const queryClient = useQueryClient();
  const [mutated, setMutated] = useState(false);
  const mutation = useMutation({
    mutationKey: ["refund-practice"],
    mutationFn: updateSubscription,
  });
  useEffect(() => {
    if (!mutated && !refunded) {
      mutation.mutate({ refund_credits: 10 });
      setMutated(true);
      setRefunded(true);

      restoreChatMessages();
      resetTranscriptions();
      resetLocalPracticeTest();

      queryClient.invalidateQueries({ queryKey: ["subscription-fetch"] });
    }
  }, [mutated]);

  return (
    <div className="flex flex-col gap-6 items-center justify-center min-h-screen w-full font-geist">
      <UnexpectedError setRefunded={setRefunded} error={error} />
    </div>
  );
}
