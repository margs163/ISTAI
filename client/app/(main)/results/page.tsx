import Footer from "@/components/Footer";
import AdvancedVocabulary from "@/components/results/AdvancedVocabulary";
import CriterionScores from "@/components/results/CriterionScores";
import GrammarErrors from "@/components/results/GrammarErrors";
import ImprovementTips from "@/components/results/ImprovementTips";
import Overall from "@/components/results/Overall";
import PronunciationIssues from "@/components/results/PronunciationIssues";
import RepeatedWords from "@/components/results/Repetitions";
import ResultsHeader from "@/components/results/ResultsHeader";
import SentenceImprovements from "@/components/results/SentenceImprovements";
import StrongAspects from "@/components/results/StrongAspects";
import WeakAspects from "@/components/results/WeakAspects";
import React from "react";

export default function Page() {
  return (
    <div className="font-geist w-full min-h-screen flex flex-col gap-6 lg:gap-10 bg-gray-50 pt-24 lg:pt-32 pb-0">
      <ResultsHeader />
      <Overall score={6} />
      <CriterionScores />
      <div className="lg:px-20 lg:grid-cols-2 lg:grid lg:gap-6 space-y-6 lg:space-y-0 xl:px-36">
        <StrongAspects />
        <WeakAspects />
      </div>
      <SentenceImprovements />
      <GrammarErrors />
      <div className="lg:px-20 lg:grid-cols-2 lg:grid lg:gap-6 space-y-6 xl:px-36 lg:space-y-0">
        <AdvancedVocabulary />
        <RepeatedWords />
      </div>
      <PronunciationIssues />
      <ImprovementTips />
      <Footer />
    </div>
  );
}
