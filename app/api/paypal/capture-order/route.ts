import { NextResponse } from "next/server";

const getPayPalBaseUrl = () => {
  if (process.env.PAYPAL_ENV) {
    return process.env.PAYPAL_ENV === "sandbox"
      ? "https://api-m.sandbox.paypal.com"
      : "https://api-m.paypal.com";
  }
  return process.env.NODE_ENV === "production"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";
};

const getAccessToken = async () => {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("PayPal credentials not configured.");
  }
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const response = await fetch(`${getPayPalBaseUrl()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!response.ok) {
    throw new Error("Unable to authenticate with PayPal.");
  }
  const data = await response.json();
  return data.access_token as string;
};

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const orderId = payload?.orderId;
    if (!orderId) {
      return NextResponse.json({ error: "Missing PayPal order ID." }, { status: 400 });
    }

    const token = await getAccessToken();
    const response = await fetch(`${getPayPalBaseUrl()}/v2/checkout/orders/${orderId}/capture`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error?.message ?? "PayPal capture failed." },
        { status: 500 }
      );
    }

    const data = await response.json();
    return NextResponse.json({ status: data.status });
  } catch (error) {
    return NextResponse.json({ error: "Unable to capture PayPal order." }, { status: 500 });
  }
}
