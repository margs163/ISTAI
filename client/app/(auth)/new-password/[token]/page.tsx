"use client";
import React, { use } from "react";
import logoIcon from "@/assets/images/logo-icon.png";
import logoText from "@/assets/images/logo-text2.png";
import talkingWoman from "@/assets/images/talkingWoman.jpg";
import person1 from "@/assets/images/person1.jpg";
import person2 from "@/assets/images/person2.jpg";
import person3 from "@/assets/images/person3.jpg";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { NewPasswordSchema, NewPasswordType } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Page({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const router = useRouter();
  const { token } = use(params);

  if (!token) {
    redirect("/login");
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isLoading, isSubmitting, isSubmitted },
  } = useForm<NewPasswordType>({
    resolver: zodResolver(NewPasswordSchema),
  });

  const submit: SubmitHandler<NewPasswordType> = async (
    data: NewPasswordType
  ) => {
    try {
      console.log(data);
      const response = await axios.post(
        "http://localhost:8000/auth/reset-password",
        {
          password: data.confirmPassword,
          token: token,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        router.replace("/login");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen w-full p-6 flex items-center justify-center lg:px-20 xl:px-40 font-geist">
      <section className=" shadow-md bg-white w-full lg:flex lg:flex-row lg:shadow-lg shadow-slate-200 rounded-lg lg:min-h-[610px]">
        <div className="flex flex-col p-6 justify-center gap-16 lg:flex-1/2 lg:items-center lg:p-10">
          <div className="flex items-center justify-start gap-2 mb-auto lg:self-start">
            <Image src={logoIcon} alt="iconLogo" className="w-6" />
            <Image src={logoText} alt="iconText" className="w-14" />
          </div>
          <form
            onSubmit={handleSubmit(submit)}
            className="flex flex-col items-center justify-center gap-8 px-3 pb-6 lg:pb-10 lg:w-3/4 xl:w-[65%] mb-auto"
          >
            <div className="space-y-1">
              <h1 className="font-semibold text-xl text-gray-800">
                Set new Password
              </h1>
              <p className="text-xs text-gray-600 font-medium">
                Must be at least 8 characters
              </p>
            </div>
            <div className="flex flex-col gap-4 justify-start items-stretch w-full">
              <input
                type="password"
                placeholder="Password"
                {...register("password")}
                className="text-sm text-gray-700 font-normal border-b-2 border-gray-200 px-2 py-2 focus-within:outline-0 focus-within:border-b-indigo-200 transition-colors"
              />
              <input
                type="password"
                placeholder="Confirm Password"
                {...register("confirmPassword")}
                className="text-sm text-gray-700 font-normal border-b-2 border-gray-200 px-2 py-2 focus-within:outline-0 focus-within:border-b-indigo-200 transition-colors"
              />
              {errors.confirmPassword && (
                <p className="text-red-700 font-normal text-xs h-3 mt-0.5">
                  {errors.confirmPassword?.message}
                </p>
              )}
            </div>
            <div className="w-full space-y-3 mt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 disabled:bg-indigo-500 rounded-md bg-indigo-700 text-white font-medium lg:font-semibold text-xs hover:bg-indigo-600 transition-colors"
              >
                {isLoading ? "Loading..." : "Confirm"}
              </button>
              <Link href={"/login"}>
                <p className="text-center text-xs font-normal text-gray-500 active:text-gray-700 hover:text-gray-700 transition-colors">
                  Back to login
                </p>
              </Link>
            </div>
          </form>
        </div>
        <div className="lg:flex-1/2 relative hidden lg:block">
          <Image
            src={talkingWoman}
            alt="talkingWoman"
            className="h-full object-cover brightness-75 rounded-r-lg"
          />
          <div className="absolute top-1/2 xl:top-3/5 w-full pr-12 flex flex-col items-end gap-6 p-4 drop-shadow-2xl">
            <h2 className="font-bold leading-[1.3] tracking-tight text-3xl text-white w-[90%] xl:w-3/4 text-right text-shadow-sm">
              Unlock Your IELTS Success with AI-Powered Speaking Practice. Join
              ISTAI today.
            </h2>
            <div className="flex flex-row">
              <p className="text-sm font-semibold text-white relative -right-4 text-shadow-sm">
                1.2k <br /> members
              </p>
              <Image
                src={person1}
                alt="person1"
                className="w-10 h-10 rounded-full border-2 relative -right-7 z-10 border-gray-200 shrink-0 object-cover"
              />
              <Image
                src={person2}
                alt="person2"
                className="w-10 h-10 rounded-full border-2 relative -right-3 border-gray-200 shrink-0 object-cover"
              />
              <Image
                src={person3}
                alt="person3"
                className="w-10 h-10 rounded-full border-2 rleative -right-4 border-gray-200 shrink-0 object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
