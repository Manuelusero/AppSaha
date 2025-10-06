import { PrismaClient } from '../generated/prisma';

// Crear instancia única de Prisma Client
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

export default prisma;
