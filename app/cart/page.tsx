"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/lib/cart-store";
import { formatCurrency, formatUnit } from "@/lib/format";
import { isValidLength } from "@/lib/validation";
import ProductMedia from "@/app/components/ProductMedia";

export default function CartPage() {
  const { items, removeItem, updateItem } = useCartStore();
  const total = items.reduce((sum, item) => sum + item.priceAtAdd * item.length, 0);

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
                  <div className="relative h-24 w-32 overflow-hidden rounded-2xl">
                    <ProductMedia
                      image={item.image}
                      color={item.color ?? "beige"}
                      label={item.name}
                      className="absolute inset-0"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-sm font-semibold">{item.name}</h3>
                        <p className="text-xs text-[var(--muted)]">
                          {formatUnit(item.unit)} · {item.length.toFixed(2)} {item.unit}s
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
                        Length
                        <input
                          type="number"
                          step={0.25}
                          min={0.25}
                          defaultValue={item.length}
                          onBlur={(event) => {
                            const parsed = Number.parseFloat(event.target.value);
                            if (isValidLength(parsed)) {
                              updateItem(item.id, { length: parsed });
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
