import express from 'express';
import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();
const router = express.Router();

// GET /api/providers - Listar todos los proveedores con filtros
router.get('/', async (req, res) => {
  try {
    const { 
      category, 
      location, 
      sortBy = 'rating', // rating, price, experience
      order = 'desc' // asc, desc
    } = req.query;

    // Construir filtros dinámicamente
    const where: any = {
      role: 'PROVIDER',
      providerProfile: {
        isNot: null,
      }
    };

    // Construir filtros para el perfil de proveedor
    const profileWhere: any = {};

    if (category) {
      profileWhere.serviceCategory = category as string;
    }

    if (location) {
      profileWhere.location = {
        contains: location as string,
        mode: 'insensitive'
      };
    }

    // Definir ordenamiento
    let orderByClause: any = {};
    
    if (sortBy === 'rating') {
      orderByClause = { providerProfile: { rating: order as 'asc' | 'desc' } };
    } else if (sortBy === 'price') {
      orderByClause = { providerProfile: { pricePerHour: order as 'asc' | 'desc' } };
    } else if (sortBy === 'experience') {
      orderByClause = { providerProfile: { experience: order as 'asc' | 'desc' } };
    }

    const providers = await prisma.user.findMany({
      where,
      include: {
        providerProfile: {
          where: Object.keys(profileWhere).length > 0 ? profileWhere : undefined
        }
      },
      orderBy: orderByClause
    });

    // Filtrar usuarios que tienen providerProfile
    const filteredProviders = providers.filter(p => p.providerProfile !== null);

    // No devolver contraseñas
    const providersWithoutPassword = filteredProviders.map(provider => {
      const { password, ...userWithoutPassword } = provider;
      return userWithoutPassword;
    });

    res.json(providersWithoutPassword);

  } catch (error) {
    console.error('Error al obtener proveedores:', error);
    res.status(500).json({ error: 'Error al obtener proveedores' });
  }
});

// GET /api/providers/:id - Obtener un proveedor específico
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const provider = await prisma.user.findUnique({
      where: { 
        id,
        role: 'PROVIDER'
      },
      include: {
        providerProfile: true
      }
    });

    if (!provider || !provider.providerProfile) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }

    // No devolver contraseña
    const { password, ...providerWithoutPassword } = provider;

    res.json(providerWithoutPassword);

  } catch (error) {
    console.error('Error al obtener proveedor:', error);
    res.status(500).json({ error: 'Error al obtener proveedor' });
  }
});

// GET /api/providers/categories/list - Obtener lista de categorías con conteo
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await prisma.providerProfile.groupBy({
      by: ['serviceCategory'],
      _count: {
        serviceCategory: true
      }
    });

    res.json(categories);

  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
});

export default router;
