import type { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
let prismaSingleton: PrismaClient | undefined;

export const isDatabaseConfigured = () => Boolean(process.env.DATABASE_URL);

const createPrismaClient = async () => {
  const { PrismaClient } = await import("@prisma/client");
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
};

export const getPrismaClient = async () => {
  if (!isDatabaseConfigured()) {
    return null;
  }
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }
  if (!prismaSingleton) {
    prismaSingleton = await createPrismaClient();
  }
  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prismaSingleton;
  }
  return prismaSingleton;
};
