import React from "react";

const currentDate = new Date();

export default function Greeting() {
  return (
    <section className="w-full px-6 pl-8">
      <p className="text-sm font-normal text-gray-600">
        {currentDate.toDateString()}
      </p>
      <h2 className="text-2xl font-gray-800 font-semibold">
        {currentDate.getHours() > 12 && currentDate.getHours() < 18
          ? "Good Day!"
          : currentDate.getHours() > 6 && currentDate.getHours() < 12
          ? "Good Morning!"
          : "Good Evening!"}{" "}
        John
      </h2>
    </section>
  );
}
