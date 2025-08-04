import { LaptopMinimalCheck } from "lucide-react";
import React from "react";

export default function TestTips() {
  return (
    <section className="p-6 py-0 max-w-[600px] lg:px-0">
      <div className="p-6 rounded-xl border border-gray-200 space-y-6 bg-white">
        <header className="flex flex-row items-center gap-2">
          <LaptopMinimalCheck className="size-6 text-indigo-600" />
          <h3 className="font-semibold text-gray-800 text-lg">Part 1 Tips</h3>
        </header>
        <main className="">
          <ul className="flex flex-col gap-6 list-none item-start text-gray-700 text-sm font-medium px-2">
            <li className=" rounded-lg  flex flex-row items-center gap-2">
              <div className="p-2 px-4 rounded-md bg-gray-100">1</div>
              Respond clearly and concisely to questions about familiar topics
            </li>
            <li className=" rounded-lg flex flex-row items-center gap-2">
              <div className="p-2 px-4 rounded-md bg-gray-100">2</div>
              Add a brief reason or example to your answer
            </li>
            <li className=" rounded-lg flex flex-row items-center gap-2">
              <div className="p-2 px-4 rounded-md bg-gray-100">3</div>
              Use a conversational tone and avoid memorized answers.
            </li>
          </ul>
        </main>
      </div>
    </section>
  );
}
