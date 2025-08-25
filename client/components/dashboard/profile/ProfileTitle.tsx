import React from "react";

export default function ProfileTitle() {
  return (
    <section className="space-y-1 px-6 lg:col-span-2">
      <h2 className="text-xl font-semibold">Account</h2>
      <p className="text-sm font-normal text-gray-600">
        Real-time information regarding your account
      </p>
      <hr className="h-[1px] bg-slate-100 rounded-xl px-6 mt-6" />
    </section>
  );
}
