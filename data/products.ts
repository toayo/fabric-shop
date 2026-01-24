import { slugify } from "@/lib/slug";

export type FabricProduct = {
  id: string;
  name: string;
  slug: string;
  type: string;
  color: string;
  pricePerYard: number;
  pricePerMeter: number;
  currency: "JMD" | "USD";
  images: string[];
  description: string;
  width: string;
  weight: string;
  composition: string;
  care: string;
  origin: string;
};

export const fabricTypes = [
  "cotton",
  "linen",
  "silk",
  "polyester",
  "lace",
  "denim",
  "rayon",
] as const;

export const fabricColors = [
  "black",
  "white",
  "red",
  "blue",
  "green",
  "yellow",
  "pink",
  "beige",
  "multicolor",
] as const;

export const products: FabricProduct[] = [
  {
    id: "cotton-sateen-midnight",
    name: "Midnight Cotton Sateen",
    slug: "midnight-cotton-sateen",
    type: "cotton",
    color: "black",
    pricePerYard: 1250,
    pricePerMeter: 1365,
    currency: "JMD",
    images: ["1.svg", "2.svg"],
    description: "Smooth, breathable cotton sateen with a subtle sheen for tailored pieces and occasion wear.",
    width: "58 in",
    weight: "165 gsm",
    composition: "100% cotton",
    care: "Machine wash cold, line dry",
    origin: "Japan",
  },
  {
    id: "linen-seaside",
    name: "Seaside Linen",
    slug: "seaside-linen",
    type: "linen",
    color: "blue",
    pricePerYard: 2150,
    pricePerMeter: 2350,
    currency: "JMD",
    images: ["1.svg", "2.svg"],
    description: "Airy, crisp linen in a calm Caribbean blue with a relaxed, premium drape.",
    width: "55 in",
    weight: "190 gsm",
    composition: "100% linen",
    care: "Machine wash cold, hang dry",
    origin: "Ireland",
  },
  {
    id: "silk-hibiscus",
    name: "Hibiscus Silk Charmeuse",
    slug: "hibiscus-silk-charmeuse",
    type: "silk",
    color: "red",
    pricePerYard: 4800,
    pricePerMeter: 5240,
    currency: "JMD",
    images: ["1.svg", "2.svg"],
    description: "Luxurious charmeuse with a luminous finish, ideal for statement blouses and evening looks.",
    width: "54 in",
    weight: "95 gsm",
    composition: "100% silk",
    care: "Dry clean only",
    origin: "China",
  },
  {
    id: "polyester-sunset",
    name: "Sunset Polyester Crepe",
    slug: "sunset-polyester-crepe",
    type: "polyester",
    color: "pink",
    pricePerYard: 980,
    pricePerMeter: 1070,
    currency: "JMD",
    images: ["1.svg", "2.svg"],
    description: "Easy-care crepe with fluid movement and a matte finish for everyday elegance.",
    width: "60 in",
    weight: "140 gsm",
    composition: "100% polyester",
    care: "Machine wash gentle, low tumble dry",
    origin: "South Korea",
  },
  {
    id: "lace-ivory",
    name: "Ivory Chantilly Lace",
    slug: "ivory-chantilly-lace",
    type: "lace",
    color: "white",
    pricePerYard: 5200,
    pricePerMeter: 5680,
    currency: "JMD",
    images: ["1.svg", "2.svg"],
    description: "Delicate floral lace with soft scallops for bridal overlays and heirloom designs.",
    width: "52 in",
    weight: "75 gsm",
    composition: "Nylon blend",
    care: "Hand wash cold, lay flat",
    origin: "France",
  },
  {
    id: "denim-oak",
    name: "Oak Rinse Denim",
    slug: "oak-rinse-denim",
    type: "denim",
    color: "blue",
    pricePerYard: 1750,
    pricePerMeter: 1910,
    currency: "JMD",
    images: ["1.svg", "2.svg"],
    description: "Structured selvedge denim with a soft rinse, perfect for jackets and structured dresses.",
    width: "60 in",
    weight: "320 gsm",
    composition: "98% cotton, 2% elastane",
    care: "Cold wash, hang dry",
    origin: "USA",
  },
  {
    id: "rayon-palms",
    name: "Palm Rayon Twill",
    slug: "palm-rayon-twill",
    type: "rayon",
    color: "green",
    pricePerYard: 1480,
    pricePerMeter: 1615,
    currency: "JMD",
    images: ["1.svg", "2.svg"],
    description: "Soft rayon twill with a smooth hand and vibrant green hue for resort wear.",
    width: "57 in",
    weight: "175 gsm",
    composition: "100% rayon",
    care: "Hand wash cold, line dry",
    origin: "India",
  },
  {
    id: "linen-sandbar",
    name: "Sandbar Linen Blend",
    slug: "sandbar-linen-blend",
    type: "linen",
    color: "beige",
    pricePerYard: 1950,
    pricePerMeter: 2130,
    currency: "JMD",
    images: ["1.svg", "2.svg"],
    description: "Neutral linen blend with a textured slub for relaxed tailoring and home decor.",
    width: "56 in",
    weight: "210 gsm",
    composition: "70% linen, 30% cotton",
    care: "Machine wash cold, line dry",
    origin: "Belgium",
  },
  {
    id: "cotton-carnival",
    name: "Carnival Cotton Print",
    slug: "carnival-cotton-print",
    type: "cotton",
    color: "multicolor",
    pricePerYard: 1380,
    pricePerMeter: 1505,
    currency: "JMD",
    images: ["1.svg", "2.svg"],
    description: "Playful multicolor cotton poplin with bold tropical motifs for statement pieces.",
    width: "44 in",
    weight: "120 gsm",
    composition: "100% cotton",
    care: "Machine wash cold, low tumble dry",
    origin: "Mexico",
  }
];

export const getProductBySlug = (slug: string) => {
  const normalized = slugify(slug);
  return products.find((product) => slugify(product.slug) === normalized);
};

export const getProductsByType = (type: string) => {
  const normalized = slugify(type);
  return products.filter((product) => slugify(product.type) === normalized);
};

export const getProductsByColor = (color: string) => {
  const normalized = slugify(color);
  return products.filter((product) => slugify(product.color) === normalized);
};
