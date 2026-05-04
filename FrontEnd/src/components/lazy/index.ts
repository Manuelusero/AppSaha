import dynamic from 'next/dynamic';
import { ComponentType, FC } from 'react';

/**
 * Wrapper para lazy loading de componentes pesados con loading fallback
 */

// Loading component genérico
const LoadingFallback: FC<{ message?: string }> = ({ message = 'Cargando...' }) => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-main"></div>
    <span className="ml-4 text-neutral-600">{message}</span>
  </div>
);

/**
 * Helper para crear componentes lazy loaded con el loading fallback
 */
export const createLazyComponent = <P extends object>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  loadingMessage?: string
) => {
  return dynamic(importFn, {
    loading: () => <LoadingFallback message={loadingMessage} />,
    ssr: true // Server-side rendering habilitado
  });
};

/**
 * Lazy load para WorkZoneMap (componente pesado)
 */
export const LazyWorkZoneMap = createLazyComponent(
  () => import('../ui/WorkZoneMap'),
  'Cargando mapa...'
);

/**
 * Lazy load para CookieBanner
 */
export const LazyCookieBanner = createLazyComponent(
  () => import('../ui/CookieBanner'),
  'Cargando configuración...'
);

/**
 * Lazy load para modales pesados
 */
export const LazyModal = createLazyComponent(
  () => import('../ui/Modal'),
  'Cargando modal...'
);

export { LoadingFallback };
