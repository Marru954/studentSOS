import { PrismaClient } from "@prisma/client";

/** Singleton PrismaClient — evita di esaurire le connessioni in hot-reload. */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ log: ["warn", "error"] });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
