'use client';

import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

/**
 * Wrapper para lazy loading de componentes pesados con loading fallback
 */

/**
 * Helper para crear componentes lazy loaded con el loading fallback
 */
export const createLazyComponent = <P extends object>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  loadingMessage?: string
) => {
  return dynamic(importFn, {
    loading: () => (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-main"></div>
        <span className="ml-4 text-neutral-600">{loadingMessage || 'Cargando...'}</span>
      </div>
    ),
    ssr: true
  });
};

/**
 * Lazy load para WorkZoneMap (componente pesado)
 */
export const LazyWorkZoneMap = createLazyComponent(
  () => import('../ui/WorkZoneMap'),
  'Cargando mapa...'
);
