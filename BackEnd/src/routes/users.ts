import express from 'express';
import prisma from '../db/prisma.js';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth.js';

const router = express.Router();

// GET todos los usuarios (solo ADMIN)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// GET un usuario por ID (requiere autenticación)
router.get('/:id', authenticateToken, async (req: any, res) => {
  try {
    const { id } = req.params;

    // Solo el propio usuario o un admin puede ver el perfil
    if (req.user.userId !== id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'No tienes permiso para ver este usuario' });
    }
    const user = await prisma.user.findUnique({
      where: { id }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
});

// POST crear un nuevo usuario
// NOTA: Este endpoint está deshabilitado. Usa /api/auth/signup o /api/auth/signup-client
router.post('/', async (req, res) => {
  res.status(400).json({ 
    error: 'Este endpoint está deshabilitado. Usa /api/auth/signup o /api/auth/signup-client' 
  });
});

// PUT actualizar un usuario (requiere autenticación, solo el propio usuario o ADMIN)
router.put('/:id', authenticateToken, async (req: any, res) => {
  try {
    const { id } = req.params;
    const { email, name } = req.body;

    // Solo el propio usuario o un admin puede actualizar
    if (req.user.userId !== id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'No tienes permiso para actualizar este usuario' });
    }
    
    const user = await prisma.user.update({
      where: { id },
      data: { email, name }
    });
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});

// DELETE eliminar un usuario (solo ADMIN)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.user.delete({
      where: { id }
    });
    
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});

export default router;
