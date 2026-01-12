'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireRole?: 'CLIENT' | 'PROVIDER';
  redirectTo?: string;
}

export default function ProtectedRoute({ 
  children, 
  requireAuth = true,
  requireRole,
  redirectTo = '/login'
}: ProtectedRouteProps) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    // Si requiere autenticación y no está autenticado
    if (requireAuth && !isAuthenticated) {
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
  }, [isAuthenticated, isLoading, user, requireAuth, requireRole, router, redirectTo]);

  // Mostrar loading mientras se verifica
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-700 text-lg">Verificando acceso...</span>
        </div>
      </div>
    );
  }

  // Si no está autenticado y requiere auth, no mostrar nada (ya redirigió)
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  // Si requiere rol y no lo tiene, no mostrar nada (ya redirigió)
  if (requireRole && user?.role !== requireRole) {
    return null;
  }

  return <>{children}</>;
}
