"use server";

import OpenaAI from "openai";
import { client } from "./redisClient";

export async function setTransactionEmail(
  transactionId: string,
  email: string
) {
  await client.set(transactionId, email, {
    expiration: { type: "EX", value: 1800 },
  });
}

export async function setSubscriptionEmail(
  subscriptionId: string,
  email: string
) {
  await client.set(subscriptionId, email);
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
