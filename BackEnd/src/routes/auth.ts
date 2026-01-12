import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../db/prisma.js';

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

export default router;
