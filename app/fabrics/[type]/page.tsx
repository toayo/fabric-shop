import { notFound } from "next/navigation";
import { fabricTypes, getProductsByType } from "@/data/products";
import ProductCard from "@/app/components/ProductCard";
import { slugify } from "@/lib/slug";

const chipOptions = ["lightweight", "medium", "heavy", "printed", "solid"];

export default function FabricTypePage({ params }: { params: { type: string } }) {
  const normalizedType = slugify(params.type ?? "");
  const matchedType = fabricTypes.find((type) => slugify(type) === normalizedType);
  if (!matchedType) {
    notFound();
  }
  const products = getProductsByType(matchedType);
  if (products.length === 0) {
    notFound();
  }

  return (
    <div className="container pb-20">
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <p className="text-xs uppercase text-cocoa/50">Fabric type</p>
        <h1 className="mt-2 text-3xl font-semibold capitalize text-cocoa">{matchedType}</h1>
        <p className="mt-3 text-sm text-cocoa/60">
          Explore our curated {matchedType} selection, ideal for Jamaica&apos;s climate and
          studio-ready tailoring.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {chipOptions.map((chip) => (
            <span
              key={chip}
              className="rounded-full border border-cocoa/20 px-3 py-1 text-xs text-cocoa/70 transition hover:border-brand/30 hover:text-brand"
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
