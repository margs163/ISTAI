import { PolarEmbedCheckout } from "@polar-sh/checkout/embed";
import { setSubscriptionEmail } from "./actions";
import { toast } from "sonner";

async function getPolarCustomerId() {
  try {
  } catch (error) {
    console.error("Error fetching Polar customer ID:", error);
  }
}
