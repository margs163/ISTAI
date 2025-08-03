import Image from "next/image";
import React from "react";
import logoIcon from "@/assets/images/logo-icon.png";
import logoText from "@/assets/images/logo-text2.png";

export default function LogoWithIcon() {
  return (
    <div className="flex items-center justify-start gap-2">
      <Image src={logoIcon} alt="iconLogo" className="w-7" />
      <Image src={logoText} alt="iconText" className="w-16" />
    </div>
  );
}
