"use client";

import Link from "next/link";
import type { SyntheticEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/lib/cart-store";
import { formatCurrency, formatQuantity, formatUnit } from "@/lib/format";
import { isValidQuantity } from "@/lib/validation";

export default function CartPage() {
  const { items, removeItem, updateItem } = useCartStore();
  const total = items.reduce((sum, item) => sum + item.priceAtAdd * item.length, 0);
  const placeholderImage =
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='320' height='240'><rect width='100%25' height='100%25' fill='%23f3f4f6'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-size='14' font-family='Arial'>Image unavailable</text></svg>";

  return (
    <div className="container pb-20">
      <h1 className="text-3xl font-semibold">Your Cart</h1>
      {items.length === 0 ? (
        <div className="mt-10 rounded-3xl p-8 text-center shadow-sm surface card-hover">
          <p className="text-sm text-[var(--muted)]">Your cart is empty.</p>
          <Link
            href="/shop"
            className="btn-primary mt-4 inline-flex rounded-full px-6 py-3 text-sm font-semibold"
          >
            Browse fabrics
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-4 rounded-3xl p-6 shadow-sm surface card-hover sm:flex-row"
                >
                  {(() => {
                    const itemImageUrl =
                      "imageUrl" in item
                        ? item.imageUrl
                        : (item as { image?: string | null }).image ?? null;
                    return (
                      <div className="relative h-24 w-32 overflow-hidden rounded-2xl">
                        <img
                          src={itemImageUrl ?? placeholderImage}
                          alt={item.name}
                          className="h-full w-full object-cover"
                          onError={(event: SyntheticEvent<HTMLImageElement>) => {
                            const target = event.currentTarget;
                            if (target.dataset.fallbackApplied) {
                              return;
                            }
                            target.dataset.fallbackApplied = "true";
                            target.src = placeholderImage;
                            console.error("Image failed:", itemImageUrl);
                          }}
                        />
                      </div>
                    );
                  })()}
                  <div className="flex flex-1 flex-col gap-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-sm font-semibold">{item.name}</h3>
                        <p className="text-xs text-[var(--muted)]">
                          {formatUnit(item.unit)} · {formatQuantity(item.length, item.unit)}{" "}
                          {item.unit}
                          {item.length === 1 ? "" : "s"}
                        </p>
                      </div>
                      <button
                        className="text-xs text-[var(--muted)] hover:text-[var(--accent)]"
                        onClick={() => removeItem(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                      <label className="text-xs uppercase text-[var(--muted)]">
                        {item.unit === "spool" ? "Quantity" : "Length"}
                        <input
                          type="number"
                          step={item.unit === "spool" ? 1 : 0.25}
                          min={item.unit === "spool" ? 1 : 0.25}
                          defaultValue={item.length}
                          onBlur={(event) => {
                            const parsed = Number.parseFloat(event.target.value);
                            const normalized = item.unit === "spool" ? Math.round(parsed) : parsed;
                            if (isValidQuantity(normalized, item.unit)) {
                              updateItem(item.id, { length: normalized });
                            }
                          }}
                          className="input-theme ml-2 w-20 rounded-full px-2 py-1 text-xs"
                        />
                      </label>
                      <span className="text-sm font-semibold">
                        {formatCurrency(item.priceAtAdd * item.length, item.currency)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <div className="rounded-3xl p-6 shadow-sm surface card-hover">
            <h3 className="text-sm font-semibold">Cart total</h3>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span>Subtotal</span>
              <span>{formatCurrency(total, items[0].currency)}</span>
            </div>
            <p className="mt-2 text-xs text-[var(--muted)]">
              Taxes and Jamaica delivery calculated at checkout.
            </p>
            <Link
              href="/checkout"
              className="btn-primary mt-6 inline-flex w-full justify-center rounded-full px-6 py-3 text-sm font-semibold"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
