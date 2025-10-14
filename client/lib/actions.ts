"use server";

import OpenaAI from "openai";
import { client } from "./redisClient";

export async function setCustomerEmail(customerId: string, email: string) {
  try {
    await client.set(customerId, email, {
      expiration: { type: "EX", value: 1800 },
    });
  } catch (error) {
    console.error("Error setting customer email:", error);
  }
}

export async function setSubscriptionEmail(
  subscriptionId: string,
  email: string
) {
  try {
    await client.set(subscriptionId, email);
    return true;
  } catch (error) {
    console.error("Error setting subscription email:", error);
  }
}

export async function deleteSubscriptionEmail(subscriptionId: string) {
  try {
    const email = await client.get(subscriptionId);

    if (!email) {
      console.error("No email found for subscription ID:", subscriptionId);
      return false;
    }

    await client.del(subscriptionId);
    return true;
  } catch (error) {
    console.error("Error deleting subscription email:", error);
  }
}

export async function deleteTransactionEmail(transactionId: string) {
  const email = await client.get(transactionId);

  if (!email) {
    return;
  }

  await client.del(transactionId);
}

// export async function generateAudioPronunciation(words: string[]) {
//   try {

//   } catch (error) {
//     console.error(error);
//   }
// }
