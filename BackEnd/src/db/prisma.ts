import { PrismaClient } from '@prisma/client';

// Singleton pattern para evitar múltiples instancias de PrismaClient
// Esto previene memory leaks en desarrollo con hot-reload
const globalForPrisma = global as unknown as { prisma: PrismaClient };

const prisma = globalForPrisma.prisma || new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
