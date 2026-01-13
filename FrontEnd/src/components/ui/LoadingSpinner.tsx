import React from 'react';
import { colors, typography } from '@/styles/tokens';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  fullScreen?: boolean;
  color?: string;
}

/**
 * Componente LoadingSpinner reutilizable
 * 
 * @example
 * ```tsx
 * // Spinner simple
 * <LoadingSpinner />
 * 
 * // Con mensaje
 * <LoadingSpinner message="Cargando datos..." />
 * 
 * // Pantalla completa
 * <LoadingSpinner fullScreen message="Procesando..." />
 * ```
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  message,
  fullScreen = false,
  color = colors.primary.main,
}) => {
  const sizeMap = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  const spinner = (
    <div className="text-center">
      <div
        className={`animate-spin rounded-full border-b-2 mx-auto ${sizeMap[size]}`}
        style={{ borderColor: color }}
      />
      {message && (
        <p
          className="mt-4"
          style={{
            fontFamily: typography.fontFamily.primary,
            fontSize: typography.fontSize.base,
            color: color,
          }}
        >
          {message}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        {spinner}
      </div>
    );
  }

  return spinner;
};
