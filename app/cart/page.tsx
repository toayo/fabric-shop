"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/lib/cart-store";
import { formatCurrency, formatUnit } from "@/lib/format";
import { isValidLength } from "@/lib/validation";
import { blurDataURL } from "@/lib/image-placeholder";

export default function CartPage() {
  const { items, removeItem, updateItem } = useCartStore();
  const total = items.reduce((sum, item) => sum + item.priceAtAdd * item.length, 0);

  return (
    <div className="container pb-20">
      <h1 className="text-3xl font-semibold">Your Cart</h1>
      {items.length === 0 ? (
        <div className="mt-10 rounded-3xl bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-cocoa/70">Your cart is empty.</p>
          <Link
            href="/shop"
            className="mt-4 inline-flex rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-brand-dark"
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
                  className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm sm:flex-row"
                >
                  <div className="relative h-24 w-32 overflow-hidden rounded-2xl">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      placeholder="blur"
                      blurDataURL={blurDataURL}
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-sm font-semibold">{item.name}</h3>
                        <p className="text-xs text-cocoa/60">
                          {formatUnit(item.unit)} · {item.length.toFixed(2)} {item.unit}s
                        </p>
                      </div>
                      <button
                        className="text-xs text-cocoa/50"
                        onClick={() => removeItem(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                      <label className="text-xs uppercase text-cocoa/60">
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
                          className="ml-2 w-20 rounded-full border border-cocoa/20 px-2 py-1 text-xs focus:border-brand/40 focus:outline-none focus:ring-2 focus:ring-brand/20"
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
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h3 className="text-sm font-semibold">Cart total</h3>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span>Subtotal</span>
              <span>{formatCurrency(total, items[0].currency)}</span>
            </div>
            <p className="mt-2 text-xs text-cocoa/60">
              Taxes and Jamaica delivery calculated at checkout.
            </p>
            <Link
              href="/checkout"
              className="mt-6 inline-flex w-full justify-center rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-brand-dark"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
