import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_change_this';

/**
 * Extended Request interface with user data
 */
export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email?: string;
    role: 'CLIENT' | 'PROVIDER' | 'ADMIN';
  };
}

/**
 * Middleware de autenticación JWT
 * Verifica el token en el header Authorization y agrega user a req
 */
export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      email?: string;
      role: 'CLIENT' | 'PROVIDER' | 'ADMIN';
    };
    
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

/**
 * Middleware para requerir rol ADMIN
 * Debe usarse después de authenticateToken
 */
export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({ error: 'No autenticado' });
  }

  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Acceso restringido a administradores' });
  }

  next();
};

/**
 * Middleware para requerir rol PROVIDER
 * Debe usarse después de authenticateToken
 */
export const requireProvider = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({ error: 'No autenticado' });
  }

  if (req.user.role !== 'PROVIDER') {
    return res.status(403).json({ error: 'Acceso restringido a proveedores' });
  }

  next();
};

/**
 * Middleware para requerir rol CLIENT
 * Debe usarse después de authenticateToken
 */
export const requireClient = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({ error: 'No autenticado' });
  }

  if (req.user.role !== 'CLIENT') {
    return res.status(403).json({ error: 'Acceso restringido a clientes' });
  }

  next();
};

/**
 * Middleware opcional de autenticación
 * Añade user a req si hay token válido, pero NO rechaza si no hay token
 */
export const optionalAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as {
        userId: string;
        email?: string;
        role: 'CLIENT' | 'PROVIDER' | 'ADMIN';
      };
      req.user = decoded;
    } catch {
      // Token inválido, pero no rechazamos la request
      req.user = undefined;
    }
  }

  next();
};
