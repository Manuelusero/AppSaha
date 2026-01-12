'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts';

interface UseRequireAuthOptions {
  redirectTo?: string;
  requireRole?: 'CLIENT' | 'PROVIDER';
}

/**
 * Hook para proteger páginas que requieren autenticación
 * Redirige automáticamente si el usuario no está autenticado
 */
export function useRequireAuth(options: UseRequireAuthOptions = {}) {
  const { redirectTo = '/login', requireRole } = options;
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    // Si no está autenticado, redirigir
    if (!isAuthenticated) {
      router.push(redirectTo);
      return;
    }

    // Si requiere un rol específico y no lo tiene
    if (requireRole && user?.role !== requireRole) {
      // Redirigir al dashboard correspondiente
      if (user?.role === 'PROVIDER') {
        router.push('/dashboard-provider');
      } else if (user?.role === 'CLIENT') {
        router.push('/dashboard-client');
      } else {
        router.push('/');
      }
    }
  }, [isAuthenticated, isLoading, user, requireRole, router, redirectTo]);

  return { user, isAuthenticated, isLoading };
}

/**
 * Hook para redirigir usuarios autenticados (para páginas de login/signup)
 */
export function useRedirectIfAuthenticated(redirectTo: string = '/') {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (isAuthenticated) {
      // Redirigir según el rol
      if (user?.role === 'PROVIDER') {
        router.push('/dashboard-provider');
      } else if (user?.role === 'CLIENT') {
        router.push('/dashboard-client');
      } else {
        router.push(redirectTo);
      }
    }
  }, [isAuthenticated, isLoading, user, router, redirectTo]);

  return { isAuthenticated, isLoading };
}
