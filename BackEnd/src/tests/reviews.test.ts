import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../index.js';
import {
  createTestClient,
  createTestProvider,
  createTestBooking,
  createTestReview,
  generateTestToken,
  cleanDatabase,
} from './helpers.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Review Routes', () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  describe('POST /api/reviews', () => {
    it('should create a review for completed booking', async () => {
      const client = await createTestClient();
      const provider = await createTestProvider();
      const token = generateTestToken(client.id, client.email, 'CLIENT');

      // Create and complete booking
      const booking = await createTestBooking(client.id, provider.id);
      await prisma.booking.update({
        where: { id: booking.id },
        data: { 
          status: 'COMPLETED',
          completedAt: new Date(),
        },
      });

      const reviewData = {
        bookingId: booking.id,
        rating: 5,
        comment: 'Excellent service!',
      };

      const response = await request(app)
        .post('/api/reviews')
        .set('Authorization', `Bearer ${token}`)
        .send(reviewData)
        .expect(201);

      expect(response.body).toHaveProperty('review');
      expect(response.body.review.rating).toBe(5);
      expect(response.body.review.comment).toBe('Excellent service!');
      expect(response.body.review.clientId).toBe(client.id);
      expect(response.body.review.providerId).toBe(provider.providerProfile!.id);
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .post('/api/reviews')
        .send({
          bookingId: 'some-id',
          rating: 5,
          comment: 'Great!',
        })
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    it('should fail with invalid rating (less than 1)', async () => {
      const client = await createTestClient();
      const provider = await createTestProvider();
      const token = generateTestToken(client.id, client.email, 'CLIENT');
      const booking = await createTestBooking(client.id, provider.id);

      await prisma.booking.update({
        where: { id: booking.id },
        data: { status: 'COMPLETED', completedAt: new Date() },
      });

      const response = await request(app)
        .post('/api/reviews')
        .set('Authorization', `Bearer ${token}`)
        .send({
          bookingId: booking.id,
          rating: 0,
          comment: 'Test',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('1 y 5');
    });

    it('should fail with invalid rating (more than 5)', async () => {
      const client = await createTestClient();
      const provider = await createTestProvider();
      const token = generateTestToken(client.id, client.email, 'CLIENT');
      const booking = await createTestBooking(client.id, provider.id);

      await prisma.booking.update({
        where: { id: booking.id },
        data: { status: 'COMPLETED', completedAt: new Date() },
      });

      const response = await request(app)
        .post('/api/reviews')
        .set('Authorization', `Bearer ${token}`)
        .send({
          bookingId: booking.id,
          rating: 6,
          comment: 'Test',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('1 y 5');
    });

    it('should fail for non-completed booking', async () => {
      const client = await createTestClient();
      const provider = await createTestProvider();
      const token = generateTestToken(client.id, client.email, 'CLIENT');
      const booking = await createTestBooking(client.id, provider.id); // PENDING status

      const response = await request(app)
        .post('/api/reviews')
        .set('Authorization', `Bearer ${token}`)
        .send({
          bookingId: booking.id,
          rating: 5,
          comment: 'Great!',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('completado');
    });

    it('should fail for duplicate review on same booking', async () => {
      const client = await createTestClient();
      const provider = await createTestProvider();
      const token = generateTestToken(client.id, client.email, 'CLIENT');
      const booking = await createTestBooking(client.id, provider.id);

      await prisma.booking.update({
        where: { id: booking.id },
        data: { status: 'COMPLETED', completedAt: new Date() },
      });

      // Create first review
      await createTestReview(booking.id, client.id, provider.id, 5);

      // Try to create second review
      const response = await request(app)
        .post('/api/reviews')
        .set('Authorization', `Bearer ${token}`)
        .send({
          bookingId: booking.id,
          rating: 4,
          comment: 'Another review',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('calificado');
    });

    it('should fail when non-client tries to review', async () => {
      const client = await createTestClient();
      const provider = await createTestProvider();
      const otherClient = await createTestClient({ email: 'other@test.com' });
      const otherToken = generateTestToken(otherClient.id, otherClient.email, 'CLIENT');

      const booking = await createTestBooking(client.id, provider.id);
      await prisma.booking.update({
        where: { id: booking.id },
        data: { status: 'COMPLETED', completedAt: new Date() },
      });

      const response = await request(app)
        .post('/api/reviews')
        .set('Authorization', `Bearer ${otherToken}`)
        .send({
          bookingId: booking.id,
          rating: 5,
          comment: 'Great!',
        })
        .expect(403);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/reviews/provider/:providerId', () => {
    it('should return all reviews for a provider', async () => {
      const client1 = await createTestClient({ email: 'client1@test.com' });
      const client2 = await createTestClient({ email: 'client2@test.com' });
      const provider = await createTestProvider();

      // Create bookings and reviews
      const booking1 = await createTestBooking(client1.id, provider.id);
      const booking2 = await createTestBooking(client2.id, provider.id);

      await prisma.booking.updateMany({
        where: { id: { in: [booking1.id, booking2.id] } },
        data: { status: 'COMPLETED', completedAt: new Date() },
      });

      await createTestReview(booking1.id, client1.id, provider.id, 5);
      await createTestReview(booking2.id, client2.id, provider.id, 4);

      const response = await request(app)
        .get(`/api/reviews/provider/${provider.providerProfile!.id}`)
        .expect(200);

      expect(response.body).toHaveProperty('reviews');
      expect(response.body.reviews.length).toBe(2);
      expect(response.body.stats).toHaveProperty('averageRating');
      expect(response.body.stats.averageRating).toBe(4.5);
      expect(response.body.stats).toHaveProperty('totalReviews', 2);
    });

    it('should return empty array for provider without reviews', async () => {
      const provider = await createTestProvider();

      const response = await request(app)
        .get(`/api/reviews/provider/${provider.providerProfile!.id}`)
        .expect(200);

      expect(response.body.reviews).toEqual([]);
      expect(response.body.stats.averageRating).toBe(0);
      expect(response.body.stats.totalReviews).toBe(0);
    });

    it('should return empty array for non-existent provider', async () => {
      const response = await request(app)
        .get('/api/reviews/provider/non-existent-id')
        .expect(200);

      expect(response.body.reviews).toEqual([]);
      expect(response.body.stats.totalReviews).toBe(0);
    });
  });

  describe('GET /api/reviews/booking/:bookingId', () => {
    it('should return review for a booking', async () => {
      const client = await createTestClient();
      const provider = await createTestProvider();
      const token = generateTestToken(client.id, client.email, 'CLIENT');

      const booking = await createTestBooking(client.id, provider.id);
      await prisma.booking.update({
        where: { id: booking.id },
        data: { status: 'COMPLETED', completedAt: new Date() },
      });

      const review = await createTestReview(booking.id, client.id, provider.id, 5);

      const response = await request(app)
        .get(`/api/reviews/booking/${booking.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.id).toBe(review.id);
      expect(response.body.rating).toBe(5);
      expect(response.body).toHaveProperty('client');
      expect(response.body).toHaveProperty('provider');
    });

    it('should return 404 when no review exists', async () => {
      const client = await createTestClient();
      const provider = await createTestProvider();
      const token = generateTestToken(client.id, client.email, 'CLIENT');
      const booking = await createTestBooking(client.id, provider.id);

      const response = await request(app)
        .get(`/api/reviews/booking/${booking.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PATCH /api/reviews/:id/response', () => {
    it('should allow provider to respond to review', async () => {
      const client = await createTestClient();
      const provider = await createTestProvider();
      const providerToken = generateTestToken(provider.id, provider.email, 'PROVIDER');

      const booking = await createTestBooking(client.id, provider.id);
      await prisma.booking.update({
        where: { id: booking.id },
        data: { status: 'COMPLETED', completedAt: new Date() },
      });

      const review = await createTestReview(booking.id, client.id, provider.id, 4);

      const response = await request(app)
        .patch(`/api/reviews/${review.id}/response`)
        .set('Authorization', `Bearer ${providerToken}`)
        .send({
          providerResponse: 'Thank you for your feedback!',
        })
        .expect(200);

      expect(response.body.review.providerResponse).toBe('Thank you for your feedback!');
      expect(response.body.review).toHaveProperty('respondedAt');
    });

    it('should fail when non-provider tries to respond', async () => {
      const client = await createTestClient();
      const provider = await createTestProvider();
      const otherProvider = await createTestProvider({ email: 'other@test.com' });
      const otherToken = generateTestToken(otherProvider.id, otherProvider.email, 'PROVIDER');

      const booking = await createTestBooking(client.id, provider.id);
      await prisma.booking.update({
        where: { id: booking.id },
        data: { status: 'COMPLETED', completedAt: new Date() },
      });

      const review = await createTestReview(booking.id, client.id, provider.id, 4);

      const response = await request(app)
        .patch(`/api/reviews/${review.id}/response`)
        .set('Authorization', `Bearer ${otherToken}`)
        .send({
          providerResponse: 'Unauthorized response',
        })
        .expect(403);

      expect(response.body).toHaveProperty('error');
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .patch('/api/reviews/some-id/response')
        .send({
          providerResponse: 'Test response',
        })
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });
});
