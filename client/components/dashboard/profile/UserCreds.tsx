import { Lock, Mail } from "lucide-react";
import React from "react";

export default function UserEmail() {
  return (
    <section className="flex flex-col gap-6 items-start px-6">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">Credentials</h2>
        <p className="text-sm font-normal text-gray-600">
          Manage your account&apos;s email address and password
        </p>
      </div>
      <div className="flex flex-col gap-4 items-start">
        <div className="space-y-1 w-full">
          <h3 className="text-xs font-normal text-gray-500">Email Address</h3>
          <div className="px-4 py-2 rounded-sm border border-gray-200 shadow-sm w-full flex flex-row gap-2 items-center">
            <Mail className="size-4.5 text-gray-500" strokeWidth={1.7} />
            <input
              className="focus-within:outline-0 text-gray-800 w-full text-sm"
              placeholder="Your first name"
              type="text"
            />
          </div>
        </div>
        <div className="space-y-1 w-full">
          <h3 className="text-xs font-normal text-gray-500">Password</h3>
          <div className="px-4 py-2 rounded-sm border border-gray-200 shadow-sm w-full flex flex-row gap-2 items-center">
            <Lock className="size-4.5 text-gray-500" strokeWidth={1.7} />
            <input
              className="focus-within:outline-0 text-gray-800 w-full text-sm"
              placeholder="New Password"
              type="password"
            />
          </div>
        </div>
      </div>
      <hr className="h-[1px] bg-slate-100 rounded-sm px-6 mt-4 w-full" />
    </section>
  );
}
