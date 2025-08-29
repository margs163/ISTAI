import { updateCreditCard, updateSubscription } from "@/lib/queries";
import {
  CreditCardType,
  SubscriptionUpdateSchema,
  SubscriptionUpdateType,
} from "@/lib/types";
import {
  Address,
  Customer,
  CustomerCollection,
  Environment,
  EventName,
  LogLevel,
  Paddle,
  PaymentMethod,
  PaymentMethodDetails,
  Product,
  ProductCollection,
  Subscription,
  SubscriptionCollection,
  Transaction,
  TransactionCollection,
} from "@paddle/paddle-node-sdk";
import dotenv from "dotenv";
import { NextRequest, NextResponse } from "next/server";

dotenv.config();

const PADDLE_API_KEY = process.env.NEXT_PUBLIC_PADDLE_API_KEY;

const paddle = new Paddle(PADDLE_API_KEY as string, {
  environment: Environment.sandbox,
  logLevel: LogLevel.verbose,
});

async function getAllSubscriptions(): Promise<Transaction[] | undefined> {
  const subs = paddle.transactions.list({
    subscriptionId: ["sub_01k3ngscrkr2y4b4rmbqkqhnnd"],
  });

  const items: Transaction[] = [];

  for await (const sub of subs) {
    items.push(sub);
  }

  if (items.length === 0) {
    console.log("No products were found");
    throw new Error("No products were found");
  }

  return items;
}

async function getPaymentMethod(
  subscriptionId: string
): Promise<PaymentMethodDetails | undefined> {
  const trans = paddle.transactions.list({ subscriptionId: [subscriptionId] });

  if (!trans.hasMore) {
    throw new Error("No transactions were found");
  }

  const transaction = (await trans.next()).at(0);

  if (!transaction) {
    throw new Error("No transaction was found");
  }
  const paymentDetails = transaction.payments.at(-1)?.methodDetails;

  if (!paymentDetails) {
    throw new Error("No payment detail was found");
  }
  return paymentDetails;
}

async function getAddress(
  customerId: string,
  addressId: string
): Promise<Address | undefined> {
  const address = await paddle.addresses.get(customerId, addressId);

  if (!address) {
    throw new Error("No transaction was found");
  }
  return address;
}

export async function GET(request: NextRequest) {
  try {
    const subs = await getPaymentMethod("ctm_01k3ngh9c98fhfegaj7yw5m4aw");
    console.log("Address:", subs);
    return NextResponse.json({ message: subs });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: error }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const signature = (request.headers.get("paddle-signature") as string) || "";
    const rawRequestBody = await request.text();

    const secretKey = process.env.PADDLE_WEBHOOK_SECRET || "";

    if (signature && rawRequestBody) {
      const eventData = await paddle.webhooks.unmarshal(
        rawRequestBody,
        secretKey,
        signature
      );
      switch (eventData.eventType) {
        case EventName.ProductUpdated:
          console.log(`Praduct ${eventData.data.id} was updated`);
          break;
        case EventName.SubscriptionUpdated:
          console.log(`Subscription ${eventData.data} was updated`);
          break;
        case EventName.SubscriptionActivated:
          console.log(`Subscription ${eventData.data} was activated`);

          const data = eventData.data;
          const paymentDetails = await getPaymentMethod(data.id);
          const address = await getAddress(data.customerId, data.addressId);
          const updateSchema: SubscriptionUpdateType = {
            subscription_tier: data?.items[0]?.product?.name as
              | "Starter"
              | "Pro",
            total_money_spent:
              parseFloat(data?.items[0]?.price?.unitPrice?.amount as string) /
              100,
            credits_total_purchased:
              data?.items[0]?.product?.name === "Starter" ? 300 : 800,
            credits_left:
              data?.items[0]?.product?.name === "Starter" ? 300 : 800,
            billing_interval: data?.items[0]?.price?.billingCycle
              ?.interval as string,
            billing_frequency: data?.items[0]?.price?.billingCycle
              ?.frequency as number,
            paddle_product_id: data?.items[0].product?.id,
            paddle_subscription_id: data?.id,
            paddle_subscription_status: data?.status,
            paddle_price_id: data?.items[0].price?.id,
            subscription_created_at: data?.createdAt,
            subscription_next_billed_at: data?.nextBilledAt,
          };
          const cardUpdateSchema: CreditCardType = {
            card_holder_name: paymentDetails?.card?.cardholderName as string,
            card_type: paymentDetails?.card?.type as string,
            last_four: paymentDetails?.card?.last4 as string,
            expiry_year: paymentDetails?.card?.expiryYear as number,
            expiry_month: paymentDetails?.card?.expiryMonth as number,
            country: address?.countryCode as string,
            payment_method: paymentDetails?.type as string,
          };

          updateSubscription(updateSchema);
          updateCreditCard(cardUpdateSchema);
          console.log("Everything was updated successfully!");
        case EventName.SubscriptionCanceled:
          console.log(`Subscription ${eventData.data.id} was cancelled`);
          break;
        default:
          console.log(eventData.eventType);
      }
    } else {
      console.log("Signature missing in header");
    }
    return NextResponse.json({ message: "Processed webhook eventData" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
