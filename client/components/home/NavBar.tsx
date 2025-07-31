"use client";
import React, { useState } from "react";
import logoIcon from "@/assets/images/logo-icon.png";
import logoText from "@/assets/images/logo-text2.png";
import Image from "next/image";
import { Menu } from "lucide-react";
import Link from "next/link";
import { clsx } from "clsx";
import ButtonPrimary from "./ButtonPrimary";

export default function NavBar() {
  const [menuPressed, setMenuPressed] = useState(false);
  return (
    <header
      className={clsx(
        "w-full lg:flex lg:flex-row lg:justify-between lg:items-center lg:px-20 lg:py-5 z-40",
        menuPressed && "bg-white"
      )}
    >
      <div className="flex justify-between items-center p-4 px-5 lg:p-0">
        <div className="flex items-center justify-start gap-2">
          <Image src={logoIcon} alt="iconLogo" className="w-7" />
          <Image src={logoText} alt="iconText" className="w-16" />
        </div>
        <Menu
          size={24}
          onClick={() => setMenuPressed(!menuPressed)}
          className="lg:hidden"
        />
      </div>
      <div
        className={
          menuPressed
            ? "fixed top-14 w-full bg-white opacity-100 h-screen"
            : "hidden opacity-0 transition-opacity duration-500"
        }
      >
        <ul className="flex flex-col gap-0">
          <li className="hover:bg-gray-50 active:bg-gray-50 px-6 py-3">
            <Link href={"#"}>
              <h3 className="font-medium text-base text-gray-800 hover:text-indigo-700 transition-colors">
                Home
              </h3>
            </Link>
          </li>
          <li className="hover:bg-gray-50 active:bg-gray-50 px-6 py-3">
            <Link href={"#"}>
              <h3 className="font-medium text-base text-gray-800 hover:text-indigo-700 transition-colors">
                Pricing
              </h3>
            </Link>
          </li>
          <li className="hover:bg-gray-50 active:bg-gray-50 px-6 py-3">
            <Link href={"#"}>
              <h3 className="font-medium text-base text-gray-800 hover:text-indigo-700 transition-colors">
                Features
              </h3>
            </Link>
          </li>
          <li className="hover:bg-gray-50 active:bg-gray-50 px-6 py-3">
            <Link href={"#"}>
              <h3 className="font-medium text-base text-gray-800 hover:text-indigo-700 transition-colors">
                Contact Us
              </h3>
            </Link>
          </li>
          <li className=" px-5 py-3">
            <Link href={"#"}>
              <ButtonPrimary className="">Free Sign Up</ButtonPrimary>
            </Link>
          </li>
        </ul>
      </div>
      <div className="hidden lg:block">
        <ul className="flex flex-row gap-12">
          <li className="">
            <Link href={"#"}>
              <h3 className="font-medium text-base text-gray-800 hover:text-indigo-700 transition-colors">
                Home
              </h3>
            </Link>
          </li>
          <li className="">
            <Link href={"#"}>
              <h3 className="font-medium text-base text-gray-800 hover:text-indigo-700 transition-colors">
                Pricing
              </h3>
            </Link>
          </li>
          <li className="">
            <Link href={"#"}>
              <h3 className="font-medium text-base text-gray-800 hover:text-indigo-700 transition-colors">
                Features
              </h3>
            </Link>
          </li>
          <li className="">
            <Link href={"#"}>
              <h3 className="font-medium text-base text-gray-800 hover:text-indigo-700 transition-colors">
                Contact Us
              </h3>
            </Link>
          </li>
        </ul>
      </div>
      <Link href={"#"} className="hidden lg:block">
        <ButtonPrimary className="lg:text-sm lg:py-2 lg:px-5">
          Free Sign Up
        </ButtonPrimary>
      </Link>
    </header>
  );
}
