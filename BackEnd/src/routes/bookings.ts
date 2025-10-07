import express from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_change_this';

// Middleware para verificar autenticación
const authenticateToken = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

// POST /api/bookings - Crear una nueva solicitud (requiere autenticación)
router.post('/', authenticateToken, async (req: any, res) => {
  try {
    const {
      providerId,
      serviceDate,
      serviceTime,
      description,
      address,
      estimatedHours,
      clientNotes
    } = req.body;

    // Validaciones
    if (!providerId || !serviceDate || !description) {
      return res.status(400).json({
        error: 'Proveedor, fecha y descripción son requeridos'
      });
    }

    // Verificar que el proveedor existe
    const provider = await prisma.providerProfile.findUnique({
      where: { id: providerId }
    });

    if (!provider) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }

    // Crear la solicitud
    const booking = await prisma.booking.create({
      data: {
        clientId: req.user.userId,
        providerId,
        serviceDate: new Date(serviceDate),
        serviceTime,
        description,
        address,
        estimatedHours: estimatedHours ? parseFloat(estimatedHours) : null,
        clientNotes,
        status: 'PENDING'
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        provider: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true
              }
            }
          }
        }
      }
    });

    res.status(201).json({
      message: 'Solicitud creada exitosamente',
      booking
    });

  } catch (error) {
    console.error('Error al crear solicitud:', error);
    res.status(500).json({ error: 'Error al crear solicitud' });
  }
});

// GET /api/bookings - Listar solicitudes del usuario (requiere autenticación)
router.get('/', authenticateToken, async (req: any, res) => {
  try {
    const { status, role } = req.query;
    const userId = req.user.userId;
    const userRole = req.user.role;

    let where: any = {};

    // Si es proveedor, mostrar solicitudes recibidas
    if (userRole === 'PROVIDER') {
      const providerProfile = await prisma.providerProfile.findUnique({
        where: { userId }
      });

      if (!providerProfile) {
        return res.status(404).json({ error: 'Perfil de proveedor no encontrado' });
      }

      where.providerId = providerProfile.id;
    } else {
      // Si es cliente, mostrar solicitudes realizadas
      where.clientId = userId;
    }

    // Filtrar por estado si se proporciona
    if (status) {
      where.status = status;
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        provider: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(bookings);

  } catch (error) {
    console.error('Error al obtener solicitudes:', error);
    res.status(500).json({ error: 'Error al obtener solicitudes' });
  }
});

// GET /api/bookings/:id - Obtener una solicitud específica
router.get('/:id', authenticateToken, async (req: any, res) => {
  try {
    const { id } = req.params;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        provider: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true
              }
            }
          }
        }
      }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }

    // Verificar que el usuario tiene acceso a esta solicitud
    const userId = req.user.userId;
    const providerProfile = await prisma.providerProfile.findUnique({
      where: { userId }
    });

    const isClient = booking.clientId === userId;
    const isProvider = providerProfile && booking.providerId === providerProfile.id;

    if (!isClient && !isProvider) {
      return res.status(403).json({ error: 'No tienes permiso para ver esta solicitud' });
    }

    res.json(booking);

  } catch (error) {
    console.error('Error al obtener solicitud:', error);
    res.status(500).json({ error: 'Error al obtener solicitud' });
  }
});

// PATCH /api/bookings/:id/status - Actualizar estado de la solicitud (solo proveedor)
router.patch('/:id/status', authenticateToken, async (req: any, res) => {
  try {
    const { id } = req.params;
    const { status, providerNotes, totalPrice } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Estado es requerido' });
    }

    // Verificar que el usuario es el proveedor de esta solicitud
    const userId = req.user.userId;
    const providerProfile = await prisma.providerProfile.findUnique({
      where: { userId }
    });

    if (!providerProfile) {
      return res.status(403).json({ error: 'Solo los proveedores pueden actualizar solicitudes' });
    }

    const booking = await prisma.booking.findUnique({
      where: { id }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }

    if (booking.providerId !== providerProfile.id) {
      return res.status(403).json({ error: 'No tienes permiso para actualizar esta solicitud' });
    }

    // Actualizar la solicitud
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        status,
        providerNotes,
        totalPrice: totalPrice ? parseFloat(totalPrice) : undefined
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        provider: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true
              }
            }
          }
        }
      }
    });

    res.json({
      message: 'Solicitud actualizada exitosamente',
      booking: updatedBooking
    });

  } catch (error) {
    console.error('Error al actualizar solicitud:', error);
    res.status(500).json({ error: 'Error al actualizar solicitud' });
  }
});

export default router;
