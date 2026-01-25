import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendOrderEmails } from "@/lib/email";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const paymentIntentId = searchParams.get("payment_intent");

  if (!paymentIntentId) {
    return NextResponse.json({ error: "Missing payment intent." }, { status: 400 });
  }

  const order = await prisma.order.findUnique({
    where: { stripePaymentIntentId: paymentIntentId },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  if (order.status !== "paid") {
    const updated = await prisma.order.update({
      where: { id: order.id },
      data: { status: "paid" },
    });
    await sendOrderEmails(updated);
    return NextResponse.json(updated);
  }

  return NextResponse.json(order);
}
