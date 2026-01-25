import { notFound } from "next/navigation";
import { fabricTypes, getProductsByType } from "@/data/products";
import ProductCard from "@/app/components/ProductCard";

const chipOptions = ["lightweight", "medium", "heavy", "printed", "solid"];

export default function FabricTypePage({ params }: { params: { type: string } }) {
  const type = params.type;
  if (!fabricTypes.includes(type as (typeof fabricTypes)[number])) {
    notFound();
  }
  const products = getProductsByType(type);

  return (
    <div className="container pb-20">
      <div className="rounded-3xl p-8 shadow-sm surface card-hover">
        <p className="text-xs uppercase text-[var(--muted)]">Fabric type</p>
        <h1 className="mt-2 text-3xl font-semibold capitalize">{type}</h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          Explore our curated {type} selection, ideal for Jamaica&apos;s climate and
          studio-ready tailoring.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {chipOptions.map((chip) => (
            <span
              key={chip}
              className="rounded-full border border-theme px-3 py-1 text-xs text-[var(--muted)]"
            >
              {chip}
            </span>
          ))}
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
