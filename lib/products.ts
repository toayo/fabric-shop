import { seedProducts } from "@/data/products";

export type ProductWithCurrency = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
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

const normalizeColor = (value: string) => {
  const normalized = value.toLowerCase();
  if (normalized.includes("multi") || normalized.includes("rainbow")) {
    return "multicolor";
  }
  if (normalized.includes("black")) {
    return "black";
  }
  if (normalized.includes("white")) {
    return "white";
  }
  if (normalized.includes("pink")) {
    return "pink";
  }
  if (normalized.includes("yellow")) {
    return "yellow";
  }
  if (normalized.includes("green")) {
    return "green";
  }
  if (normalized.includes("blue") || normalized.includes("teal")) {
    return "blue";
  }
  if (normalized.includes("beige") || normalized.includes("brown")) {
    return "beige";
  }
  if (normalized.includes("red") || normalized.includes("burgundy") || normalized.includes("orange")) {
    return "red";
  }
  if (normalized.includes("purple") || normalized.includes("grey")) {
    return "multicolor";
  }
  return "multicolor";
};

const products: ProductWithCurrency[] = seedProducts.map((product) => ({
  id: product.id ?? product.slug,
  name: product.name,
  slug: product.slug,
  imageUrl: product.imageUrl ?? product.images?.[0] ?? null,
  pricePerYard: product.pricePerYard,
  pricePerMeter: product.pricePerMeter,
  currency: product.currency,
  type: product.type,
  colors: [normalizeColor(product.color)],
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
