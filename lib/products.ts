import { seedProducts } from "@/data/products";

export type ProductWithCurrency = {
  id: string;
  name: string;
  slug: string;
  pricePerYard: number;
  pricePerMeter: number;
  currency: "JMD" | "USD";
  type: string;
  colors: string[];
  description: string;
  images: string[];
  inStock: boolean;
  shippingProfile: string | null;
  createdAt: Date;
  updatedAt: Date;
};

const products: ProductWithCurrency[] = seedProducts.map((product) => ({
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

export const getAllProducts = async () => products;

export const getProductBySlug = async (slug: string) =>
  products.find((product) => product.slug === slug) ?? null;

export const getProductsByType = async (type: string) =>
  products.filter((product) => product.type === type);

export const getProductsByColor = async (color: string) =>
  products.filter((product) => product.colors.includes(color));
