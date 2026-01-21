import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../index.js';
import { createTestClient, createTestProvider, cleanDatabase } from './helpers.js';

describe('Auth Routes', () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  describe('POST /api/auth/signup', () => {
    it('should register a new provider successfully', async () => {
      const providerData = {
        email: 'newprovider@test.com',
        password: 'password123',
        name: 'New Provider',
        phone: '1234567890',
        serviceCategory: 'PLOMERIA',
        serviceDescription: 'Professional plumber',
        experience: 5,
        pricePerHour: 1500,
        location: 'Buenos Aires',
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(providerData)
        .expect(201);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(providerData.email);
      expect(response.body.user.role).toBe('PROVIDER');
      expect(response.body.user).not.toHaveProperty('password');
      expect(response.body.user.providerProfile).toBeDefined();
      expect(response.body.user.providerProfile.serviceCategory).toBe('PLOMERIA');
    });

    it('should fail with missing required fields', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          email: 'test@test.com',
          password: 'password123',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('requeridos');
    });

    it('should fail with short password', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          email: 'test@test.com',
          password: '12345',
          name: 'Test User',
          serviceCategory: 'PLOMERIA',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('6 caracteres');
    });

    it('should fail with duplicate email', async () => {
      const existingProvider = await createTestProvider({
        email: 'existing@test.com',
      });

      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          email: 'existing@test.com',
          password: 'password123',
          name: 'New Provider',
          serviceCategory: 'ELECTRICIDAD',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('registrado');
    });
  });

  describe('POST /api/auth/signup-client', () => {
    it('should register a new client successfully', async () => {
      const clientData = {
        email: 'newclient@test.com',
        password: 'password123',
        name: 'New Client',
        phone: '1234567890',
      };

      const response = await request(app)
        .post('/api/auth/signup-client')
        .send(clientData)
        .expect(201);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(clientData.email);
      expect(response.body.user.role).toBe('CLIENT');
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('should fail with missing required fields', async () => {
      const response = await request(app)
        .post('/api/auth/signup-client')
        .send({
          email: 'test@test.com',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should fail with duplicate email', async () => {
      await createTestClient({ email: 'existing@test.com' });

      const response = await request(app)
        .post('/api/auth/signup-client')
        .send({
          email: 'existing@test.com',
          password: 'password123',
          name: 'New Client',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('registrado');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      const provider = await createTestProvider({
        email: 'provider@test.com',
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'provider@test.com',
          password: 'password123',
        })
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe('provider@test.com');
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('should fail with invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@test.com',
          password: 'password123',
        })
        .expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('incorrectos');
    });

    it('should fail with invalid password', async () => {
      await createTestClient({ email: 'client@test.com' });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'client@test.com',
          password: 'wrongpassword',
        })
        .expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('incorrectos');
    });

    it('should fail with missing credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@test.com',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return current user with valid token', async () => {
      const provider = await createTestProvider({
        email: 'provider@test.com',
      });

      // First login to get token
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'provider@test.com',
          password: 'password123',
        });

      const token = loginResponse.body.token;

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('email');
      expect(response.body.email).toBe('provider@test.com');
      expect(response.body).not.toHaveProperty('password');
    });

    it('should fail without token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    it('should fail with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid_token')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });
});
