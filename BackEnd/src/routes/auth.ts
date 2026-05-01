import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../db/prisma.js';
import { sendEmailVerification } from '../utils/notifications.js';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_change_this';

// POST /api/auth/signup - Registro de proveedores
router.post('/signup', async (req, res) => {
  try {
    const { 
      email, 
      password, 
      name, 
      phone,
      serviceCategory, 
      serviceDescription,
      experience,
      pricePerHour,
      location 
    } = req.body;

    // Validaciones básicas
    if (!email || !password || !name || !serviceCategory) {
      return res.status(400).json({ 
        error: 'Email, contraseña, nombre y categoría de servicio son requeridos' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'La contraseña debe tener al menos 6 caracteres' 
      });
    }

    // Verificar si el email ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ 
        error: 'Este email ya está registrado' 
      });
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario y perfil de proveedor
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        role: 'PROVIDER',
        providerProfile: {
          create: {
            serviceCategory,
            serviceDescription,
            experience: experience ? parseInt(experience) : null,
            pricePerHour: pricePerHour ? parseFloat(pricePerHour) : null,
            location
          }
        }
      },
      include: {
        providerProfile: true
      }
    });

    // Generar JWT
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // No devolver la contraseña
    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Error en signup:', error);
    res.status(500).json({ 
      error: 'Error al registrar usuario' 
    });
  }
});

// POST /api/auth/login - Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validaciones
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email y contraseña son requeridos' 
      });
    }

    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        providerProfile: true
      }
    });

    if (!user) {
      return res.status(401).json({ 
        error: 'Email o contraseña incorrectos' 
      });
    }

    // Verificar contraseña
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ 
        error: 'Email o contraseña incorrectos' 
      });
    }

    // Generar JWT
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // No devolver la contraseña
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Login exitoso',
      token,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      error: 'Error al iniciar sesión' 
    });
  }
});

// POST /api/auth/signup-client - Registro de clientes
router.post('/signup-client', async (req, res) => {
  try {
    const { 
      email, 
      password, 
      name, 
      phone
    } = req.body;

    // Validaciones básicas
    if (!email || !password || !name) {
      return res.status(400).json({ 
        error: 'Email, contraseña y nombre son requeridos' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'La contraseña debe tener al menos 6 caracteres' 
      });
    }

    // Verificar si el email ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ 
        error: 'Este email ya está registrado' 
      });
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario cliente (sin ProviderProfile)
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        role: 'CLIENT'
      }
    });

    // Generar JWT
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // No devolver la contraseña
    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      message: 'Cliente registrado exitosamente',
      token,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Error en registro de cliente:', error);
    res.status(500).json({ 
      error: 'Error al registrar cliente' 
    });
  }
});

// GET /api/auth/me - Obtener usuario actual (requiere token)
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ 
        error: 'Token no proporcionado' 
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        providerProfile: true
      }
    });

    if (!user) {
      return res.status(404).json({ 
        error: 'Usuario no encontrado' 
      });
    }

    // No devolver la contraseña
    const { password: _, ...userWithoutPassword } = user;

    res.json(userWithoutPassword);

  } catch (error) {
    console.error('Error en /me:', error);
    res.status(401).json({ 
      error: 'Token inválido' 
    });
  }
});

// ─── POST /api/auth/pre-register ─────────────────────────────────────────────
// Crea el usuario con datos del paso 1 y envía email de verificación
router.post('/pre-register', async (req, res) => {
  try {
    const { nombre, apellido, email, telefono, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ error: 'Nombre, email y contraseña son requeridos' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
    }

    // Si el email ya existe con verificación completada, rechazamos
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing && existing.isEmailVerified) {
      return res.status(400).json({ error: 'Este email ya está registrado' });
    }

    // Si existe pero no verificó, lo eliminamos para volver a crear (re-registro)
    if (existing && !existing.isEmailVerified) {
      await prisma.user.delete({ where: { email } });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const fullName = apellido ? `${nombre} ${apellido}` : nombre;

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: fullName,
        phone: telefono || null,
        role: 'PROVIDER',
        isEmailVerified: false,
        providerProfile: {
          create: {
            serviceCategory: 'OTRO',  // placeholder, se actualiza en paso 4
            rating: 0,
            totalReviews: 0,
          }
        }
      }
    });

    // Token de verificación (JWT con type: 'email-verify')
    const verificationToken = jwt.sign(
      { userId: user.id, type: 'email-verify' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const FRONTEND_URL = process.env.FRONTEND_URL || 'https://app-saha.vercel.app';
    const verificationLink = `${FRONTEND_URL}/provider-signup/continuar?token=${verificationToken}`;

    await sendEmailVerification(email, nombre, verificationLink);

    res.status(201).json({
      success: true,
      userId: user.id,
      message: 'Email de verificación enviado'
    });

  } catch (error) {
    console.error('❌ Error en pre-register:', error);
    res.status(500).json({ error: 'Error al pre-registrar usuario' });
  }
});

// ─── GET /api/auth/verify-email/:token ───────────────────────────────────────
// Verifica el email y devuelve el userId + auth token para continuar
router.get('/verify-email/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; type: string };

    if (decoded.type !== 'email-verify') {
      return res.status(400).json({ error: 'Token inválido' });
    }

    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    await prisma.user.update({
      where: { id: decoded.userId },
      data: { isEmailVerified: true }
    });

    // Auth token para que el frontend guarde la sesión
    const authToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      userId: user.id,
      name: user.name,
      email: user.email,
      token: authToken,
      message: 'Email verificado exitosamente'
    });

  } catch (error) {
    res.status(400).json({ error: 'Token inválido o expirado' });
  }
});

export default router;
