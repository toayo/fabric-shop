import { Resend } from "resend";
import type { Order } from "@prisma/client";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export const sendOrderEmails = async (order: Order) => {
  if (!resend) {
    console.warn("RESEND_API_KEY is not configured. Skipping order email send.");
    return;
  }
  const ownerEmail = process.env.STORE_OWNER_EMAIL;
  const subject = `Harvey's order ${order.id}`;
  const summary = JSON.stringify(order.items, null, 2);

  await resend.emails.send({
    from: "Harvey's <orders@harveysfabrics.com>",
    to: [order.email],
    subject: "Your Harvey's order confirmation",
    text: `Thanks for your order!\n\nOrder ID: ${order.id}\nStatus: ${order.status}\nTotal: ${order.total}\nShipping: ${order.shipping}\nParish: ${order.parish}\nDelivery: ${order.deliveryMethod}\n\nItems:\n${summary}`,
  });

  if (ownerEmail) {
    await resend.emails.send({
      from: "Harvey's <orders@harveysfabrics.com>",
      to: [ownerEmail],
      subject,
      text: `New order received.\n\nOrder ID: ${order.id}\nCustomer: ${order.email}\nTotal: ${order.total}\nShipping: ${order.shipping}\nParish: ${order.parish}\nDelivery: ${order.deliveryMethod}\n\nItems:\n${summary}`,
    });
  }
};
