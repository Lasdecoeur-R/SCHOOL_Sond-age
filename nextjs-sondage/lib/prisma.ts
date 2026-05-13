import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "@/app/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

/**
 * Client Prisma paresseux : sans `DATABASE_URL` (ex. `next build` dans Docker),
 * retourne `null` au lieu de lancer une erreur.
 */
export function getPrisma(): PrismaClient | null {
  const connectionString = process.env.DATABASE_URL?.trim();
  if (!connectionString) {
    return null;
  }

  if (!globalForPrisma.prisma) {
    const pool = globalForPrisma.pool ?? new Pool({ connectionString });
    globalForPrisma.pool = pool;
    const adapter = new PrismaPg(pool);
    globalForPrisma.prisma = new PrismaClient({ adapter });
  }

  return globalForPrisma.prisma;
}
