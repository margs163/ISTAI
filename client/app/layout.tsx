import type { Metadata } from "next";
import { Montserrat, Roboto, Inter, Geist } from "next/font/google";
import Providers from "./providers";
import "./globals.css";

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
  title: "Practice IELTS Speaking with ISTAI",
  description:
    "IELTS AI simulator that is proven to be improving English Fluency",
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
