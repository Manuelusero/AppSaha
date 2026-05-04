import express from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../db/prisma.js';
import { upload, uploadProviderFiles } from '../middleware/upload.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';
import { getOptionalFileUrl, getOptionalFileUrls, getFileUrl, getFileUrls } from '../utils/file-helpers.js';
import bcrypt from 'bcrypt';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_change_this';

// GET /api/providers/test - Endpoint de prueba sin base de datos
router.get('/test', async (req, res) => {
  console.log('📥 Test endpoint llamado');
  res.json({ 
    success: true, 
    message: 'Backend funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// POST /api/providers/register - Registrar un nuevo proveedor con archivos
router.post('/register', uploadProviderFiles, async (req, res) => {
  console.log('📥 Request a /api/providers/register - INICIANDO');
  
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const {
      nombre,
      apellido,
      email,
      telefono,
      password,
      profesion,
      especialidades,
      profesionesAdicionales,
      ubicacion,
      alcanceTrabajo,
      descripcion,
      instagram,
      facebook,
      linkedin,
      dni,
      preRegisterId  // set by frontend when user was pre-registered at paso 1
    } = req.body;

    console.log('📄 Datos recibidos:', { nombre, apellido, email, profesion, preRegisterId });
    console.log('📎 Archivos recibidos:', Object.keys(files || {}).map(key => `${key}: ${files[key].length} archivo(s)`));
    
    // Debug: Ver qué devuelve Cloudinary
    if (files.fotoPerfil?.[0]) {
      console.log('🔍 Debug fotoPerfil completo:', files.fotoPerfil[0]);
      console.log('🔍 Debug fotoPerfil desglosado:', {
        filename: files.fotoPerfil[0].filename,
        path: (files.fotoPerfil[0] as any).path,
        url: (files.fotoPerfil[0] as any).url,
        allKeys: Object.keys(files.fotoPerfil[0])
      });
    }

    // If pre-registered, we UPDATE; otherwise verify email not already in use
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser && !preRegisterId) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    // Determine which user record to update/create
    const targetUserId = preRegisterId || (existingUser?.id ?? null);

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Procesar especialidades (puede venir como string JSON)
    let especialidadesArray = [];
    try {
      especialidadesArray = typeof especialidades === 'string' 
        ? JSON.parse(especialidades) 
        : especialidades;
    } catch (e) {
      especialidadesArray = [];
    }

    // Procesar profesiones adicionales
    let profesionesAdicionalesArray = [];
    try {
      profesionesAdicionalesArray = typeof profesionesAdicionales === 'string'
        ? JSON.parse(profesionesAdicionales)
        : profesionesAdicionales || [];
    } catch (e) {
      profesionesAdicionalesArray = [];
    }

    // Obtener rutas de archivos usando helpers
    const fotoPerfil = getOptionalFileUrl(files, 'fotoPerfil');
    const fotoDniFrente = getOptionalFileUrl(files, 'fotoDniFrente');
    const fotoDniDorso = getOptionalFileUrl(files, 'fotoDniDorso');
    const certificados = getOptionalFileUrls(files, 'certificados');
    const fotosTrabajos = getOptionalFileUrls(files, 'fotosTrabajos');

    console.log('🖼️ Fotos procesadas:', {
      perfil: fotoPerfil,
      dniFrente: fotoDniFrente,
      dniDorso: fotoDniDorso,
      certificados: certificados.length,
      trabajos: fotosTrabajos.length
    });

    // Mapear profesión a categoría válida del enum
    const categoryMap: { [key: string]: string } = {
      'Plomeros': 'PLOMERIA',
      'Pintores': 'PINTURA',
      'Herreros': 'OTRO',
      'Modistas': 'OTRO',
      'Jardineros': 'JARDINERIA',
      'Limpiadores': 'LIMPIEZA',
      'Profesores': 'OTRO',
      'Electricistas': 'ELECTRICIDAD',
      'Masajistas': 'OTRO',
      'Albañiles': 'CONSTRUCCION',
      'Carpinteros': 'CARPINTERIA'
    };

    const serviceCategory = categoryMap[profesion] || 'OTRO';

    // Crear o actualizar usuario y perfil de proveedor
    const profileData = {
      serviceCategory: serviceCategory as any,
      specialties: JSON.stringify(especialidadesArray),
      location: ubicacion,
      bio: descripcion || '',
      serviceDescription: descripcion || '',
      experience: 0,
      pricePerHour: 0,
      profilePhoto: fotoPerfil || null,
      workPhotos: JSON.stringify(fotosTrabajos),
      portfolioImages: JSON.stringify(fotosTrabajos),
      dniNumber: dni || '',
      dniDocument: fotoDniFrente || null,
      dniPhotoFront: fotoDniFrente || null,
      dniPhotoBack: fotoDniDorso || null,
      certifications: JSON.stringify(certificados),
      serviceRadius: alcanceTrabajo && !isNaN(parseInt(alcanceTrabajo)) ? parseInt(alcanceTrabajo) : null,
      instagram: instagram || null,
      facebook: facebook || null,
      linkedin: linkedin || null,
    };

    let newProvider: any;

    if (targetUserId) {
      // UPDATE path: user was pre-registered at paso 1
      await prisma.user.update({
        where: { id: targetUserId },
        data: {
          password: hashedPassword,
          name: `${nombre} ${apellido}`,
          phone: telefono,
          isEmailVerified: true,
        },
      });

      await prisma.providerProfile.upsert({
        where: { userId: targetUserId },
        update: profileData,
        create: { userId: targetUserId, ...profileData, rating: 0, totalReviews: 0 },
      });

      newProvider = await prisma.user.findUnique({
        where: { id: targetUserId },
        include: { providerProfile: true },
      });
    } else {
      // CREATE path: classic registration without pre-register
      newProvider = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name: `${nombre} ${apellido}`,
          phone: telefono,
          role: 'PROVIDER',
          isEmailVerified: true,
          providerProfile: {
            create: {
              ...profileData,
              rating: 0,
              totalReviews: 0,
            }
          }
        },
        include: { providerProfile: true }
      });
    }

    console.log('✅ Proveedor creado exitosamente:', newProvider.id);

    // Generar JWT para login automático
    const token = jwt.sign(
      { userId: newProvider.id, role: 'PROVIDER' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // No devolver contraseña
    const { password: _, ...providerWithoutPassword } = newProvider;

    res.status(201).json({
      success: true,
      message: 'Proveedor registrado exitosamente',
      token,
      provider: providerWithoutPassword,
      files: {
        fotoPerfil,
        fotoDniFrente,
        fotoDniDorso,
        certificados,
        fotosTrabajos
      }
    });

  } catch (error) {
    console.error('❌ Error al registrar proveedor:', error);
    res.status(500).json({ 
      error: 'Error al registrar proveedor',
      details: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

// GET /api/providers - Listar todos los proveedores con filtros
router.get('/', async (req, res) => {
  console.log('📥 Request a /api/providers - INICIANDO');
  
  try {
    const { 
      category, 
      location, 
      sortBy = 'rating',
      order = 'desc'
    } = req.query;

    // Build where clause para filtrar en la DB, no en memoria
    const whereClause: any = {
      role: 'PROVIDER',
      providerProfile: { isNot: null }
    };

    // Aplicar filtros en la query
    if (category) {
      whereClause.providerProfile = {
        ...whereClause.providerProfile,
        serviceCategory: category as string
      };
    }

    if (location) {
      whereClause.providerProfile = {
        ...whereClause.providerProfile,
        location: {
          contains: location as string,
          mode: 'insensitive'
        }
      };
    }

    // Determinar orden
    let orderByClause: any = {};
    if (sortBy === 'rating') {
      orderByClause = { providerProfile: { rating: order === 'desc' ? 'desc' : 'asc' } };
    } else if (sortBy === 'price') {
      orderByClause = { providerProfile: { pricePerHour: order === 'desc' ? 'desc' : 'asc' } };
    } else if (sortBy === 'experience') {
      orderByClause = { providerProfile: { experience: order === 'desc' ? 'desc' : 'asc' } };
    } else {
      orderByClause = { createdAt: 'desc' };
    }

    // Query optimizada: select solo campos necesarios, sin password
    const providers = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        isEmailVerified: true,
        createdAt: true,
        updatedAt: true,
        providerProfile: {
          select: {
            userId: true,
            serviceCategory: true,
            specialties: true,
            location: true,
            bio: true,
            serviceDescription: true,
            experience: true,
            pricePerHour: true,
            rating: true,
            totalReviews: true,
            completedBookings: true,
            profilePhoto: true,
            portfolioImages: true,
            workPhotos: true,
            serviceRadius: true,
            instagram: true,
            facebook: true,
            linkedin: true,
            dniNumber: true
            // No incluir: dniDocument, dniPhotoFront, dniPhotoBack, certifications (privados)
          }
        }
      },
      orderBy: orderByClause
    });

    console.log(`✅ Encontrados ${providers.length} proveedores`);

    res.json(providers);

  } catch (error) {
    console.error('❌ Error al obtener proveedores:', error);
    res.status(500).json({ error: 'Error al obtener proveedores' });
  }
});

// GET /api/providers/categories/list - Obtener lista de categorías con conteo
// IMPORTANTE: Esta ruta debe estar ANTES de GET /:id para que no sea capturada por el parámetro dinámico
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

// GET /api/providers/:id - Obtener un proveedor específico
router.get('/:id', async (req, res) => {
  
  try {
    const { id } = req.params;

    const provider = await prisma.user.findUnique({
      where: { 
        id,
        role: 'PROVIDER'
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        isEmailVerified: true,
        createdAt: true,
        updatedAt: true,
        providerProfile: {
          select: {
            userId: true,
            serviceCategory: true,
            specialties: true,
            location: true,
            bio: true,
            serviceDescription: true,
            experience: true,
            pricePerHour: true,
            rating: true,
            totalReviews: true,
            completedBookings: true,
            profilePhoto: true,
            portfolioImages: true,
            workPhotos: true,
            serviceRadius: true,
            instagram: true,
            facebook: true,
            linkedin: true,
            dniNumber: true,
            certifications: true,
            references: {
              select: {
                id: true,
                clientName: true,
                relationship: true,
                phone: true,
                email: true,
                yearsKnown: true,
                comments: true,
                createdAt: true
              }
            }
          }
        }
      }
    });

    if (!provider || !provider.providerProfile) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }

    res.json(provider);

  } catch (error) {
    console.error('Error al obtener proveedor:', error);
    res.status(500).json({ error: 'Error al obtener proveedor' });
  }
});

// PUT /api/providers/:id - Actualizar datos del perfil del proveedor
router.put('/:id', authenticateToken, async (req: any, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    // Solo el propio proveedor puede actualizar su perfil
    if (userId !== id) {
      return res.status(403).json({ error: 'No autorizado' });
    }

    const {
      location,
      bio,
      serviceDescription,
      serviceCategory,
      specialties,
      experience,
      serviceRadius,
      instagram,
      facebook,
      linkedin
    } = req.body;

    const updated = await prisma.providerProfile.update({
      where: { userId: id },
      data: {
        ...(location !== undefined && { location }),
        ...(bio !== undefined && { bio }),
        ...(serviceDescription !== undefined && { serviceDescription }),
        ...(serviceCategory !== undefined && { serviceCategory }),
        ...(specialties !== undefined && { specialties: Array.isArray(specialties) ? JSON.stringify(specialties) : specialties }),
        ...(experience !== undefined && { experience: Number(experience) }),
        ...(serviceRadius !== undefined && { serviceRadius: Number(serviceRadius) }),
        ...(instagram !== undefined && { instagram }),
        ...(facebook !== undefined && { facebook }),
        ...(linkedin !== undefined && { linkedin }),
      }
    });

    res.json({ success: true, providerProfile: updated });
  } catch (error) {
    console.error('Error al actualizar proveedor:', error);
    res.status(500).json({ error: 'Error al actualizar el perfil' });
  }
});

// POST /api/providers/:id/profile-photo - Actualizar foto de perfil
router.post('/:id/profile-photo', authenticateToken, upload.single('fotoPerfil'), async (req: any, res) => {
  try {
    const { id } = req.params;
    const file = req.file as any;

    if (!file) {
      return res.status(400).json({ error: 'No se envió ninguna foto' });
    }

    const photoUrl = getFileUrl(file);

    await prisma.providerProfile.update({
      where: { userId: id },
      data: { profilePhoto: photoUrl }
    });

    res.json({ success: true, profilePhoto: photoUrl });

  } catch (error) {
    console.error('Error al actualizar foto de perfil:', error);
    res.status(500).json({ error: 'Error al actualizar foto de perfil' });
  }
});

// POST /api/providers/:id/portfolio - Agregar fotos al portfolio
router.post('/:id/portfolio', authenticateToken, upload.array('fotosTrabajos', 10), async (req: any, res) => {
  try {
    const { id } = req.params;
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No se enviaron fotos' });
    }

    // Obtener el provider actual
    const provider = await prisma.user.findUnique({
      where: { id, role: 'PROVIDER' },
      include: { providerProfile: true }
    });

    if (!provider || !provider.providerProfile) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }

    // Parsear fotos existentes
    let existingImages: string[] = [];
    try {
      const raw = provider.providerProfile.portfolioImages;
      existingImages = typeof raw === 'string'
        ? JSON.parse(raw)
        : (raw as unknown as string[]) || [];
    } catch {
      existingImages = [];
    }

    // Extraer URLs de las nuevas fotos usando helper
    const newPhotos = getFileUrls(files);

    const updatedImages = [...existingImages, ...newPhotos];

    // Actualizar en DB
    await prisma.providerProfile.update({
      where: { userId: id },
      data: {
        portfolioImages: JSON.stringify(updatedImages),
        workPhotos: JSON.stringify(updatedImages)
      }
    });

    res.json({
      success: true,
      portfolioImages: updatedImages
    });

  } catch (error) {
    console.error('Error al subir fotos al portfolio:', error);
    res.status(500).json({ error: 'Error al subir fotos' });
  }
});

