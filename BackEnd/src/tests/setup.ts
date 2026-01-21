import { beforeAll, afterAll, afterEach } from 'vitest';
import { PrismaClient } from '@prisma/client';

// Set JWT_SECRET for tests BEFORE importing any routes
process.env.JWT_SECRET = 'test_secret';

// Test database instance
export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL_TEST || process.env.DATABASE_URL,
    },
  },
});

beforeAll(async () => {
  // Connect to test database
  await prisma.$connect();
  console.log('🧪 Test database connected');
});

afterEach(async () => {
  // Clean up after each test - order matters due to foreign key constraints
  // Delete in order from child tables to parent tables
  try {
    await prisma.review.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.message.deleteMany();
    await prisma.favorite.deleteMany();
    await prisma.providerReference.deleteMany();
    // Delete bookings BEFORE providerProfile and user
    await prisma.booking.deleteMany();
    await prisma.providerProfile.deleteMany();
    await prisma.user.deleteMany();
  } catch (error) {
    console.error('❌ Error cleaning database:', error);
    // Force cleanup even if one step fails
    try {
      await prisma.$executeRawUnsafe('TRUNCATE TABLE "Review" CASCADE');
      await prisma.$executeRawUnsafe('TRUNCATE TABLE "Notification" CASCADE');
      await prisma.$executeRawUnsafe('TRUNCATE TABLE "Message" CASCADE');
      await prisma.$executeRawUnsafe('TRUNCATE TABLE "Favorite" CASCADE');
      await prisma.$executeRawUnsafe('TRUNCATE TABLE "ProviderReference" CASCADE');
      await prisma.$executeRawUnsafe('TRUNCATE TABLE "Booking" CASCADE');
      await prisma.$executeRawUnsafe('TRUNCATE TABLE "ProviderProfile" CASCADE');
      await prisma.$executeRawUnsafe('TRUNCATE TABLE "User" CASCADE');
    } catch (truncateError) {
      console.error('❌ Error truncating tables:', truncateError);
    }
  }
});

afterAll(async () => {
  // Disconnect from test database
  await prisma.$disconnect();
  console.log('🧪 Test database disconnected');
});
