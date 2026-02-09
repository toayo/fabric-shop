import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const paymentIntentId = searchParams.get("payment_intent");

  if (!paymentIntentId) {
    return NextResponse.json({ error: "Missing payment intent." }, { status: 400 });
  }

  return NextResponse.json({
    id: paymentIntentId,
    email: "",
    items: [],
    total: 0,
    shipping: 0,
    parish: "",
    deliveryMethod: "",
  });
}
