import Image from "next/image";
import React from "react";
// import logoIcon from "@/assets/images/logo-icon.png";
// import logoText from "@/assets/images/logo-text2.png";

export default function LogoWithIcon() {
  return (
    <div className="flex items-center justify-start gap-2">
      <Image
        src={"/iconLogo.png"}
        alt="iconLogo"
        className="w-8 bg-transparent"
        width={28}
        height={28}
      />
      <h1 className="text-2xl font-geist font-bold text-gray-800">
        FluentFlow
      </h1>
    </div>
  );
}
