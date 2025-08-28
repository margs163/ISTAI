import { UpdateUserType } from "@/lib/types";
import { useUserStore } from "@/lib/userStorage";
import React from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";

export default function UserInfo({
  register,
  errors,
}: {
  register: UseFormRegister<UpdateUserType>;
  errors: FieldErrors<UpdateUserType>;
}) {
  const firstName = useUserStore((state) => state.firstName);
  const lastName = useUserStore((state) => state.lastName);
  return (
    <section className="flex flex-col gap-4 items-start px-6 lg:px-12">
      <h1 className="text-lg font-semibold text-gray-800">Full name</h1>
      <div className="flex flex-col lg:flex lg:flex-row gap-4 w-full">
        <div className="space-y-1 lg:flex-1/2">
          <h3 className="text-xs font-normal text-gray-500">First name</h3>
          <input
            className="px-4 py-2 rounded-sm text-gray-800 border text-sm border-gray-200 shadow-sm shadow-slate-100 w-full"
            placeholder={`Your first name`}
            type="text"
            {...register("first_name")}
            defaultValue={firstName}
          />
        </div>
        {errors.first_name && (
          <p className="text-red-700 font-normal text-xs">
            {errors.first_name.message}
          </p>
        )}
        <div className="space-y-1 lg:flex-1/2">
          <h3 className="text-xs font-normal text-gray-500">Last name</h3>
          <input
            className="px-4 py-2 rounded-sm text-gray-800 border text-sm border-gray-200 shadow-sm shadow-slate-100 w-full"
            placeholder={`Your last name`}
            type="text"
            {...register("last_name")}
            defaultValue={lastName}
          />
        </div>
        {errors.last_name && (
          <p className="text-red-700 font-normal text-xs">
            {errors.last_name.message}
          </p>
        )}
      </div>
      <hr className="h-[1px] bg-slate-100 rounded-sm px-6 mt-4 lg:mt-6 w-full" />
    </section>
  );
}
