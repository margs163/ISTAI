"use client";
import GrammarCommon from "@/components/dashboard/analysis/GrammarCommon";
import BandScoreCards from "@/components/dashboard/analysis/BandScoreCards";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import React from "react";
import VocabularyCommon from "@/components/dashboard/analysis/VocabularyCommon";
import PronunciationCommon from "@/components/dashboard/analysis/PronunciationCommon";

export default function page() {
  return (
    <div className="w-full flex flex-col gap-6 bg-gray-50 pb-6">
      <DashboardHeader />
      <BandScoreCards />
      <div className="grid grid-cols-1 lg:grid-cols-3 px-6 gap-6 lg:items-start">
        <GrammarCommon />
        <VocabularyCommon />
        <PronunciationCommon />
      </div>
    </div>
  );
}
