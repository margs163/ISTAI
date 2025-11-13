import { Checkout, CheckoutConfig } from "@polar-sh/nextjs";
import { NextRequest } from "next/server";

type PolarEnvType = "sandbox" | "production";

export const GET = Checkout({
  accessToken: process.env.POLAR_ACCESS_TOKEN_PROD,
  successUrl: process.env.POLAR_SUCCESS_URL,
  server: "sandbox",
  theme: "light",
});
