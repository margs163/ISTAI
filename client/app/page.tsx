import Advantages from "@/components/home/Advantages";
import AppFaq from "@/components/home/AppFaq";
import FeedbackInfo from "@/components/home/FeedbackInfo";
import Hero from "@/components/home/Hero";
import NavBar from "@/components/home/NavBar";
import TestInfo from "@/components/home/TestInfo";
import React from "react";

export default function Page() {
  return (
    <div className="h-screen w-full flex flex-col gap-10 lg:gap-16">
      <NavBar />
      <Hero />
      <section className=" relative -top-36 lg:-top-68 bg-white z-20 space-y-8">
        <Advantages />
        <TestInfo />
        <FeedbackInfo />
        <AppFaq />
      </section>
    </div>
  );
}
