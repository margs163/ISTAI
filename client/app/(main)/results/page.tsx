import CriterionScores from "@/components/results/CriterionScores";
import Overall from "@/components/results/Overall";
import ResultsHeader from "@/components/results/ResultsHeader";
import SentenceImprovements from "@/components/results/SentenceImprovements";
import StrongAspects from "@/components/results/StrongAspects";
import WeakAspects from "@/components/results/WeakAspects";
import React from "react";

export default function Page() {
  return (
    <div className="font-geist w-full min-h-screen flex flex-col gap-6 lg:gap-12 bg-gray-50">
      <ResultsHeader />
      <Overall score={6} />
      <CriterionScores />
      <div className="lg:px-20 lg:grid-cols-2 lg:grid lg:gap-6 space-y-6 xl:px-40">
        <StrongAspects />
        <WeakAspects />
      </div>
      <SentenceImprovements />
    </div>
  );
}
