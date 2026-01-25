import type { Product } from "@prisma/client";
import { seedProducts } from "@/data/products";
import { getPrismaClient } from "@/lib/db";

const fallbackProducts: Product[] = seedProducts.map((product) => ({
  id: product.id ?? product.slug,
  name: product.name,
  slug: product.slug,
  pricePerYard: product.pricePerYard,
  pricePerMeter: product.pricePerMeter,
  currency: product.currency,
  type: product.type,
  colors: [product.color],
  description: product.description,
  images: [],
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
  return prisma.product.findMany({ orderBy: { createdAt: "desc" } });
};

export const getProductBySlug = async (slug: string) => {
  const prisma = await getPrismaClient();
  if (!prisma) {
    return fallbackProducts.find((product) => product.slug === slug) ?? null;
  }
  return prisma.product.findUnique({ where: { slug } });
};

export const getProductsByType = async (type: string) => {
  const prisma = await getPrismaClient();
  if (!prisma) {
    return fallbackProducts.filter((product) => product.type === type);
  }
  return prisma.product.findMany({ where: { type }, orderBy: { createdAt: "desc" } });
};

export const getProductsByColor = async (color: string) => {
  const prisma = await getPrismaClient();
  if (!prisma) {
    return fallbackProducts.filter((product) => product.colors.includes(color));
  }
  return prisma.product.findMany({
    where: { colors: { has: color } },
    orderBy: { createdAt: "desc" },
  });
};
