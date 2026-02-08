import Stripe from "stripe";
import { isValidQuantity } from "../../lib/validation";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error("Missing STRIPE_SECRET_KEY environment variable.");
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2023-10-16",
});

export const handler = async (event: { body?: string }) => {
  try {
    const payload = event.body ? JSON.parse(event.body) : null;
    const items = payload?.items ?? [];
    const shipping = Number(payload?.shipping ?? 0);
    const parish = String(payload?.parish ?? "");
    const deliveryMethod = String(payload?.deliveryMethod ?? "delivery");
    const email = String(payload?.email ?? "");
    const fullName = String(payload?.fullName ?? "");
    const shippingDetails = payload?.shippingDetails ?? null;

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
      const unit = (item.unit ?? "yard") as "yard" | "meter" | "spool";
      if (!isValidQuantity(length, unit)) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "Invalid quantity value." }),
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
      metadata: {
        email,
        parish,
        deliveryMethod,
      },
      shipping:
        deliveryMethod === "delivery" && shippingDetails
          ? {
              name: fullName || email,
              address: {
                line1: String(shippingDetails.addressLine1 ?? ""),
                line2: String(shippingDetails.addressLine2 ?? "") || undefined,
                city: String(shippingDetails.city ?? ""),
                postal_code: String(shippingDetails.postalCode ?? "") || undefined,
                country: "JM",
              },
            }
          : undefined,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        orderId: paymentIntent.id,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Unable to create payment intent." }),
    };
  }
};
