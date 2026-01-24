import Stripe from "stripe";
import { isValidLength } from "../../lib/validation";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error("Missing STRIPE_SECRET_KEY environment variable.");
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2024-06-20",
});

export const handler = async (event: { body?: string }) => {
  try {
    const payload = event.body ? JSON.parse(event.body) : null;
    const items = payload?.items ?? [];

    if (!Array.isArray(items) || items.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Cart is empty." }),
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

    const rounded = Math.round(amount * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: rounded,
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ clientSecret: paymentIntent.client_secret }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Unable to create payment intent." }),
    };
  }
};
