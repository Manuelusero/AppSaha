import { User, ServiceCategory } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from './setup.js'; // Import shared prisma instance

const JWT_SECRET = process.env.JWT_SECRET || 'test_secret';

// Counter for unique emails
let emailCounter = 0;

/**
 * Create a test client user
 */
export async function createTestClient(data?: Partial<User>) {
  const hashedPassword = await bcrypt.hash('password123', 10);

  return await prisma.user.create({
    data: {
      email: data?.email || `client-${Date.now()}-${++emailCounter}@test.com`,
      password: hashedPassword,
      name: data?.name || 'Test Client',
      phone: data?.phone || '1234567890',
      role: 'CLIENT',
    },
  });
}

/**
 * Create a test admin user
 */
export async function createTestAdmin(data?: Partial<User>) {
  const hashedPassword = await bcrypt.hash('password123', 10);

  return await prisma.user.create({
    data: {
      email: data?.email || `admin-${Date.now()}-${++emailCounter}@test.com`,
      password: hashedPassword,
      name: data?.name || 'Test Admin',
      phone: data?.phone || '1234567890',
      role: 'ADMIN',
    },
  });
}

/**
 * Create a test provider user with profile
 */
export async function createTestProvider(
  data?: Partial<User>,
  profileData?: { 
    serviceCategory?: ServiceCategory;
    serviceDescription?: string;
    experience?: number;
    pricePerHour?: number;
    location?: string;
  }
) {
  const hashedPassword = await bcrypt.hash('password123', 10);

  return await prisma.user.create({
    data: {
      email: data?.email || `provider-${Date.now()}-${++emailCounter}@test.com`,
      password: hashedPassword,
      name: data?.name || 'Test Provider',
      phone: data?.phone || '1234567890',
      role: 'PROVIDER',
      providerProfile: {
        create: {
          serviceCategory: profileData?.serviceCategory || 'PLOMERIA',
          serviceDescription: profileData?.serviceDescription || 'Test service description',
          experience: profileData?.experience || 5,
          pricePerHour: profileData?.pricePerHour || 1000,
          location: profileData?.location || 'Buenos Aires',
        },
      },
    },
    include: {
      providerProfile: true,
    },
  });
}

/**
 * Generate JWT token for testing
 */
export function generateTestToken(userId: string, email: string, role: string) {
  return jwt.sign({ userId, email, role }, JWT_SECRET, { expiresIn: '7d' });
}

/**
 * Create a test booking
 * @param clientId - User ID of the client
 * @param providerUserId - User ID of the provider (will look up ProviderProfile)
 */
export async function createTestBooking(clientId: string, providerUserId: string) {
  // Find the provider profile for this user
  const providerProfile = await prisma.providerProfile.findUnique({
    where: { userId: providerUserId },
  });

  if (!providerProfile) {
    throw new Error(`ProviderProfile not found for user ${providerUserId}`);
  }

  return await prisma.booking.create({
    data: {
      clientId,
      providerId: providerProfile.id, // Use ProviderProfile ID, not User ID
      serviceDate: new Date(Date.now() + 86400000), // Tomorrow
      description: 'Test booking description',
      address: 'Test address 123',
      location: 'Buenos Aires',
      status: 'PENDING',
    },
  });
}

/**
 * Create a test review
 * @param bookingId - Booking ID
 * @param clientId - User ID of the client
 * @param providerUserId - User ID of the provider (will look up ProviderProfile)
 * @param rating - Rating value (1-5)
 */
export async function createTestReview(
  bookingId: string,
  clientId: string,
  providerUserId: string,
  rating: number = 5
) {
  // Find the provider profile for this user
  const providerProfile = await prisma.providerProfile.findUnique({
    where: { userId: providerUserId },
  });

  if (!providerProfile) {
    throw new Error(`ProviderProfile not found for user ${providerUserId}`);
  }

  const review = await prisma.review.create({
    data: {
      bookingId,
      clientId,
      providerId: providerProfile.id, // Use ProviderProfile ID, not User ID
      rating,
      comment: 'Test review comment',
    },
  });

  // Update provider's average rating
  const providerReviews = await prisma.review.findMany({
    where: { providerId: providerProfile.id },
    select: { rating: true }
  });

  const totalRating = providerReviews.reduce((sum, r) => sum + r.rating, 0);
  const avgRating = totalRating / providerReviews.length;

  await prisma.providerProfile.update({
    where: { id: providerProfile.id },
    data: {
      rating: avgRating,
      totalReviews: providerReviews.length
    }
  });

  return review;
}

/**
 * Clean all test data
 */
export async function cleanDatabase() {
  await prisma.review.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.message.deleteMany();
  await prisma.providerReference.deleteMany();
  await prisma.providerProfile.deleteMany();
  await prisma.user.deleteMany();
}
