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
  const clientId = process.env.PAYPAL_CLIENT_ID;
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
    const {
      total,
      currency,
      email,
      deliveryMethod,
      shippingDetails,
      shipping,
    } = payload ?? {};

    if (!total || !currency) {
      return NextResponse.json({ error: "Missing order total or currency." }, { status: 400 });
    }

    const token = await getAccessToken();
    const baseUrl = getPayPalBaseUrl();
    const response = await fetch(`${baseUrl}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: String(currency).toUpperCase(),
              value: Number(total).toFixed(2),
              breakdown: {
                item_total: {
                  currency_code: String(currency).toUpperCase(),
                  value: Number(total - Number(shipping ?? 0)).toFixed(2),
                },
                shipping: {
                  currency_code: String(currency).toUpperCase(),
                  value: Number(shipping ?? 0).toFixed(2),
                },
              },
            },
            custom_id: JSON.stringify({
              email,
              deliveryMethod,
            }),
            shipping:
              deliveryMethod === "delivery" && shippingDetails
                ? {
                    name: {
                      full_name: shippingDetails.fullName ?? email,
                    },
                    address: {
                      address_line_1: shippingDetails.addressLine1 ?? "",
                      address_line_2: shippingDetails.addressLine2 ?? "",
                      admin_area_2: shippingDetails.city ?? "",
                      admin_area_1: shippingDetails.parish ?? "",
                      postal_code: shippingDetails.postalCode ?? "",
                      country_code: "JM",
                    },
                  }
                : undefined,
          },
        ],
        payer: {
          email_address: email,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json({ error: error?.message ?? "PayPal order failed." }, { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json({ orderId: data.id });
  } catch (error) {
    return NextResponse.json({ error: "Unable to create PayPal order." }, { status: 500 });
  }
}
