import { MoveRight } from "lucide-react";
import PlugImage from "@/assets/images/404Plug.svg";
import SpaceImage from "@/assets/images/404Space.svg";
import Image from "next/image";
import Link from "next/link";

export default function UnexpectedError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  return (
    <div className="flex flex-col lg:flex-row lg:justify-center bg-white lg:items-center mb-28 lg:mt-6 lg:mb-16 lg:gap-20 gap-0 items-center justify-center text-center w-full">
      <Image
        src={PlugImage}
        alt="error image"
        className="w-76 lg:w-116 object-cover"
      />
      <div className="flex flex-col lg:items-start lg:text-start items-center gap-4 text-center max-w-80 lg:max-w-96">
        <h1 className="text-xl lg:text-3xl font-semibold text-gray-800">
          Something Went Wrong...
        </h1>
        <p className="text-sm lg:text-base font-medium text-gray-500">
          Sorry, an unexpected error has occurred. Don&apos;t worry we have refunded
          your credits for this test. Try again later!
        </p>
        <Link
          href={"/"}
          replace
          className="px-6 lg:px-8 py-2.5 lg:py-3 mt-4 lg:mt-10 bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-600 transition-colors text-sm font-medium text-white flex items-center justify-center rounded-md gap-2"
        >
          Go back to home page <MoveRight className="size-5" />
        </Link>
      </div>
    </div>
  );
}
