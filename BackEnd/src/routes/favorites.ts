import express from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../db/prisma.js';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_change_this';

const authenticateToken = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Token no proporcionado' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

// GET /api/favorites
// Returns all favorite providers for the authenticated client
router.get('/', authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user.userId;

    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: {
        provider: {
          include: {
            user: {
              select: { id: true, name: true, email: true, phone: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(favorites);
  } catch (error) {
    console.error('Error al obtener favoritos:', error);
    res.status(500).json({ error: 'Error al obtener favoritos' });
  }
});

// POST /api/favorites/:providerId
// Add a provider to favorites
router.post('/:providerId', authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user.userId;
    const { providerId } = req.params;

    // Validate provider exists
    const provider = await prisma.providerProfile.findUnique({ where: { id: providerId } });
    if (!provider) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }

    // Upsert to avoid duplicates (schema has @@unique([userId, providerId]))
    const favorite = await prisma.favorite.upsert({
      where: { userId_providerId: { userId, providerId } },
      update: {},
      create: { userId, providerId },
      include: {
        provider: {
          include: {
            user: { select: { id: true, name: true } },
          },
        },
      },
    });

    res.status(201).json({ message: 'Proveedor añadido a favoritos', favorite });
  } catch (error) {
    console.error('Error al agregar favorito:', error);
    res.status(500).json({ error: 'Error al agregar favorito' });
  }
});

// DELETE /api/favorites/:providerId
// Remove a provider from favorites
router.delete('/:providerId', authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user.userId;
    const { providerId } = req.params;

    const existing = await prisma.favorite.findUnique({
      where: { userId_providerId: { userId, providerId } },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Favorito no encontrado' });
    }

    await prisma.favorite.delete({
      where: { userId_providerId: { userId, providerId } },
    });

    res.json({ message: 'Proveedor eliminado de favoritos' });
  } catch (error) {
    console.error('Error al eliminar favorito:', error);
    res.status(500).json({ error: 'Error al eliminar favorito' });
  }
});

// GET /api/favorites/check/:providerId
// Returns whether a provider is in the user's favorites
router.get('/check/:providerId', authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user.userId;
    const { providerId } = req.params;

    const favorite = await prisma.favorite.findUnique({
      where: { userId_providerId: { userId, providerId } },
    });

    res.json({ isFavorite: !!favorite });
  } catch (error) {
    res.status(500).json({ error: 'Error al verificar favorito' });
  }
});

export default router;
