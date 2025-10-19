"use client";
import React, { useEffect, useState } from "react";
import logoText from "@/assets/images/logo-text2.png";
import talkingWoman from "@/assets/images/talkingWoman.jpg";
import person1 from "@/assets/images/person1.jpg";
import person2 from "@/assets/images/person2.jpg";
import person3 from "@/assets/images/person3.jpg";
import googleIcon from "@/assets/images/google.png";
import Image from "next/image";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import { SignInFormData, UserSignInSchema } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { authorizeGoogle, checkQuestRecord } from "@/lib/queries";
import LogoWithIcon from "@/components/LogoWithIcon";
import { toast } from "sonner";

export default function Page() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isLoading, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(UserSignInSchema),
  });

  const [isAuthorizingGoogle, setIsAuthorizingGoogle] = useState(false);

  const submit: SubmitHandler<SignInFormData> = async (
    data: SignInFormData
  ) => {
    const formData = new URLSearchParams();
    formData.append("grant_type", "password");
    formData.append("username", data.email);
    formData.append("password", data.password);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_FASTAPI}/auth/jwt/login`,
        {
          method: "POST",
          body: formData.toString(),
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Could not login");
      }
      const hasRecord = await checkQuestRecord();

      if (!hasRecord) {
        router.replace("/questionnaire");
      } else {
        router.replace("/dashboard");
      }
    } catch (error) {
      toast.error("Could not login", {
        description: "Email or password are invalid",
      });
    }
  };

  return (
    <div className="h-full lg:min-h-screen font-geist">
      <section className="min-h-screen shadow-md bg-white w-full lg:flex lg:flex-row lg:shadow-lg shadow-slate-200 rounded-lg">
        <div className="flex flex-col p-6 px-8 justify-center gap-4 lg:gap-16 lg:flex-1/3 lg:items-center lg:p-10 min-h-screen">
          <div className="flex items-center justify-start gap-2 mb-auto lg:self-start">
            <LogoWithIcon />
          </div>
          <form
            onSubmit={handleSubmit(submit)}
            className="flex flex-col items-center justify-center gap-4 px-3 pb-6 lg:pb-10 lg:w-3/4 xl:w-[65%] mb-auto"
          >
            <div className="space-y-1">
              <h1 className="font-semibold text-xl text-gray-800">
                Welcome back! Log in
              </h1>
              <p className="text-xs text-gray-600 font-medium">
                Welcome back! Please enter your details.
              </p>
            </div>
            <button
              onClick={async () => {
                setIsAuthorizingGoogle(true);
                const url = await authorizeGoogle();
                if (url) {
                  router.push(url);
                }
              }}
              disabled={isSubmitting}
              className="w-full flex disabled:cursor-not-allowed flex-row cursor-pointer hover:bg-gray-50 active:bg-gray-50 transition-colors items-center justify-center gap-2 border-2 border-gray-300/80 rounded-md p-2.5 mt-2"
            >
              <Image src={googleIcon} alt="google" className="w-6 shrink-0" />
              <p className="text-sm font-medium text-gray-700">
                Log In with Google
              </p>
            </button>
            <div className="flex flex-row items-center w-full gap-2 mt-2.5">
              <hr className="h-[2px] text-gray-200 w-1/2" />
              <p className="text-xs font-medium text-gray-500 pb-1">or</p>
              <hr className="h-[2px] text-gray-200 w-1/2" />
            </div>
            <div className="flex flex-col gap-0 justify-start items-stretch w-full">
              <div className="space-y-2">
                <input
                  type="email"
                  placeholder="Email"
                  {...register("email")}
                  className="text-sm w-full text-gray-700 font-normal border-b-2 border-gray-200 px-2 py-2 focus-within:outline-0 focus-within:border-b-indigo-200 transition-colors"
                />
                <p className="text-red-700 font-normal text-xs h-3 mt-0.5">
                  {errors.email && !isAuthorizingGoogle && errors.email.message}
                </p>
              </div>
              <div className="space-y-2">
                <input
                  type="password"
                  placeholder="Password"
                  {...register("password")}
                  className="text-sm w-full text-gray-700 font-normal border-b-2 border-gray-200 px-2 py-2 focus-within:outline-0 focus-within:border-b-indigo-200 transition-colors"
                />
                <p className="text-red-700 font-normal text-xs h-3 mt-0.5 mb-2">
                  {errors.password &&
                    !isAuthorizingGoogle &&
                    errors.password.message}
                </p>
              </div>
              <Link href={"/password-reset"} className="ml-auto mt-0">
                <p className="text-xs text-gray-600 hover:text-gray-800 transition-colors">
                  Forgot password
                </p>
              </Link>
            </div>
            <div className="w-full space-y-3 mt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full disabled:bg-indigo-500 cursor-pointer py-2.5 rounded-md bg-indigo-700 text-white font-medium lg:font-semibold text-xs hover:bg-indigo-600 transition-colors"
              >
                {isSubmitting ? "Logging in..." : "Log In"}
              </button>
              <Link href={"/signup"} aria-disabled={isSubmitting}>
                <p className="text-center text-xs font-normal text-gray-500 active:text-gray-700 hover:text-gray-700 transition-colors">
                  Don&apos;t have an account?
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
          <div className="absolute top-1/2 xl:top-3/4 w-full pr-12 flex flex-col items-end gap-6 p-4 drop-shadow-2xl drop-shadow-gray-600">
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
