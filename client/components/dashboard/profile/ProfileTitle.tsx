import React from "react";

export default function ProfileTitle() {
  return (
    <section className="space-y-1 px-6 lg:px-12 lg:col-span-2">
      <div className="flex flex-row justify-between items-start">
        <div className="space-y-1">
          <h2 className="text-xl lg:text-2xl font-semibold">Account</h2>
          <p className="text-sm font-normal text-gray-600">
            Real-time information regarding your account
          </p>
        </div>
        <button
          type="submit"
          className="rounded-md border border-gray-200 bg-white hover:bg-gray-50 active:bg-gray-50 transition-colors cursor-pointer px-4 py-2 text-sm text-gray-800 font-medium"
        >
          Save Changes
        </button>
      </div>
      <hr className="h-[1px] bg-slate-100 rounded-xl px-6 mt-6" />
    </section>
  );
}
