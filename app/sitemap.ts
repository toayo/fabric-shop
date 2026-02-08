import type { MetadataRoute } from "next";
import { seedProducts } from "@/data/products";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const products = seedProducts.map((product) => ({
    slug: product.slug,
    updatedAt: new Date(),
  }));

  const routes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/shop`, lastModified: new Date() },
    { url: `${baseUrl}/about`, lastModified: new Date() },
    { url: `${baseUrl}/contact`, lastModified: new Date() },
  ];

  products.forEach((product) => {
    routes.push({
      url: `${baseUrl}/product/${product.slug}`,
      lastModified: product.updatedAt,
    });
  });

  return routes;
}
