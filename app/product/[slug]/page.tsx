"use client";

import { useState } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/data/products";
import { formatCurrency, formatUnit } from "@/lib/format";
import { useCartStore } from "@/lib/cart-store";
import { isValidLength } from "@/lib/validation";
import { blurDataURL } from "@/lib/image-placeholder";
import QuantityStepper from "@/app/components/QuantityStepper";
import { motion } from "framer-motion";

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug);
  const addItem = useCartStore((state) => state.addItem);
  const [selectedImage, setSelectedImage] = useState(0);
  const [unit, setUnit] = useState<"yard" | "meter">("yard");
  const [length, setLength] = useState(1);
  const [error, setError] = useState<string | null>(null);

  if (!product) {
    notFound();
  }

  const unitPrice = unit === "yard" ? product.pricePerYard : product.pricePerMeter;
  const total = unitPrice * length;

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
      image: product.images[0],
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
          <div className="relative aspect-[4/3] overflow-hidden rounded-[32px] bg-white shadow-sm">
            <Image
              src={product.images[selectedImage]}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              placeholder="blur"
              blurDataURL={blurDataURL}
              priority
            />
          </div>
          <div className="mt-4 flex gap-3">
            {product.images.map((image, index) => (
              <button
                key={image}
                onClick={() => setSelectedImage(index)}
                className={`relative h-20 w-24 overflow-hidden rounded-2xl border ${
                  selectedImage === index ? "border-ember" : "border-transparent"
                }`}
              >
                <Image
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="96px"
                  placeholder="blur"
                  blurDataURL={blurDataURL}
                />
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs uppercase text-cocoa/50">{product.type}</p>
          <h1 className="mt-2 text-3xl font-semibold">{product.name}</h1>
          <p className="mt-3 text-sm text-cocoa/70">{product.description}</p>
          <div className="mt-6 space-y-4 rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-cocoa/70">Unit price</p>
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
                      ? "bg-ember text-white"
                      : "border border-cocoa/20 text-cocoa"
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
              className="w-full rounded-full bg-ember px-6 py-3 text-sm font-semibold text-white"
            >
              Add to Cart
            </motion.button>
            <p className="text-xs text-cocoa/60">
              Jamaica delivery calculated at checkout. Need assistance? Reach out to our team.
            </p>
          </div>
          <div className="mt-8 grid gap-4 text-sm">
            <div className="flex justify-between border-b border-cocoa/10 pb-2">
              <span className="text-cocoa/60">Composition</span>
              <span>{product.composition}</span>
            </div>
            <div className="flex justify-between border-b border-cocoa/10 pb-2">
              <span className="text-cocoa/60">Width</span>
              <span>{product.width}</span>
            </div>
            <div className="flex justify-between border-b border-cocoa/10 pb-2">
              <span className="text-cocoa/60">Weight</span>
              <span>{product.weight}</span>
            </div>
            <div className="flex justify-between border-b border-cocoa/10 pb-2">
              <span className="text-cocoa/60">Care</span>
              <span>{product.care}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-cocoa/60">Origin</span>
              <span>{product.origin}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
