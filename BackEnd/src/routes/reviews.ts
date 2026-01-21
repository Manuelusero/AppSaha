import express from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../db/prisma.js';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_change_this';

// Middleware de autenticación
const authenticateToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
    (req as any).user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

// POST /api/reviews - Crear una reseña (solo clientes, solo para bookings completados)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;
    const userId = (req as any).user.userId;
    const userRole = (req as any).user.role;

    // Validaciones
    if (!bookingId || rating === undefined || rating === null) {
      return res.status(400).json({ 
        error: 'bookingId y rating son requeridos' 
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ 
        error: 'El rating debe ser entre 1 y 5' 
      });
    }

    if (userRole !== 'CLIENT') {
      return res.status(403).json({ 
        error: 'Solo los clientes pueden crear reseñas' 
      });
    }

    // Verificar que el booking existe y pertenece al usuario
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        review: true
      }
    });

    if (!booking) {
      return res.status(404).json({ 
        error: 'Booking no encontrado' 
      });
    }

    if (booking.clientId !== userId) {
      return res.status(403).json({ 
        error: 'No tienes permiso para calificar este servicio' 
      });
    }

    if (booking.status !== 'COMPLETED') {
      return res.status(400).json({ 
        error: 'Solo puedes calificar servicios completados' 
      });
    }

    // Verificar que no exista ya una reseña para este booking
    if (booking.review) {
      return res.status(400).json({ 
        error: 'Ya has calificado este servicio' 
      });
    }

    // Crear la reseña
    const review = await prisma.review.create({
      data: {
        bookingId,
        clientId: userId,
        providerId: booking.providerId,
        rating,
        comment: comment || null
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    });

    // Actualizar el rating promedio del proveedor
    const providerReviews = await prisma.review.findMany({
      where: { providerId: booking.providerId },
      select: { rating: true }
    });

    const totalRating = providerReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = totalRating / providerReviews.length;

    await prisma.providerProfile.update({
      where: { id: booking.providerId },
      data: {
        rating: avgRating,
        totalReviews: providerReviews.length
      }
    });

    // Crear notificación para el proveedor
    const provider = await prisma.providerProfile.findUnique({
      where: { id: booking.providerId },
      select: { userId: true }
    });

    if (provider) {
      await prisma.notification.create({
        data: {
          userId: provider.userId,
          type: 'NEW_REVIEW',
          title: 'Nueva reseña recibida',
          message: `Has recibido una calificación de ${rating} estrellas`,
          metadata: JSON.stringify({ 
            reviewId: review.id, 
            bookingId,
            rating 
          })
        }
      });
    }

    res.status(201).json({
      message: 'Reseña creada exitosamente',
      review,
      newProviderRating: avgRating
    });

  } catch (error) {
    console.error('Error al crear reseña:', error);
    res.status(500).json({ 
      error: 'Error al crear reseña' 
    });
  }
});

// GET /api/reviews/provider/:providerId - Obtener todas las reseñas de un proveedor
router.get('/provider/:providerId', async (req, res) => {
  try {
    const { providerId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Obtener reseñas con paginación
    const reviews = await prisma.review.findMany({
      where: { providerId },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        booking: {
          select: {
            serviceDate: true,
            description: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    });

    // Contar total de reseñas
    const totalReviews = await prisma.review.count({
      where: { providerId }
    });

    // Calcular distribución de ratings
    const ratingDistribution = await prisma.review.groupBy({
      by: ['rating'],
      where: { providerId },
      _count: { rating: true }
    });

    // Obtener info del proveedor
    const provider = await prisma.providerProfile.findUnique({
      where: { id: providerId },
      select: {
        rating: true,
        totalReviews: true
      }
    });

    res.json({
      reviews,
      pagination: {
        page,
        limit,
        total: totalReviews,
        totalPages: Math.ceil(totalReviews / limit)
      },
      stats: {
        averageRating: provider?.rating || 0,
        totalReviews: provider?.totalReviews || 0,
        ratingDistribution
      }
    });

  } catch (error) {
    console.error('Error al obtener reseñas:', error);
    res.status(500).json({ 
      error: 'Error al obtener reseñas' 
    });
  }
});

// GET /api/reviews/booking/:bookingId - Obtener la reseña de un booking específico
router.get('/booking/:bookingId', async (req, res) => {
  try {
    const { bookingId } = req.params;

    const review = await prisma.review.findUnique({
      where: { bookingId },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        provider: {
          include: {
            user: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });

    if (!review) {
      return res.status(404).json({ 
        error: 'Reseña no encontrada' 
      });
    }

    res.json(review);

  } catch (error) {
    console.error('Error al obtener reseña:', error);
    res.status(500).json({ 
      error: 'Error al obtener reseña' 
    });
  }
});

// PATCH /api/reviews/:id/response - Proveedor responde a una reseña
router.patch('/:id/response', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { providerResponse } = req.body;
    const userId = (req as any).user.userId;
    const userRole = (req as any).user.role;

    if (userRole !== 'PROVIDER') {
      return res.status(403).json({ 
        error: 'Solo los proveedores pueden responder reseñas' 
      });
    }

    if (!providerResponse) {
      return res.status(400).json({ 
        error: 'La respuesta no puede estar vacía' 
      });
    }

    // Verificar que la reseña existe y pertenece al proveedor
    const review = await prisma.review.findUnique({
      where: { id },
      include: {
        provider: {
          select: { userId: true }
        }
      }
    });

    if (!review) {
      return res.status(404).json({ 
        error: 'Reseña no encontrada' 
      });
    }

    if (review.provider.userId !== userId) {
      return res.status(403).json({ 
        error: 'No tienes permiso para responder esta reseña' 
      });
    }

    // Actualizar la reseña con la respuesta
    const updatedReview = await prisma.review.update({
      where: { id },
      data: {
        providerResponse,
        respondedAt: new Date()
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    });

    // Notificar al cliente
    await prisma.notification.create({
      data: {
        userId: review.clientId,
        type: 'SYSTEM',
        title: 'El proveedor respondió tu reseña',
        message: 'Un proveedor ha respondido a tu calificación',
        metadata: JSON.stringify({ 
          reviewId: id,
          providerId: review.providerId
        })
      }
    });

    res.json({
      message: 'Respuesta agregada exitosamente',
      review: updatedReview
    });

  } catch (error) {
    console.error('Error al responder reseña:', error);
    res.status(500).json({ 
      error: 'Error al responder reseña' 
    });
  }
});

// GET /api/reviews/client/:clientId - Obtener todas las reseñas hechas por un cliente
router.get('/client/:clientId', async (req, res) => {
  try {
    const { clientId } = req.params;

    const reviews = await prisma.review.findMany({
      where: { clientId },
      include: {
        provider: {
          include: {
            user: {
              select: {
                name: true,
                avatar: true
              }
            }
          }
        },
        booking: {
          select: {
            serviceDate: true,
            description: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(reviews);

  } catch (error) {
    console.error('Error al obtener reseñas del cliente:', error);
    res.status(500).json({ 
      error: 'Error al obtener reseñas' 
    });
  }
});

export default router;
