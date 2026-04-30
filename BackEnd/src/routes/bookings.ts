import express from 'express';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import prisma from '../db/prisma.js';
import { uploadProblemPhoto } from '../middleware/upload.js';
import {
  sendClientConfirmationEmail,
  sendClientConfirmationWhatsApp,
  sendBudgetToClientEmail,
  sendBudgetToClientWhatsApp,
  sendProviderNewBookingNotification
} from '../utils/notifications.js';

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

// POST /api/bookings/guest - Crear solicitud sin autenticación (clientes invitados)
router.post('/guest', uploadProblemPhoto, async (req: any, res) => {
  try {
    const {
      providerId,
      clientName,
      clientEmail,
      clientPhone,
      contactMethod,
      serviceDate,
      description,
      urgency,
      location
    } = req.body;

    // Obtener URL/nombre del archivo subido (si existe)
    // req.file.path = full Cloudinary https URL (production)
    // req.file.filename = local filename (development)
    const problemPhotoFilename = req.file
      ? (req.file.path?.startsWith('http') ? req.file.path : req.file.filename)
      : null;

    console.log('📥 Solicitud de cliente invitado recibida:', {
      providerId,
      clientName,
      contactMethod,
      urgency,
      location,
      problemPhoto: problemPhotoFilename
    });

    // Validaciones
    if (!providerId || !clientName || !description || !contactMethod) {
      return res.status(400).json({
        error: 'Proveedor, nombre, descripción y método de contacto son requeridos'
      });
    }

    // Validar que tenga el dato de contacto correcto
    if (contactMethod === 'Mail' && !clientEmail) {
      return res.status(400).json({ error: 'Email es requerido' });
    }
    if ((contactMethod === 'Whatsapp' || contactMethod === 'Mensaje de texto') && !clientPhone) {
      return res.status(400).json({ error: 'Teléfono es requerido' });
    }

    // Verificar que el proveedor existe
    // El providerId puede ser el User ID o el ProviderProfile ID
    let provider = await prisma.providerProfile.findUnique({
      where: { id: providerId },
      include: {
        user: true
      }
    });

    // Si no se encuentra, intentar buscar por userId
    if (!provider) {
      provider = await prisma.providerProfile.findUnique({
        where: { userId: providerId },
        include: {
          user: true
        }
      });
    }

    if (!provider) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }

    // Crear la solicitud SIN usuario (guest booking)
    const booking = await prisma.booking.create({
      data: {
        clientId: null, // Sin usuario registrado
        clientName: clientName,
        clientEmail: clientEmail || null,
        clientPhone: clientPhone || null,
        clientContactMethod: contactMethod,
        providerId: provider.id,
        serviceDate: new Date(serviceDate || new Date()),
        serviceTime: '',
        description,
        address: '',
        location: location || 'No especificada',
        problemPhoto: problemPhotoFilename,
        clientNotes: `Urgencia: ${urgency || 'Media'}`,
        status: 'PENDING'
      },
      include: {
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

    console.log('✅ Solicitud creada exitosamente:', booking.id);

    // ENVIAR NOTIFICACIÓN INMEDIATA AL CLIENTE
    try {
      if (contactMethod === 'Mail' && clientEmail) {
        await sendClientConfirmationEmail(clientEmail, clientName, booking.id);
      } else if ((contactMethod === 'Whatsapp' || contactMethod === 'Mensaje de texto') && clientPhone) {
        await sendClientConfirmationWhatsApp(clientPhone, clientName, booking.id);
      }
    } catch (notifError) {
      console.error('⚠️ Error al enviar notificación al cliente:', notifError);
      // No fallar la request por error de notificación
    }

    // NOTIFICAR AL PROFESIONAL
    try {
      await sendProviderNewBookingNotification(
        provider.user.email,
        provider.user.name,
        {
          id: booking.id,
          clientName,
          description,
          location: location || 'No especificada',
          urgency
        }
      );
    } catch (notifError) {
      console.error('⚠️ Error al enviar notificación al profesional:', notifError);
      // No fallar la request por error de notificación
    }

    res.status(201).json({
      success: true,
      message: 'Solicitud enviada exitosamente',
      booking: {
        id: booking.id,
        providerName: provider.user.name,
        status: booking.status
      }
    });

  } catch (error) {
    console.error('❌ Error al crear solicitud de invitado:', error);
    res.status(500).json({ error: 'Error al crear solicitud' });
  }
});

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

    // Validar que la fecha sea en el futuro
    const requestedDate = new Date(serviceDate);
    const now = new Date();
    if (requestedDate < now) {
      return res.status(400).json({
        error: 'La fecha del servicio debe ser en el futuro'
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
    const { status, providerNotes, totalPrice, cancellationReason } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Estado es requerido' });
    }

    const userId = req.user.userId;
    const userRole = req.user.role;

    const booking = await prisma.booking.findUnique({
      where: { id }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }

    // Allow client to cancel their own bookings
    if (status === 'CANCELLED' && userRole === 'CLIENT' && booking.clientId === userId) {
      const updatedBooking = await prisma.booking.update({
        where: { id },
        data: {
          status: 'CANCELLED',
          cancelledAt: new Date(),
          cancellationReason
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

      return res.json({
        message: 'Solicitud cancelada exitosamente',
        booking: updatedBooking
      });
    }

    // For other status changes, verify user is the provider
    const providerProfile = await prisma.providerProfile.findUnique({
      where: { userId }
    });

    if (!providerProfile) {
      return res.status(403).json({ error: 'Solo los proveedores pueden actualizar solicitudes' });
    }

    if (booking.providerId !== providerProfile.id) {
      return res.status(403).json({ error: 'No tienes permiso para actualizar esta solicitud' });
    }

    // Validate status transitions
    const validTransitions: Record<string, string[]> = {
      'PENDING': ['ACCEPTED', 'REJECTED', 'CANCELLED'],
      'ACCEPTED': ['CONFIRMED', 'CANCELLED'],
      'REJECTED': [], // Cannot transition from rejected
      'CONFIRMED': ['IN_PROGRESS', 'CANCELLED'],
      'IN_PROGRESS': ['COMPLETED', 'CANCELLED'],
      'COMPLETED': [], // Cannot transition from completed
      'CANCELLED': [] // Cannot transition from cancelled
    };

    const allowedStatuses = validTransitions[booking.status] || [];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        error: `No se puede cambiar de ${booking.status} a ${status}`
      });
    }

    // Actualizar la solicitud
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        status,
        providerNotes,
        totalPrice: totalPrice ? parseFloat(totalPrice) : undefined,
        acceptedAt: status === 'ACCEPTED' ? new Date() : undefined,
        rejectedAt: status === 'REJECTED' ? new Date() : undefined,
        completedAt: status === 'COMPLETED' ? new Date() : undefined,
        cancelledAt: status === 'CANCELLED' ? new Date() : undefined,
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

// POST /api/bookings/:id/send-budget - Proveedor envía presupuesto
router.post('/:id/send-budget', authenticateToken, async (req: any, res) => {
  try {
    const { id } = req.params;
    const {
      budgetPrice,
      budgetDetails,
      budgetMaterials,
      budgetTime
    } = req.body;

    console.log('💰 Proveedor enviando presupuesto para booking:', id);
    console.log('📦 Datos recibidos:', { budgetPrice, budgetDetails, budgetMaterials, budgetTime });

    // Validaciones
    if (!budgetPrice || !budgetDetails) {
      return res.status(400).json({
        error: 'Precio y detalles del presupuesto son requeridos'
      });
    }

    // Validar que budgetPrice sea un número válido
    const priceValue = parseFloat(budgetPrice);
    if (isNaN(priceValue) || priceValue <= 0) {
      return res.status(400).json({
        error: 'El precio debe ser un número válido mayor a 0'
      });
    }

    // Buscar la booking
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        provider: {
          include: {
            user: true
          }
        },
        client: true
      }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }

    // Verificar que el proveedor autenticado es el dueño de la booking
    const providerProfile = await prisma.providerProfile.findUnique({
      where: { userId: req.user.userId }
    });

    if (!providerProfile || providerProfile.id !== booking.providerId) {
      return res.status(403).json({ error: 'No autorizado' });
    }

    // Generar token criptográficamente seguro para que el cliente ingrese sus datos
    const clientDataToken = randomBytes(32).toString('hex');
    const tokenExpiry = new Date();
    tokenExpiry.setDate(tokenExpiry.getDate() + 7); // Expira en 7 días

    // Actualizar la booking con el presupuesto y el token
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        budgetPrice: priceValue,
        budgetDetails,
        budgetMaterials: budgetMaterials || null,
        budgetTime: budgetTime || null,
        budgetSentAt: new Date(),
        clientDataToken,
        clientDataTokenExpiry: tokenExpiry,
        status: 'ACCEPTED' // Cambiamos el estado cuando envía presupuesto
      }
    });

    console.log('✅ Presupuesto guardado. Token generado:', clientDataToken);

    // URL que el proveedor puede compartir con el cliente
    const clientDataUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/client-contact/${clientDataToken}`;

    // ENVIAR PRESUPUESTO AL CLIENTE por el método que eligió
    try {
      const budgetData = {
        price: priceValue,
        details: budgetDetails,
        materials: budgetMaterials,
        estimatedTime: budgetTime || 'A confirmar'
      };

      if (booking.clientEmail) {
        await sendBudgetToClientEmail(
          booking.clientEmail,
          booking.clientName || 'Cliente',
          booking.provider.user.name,
          budgetData,
          booking.id
        );
      } else if (booking.clientPhone) {
        await sendBudgetToClientWhatsApp(
          booking.clientPhone,
          booking.clientName || 'Cliente',
          booking.provider.user.name,
          budgetData,
          booking.id
        );
      }
    } catch (notifError) {
      console.error('⚠️ Error al enviar presupuesto al cliente:', notifError);
      // No fallar la request por error de notificación
    }

    res.json({
      success: true,
      message: 'Presupuesto enviado exitosamente',
      booking: updatedBooking,
      clientDataUrl // Enviamos el URL para que el proveedor pueda compartirlo manualmente por ahora
    });

  } catch (error) {
    console.error('❌ Error al enviar presupuesto:', error);
    res.status(500).json({ error: 'Error al enviar presupuesto' });
  }
});

// GET /api/bookings/client-data/:token - Obtener datos de la solicitud por token
router.get('/client-data/:token', async (req, res) => {
  try {
    const { token } = req.params;

    const booking = await prisma.booking.findFirst({
      where: {
        clientDataToken: token,
        clientDataTokenExpiry: {
          gte: new Date() // Token no expirado
        }
      },
      include: {
        provider: {
          include: {
            user: true
          }
        }
      }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Link inválido o expirado' });
    }

    // Retornar info necesaria para mostrar el presupuesto
    res.json({
      booking: {
        id: booking.id,
        providerName: booking.provider.user.name,
        description: booking.description,
        budgetPrice: booking.budgetPrice,
        budgetDetails: booking.budgetDetails,
        budgetMaterials: booking.budgetMaterials,
        budgetTime: booking.budgetTime
      }
    });

  } catch (error) {
    console.error('❌ Error al obtener datos de booking:', error);
    res.status(500).json({ error: 'Error al obtener información' });
  }
});

// POST /api/bookings/client-data/:token - Cliente ingresa sus datos de contacto
router.post('/client-data/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { clientEmail, clientPhone, clientContactMethod } = req.body;

    console.log('📧 Cliente ingresando datos para token:', token);

    // Validaciones
    if (!clientEmail || !clientPhone || !clientContactMethod) {
      return res.status(400).json({
        error: 'Email, teléfono y método de contacto son requeridos'
      });
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(clientEmail)) {
      return res.status(400).json({ error: 'Email inválido' });
    }

    // Buscar booking
    const booking = await prisma.booking.findFirst({
      where: {
        clientDataToken: token,
        clientDataTokenExpiry: {
          gte: new Date()
        }
      },
      include: {
        client: true,
        provider: {
          include: {
            user: true
          }
        }
      }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Link inválido o expirado' });
    }

    // Actualizar el cliente con los datos reales
    await (prisma.user.update as any)({
      where: { id: booking.clientId },
      data: {
        email: clientEmail,
        phone: clientPhone
      }
    });

    // Actualizar la booking con los datos de contacto
    const updatedBooking = await prisma.booking.update({
      where: { id: booking.id },
      data: {
        clientEmail: clientEmail ?? undefined,
        clientPhone: clientPhone ?? undefined,
        clientContactMethod: clientContactMethod ?? undefined
      }
    });

    console.log('✅ Datos del cliente guardados');

    // TODO: Enviar presupuesto por email/WhatsApp al cliente
    console.log(`📧 TODO: Enviar presupuesto a ${clientEmail} via ${clientContactMethod}`);

    res.json({
      success: true,
      message: 'Datos guardados. Recibirás el presupuesto en breve.'
    });

  } catch (error) {
    console.error('❌ Error al guardar datos del cliente:', error);
    res.status(500).json({ error: 'Error al guardar datos' });
  }
});

// DELETE /api/bookings/:id - Eliminar una solicitud (solo ADMIN)
router.delete('/:id', authenticateToken, async (req: any, res) => {
  try {
    const { id } = req.params;
    const userRole = req.user.role;

    // Solo admins pueden eliminar bookings
    if (userRole !== 'ADMIN') {
      return res.status(403).json({ 
        error: 'No tienes permisos para eliminar solicitudes' 
      });
    }

    const booking = await prisma.booking.findUnique({
      where: { id }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }

    await prisma.booking.delete({
      where: { id }
    });

    res.json({ 
      message: 'Solicitud eliminada exitosamente' 
    });
  } catch (error) {
    console.error('Error al eliminar solicitud:', error);
    res.status(500).json({ error: 'Error al eliminar solicitud' });
  }
});

export default router;
