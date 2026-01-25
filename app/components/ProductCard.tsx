"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FabricProduct } from "@/data/products";
import { formatCurrency } from "@/lib/format";
import FabricSwatch from "@/app/components/FabricSwatch";

export default function ProductCard({ product }: { product: FabricProduct }) {
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
          <FabricSwatch
            color={product.color}
            label={product.name}
            className="absolute inset-0 transition duration-300 group-hover:scale-105"
          />
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
