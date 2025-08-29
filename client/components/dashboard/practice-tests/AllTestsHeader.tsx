import React from "react";

export default function AllTestsHeader() {
  return (
    <section className="w-full flex flex-row justify-between items-center py-2 lg:py-4 px-6 lg:px-8 rounded-lg bg-transparent border-slate-200/80">
      <div className="space-y-1 lg:space-y-2">
        <h1 className="text-xl lg:text-3xl font-semibold text-gray-800">
          Your Practice Tests
        </h1>
        <p className="text-sm lg:text-base lg:font-medium text-balance text-gray-500">
          Observe all the practice tests you have taken so far
        </p>
      </div>
    </section>
  );
}
