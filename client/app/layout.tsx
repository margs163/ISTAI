import type { Metadata } from "next";
import { Montserrat, Roboto, Inter, Geist } from "next/font/google";
import Providers from "./providers";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const montFont = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const interFont = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const robotoFont = Roboto({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-roboto",
});

const geistFont = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title:
    "FluentFlow - an AI IELTS Speaking Test Simulator. Practice IELTS Speaking with FluentFlow",
  description:
    "Practice your speaking by using our AI powered IELTS test simulator. Get instant feedback and improve your score with realistic practice sessions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montFont.variable} ${geistFont.variable} ${interFont.variable} ${robotoFont.variable} antialiased`}
      >
        {/* <Script
          src="https://example.com/script.js"
          strategy="beforeInteractive"
        /> */}
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
