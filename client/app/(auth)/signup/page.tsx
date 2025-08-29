"use client";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import logoText from "@/assets/images/logo-text2.png";
import talkingWoman from "@/assets/images/person1.jpg";
import person1 from "@/assets/images/person1.jpg";
import person2 from "@/assets/images/person2.jpg";
import person3 from "@/assets/images/person3.jpg";
import googleIcon from "@/assets/images/google.png";
import Image from "next/image";
import Link from "next/link";
import { SignUpFormData, UserSignUpSchema } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserData, useUserStore } from "@/lib/userStorage";
import { useRouter } from "next/navigation";
import axios from "axios";
import { authorizeGoogle } from "@/lib/queries";

export default function Page() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isLoading, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(UserSignUpSchema),
  });
  const [isAuthorizingGoogle, setIsAuthorizingGoogle] = useState(false);
  const setUserData = useUserStore((state) => state.setUserData);

  const submit: SubmitHandler<SignUpFormData> = async (
    data: SignUpFormData
  ) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/auth/register`,
        {
          method: "POST",
          body: JSON.stringify({
            first_name: data.firstName,
            last_name: data.lastName,
            email: data.email,
            password: data.password,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Could not signup!");
      }

      await axios.post(
        `${process.env.NEXT_PUBLIC_API}/auth/request-verify-token`,
        {
          email: data.email,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const json_data: UserData = await response.json();
      setUserData(json_data);
      router.replace("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen w-full p-6 flex items-center justify-center lg:px-20 xl:px-40 font-geist">
      <section className=" shadow-md bg-white w-full lg:flex lg:flex-row lg:shadow-lg shadow-slate-200 rounded-lg">
        <div className="flex flex-col p-6 justify-center gap-16 lg:flex-1/2 lg:items-center lg:p-10">
          <div className="flex items-center justify-start gap-2 mb-auto lg:self-start">
            {/* <Image src={logoIcon} alt="iconLogo" className="w-6" /> */}
            <Image src={logoText} alt="iconText" className="w-16" />
          </div>
          <form
            className="flex flex-col items-center justify-center gap-4 px-3 pb-6 lg:pb-10 lg:w-3/4 xl:w-[65%]"
            onSubmit={handleSubmit(submit)}
          >
            <div className="space-y-1">
              <h1 className="font-semibold text-xl text-gray-800">
                Sign Up to Get Started
              </h1>
              <p className="text-xs text-gray-600 font-medium">
                Please enter you details to get started.
              </p>
            </div>
            <button
              onClick={() => {
                setIsAuthorizingGoogle(true);
                authorizeGoogle();
              }}
              className="w-full flex flex-row items-center justify-center gap-2 border-2 border-gray-300/80 rounded-md p-2.5 mt-2"
            >
              <Image src={googleIcon} alt="google" className="w-6 shrink-0" />
              <p className="text-sm font-medium text-gray-700">
                Sign Up with Google
              </p>
            </button>
            <div className="flex flex-row items-center w-full gap-2 mt-2">
              <hr className="h-[2px] text-gray-200 w-1/2" />
              <p className="text-xs font-medium text-gray-500 pb-1">or</p>
              <hr className="h-[2px] text-gray-200 w-1/2" />
            </div>
            <div className="flex flex-col gap-4 justify-start items-stretch w-full">
              <div className="w-full space-y-2">
                <input
                  type="text"
                  placeholder="First name"
                  {...register("firstName")}
                  className="text-sm w-full text-gray-700 font-normal border-b-2 border-gray-200 px-2 py-2 focus-within:outline-0 focus-within:border-b-indigo-200 transition-colors"
                />
                {errors.firstName && !isAuthorizingGoogle && (
                  <p className="text-red-700 font-normal text-xs">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Last name"
                  {...register("lastName")}
                  className="text-sm w-full text-gray-700 font-normal border-b-2 border-gray-200 px-2 py-2 focus-within:outline-0 focus-within:border-b-indigo-200 transition-colors"
                />
                {errors.lastName && !isAuthorizingGoogle && (
                  <p className="text-red-700 font-normal text-xs">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <input
                  type="email"
                  placeholder="Email"
                  {...register("email")}
                  className="text-sm w-full text-gray-700 font-normal border-b-2 border-gray-200 px-2 py-2 focus-within:outline-0 focus-within:border-b-indigo-200 transition-colors"
                />
                {errors.email && (
                  <p className="text-red-700 font-normal text-xs">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <input
                  type="password"
                  placeholder="Password"
                  {...register("password")}
                  className="text-sm w-full text-gray-700 font-normal border-b-2 border-gray-200 px-2 py-2 focus-within:outline-0 focus-within:border-b-indigo-200 transition-colors"
                />
                {errors.password && (
                  <p className="text-red-700 font-normal text-xs">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>
            <div className="w-full space-y-3 mt-6">
              <button
                disabled={isSubmitting}
                type="submit"
                className="w-full disabled:bg-indigo-400 py-2.5 rounded-md bg-indigo-700 hover:bg-indigo-600 text-white font-medium lg:font-semibold text-xs transition-colors"
              >
                {isSubmitting ? "Signing Up..." : "Sign Up"}
              </button>
              <Link href={"/login"} aria-disabled={isSubmitting}>
                <p className="text-center text-xs font-normal text-gray-500 active:text-gray-700 hover:text-gray-700 transition-colors">
                  Already have an account?
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
          <div className="absolute top-1/2 xl:top-3/5 w-full pr-12 flex flex-col items-end gap-6 p-4 drop-shadow-2xl drop-shadow-gray-600">
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
