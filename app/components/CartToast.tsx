"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { formatCurrency } from "@/lib/format";
import { useCartStore } from "@/lib/cart-store";

const placeholderImage =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='90'><rect width='100%25' height='100%25' fill='%2333174a'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23d3c2ee' font-size='12' font-family='Arial'>No image</text></svg>";

export default function CartToast() {
  const toast = useCartStore((state) => state.cartToast);
  const dismissToast = useCartStore((state) => state.dismissToast);

  useEffect(() => {
    if (!toast) {
      return;
    }
    const timeout = window.setTimeout(() => {
      dismissToast();
    }, 3500);
    return () => window.clearTimeout(timeout);
  }, [toast, dismissToast]);

  return (
    <AnimatePresence>
      {toast && (
        <motion.aside
          initial={{ opacity: 0, x: 40, y: 8 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: 36, y: 8 }}
          transition={{ duration: 0.24, ease: "easeOut" }}
          className="fixed inset-x-4 bottom-4 z-[70] w-auto rounded-2xl border border-[#d8b26b66] bg-[var(--surface)] p-4 shadow-[0_18px_35px_rgba(0,0,0,0.45)] md:inset-x-auto md:right-6 md:top-24 md:w-[360px]"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-start gap-3">
            <img
              src={toast.imageUrl ?? placeholderImage}
              alt={toast.name}
              className="h-14 w-14 rounded-lg border border-theme object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[var(--text)]">Added to cart</p>
              <p className="truncate text-sm text-[var(--text)]">{toast.name}</p>
              <p className="text-xs text-[var(--muted)]">
                {formatCurrency(toast.lineTotal, toast.currency)}
              </p>
              <p className="mt-1 text-xs text-[var(--muted)]">
                Cart: {toast.itemCount} item{toast.itemCount === 1 ? "" : "s"}
              </p>
            </div>
            <button
              type="button"
              onClick={dismissToast}
              className="rounded-full border border-theme px-2 py-0.5 text-xs text-[var(--muted)] transition hover:text-[var(--text)]"
              aria-label="Close cart notification"
            >
              ✕
            </button>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Link
              href="/cart"
              onClick={dismissToast}
              className="btn-secondary rounded-full px-4 py-2 text-center text-xs font-semibold"
            >
              View Cart
            </Link>
            <Link
              href="/checkout"
              onClick={dismissToast}
              className="btn-primary rounded-full px-4 py-2 text-center text-xs font-semibold"
            >
              Checkout
            </Link>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
