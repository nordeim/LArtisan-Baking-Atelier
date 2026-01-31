import { PrismaClient } from '@prisma/client';

/**
 * Prisma Client Singleton
 * 
 * This module creates a single instance of the PrismaClient that is reused
 * across the application to prevent multiple connections to the database.
 * 
 * In development, we store the client on the global object to prevent
 * exhausting database connections during hot reloading.
 * 
 * @see https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices
 */

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' 
      ? ['query', 'error', 'warn'] 
      : ['error'],
  });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

// Define global type for storing Prisma client
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClientSingleton | undefined;
}

// Create or reuse Prisma client instance
const prisma = globalThis.prisma ?? prismaClientSingleton();

// Store client on global object in development to prevent multiple instances
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

/**
 * Graceful shutdown helper
 * Call this when the application is shutting down
 */
export async function disconnectPrisma(): Promise<void> {
  await prisma.$disconnect();
  console.log('Prisma client disconnected');
}

/**
 * Health check helper
 * Returns true if database connection is healthy
 */
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
}

export { prisma };
export default prisma;
