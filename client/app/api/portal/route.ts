import { setCustomerEmail } from "@/lib/actions";
import { CustomerPortal } from "@polar-sh/nextjs";
import { NextRequest } from "next/server";

const access_token = process.env.POLAR_ACCESS_TOKEN_TEST;

if (!access_token) {
  throw new Error("POLAR_ACCESS_TOKEN is not defined");
}

export const GET = CustomerPortal({
  accessToken: access_token,
  getCustomerId: async (req: NextRequest) => {
    const searchParams = req.nextUrl.searchParams;
    const customerId = searchParams.get("customerId");
    const userEmail = searchParams.get("userEmail");

    if (!customerId) {
      throw new Error("No customerId provided");
    }

    if (!userEmail) {
      throw new Error("No userEmail provided");
    }

    await setCustomerEmail(customerId, userEmail);

    return customerId;
  },
  server: "sandbox",
});