// DELETE /api/providers/:id/portfolio - Eliminar una foto del portfolio
router.delete('/:id/portfolio', authenticateToken, async (req: any, res) => {
  try {
    const { id } = req.params;
    const { photoUrl } = req.body;

    if (!photoUrl) {
      return res.status(400).json({ error: 'Se requiere photoUrl' });
    }

    const provider = await prisma.user.findUnique({
      where: { id, role: 'PROVIDER' },
      include: { providerProfile: true }
    });

    if (!provider || !provider.providerProfile) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }

    let existingImages: string[] = [];
    try {
      const raw = provider.providerProfile.portfolioImages;
      existingImages = typeof raw === 'string'
        ? JSON.parse(raw)
        : (raw as unknown as string[]) || [];
    } catch {
      existingImages = [];
    }

    // Eliminar la foto del array (comparar por filename o URL completa)
    const updatedImages = existingImages.filter(img => img !== photoUrl && !img.includes(photoUrl) && !photoUrl.includes(img));

    await prisma.providerProfile.update({
      where: { userId: id },
      data: {
        portfolioImages: JSON.stringify(updatedImages),
        workPhotos: JSON.stringify(updatedImages)
      }
    });

    res.json({
      success: true,
      portfolioImages: updatedImages
    });

  } catch (error) {
    console.error('Error al eliminar foto del portfolio:', error);
    res.status(500).json({ error: 'Error al eliminar foto' });
  }
});

export default router;
