import Link from "next/link";
import { fabricColors, fabricTypes } from "@/data/products";
import { colorMap } from "@/lib/color-map";
import ProductCard from "@/app/components/ProductCard";
import FabricSwatch from "@/app/components/FabricSwatch";
import { getAllProducts } from "@/lib/products";
import { formatCategoryName } from "@/lib/format";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Harvey's | Premium Fabrics in Jamaica",
  description:
    "Shop premium Jamaican fabrics with boutique-level curation, modern checkout, and delivery options.",
  openGraph: {
    title: "Harvey's | Premium Fabrics in Jamaica",
    description:
      "Shop premium Jamaican fabrics with boutique-level curation, modern checkout, and delivery options.",
    type: "website",
  },
};

export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await getAllProducts();
  const heroProduct = products[0];
  const crochetThreads = products.filter((product) => product.type === "crochet-threads");
  return (
    <div className="pb-16">
      <section className="container grid gap-10 pt-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <span className="rounded-full bg-[var(--surface2)] px-4 py-2 text-xs font-semibold uppercase text-accent">
            Premium Fabrics in Jamaica
          </span>
          <h1 className="mt-6 text-4xl font-semibold leading-tight md:text-5xl">
            Harvey&apos;s
          </h1>
          <p className="mt-4 text-base text-[var(--muted)] md:text-lg">
            A curated fabric house for designers and ateliers across Jamaica. Shop by length,
            mix colors, and enjoy a seamless checkout designed for modern makers.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/shop"
              className="btn-primary rounded-full px-6 py-3 text-sm font-semibold shadow-soft"
            >
              Shop Fabrics
            </Link>
            <Link
              href="/fabrics/cotton"
              className="btn-secondary rounded-full px-6 py-3 text-sm font-semibold"
            >
              Explore Cotton
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-6 text-sm text-[var(--muted)]">
            <div>
              <p className="text-lg font-semibold text-[var(--text)]">150+</p>
              <p>Premium bolts curated</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-[var(--text)]">Jamaica-wide</p>
              <p>Delivery scheduling</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-[var(--text)]">Studio-ready</p>
              <p>Quality inspection</p>
            </div>
          </div>
        </div>
        <div className="relative h-[420px] overflow-hidden rounded-[32px] surface card-hover shadow-soft">
          {heroProduct ? (
            <FabricSwatch
              color={heroProduct.colors[0] ?? "beige"}
              label={`${heroProduct.name} fabric swatch`}
              className="absolute inset-0"
            />
          ) : (
            <div className="absolute inset-0 rounded-[32px] bg-[var(--surface2)]" />
          )}
          <div className="relative flex h-full flex-col justify-end p-8 text-white">
            <p className="text-xs uppercase text-white/80">Featured fabric</p>
            <h3 className="mt-2 text-2xl font-semibold">
              {heroProduct?.name ?? "New arrivals"}
            </h3>
            <p className="mt-2 text-sm text-white/80">
              Lightweight, breathable, and tailored for resort-ready silhouettes.
            </p>
          </div>
        </div>
      </section>

      <section className="container mt-20">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Featured Categories</h2>
          <Link href="/shop" className="text-sm text-accent">
            View all
          </Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {fabricTypes.slice(0, 6).map((type) => (
            <Link
              key={type}
              href={`/fabrics/${type}`}
              className="group rounded-3xl p-6 shadow-sm surface card-hover transition hover:-translate-y-1"
            >
              <p className="text-xs uppercase text-[var(--muted)]">Category</p>
              <h3 className="mt-2 text-lg font-semibold">{formatCategoryName(type)}</h3>
              <p className="mt-3 text-sm text-[var(--muted)]">
                Premium {formatCategoryName(type)} for tailored silhouettes and modern interiors.
              </p>
              <span className="mt-4 inline-flex text-sm font-semibold text-accent">
                Shop {formatCategoryName(type)}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="container mt-20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Crochet Threads</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">Browse crochet thread by color.</p>
          </div>
          <Link href="/fabrics/crochet-threads" className="text-sm text-accent">
            Shop Crochet Threads
          </Link>
        </div>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {crochetThreads.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="container mt-20">
        <h2 className="text-2xl font-semibold">Shop by Color</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Curate collections by palette — ideal for bridal suites, resort wear, or home ateliers.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {fabricColors.map((color) => (
            <Link
              key={color}
              href={`/colors/${color}`}
              className="group relative overflow-hidden rounded-3xl p-6 shadow-sm surface-2 card-hover transition"
            >
              <div
                className="absolute inset-0 opacity-25"
                style={{ backgroundColor: colorMap[color] ?? color }}
              />
              <p className="text-xs uppercase text-[var(--muted)]">Palette</p>
              <h3 className="mt-2 text-lg font-semibold capitalize">{color}</h3>
              <p className="mt-3 text-sm text-[var(--muted)]">
                Shop all fabrics in {color} tones.
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="container mt-20">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Best Sellers</h2>
          <Link href="/shop" className="text-sm text-accent">
            View catalog
          </Link>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.slice(0, 3).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="container mt-20 grid gap-8 lg:grid-cols-2">
        <div className="rounded-3xl p-8 shadow-sm surface card-hover">
          <h3 className="text-xl font-semibold">Loved by local designers</h3>
          <p className="mt-4 text-sm text-[var(--muted)]">
            “Harvey&apos;s delivers a boutique-level selection with impeccable quality. Our
            bridal studio depends on their premium lace.”
          </p>
          <p className="mt-3 text-xs uppercase text-[var(--muted)]">
            — Studio Yara, Kingston
          </p>
        </div>
        <div className="rounded-3xl p-8 shadow-sm surface card-hover">
          <h3 className="text-xl font-semibold">Shipping & Returns</h3>
          <p className="mt-4 text-sm text-[var(--muted)]">
            Jamaica-wide delivery scheduling and careful packaging. Returns accepted for
            unopened bolts — contact us within 7 days for assistance.
          </p>
          <Link href="/contact" className="mt-6 inline-flex text-sm font-semibold text-accent">
            Learn more
          </Link>
        </div>
      </section>
    </div>
  );
}
