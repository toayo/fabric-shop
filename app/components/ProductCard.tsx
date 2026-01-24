"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FabricProduct } from "@/data/products";
import { formatCurrency } from "@/lib/format";
import { blurDataURL } from "@/lib/image-placeholder";

export default function ProductCard({ product }: { product: FabricProduct }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group rounded-3xl bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-soft"
    >
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
            placeholder="blur"
            blurDataURL={blurDataURL}
            priority={false}
          />
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold">{product.name}</h3>
            <p className="text-xs capitalize text-cocoa/60">{product.type}</p>
          </div>
          <span className="text-sm font-semibold text-ember">
            {formatCurrency(product.pricePerYard, product.currency)}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
