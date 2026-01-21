import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../index.js';
import {
  createTestClient,
  createTestProvider,
  createTestBooking,
  createTestAdmin,
  generateTestToken,
  cleanDatabase,
} from './helpers.js';

describe('Booking Routes', () => {

  describe('POST /api/bookings', () => {
    it('should create a booking successfully', async () => {
      const client = await createTestClient();
      const provider = await createTestProvider();
      const token = generateTestToken(client.id, client.email, 'CLIENT');

      const bookingData = {
        providerId: provider.providerProfile!.id, // Use ProviderProfile ID
        serviceDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        description: 'Need plumbing repair',
        address: 'Test Street 123',
        location: 'Buenos Aires',
      };

      const response = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${token}`)
        .send(bookingData)
        .expect(201);

      expect(response.body).toHaveProperty('booking');
      expect(response.body.booking.clientId).toBe(client.id);
      expect(response.body.booking.providerId).toBe(provider.providerProfile!.id);
      expect(response.body.booking.status).toBe('PENDING');
      expect(response.body.booking.description).toBe(bookingData.description);
    });

    it('should fail without authentication', async () => {
      const provider = await createTestProvider();

      const response = await request(app)
        .post('/api/bookings')
        .send({
          providerId: provider.providerProfile!.id,
          serviceDate: new Date(Date.now() + 86400000).toISOString(),
          description: 'Test booking',
        })
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    it('should fail with missing required fields', async () => {
      const client = await createTestClient();
      const token = generateTestToken(client.id, client.email, 'CLIENT');

      const response = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${token}`)
        .send({
          description: 'Test booking',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should fail with past date', async () => {
      const client = await createTestClient();
      const provider = await createTestProvider();
      const token = generateTestToken(client.id, client.email, 'CLIENT');

      const response = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${token}`)
        .send({
          providerId: provider.providerProfile!.id,
          serviceDate: new Date(Date.now() - 86400000).toISOString(), // Yesterday
          description: 'Test booking',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('futuro');
    });

    it('should fail with non-existent provider', async () => {
      const client = await createTestClient();
      const token = generateTestToken(client.id, client.email, 'CLIENT');

      const response = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${token}`)
        .send({
          providerId: 'non-existent-id',
          serviceDate: new Date(Date.now() + 86400000).toISOString(),
          description: 'Test booking',
        })
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/bookings', () => {
    it('should return bookings for authenticated user', async () => {
      const client = await createTestClient();
      const provider = await createTestProvider();
      const token = generateTestToken(client.id, client.email, 'CLIENT');

      // Create a booking
      await createTestBooking(client.id, provider.id);

      const response = await request(app)
        .get('/api/bookings')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].clientId).toBe(client.id);
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .get('/api/bookings')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    it('should return empty array when no bookings', async () => {
      const client = await createTestClient();
      const token = generateTestToken(client.id, client.email, 'CLIENT');

      const response = await request(app)
        .get('/api/bookings')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toEqual([]);
    });
  });

  describe('GET /api/bookings/:id', () => {
    it('should return booking details', async () => {
      const client = await createTestClient();
      const provider = await createTestProvider();
      const token = generateTestToken(client.id, client.email, 'CLIENT');
      const booking = await createTestBooking(client.id, provider.id);

      const response = await request(app)
        .get(`/api/bookings/${booking.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.id).toBe(booking.id);
      expect(response.body).toHaveProperty('provider');
      expect(response.body).toHaveProperty('client');
    });

    it('should fail for non-existent booking', async () => {
      const client = await createTestClient();
      const token = generateTestToken(client.id, client.email, 'CLIENT');

      const response = await request(app)
        .get('/api/bookings/non-existent-id')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });

    it('should fail without authentication', async () => {
      const client = await createTestClient();
      const provider = await createTestProvider();
      const booking = await createTestBooking(client.id, provider.id);

      const response = await request(app)
        .get(`/api/bookings/${booking.id}`)
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PATCH /api/bookings/:id/status', () => {
    it('should allow provider to accept booking', async () => {
      const client = await createTestClient();
      const provider = await createTestProvider();
      const providerToken = generateTestToken(provider.id, provider.email, 'PROVIDER');
      const booking = await createTestBooking(client.id, provider.id);

      const response = await request(app)
        .patch(`/api/bookings/${booking.id}/status`)
        .set('Authorization', `Bearer ${providerToken}`)
        .send({ status: 'ACCEPTED' })
        .expect(200);

      expect(response.body.booking.status).toBe('ACCEPTED');
      expect(response.body.booking).toHaveProperty('acceptedAt');
    });

    it('should allow provider to reject booking', async () => {
      const client = await createTestClient();
      const provider = await createTestProvider();
      const providerToken = generateTestToken(provider.id, provider.email, 'PROVIDER');
      const booking = await createTestBooking(client.id, provider.id);

      const response = await request(app)
        .patch(`/api/bookings/${booking.id}/status`)
        .set('Authorization', `Bearer ${providerToken}`)
        .send({ status: 'REJECTED' })
        .expect(200);

      expect(response.body.booking.status).toBe('REJECTED');
      expect(response.body.booking).toHaveProperty('rejectedAt');
    });

    it('should allow client to cancel booking', async () => {
      const client = await createTestClient();
      const provider = await createTestProvider();
      const clientToken = generateTestToken(client.id, client.email, 'CLIENT');
      const booking = await createTestBooking(client.id, provider.id);

      const response = await request(app)
        .patch(`/api/bookings/${booking.id}/status`)
        .set('Authorization', `Bearer ${clientToken}`)
        .send({ 
          status: 'CANCELLED',
          cancellationReason: 'Changed my mind'
        })
        .expect(200);

      expect(response.body.booking.status).toBe('CANCELLED');
      expect(response.body.booking.cancellationReason).toBe('Changed my mind');
    });

    it('should fail with invalid status transition', async () => {
      const client = await createTestClient();
      const provider = await createTestProvider();
      const providerToken = generateTestToken(provider.id, provider.email, 'PROVIDER');
      const booking = await createTestBooking(client.id, provider.id);

      const response = await request(app)
        .patch(`/api/bookings/${booking.id}/status`)
        .set('Authorization', `Bearer ${providerToken}`)
        .send({ status: 'COMPLETED' })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should fail when unauthorized user tries to update', async () => {
      const client = await createTestClient();
      const provider = await createTestProvider();
      const otherUser = await createTestClient({ email: 'other@test.com' });
      const otherToken = generateTestToken(otherUser.id, otherUser.email, 'CLIENT');
      const booking = await createTestBooking(client.id, provider.id);

      const response = await request(app)
        .patch(`/api/bookings/${booking.id}/status`)
        .set('Authorization', `Bearer ${otherToken}`)
        .send({ status: 'CANCELLED' })
        .expect(403);

      expect(response.body).toHaveProperty('error');
    });

    it('should fail without authentication', async () => {
      const client = await createTestClient();
      const provider = await createTestProvider();
      const booking = await createTestBooking(client.id, provider.id);

      const response = await request(app)
        .patch(`/api/bookings/${booking.id}/status`)
        .send({ status: 'ACCEPTED' })
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('DELETE /api/bookings/:id', () => {
    it('should allow admin to delete booking', async () => {
      const client = await createTestClient();
      const provider = await createTestProvider();
      const booking = await createTestBooking(client.id, provider.id);

      // Create admin user
      const admin = await createTestAdmin({ 
        email: 'admin@test.com',
        name: 'Admin User'
      });

      const adminToken = generateTestToken(admin.id, admin.email, 'ADMIN');

      const response = await request(app)
        .delete(`/api/bookings/${booking.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message');
    });
  });
});
