import Advantages from "@/components/home/Advantages";
import AppFaq from "@/components/home/AppFaq";
import FeedbackInfo from "@/components/home/FeedbackInfo";
import Hero from "@/components/home/Hero";
import NavBar from "@/components/NavBar";
import TestInfo from "@/components/home/TestInfo";
import React from "react";
import Footer from "@/components/Footer";
import PowerfulFeatures from "@/components/home/PowerfulFeatures";
import StaticPlansPricing from "@/components/home/StaticPlansPricing";

export default function Page() {
  return (
    <div className="h-lvh lg:h-lvw w-full flex flex-col gap-9 lg:gap-10 home-bg pb-4 font-mont">
      <NavBar />
      <Hero />
      <section className=" relative bg-white z-0 space-y-8 mb-8 lg:mb-14 lg:mt-4">
        <Advantages />
        <TestInfo />
        <PowerfulFeatures />
        <FeedbackInfo />
        <StaticPlansPricing />
        <AppFaq />
      </section>
      <Footer />
    </div>
  );
}
