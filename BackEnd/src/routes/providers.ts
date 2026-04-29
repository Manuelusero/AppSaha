import express from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../db/prisma.js';
import { upload, uploadProviderFiles } from '../middleware/upload.js';
import bcrypt from 'bcrypt';

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
      dni
    } = req.body;

    console.log('📄 Datos recibidos:', { nombre, apellido, email, profesion });
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

    // Validar que el email no exista
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

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

    // Obtener rutas de archivos
    // En producción con Cloudinary, usar la URL completa; en desarrollo, usar filename
    const isProduction = process.env.VERCEL || process.env.NODE_ENV === 'production';
    
    const fotoPerfil = files.fotoPerfil?.[0] 
      ? (isProduction ? ((files.fotoPerfil[0] as any).path || (files.fotoPerfil[0] as any).url || files.fotoPerfil[0].filename) : files.fotoPerfil[0].filename)
      : null;
    
    const fotoDniFrente = files.fotoDniFrente?.[0]
      ? (isProduction ? ((files.fotoDniFrente[0] as any).path || (files.fotoDniFrente[0] as any).url || files.fotoDniFrente[0].filename) : files.fotoDniFrente[0].filename)
      : null;
    
    const fotoDniDorso = files.fotoDniDorso?.[0]
      ? (isProduction ? ((files.fotoDniDorso[0] as any).path || (files.fotoDniDorso[0] as any).url || files.fotoDniDorso[0].filename) : files.fotoDniDorso[0].filename)
      : null;
    
    const certificados = files.certificados?.map(f => 
      isProduction ? ((f as any).path || (f as any).url || f.filename) : f.filename
    ) || [];
    
    const fotosTrabajos = files.fotosTrabajos?.map(f => 
      isProduction ? ((f as any).path || (f as any).url || f.filename) : f.filename
    ) || [];

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

    // Crear usuario y perfil de proveedor en una transacción
    const newProvider = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: `${nombre} ${apellido}`,
        phone: telefono,
        role: 'PROVIDER',
        providerProfile: {
          create: {
            serviceCategory: serviceCategory as any,
            specialties: JSON.stringify(especialidadesArray),
            location: ubicacion,
            bio: descripcion || '',
            serviceDescription: descripcion || '',
            experience: 0,
            pricePerHour: 0,
            rating: 0,
            totalReviews: 0,
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
          }
        }
      },
      include: {
        providerProfile: true
      }
    });

    console.log('✅ Proveedor creado exitosamente:', newProvider.id);

    // No devolver contraseña
    const { password: _, ...providerWithoutPassword } = newProvider;

    res.status(201).json({
      success: true,
      message: 'Proveedor registrado exitosamente',
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
    console.log('🔍 Prisma client creado, consultando...');
    
    const { 
      category, 
      location, 
      sortBy = 'rating',
      order = 'desc'
    } = req.query;

    // Obtener todos los proveedores de forma simple
    const allUsers = await prisma.user.findMany({
      where: {
        role: 'PROVIDER'
      },
      include: {
        providerProfile: true
      }
    });

    console.log(`✅ Encontrados ${allUsers.length} usuarios con role PROVIDER`);

    // Filtrar usuarios que tienen providerProfile
    let filteredProviders = allUsers.filter((p: any) => p.providerProfile !== null);
    
    console.log(`✅ ${filteredProviders.length} tienen providerProfile`);

    // Aplicar filtros manualmente
    if (category) {
      filteredProviders = filteredProviders.filter((p: any) => 
        p.providerProfile?.serviceCategory === category
      );
    }

    if (location) {
      filteredProviders = filteredProviders.filter((p: any) => 
        p.providerProfile?.location?.toLowerCase().includes((location as string).toLowerCase())
      );
    }

    // Aplicar ordenamiento
    if (sortBy === 'rating') {
      filteredProviders.sort((a: any, b: any) => {
        const ratingA = a.providerProfile?.rating || 0;
        const ratingB = b.providerProfile?.rating || 0;
        return order === 'desc' ? ratingB - ratingA : ratingA - ratingB;
      });
    } else if (sortBy === 'price') {
      filteredProviders.sort((a: any, b: any) => {
        const priceA = a.providerProfile?.pricePerHour || 0;
        const priceB = b.providerProfile?.pricePerHour || 0;
        return order === 'desc' ? priceB - priceA : priceA - priceB;
      });
    } else if (sortBy === 'experience') {
      filteredProviders.sort((a: any, b: any) => {
        const expA = a.providerProfile?.experience || 0;
        const expB = b.providerProfile?.experience || 0;
        return order === 'desc' ? expB - expA : expA - expB;
      });
    }

    // No devolver contraseñas
    const providersWithoutPassword = filteredProviders.map((provider: any) => {
      const { password, ...userWithoutPassword } = provider;
      return userWithoutPassword;
    });

    res.json(providersWithoutPassword);

  } catch (error) {
    console.error('❌ Error al obtener proveedores:', error);
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
        providerProfile: {
          include: {
            references: true // Incluir referencias del profesional
          }
        }
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
    const isProduction = process.env.VERCEL || process.env.NODE_ENV === 'production';

    if (!file) {
      return res.status(400).json({ error: 'No se envió ninguna foto' });
    }

    const photoUrl = isProduction
      ? (file.path || file.url || file.filename)
      : file.filename;

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
    const isProduction = process.env.VERCEL || process.env.NODE_ENV === 'production';

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

    // Extraer URLs de las nuevas fotos
    const newPhotos = files.map((f: any) =>
      isProduction ? (f.path || f.url || f.filename) : f.filename
    );

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
