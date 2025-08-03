import TestProgress from "@/components/practice/TestProgress";
import TestSession from "@/components/practice/TestSession";
import React from "react";

export default function page() {
  return (
    <div className="w-full min-h-screen flex flex-col gap-6 bg-gray-50 py-6 font-geist">
      <TestSession />
      <TestProgress />
    </div>
  );
}
