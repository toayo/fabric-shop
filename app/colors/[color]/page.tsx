import { notFound } from "next/navigation";
import { fabricColors, getProductsByColor } from "@/data/products";
import ProductCard from "@/app/components/ProductCard";
import { colorMap } from "@/lib/color-map";

export default function ColorPage({ params }: { params: { color: string } }) {
  const color = params.color;
  if (!fabricColors.includes(color as (typeof fabricColors)[number])) {
    notFound();
  }
  const products = getProductsByColor(color);

  return (
    <div className="container pb-20">
      <div
        className="relative overflow-hidden rounded-3xl p-8 shadow-sm surface card-hover"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{ backgroundColor: colorMap[color] ?? color }}
        />
        <div className="relative">
          <p className="text-xs uppercase text-[var(--muted)]">Color story</p>
          <h1 className="mt-2 text-3xl font-semibold capitalize">{color}</h1>
          <p className="mt-3 text-sm text-[var(--muted)]">
            Fabrics in {color} tones, hand-selected for Jamaica&apos;s designers and stylists.
          </p>
        </div>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
