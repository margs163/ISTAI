import { MoveUpRight } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="flex flex-col gap-6 p-8 lg:px-20 xl:px-40 lg:gap-12 pt-0 font-mont">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-10 w-full">
        <div className="flex flex-col gap-3 lg:gap-5 justify-start items-start">
          <h1 className="text-3xl lg:text-4xl font-bold">ISTAI Ltd.</h1>
          <p className="text-sm lg:text-base font-medium text-gray-600">
            Recieve news letters about our latest{" "}
            <br className="hidden lg:inline" /> updates through email.
          </p>
          <div className="pl-5 pr-1 py-1 rounded-full border border-gray-200 flex flex-row mt-2 relative right-2">
            <input
              type="email"
              placeholder="Your Email Address"
              className="focus-within:outline-0 text-sm font-medium text-gray-700 w-full pr-2 lg:pr-6"
            />
            <button className="bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 rounded-full p-3 transition-colors">
              <MoveUpRight className="size-5 text-gray-200" />
            </button>
          </div>
        </div>
        <div className="flex flex-row justify-between items-start lg:w-2/5">
          <div className="flex flex-col items-start justify-start gap-4">
            <h3 className="uppercase font-semibold text-base lg:text-lg text-gray-800">
              QUICK LINKS:
            </h3>
            <ul className="space-y-4 lg:text-base text-sm">
              <li>
                <Link href={"#"} className="font-normal text-gray-600">
                  About Us
                </Link>
              </li>
              <li>
                <Link href={"#"} className="font-normal text-gray-600">
                  Features
                </Link>
              </li>
              <li>
                <Link href={"#"} className="font-normal text-gray-600">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
          <div className="flex flex-col items-start justify-start gap-6">
            <div className="space-y-3">
              <h3 className="uppercase font-semibold text-base lg:text-lg text-gray-800">
                PHONE:
              </h3>
              <p className="text-sm font-normal lg:text-base text-gray-600">
                +7 705 676 4416
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="uppercase font-semibold text-base lg:text-lg text-gray-800">
                EMAIL:
              </h3>
              <p className="text-sm font-normal lg:text-base text-gray-600">
                daniyal@istai.com
              </p>
            </div>
          </div>
        </div>
      </div>
      <hr className="w-full h-[1px] text-gray-200" />
      <div className="flex flex-col gap-6">
        <div className="flex flex-row flex-wrap items-center justify-start gap-6">
          <Link href={"#"} className="text-gray-700 text-sm font-normal">
            Privacy policy
          </Link>
          <hr className="w-[2px] h-4 text-gray-200 bg-gray-200" />
          <Link href={"#"} className="text-gray-700 text-sm font-normal">
            terms & conditions
          </Link>
          <hr className="w-[2px] h-4 text-gray-200 bg-gray-200" />
          <Link href={"#"} className=" text-gray-700 text-sm font-normal">
            @ Copyright 2025 All rights reserved
          </Link>
        </div>
      </div>
    </footer>
  );
}
