import { UpdateUserType } from "@/lib/types";
import { useUserStore } from "@/lib/userStorage";
import { Lock, Mail } from "lucide-react";
import React from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";

export default function UserEmail({
  register,
  errors,
}: {
  register: UseFormRegister<UpdateUserType>;
  errors: FieldErrors<UpdateUserType>;
}) {
  const userEmail = useUserStore((state) => state.email);
  return (
    <section className="flex flex-col gap-6 items-start px-6 lg:px-12">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">Credentials</h2>
        <p className="text-sm font-normal text-gray-600">
          Manage your account&apos;s email address and password
        </p>
      </div>
      <div className="flex flex-col gap-4 items-start lg:flex-row lg:items-stretch w-full">
        <div className="space-y-1 w-full lg:flex-1/2">
          <h3 className="text-xs font-normal text-gray-500">Email Address</h3>
          <div className="px-4 py-2 rounded-sm border border-gray-200 shadow-sm shadow-slate-100 w-full flex flex-row gap-2 items-center">
            <Mail className="size-4.5 text-gray-500" strokeWidth={1.7} />
            <input
              className="focus-within:outline-0 text-gray-800 w-full text-sm"
              placeholder="Your Email"
              {...register("email")}
              type="email"
              defaultValue={userEmail}
            />
          </div>
          {errors.email && (
            <p className="text-red-700 font-normal text-xs">
              {errors.email.message}
            </p>
          )}
        </div>
        <div className="space-y-1 w-full lg:flex-1/2">
          <h3 className="text-xs font-normal text-gray-500">Password</h3>
          <div className="px-4 py-2 rounded-sm border border-gray-200 shadow-sm shadow-slate-100 w-full flex flex-row gap-2 items-center">
            <Lock className="size-4.5 text-gray-500" strokeWidth={1.7} />
            <input
              className="focus-within:outline-0 text-gray-800 w-full text-sm"
              placeholder="New Password"
              type="password"
              {...register("password")}
            />
          </div>
          {errors.password && (
            <p className="text-red-700 font-normal text-xs">
              {errors.password.message}
            </p>
          )}
        </div>
      </div>
      <hr className="h-[1px] bg-slate-100 rounded-sm px-6 mt-4 w-full" />
    </section>
  );
}
