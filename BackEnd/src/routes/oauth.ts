import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const router = Router();
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

/**
 * POST /api/auth/oauth
 * 
 * Sincroniza usuarios de OAuth (Google, Facebook, Apple) con la base de datos
 * 
 * Body:
 * {
 *   provider: 'google' | 'facebook' | 'apple';
 *   email: string;
 *   name: string;
 *   image?: string;
 *   providerId: string; // ID del usuario en el provider
 * }
 * 
 * Response:
 * {
 *   success: true,
 *   token: string,
 *   user: User,
 *   isNewUser: boolean
 * }
 */
router.post('/oauth', async (req: Request, res: Response) => {
  try {
    const { provider, email, name, image, providerId } = req.body;

    // Validar campos requeridos
    if (!provider || !email || !name || !providerId) {
      return res.status(400).json({
        success: false,
        error: 'Provider, email, name y providerId son requeridos'
      });
    }

    // Validar provider
    if (!['google', 'facebook', 'apple'].includes(provider)) {
      return res.status(400).json({
        success: false,
        error: 'Provider inválido. Debe ser: google, facebook o apple'
      });
    }

    // Buscar usuario existente por email
    let user = await prisma.user.findUnique({
      where: { email },
      include: {
        providerProfile: true
      }
    });

    let isNewUser = false;

    if (!user) {
      // Usuario nuevo - crear con rol CLIENT por defecto
      // Cuando complete el registro de proveedor, se actualizará a PROVIDER
      const [firstName, ...lastNameParts] = name.split(' ');
      const lastName = lastNameParts.join(' ') || '';

      user = await prisma.user.create({
        data: {
          email,
          name: firstName,
          password: '', // OAuth users no tienen password tradicional
          phone: '', // Se completará en el registro
          role: 'CLIENT', // Por defecto CLIENT, se actualiza al registrarse como provider
          avatar: image || null,
        },
        include: {
          providerProfile: true
        }
      });

      isNewUser = true;
    } else {
      // Usuario existente - actualizar imagen si cambió
      if (image && user.avatar !== image) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { avatar: image },
          include: {
            providerProfile: true
          }
        });
      }
    }

    // Generar JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Preparar respuesta
    const response = {
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar
      },
      message: isNewUser 
        ? 'Usuario creado exitosamente con OAuth' 
        : 'Sesión iniciada exitosamente'
    };

    return res.status(isNewUser ? 201 : 200).json(response);

  } catch (error) {
    console.error('❌ Error en OAuth sync:', error);
    return res.status(500).json({
      success: false,
      error: 'Error al procesar autenticación OAuth',
      details: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

/**
 * POST /api/auth/oauth/complete-provider-signup
 * 
 * Completa el registro de un usuario OAuth como proveedor
 * Debe llamarse después de que el usuario complete el formulario de provider-signup
 * 
 * Body:
 * {
 *   userId: string;
 *   phone: string;
 *   serviceCategory: string;
 *   description: string;
 *   ubicacion: string;
 *   // ... resto de datos del provider
 * }
 */
router.post('/oauth/complete-provider-signup', async (req: Request, res: Response) => {
  try {
    const { userId, phone, ...providerData } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'userId es requerido'
      });
    }

    // Actualizar usuario a rol PROVIDER
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        phone: phone || '',
        role: 'PROVIDER'
      }
    });

    // Crear perfil de proveedor
    const providerProfile = await prisma.providerProfile.create({
      data: {
        userId: userId,
        serviceCategory: providerData.serviceCategory,
        serviceDescription: providerData.serviceDescription || '',
        serviceRadius: parseInt(providerData.alcanceTrabajo ?? providerData.serviceRadius) || 10,
        rating: 0,
        totalReviews: 0,
        completedBookings: 0,
        // Agregar más campos según sea necesario
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Registro de proveedor completado exitosamente',
      user: updatedUser,
      providerProfile
    });

  } catch (error) {
    console.error('❌ Error al completar registro de proveedor:', error);
    return res.status(500).json({
      success: false,
      error: 'Error al completar registro',
      details: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

export default router;
