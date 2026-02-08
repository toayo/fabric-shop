import type { Product } from "@prisma/client";
import { seedProducts } from "@/data/products";
import { getPrismaClient } from "@/lib/db";

export type ProductWithCurrency = Omit<Product, "currency"> & {
  currency: "JMD" | "USD";
};

const normalizeCurrency = (currency: string): "JMD" | "USD" =>
  currency === "USD" ? "USD" : "JMD";

const toProductWithCurrency = (product: Product): ProductWithCurrency => ({
  ...product,
  currency: normalizeCurrency(product.currency),
});

const fallbackProducts: ProductWithCurrency[] = seedProducts.map((product) => ({
  id: product.id ?? product.slug,
  name: product.name,
  slug: product.slug,
  pricePerYard: product.pricePerYard,
  pricePerMeter: product.pricePerMeter,
  currency: product.currency,
  type: product.type,
  colors: [product.color],
  description: product.description,
  images: product.images ?? [],
  inStock: true,
  shippingProfile: null,
  createdAt: new Date(),
  updatedAt: new Date(),
}));

export const getAllProducts = async () => {
  const prisma = await getPrismaClient();
  if (!prisma) {
    return fallbackProducts;
  }
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
  return products.map(toProductWithCurrency);
};

export const getProductBySlug = async (slug: string) => {
  const prisma = await getPrismaClient();
  if (!prisma) {
    return fallbackProducts.find((product) => product.slug === slug) ?? null;
  }
  const product = await prisma.product.findUnique({ where: { slug } });
  return product ? toProductWithCurrency(product) : null;
};

export const getProductsByType = async (type: string) => {
  const prisma = await getPrismaClient();
  if (!prisma) {
    return fallbackProducts.filter((product) => product.type === type);
  }
  const products = await prisma.product.findMany({
    where: { type },
    orderBy: { createdAt: "desc" },
  });
  return products.map(toProductWithCurrency);
};

export const getProductsByColor = async (color: string) => {
  const prisma = await getPrismaClient();
  if (!prisma) {
    return fallbackProducts.filter((product) => product.colors.includes(color));
  }
  const products = await prisma.product.findMany({
    where: { colors: { has: color } },
    orderBy: { createdAt: "desc" },
  });
  return products.map(toProductWithCurrency);
};
