import { MoveRight } from "lucide-react";
import PlugImage from "@/assets/images/404Plug.svg";
import SpaceImage from "@/assets/images/404Space.svg";
import Image from "next/image";
import Link from "next/link";
import NotFoundMain from "@/components/NotFoundMain";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col gap-6 items-center justify-center min-h-screen w-full font-geist">
      <NavBar />
      <NotFoundMain />
      <Footer className="xl:px-20" />
    </div>
  );
}
