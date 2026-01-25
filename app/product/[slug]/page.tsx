"use client";

import { useState } from "react";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/data/products";
import { formatCurrency, formatUnit } from "@/lib/format";
import { useCartStore } from "@/lib/cart-store";
import { isValidLength } from "@/lib/validation";
import QuantityStepper from "@/app/components/QuantityStepper";
import FabricSwatch from "@/app/components/FabricSwatch";
import { motion } from "framer-motion";

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug);
  const addItem = useCartStore((state) => state.addItem);
  const [selectedSwatch, setSelectedSwatch] = useState(0);
  const [unit, setUnit] = useState<"yard" | "meter">("yard");
  const [length, setLength] = useState(1);
  const [error, setError] = useState<string | null>(null);

  if (!product) {
    notFound();
  }

  const unitPrice = unit === "yard" ? product.pricePerYard : product.pricePerMeter;
  const total = unitPrice * length;
  const swatchVariants = ["primary", "secondary"] as const;

  const handleAdd = () => {
    if (!isValidLength(length)) {
      setError("Please choose a valid length in 0.25 increments.");
      return;
    }
    setError(null);
    addItem({
      id: `${product.id}-${unit}-${length}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      color: product.color,
      unit,
      length,
      priceAtAdd: unitPrice,
      currency: product.currency,
    });
  };

  return (
    <div className="container pb-20">
      <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[32px] surface shadow-sm">
            <FabricSwatch
              color={product.color}
              label={`${product.name} fabric swatch`}
              variant={swatchVariants[selectedSwatch]}
              className="absolute inset-0"
            />
          </div>
          <div className="mt-4 flex gap-3">
            {swatchVariants.map((variant, index) => (
              <button
                key={variant}
                onClick={() => setSelectedSwatch(index)}
                className={`relative h-20 w-24 overflow-hidden rounded-2xl border ${
                  selectedSwatch === index ? "border-[var(--accent)]" : "border-transparent"
                }`}
              >
                <FabricSwatch
                  color={product.color}
                  label={`${product.name} swatch ${index + 1}`}
                  variant={variant}
                  className="absolute inset-0"
                />
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs uppercase text-[var(--muted)]">{product.type}</p>
          <h1 className="mt-2 text-3xl font-semibold">{product.name}</h1>
          <p className="mt-3 text-sm text-[var(--muted)]">{product.description}</p>
          <div className="mt-6 space-y-4 rounded-3xl p-6 shadow-sm surface card-hover">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[var(--muted)]">Unit price</p>
              <p className="text-lg font-semibold">
                {formatCurrency(unitPrice, product.currency)} {formatUnit(unit)}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {(["yard", "meter"] as const).map((option) => (
                <button
                  key={option}
                  onClick={() => setUnit(option)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    unit === option
                      ? "btn-primary shadow-soft"
                      : "btn-secondary"
                  }`}
                >
                  {option === "yard" ? "Per Yard" : "Per Meter"}
                </button>
              ))}
            </div>
            <QuantityStepper value={length} onChange={setLength} />
            <div className="flex items-center justify-between text-sm">
              <span>Total</span>
              <span className="text-lg font-semibold">
                {formatCurrency(total, product.currency)}
              </span>
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleAdd}
              className="btn-primary w-full rounded-full px-6 py-3 text-sm font-semibold"
            >
              Add to Cart
            </motion.button>
            <p className="text-xs text-[var(--muted)]">
              Jamaica delivery calculated at checkout. Need assistance? Reach out to our team.
            </p>
          </div>
          <div className="mt-8 grid gap-4 text-sm">
            <div className="flex justify-between border-b border-theme pb-2">
              <span className="text-[var(--muted)]">Composition</span>
              <span>{product.composition}</span>
            </div>
            <div className="flex justify-between border-b border-theme pb-2">
              <span className="text-[var(--muted)]">Width</span>
              <span>{product.width}</span>
            </div>
            <div className="flex justify-between border-b border-theme pb-2">
              <span className="text-[var(--muted)]">Weight</span>
              <span>{product.weight}</span>
            </div>
            <div className="flex justify-between border-b border-theme pb-2">
              <span className="text-[var(--muted)]">Care</span>
              <span>{product.care}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--muted)]">Origin</span>
              <span>{product.origin}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
