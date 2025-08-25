import React from "react";

export default function UserInfo() {
  return (
    <section className="flex flex-col gap-6 items-start px-6">
      <h1 className="text-lg font-semibold text-gray-800">Full name</h1>
      <div className="flex flex-col gap-4 w-full">
        <div className="space-y-1">
          <h3 className="text-xs font-normal text-gray-500">First name</h3>
          <input
            className="px-4 py-2 rounded-sm text-gray-800 border text-sm border-gray-200 shadow-sm w-full"
            placeholder="Your last name"
            type="text"
          />
        </div>
        <div className="space-y-1">
          <h3 className="text-xs font-normal text-gray-500">Last name</h3>
          <input
            className="px-4 py-2 rounded-sm text-gray-800 border text-sm border-gray-200 shadow-sm w-full"
            placeholder="Your first name"
            type="text"
          />
        </div>
      </div>
      <hr className="h-[1px] bg-slate-100 rounded-sm px-6 mt-4 w-full" />
    </section>
  );
}
