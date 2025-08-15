import CharacterSection from "@/components/practice/CharacterSection";
import Chat from "@/components/practice/Chat";
import PartInfo from "@/components/practice/PartInfo";
import QuickTestActions from "@/components/practice/QuickTestActions";
import TestProgress from "@/components/practice/TestProgress";
import TestSession from "@/components/practice/TestSession";
import React from "react";

export default function page() {
  return (
    <div className="w-full min-h-screen flex flex-col gap-6 bg-gray-50 py-6 font-geist lg:grid lg:grid-cols-[0.5fr_0.8fr_0.5fr] xl:grid-cols-[0.4fr_0.8fr_0.38fr] lg:justify-items-stretch lg:items-stretch lg:gap-6 lg:w-full lg:px-12 xl:px-25 xl:py-8">
      <div className="space-y-6">
        <TestSession />
        <TestProgress />
      </div>
      <div className="space-y-6">
        <div className="lg:hidden">
          <PartInfo currentPart={1} />
        </div>
        <CharacterSection activePart={1} timerActive={false} />
      </div>
      <div className="space-y-6">
        <Chat />
        <QuickTestActions />
      </div>
    </div>
  );
}
