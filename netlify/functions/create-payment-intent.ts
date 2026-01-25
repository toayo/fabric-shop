import Stripe from "stripe";
import { isValidLength } from "../../lib/validation";
import { getPrismaClient } from "../../lib/db";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error("Missing STRIPE_SECRET_KEY environment variable.");
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2023-10-16",
});

export const handler = async (event: { body?: string }) => {
  try {
    const prisma = await getPrismaClient();
    if (!prisma) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Database not configured." }),
      };
    }

    const payload = event.body ? JSON.parse(event.body) : null;
    const items = payload?.items ?? [];
    const shipping = Number(payload?.shipping ?? 0);
    const parish = String(payload?.parish ?? "");
    const deliveryMethod = String(payload?.deliveryMethod ?? "delivery");
    const email = String(payload?.email ?? "");

    if (!Array.isArray(items) || items.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Cart is empty." }),
      };
    }

    if (!email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Email is required." }),
      };
    }

    const currency = (process.env.NEXT_PUBLIC_STRIPE_CURRENCY || "jmd").toLowerCase();

    let amount = 0;
    for (const item of items) {
      const length = Number(item.length);
      if (!isValidLength(length)) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "Invalid length value." }),
        };
      }
      amount += Number(item.priceAtAdd) * length;
    }

    const total = amount + shipping;
    const rounded = Math.round(total * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: rounded,
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    const order = await prisma.order.create({
      data: {
        email,
        items,
        total: Math.round(total),
        shipping: Math.round(shipping),
        parish,
        deliveryMethod,
        status: "pending",
        stripePaymentIntentId: paymentIntent.id,
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        orderId: order.id,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Unable to create payment intent." }),
    };
  }
};
