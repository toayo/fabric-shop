"use client";

import { useMemo, useState, type SyntheticEvent } from "react";
import type { ProductWithCurrency } from "@/lib/products";
import { formatCategoryName, formatCurrency, formatUnit } from "@/lib/format";
import { useCartStore } from "@/lib/cart-store";
import { isValidQuantity } from "@/lib/validation";
import QuantityStepper from "@/app/components/QuantityStepper";
import ProductMedia from "@/app/components/ProductMedia";
import { motion } from "framer-motion";

export default function ProductDetailClient({
  product,
}: {
  product: ProductWithCurrency;
}) {
  const placeholderImage =
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='960' height='720'><rect width='100%25' height='100%25' fill='%23f3f4f6'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-size='24' font-family='Arial'>Image unavailable</text></svg>";
  const addItem = useCartStore((state) => state.addItem);
  const [selectedImage, setSelectedImage] = useState(0);
  const unitOptions = product.type === "Crochet Threads" ? (["spool"] as const) : ([
    "yard",
    "meter",
  ] as const);
  const [unit, setUnit] = useState<(typeof unitOptions)[number]>(unitOptions[0]);
  const [length, setLength] = useState(unitOptions[0] === "spool" ? 1 : 1);
  const [error, setError] = useState<string | null>(null);

  const unitPrice =
    unit === "meter" ? product.pricePerMeter : product.pricePerYard;
  const total = unitPrice * length;
  const images = useMemo(
    () => (product.images?.length ? product.images : [null]),
    [product]
  );
  const heroImage = images[selectedImage] ?? product.imageUrl ?? placeholderImage;
  const primaryColor = product.colors[0] ?? "beige";
  const handleHeroError = (event: SyntheticEvent<HTMLImageElement>) => {
    const target = event.currentTarget;
    if (target.dataset.fallbackApplied) {
      return;
    }
    target.dataset.fallbackApplied = "true";
    target.src = placeholderImage;
    console.error("Image failed:", product.imageUrl);
  };

  const handleAdd = () => {
    if (!isValidQuantity(length, unit)) {
      setError(
        unit === "spool"
          ? "Please choose a valid quantity."
          : "Please choose a valid length in 0.25 increments."
      );
      return;
    }
    setError(null);
    addItem({
      id: `${product.id}-${unit}-${length}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      imageUrl: product.imageUrl ?? product.images[0] ?? null,
      color: product.colors[0] ?? null,
      unit,
      length,
      priceAtAdd: unitPrice,
      currency: product.currency,
    });
  };

  return (
    <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
      <div>
        <div className="relative h-[420px] overflow-hidden rounded-[32px] surface shadow-sm">
          <img
            src={heroImage}
            alt={`${product.name} fabric`}
            className="h-full w-full object-cover"
            onError={handleHeroError}
          />
        </div>
        <div className="mt-4 flex gap-3">
          {images.map((image, index) => (
            <button
              key={`${product.id}-thumb-${index}`}
              onClick={() => setSelectedImage(index)}
              className={`relative h-20 w-24 overflow-hidden rounded-2xl border ${
                selectedImage === index ? "border-[var(--accent)]" : "border-transparent"
              }`}
            >
              <ProductMedia
                image={image}
                color={primaryColor}
                label={`${product.name} thumbnail ${index + 1}`}
                className="absolute inset-0"
              />
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs uppercase text-[var(--muted)]">
          {formatCategoryName(product.type)}
        </p>
        <h1 className="mt-2 text-3xl font-semibold">{product.name}</h1>
        <p className="mt-3 text-sm text-[var(--muted)]">{product.description}</p>
        <div className="mt-6 space-y-4 rounded-3xl p-6 shadow-sm surface card-hover">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[var(--muted)]">Unit price</p>
            <p className="text-lg font-semibold">
              {formatCurrency(unitPrice, product.currency)} {formatUnit(unit)}
            </p>
          </div>
          {unitOptions.length > 1 && (
            <div className="flex flex-wrap gap-3">
              {unitOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setUnit(option)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    unit === option ? "btn-primary shadow-soft" : "btn-secondary"
                  }`}
                >
                  {option === "yard"
                    ? "Per Yard"
                    : option === "meter"
                      ? "Per Meter"
                      : "Per Spool"}
                </button>
              ))}
            </div>
          )}
          <QuantityStepper value={length} onChange={setLength} unit={unit} />
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
            <span className="text-[var(--muted)]">Shipping profile</span>
            <span>{product.shippingProfile ?? "Standard"}</span>
          </div>
          <div className="flex justify-between border-b border-theme pb-2">
            <span className="text-[var(--muted)]">Availability</span>
            <span>{product.inStock ? "In stock" : "Out of stock"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--muted)]">Colors</span>
            <span>{product.colors.length ? product.colors.join(", ") : "—"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
