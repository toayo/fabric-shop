"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ProductCard from "@/app/components/ProductCard";
import FilterTabs from "@/app/components/FilterTabs";
import SkeletonCard from "@/app/components/SkeletonCard";
import { fabricColors, fabricTypes, products } from "@/data/products";

const typeOptions = [{ label: "All", value: "all" }].concat(
  fabricTypes.map((type) => ({ label: type, value: type }))
);
const colorOptions = [{ label: "All", value: "all" }].concat(
  fabricColors.map((color) => ({ label: color, value: color }))
);

export default function ShopPage() {
  const [type, setType] = useState("all");
  const [color, setColor] = useState("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");

  const filtered = useMemo(() => {
    let items = [...products];
    if (type !== "all") {
      items = items.filter((item) => item.type === type);
    }
    if (color !== "all") {
      items = items.filter((item) => item.color === color);
    }
    if (query.trim()) {
      const normalized = query.toLowerCase();
      items = items.filter((item) => item.name.toLowerCase().includes(normalized));
    }
    if (sort === "price-low") {
      items.sort((a, b) => a.pricePerYard - b.pricePerYard);
    }
    if (sort === "price-high") {
      items.sort((a, b) => b.pricePerYard - a.pricePerYard);
    }
    return items;
  }, [type, color, query, sort]);

  return (
    <div className="container pb-20">
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold">Shop Fabrics</h1>
        <p className="mt-2 text-sm text-cocoa/60">
          Filter by fabric type, color, or search by name. Every fabric is sold by length.
        </p>
        <div className="mt-6 grid gap-4 lg:grid-cols-[2fr_2fr_1fr]">
          <div>
            <p className="text-xs uppercase text-cocoa/50">Fabric Type</p>
            <FilterTabs options={typeOptions} value={type} onChange={setType} />
          </div>
          <div>
            <p className="text-xs uppercase text-cocoa/50">Color</p>
            <FilterTabs options={colorOptions} value={color} onChange={setColor} />
          </div>
          <div>
            <p className="text-xs uppercase text-cocoa/50">Price</p>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="mt-2 w-full rounded-full border border-cocoa/20 bg-white px-4 py-3 text-sm"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to high</option>
              <option value="price-high">Price: High to low</option>
            </select>
          </div>
        </div>
        <div className="mt-6">
          <input
            type="search"
            placeholder="Search fabric name"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-full rounded-full border border-cocoa/20 bg-white px-5 py-3 text-sm"
          />
        </div>
      </div>

      <motion.div layout className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {filtered.length === 0
            ? Array.from({ length: 3 }).map((_, index) => <SkeletonCard key={index} />)
            : filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
