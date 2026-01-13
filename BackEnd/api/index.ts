import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { url, method } = req;

  // Health check endpoint
  if (url === '/api/health' || url === '/health') {
    return res.status(200).json({
      status: 'OK',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      prisma: 'connected'
    });
  }

  // Root endpoint
  if (url === '/' || url === '/api' || url === '/api/') {
    return res.status(200).json({
      message: 'Backend API funcionando correctamente! 🚀',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'production'
    });
  }

  // For other routes, return not implemented for now
  return res.status(404).json({
    error: 'Ruta no encontrada',
    path: url,
    message: 'API endpoints en desarrollo'
  });
}
