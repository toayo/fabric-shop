import { prisma } from "@/lib/db";

export const getAllProducts = async () =>
  prisma.product.findMany({ orderBy: { createdAt: "desc" } });

export const getProductBySlug = async (slug: string) =>
  prisma.product.findUnique({ where: { slug } });

export const getProductsByType = async (type: string) =>
  prisma.product.findMany({ where: { type }, orderBy: { createdAt: "desc" } });

export const getProductsByColor = async (color: string) =>
  prisma.product.findMany({
    where: { colors: { has: color } },
    orderBy: { createdAt: "desc" },
  });
