"use client";

import Link from "next/link";
import type { SyntheticEvent } from "react";
import { motion } from "framer-motion";
import type { ProductWithCurrency } from "@/lib/products";
import { formatCategoryName, formatCurrency } from "@/lib/format";

export default function ProductCard({ product }: { product: ProductWithCurrency }) {
  const placeholderImage =
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='640' height='480'><rect width='100%25' height='100%25' fill='%23f3f4f6'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-size='20' font-family='Arial'>Image unavailable</text></svg>";
  const imageSrc = product.imageUrl ?? placeholderImage;
  const handleError = (event: SyntheticEvent<HTMLImageElement>) => {
    const target = event.currentTarget;
    if (target.dataset.fallbackApplied) {
      return;
    }
    target.dataset.fallbackApplied = "true";
    target.src = placeholderImage;
    console.error("Image failed:", product.imageUrl);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group rounded-3xl p-4 shadow-sm surface card-hover transition hover:-translate-y-1"
    >
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative h-48 overflow-hidden rounded-2xl">
          <img
            src={imageSrc}
            alt={product.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            onError={handleError}
          />
          {!product.inStock && (
            <span className="absolute left-3 top-3 rounded-full bg-black/50 px-3 py-1 text-[10px] uppercase tracking-wide text-white">
              Out of stock
            </span>
          )}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold">{product.name}</h3>
            <p className="text-xs capitalize text-[var(--muted)]">
              {formatCategoryName(product.type)}
            </p>
          </div>
          <span className="text-sm font-semibold text-accent">
            {formatCurrency(product.pricePerYard, product.currency)}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
