"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { ProductWithCurrency } from "@/lib/products";
import { formatCurrency } from "@/lib/format";
import ProductMedia from "@/app/components/ProductMedia";

export default function ProductCard({ product }: { product: ProductWithCurrency }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group rounded-3xl p-4 shadow-sm surface card-hover transition hover:-translate-y-1"
    >
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
          <ProductMedia
            image={product.images[0] ?? undefined}
            color={product.colors[0] ?? "beige"}
            label={product.name}
            className="absolute inset-0 transition duration-300 group-hover:scale-105"
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
            <p className="text-xs capitalize text-[var(--muted)]">{product.type}</p>
          </div>
          <span className="text-sm font-semibold text-accent">
            {formatCurrency(product.pricePerYard, product.currency)}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
