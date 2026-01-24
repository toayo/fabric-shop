import Link from "next/link";
import Image from "next/image";
import { fabricColors, fabricTypes, products } from "@/data/products";
import { blurDataURL } from "@/lib/image-placeholder";
import { colorMap } from "@/lib/color-map";
import ProductCard from "@/app/components/ProductCard";

export default function Home() {
  return (
    <div className="pb-16">
      <section className="container grid gap-10 pt-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <span className="rounded-full bg-ember/10 px-4 py-2 text-xs font-semibold uppercase text-ember">
            Premium Fabrics in Jamaica
          </span>
          <h1 className="mt-6 text-4xl font-semibold leading-tight md:text-5xl">
            Harvey&apos;s
          </h1>
          <p className="mt-4 text-base text-cocoa/70 md:text-lg">
            A curated fabric house for designers and ateliers across Jamaica. Shop by length,
            mix colors, and enjoy a seamless checkout designed for modern makers.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/shop"
              className="rounded-full bg-ember px-6 py-3 text-sm font-semibold text-white shadow-soft"
            >
              Shop Fabrics
            </Link>
            <Link
              href="/fabrics/cotton"
              className="rounded-full border border-cocoa/20 px-6 py-3 text-sm font-semibold"
            >
              Explore Cotton
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-6 text-sm text-cocoa/60">
            <div>
              <p className="text-lg font-semibold text-cocoa">150+</p>
              <p>Premium bolts curated</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-cocoa">Jamaica-wide</p>
              <p>Delivery scheduling</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-cocoa">Studio-ready</p>
              <p>Quality inspection</p>
            </div>
          </div>
        </div>
        <div className="relative h-[420px] overflow-hidden rounded-[32px] bg-white shadow-soft">
          <Image
            src={products[1].images[0]}
            alt="Harvey's fabric showcase"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 45vw"
            placeholder="blur"
            blurDataURL={blurDataURL}
            priority
          />
        </div>
      </section>

      <section className="container mt-20">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Featured Categories</h2>
          <Link href="/shop" className="text-sm text-ember">
            View all
          </Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {fabricTypes.slice(0, 6).map((type) => (
            <Link
              key={type}
              href={`/fabrics/${type}`}
              className="group rounded-3xl border border-cocoa/10 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-soft"
            >
              <p className="text-xs uppercase text-cocoa/50">Category</p>
              <h3 className="mt-2 text-lg font-semibold capitalize">{type}</h3>
              <p className="mt-3 text-sm text-cocoa/60">
                Premium {type} fabrics for tailored silhouettes and modern interiors.
              </p>
              <span className="mt-4 inline-flex text-sm font-semibold text-ember">
                Shop {type}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="container mt-20">
        <h2 className="text-2xl font-semibold">Shop by Color</h2>
        <p className="mt-2 text-sm text-cocoa/60">
          Curate collections by palette — ideal for bridal suites, resort wear, or home ateliers.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {fabricColors.map((color) => (
            <Link
              key={color}
              href={`/colors/${color}`}
              className="group relative overflow-hidden rounded-3xl border border-cocoa/10 bg-white p-6 shadow-sm transition hover:shadow-soft"
            >
              <div
                className="absolute inset-0 opacity-15"
                style={{ backgroundColor: colorMap[color] ?? color }}
              />
              <p className="text-xs uppercase text-cocoa/50">Palette</p>
              <h3 className="mt-2 text-lg font-semibold capitalize">{color}</h3>
              <p className="mt-3 text-sm text-cocoa/60">Shop all fabrics in {color} tones.</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="container mt-20">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Best Sellers</h2>
          <Link href="/shop" className="text-sm text-ember">
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
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <h3 className="text-xl font-semibold">Loved by local designers</h3>
          <p className="mt-4 text-sm text-cocoa/70">
            “Harvey&apos;s delivers a boutique-level selection with impeccable quality. Our
            bridal studio depends on their premium lace.”
          </p>
          <p className="mt-3 text-xs uppercase text-cocoa/50">— Studio Yara, Kingston</p>
        </div>
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <h3 className="text-xl font-semibold">Shipping & Returns</h3>
          <p className="mt-4 text-sm text-cocoa/70">
            Jamaica-wide delivery scheduling and careful packaging. Returns accepted for
            unopened bolts — contact us within 7 days for assistance.
          </p>
          <Link href="/contact" className="mt-6 inline-flex text-sm font-semibold text-ember">
            Learn more
          </Link>
        </div>
      </section>
    </div>
  );
}
