"use client";

import { useMemo } from "react";
import { useCartStore } from "@/lib/cart-store";
import { formatCurrency, formatQuantity } from "@/lib/format";

export default function WhatsappButton() {
  const items = useCartStore((state) => state.items);
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

  const message = useMemo(() => {
    if (items.length === 0) {
      return "Hi! I have a question about Harvey's fabrics.";
    }
    const lines = items.map(
      (item) =>
        `${item.name} · ${formatQuantity(item.length, item.unit)} ${item.unit} · ${formatCurrency(
          item.priceAtAdd * item.length,
          item.currency
        )}`
    );
    return `Hi! I have a question about my cart:\n${lines.join("\n")}`;
  }, [items]);

  if (!number) {
    return null;
  }

  const href = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-50 rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--bg)] shadow-soft"
    >
      WhatsApp
    </a>
  );
}
