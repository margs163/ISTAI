import Footer from "@/components/Footer";
import { PrivacyPolicy } from "@/components/legal/PrivacyPolicy";
import NavBar from "@/components/NavBar";

export default function Page() {
  return (
    <div className="w-full flex flex-col gap-10 lg:gap-10 font-geist items-center xl:gap-20">
      <NavBar />
      <PrivacyPolicy />
      <Footer className="xl:px-20 mt-6" />
    </div>
  );
}
