'use client';

import React from 'react';
import { colors, typography } from '@/styles/tokens';

interface EmptyStateProps {
  /** Icono SVG (puede ser un string o elemento React) */
  icon?: React.ReactNode | string;
  /** Título principal del estado vacío */
  title: string;
  /** Descripción o mensaje detallado */
  description?: string;
  /** Botón de acción opcional */
  actionButton?: {
    label: string;
    onClick: () => void;
  };
  /** Clase CSS personalizada */
  className?: string;
}

/**
 * Componente de estado vacío reutilizable
 * Muestra un mensaje cuando no hay contenido disponible
 * 
 * @example
 * ```tsx
 * <EmptyState
 *   title="No hay recomendaciones"
 *   description="Comparte tu enlace con clientes para recibir opiniones"
 *   icon="⭐"
 *   actionButton={{
 *     label: "Compartir enlace",
 *     onClick: () => handleShare()
 *   }}
 * />
 * ```
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionButton,
  className = '',
}) => {
  return (
    <div 
      className={`flex flex-col items-center justify-center py-16 px-6 gap-4 ${className}`}
      style={{
        textAlign: 'center',
        minHeight: '300px',
      }}
    >
      {/* Icono */}
      {icon && (
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: colors.primary.pale,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '36px',
            flexShrink: 0,
          }}
        >
          {typeof icon === 'string' ? icon : icon}
        </div>
      )}

      {/* Título */}
      <h3
        style={{
          fontSize: typography.fontSize.lg,
          fontWeight: typography.fontWeight.semibold,
          color: colors.neutral[900],
          margin: 0,
          fontFamily: typography.fontFamily.primary,
        }}
      >
        {title}
      </h3>

      {/* Descripción */}
      {description && (
        <p
          style={{
            fontSize: typography.fontSize.sm,
            color: colors.neutral[500],
            maxWidth: '320px',
            margin: 0,
            lineHeight: typography.lineHeight.relaxed,
            fontFamily: typography.fontFamily.primary,
          }}
        >
          {description}
        </p>
      )}

      {/* Botón de acción */}
      {actionButton && (
        <button
          onClick={actionButton.onClick}
          className="mt-4 px-6 py-3 rounded-full font-semibold transition-colors hover:opacity-90"
          style={{
            backgroundColor: colors.primary.main,
            color: colors.secondary.light,
            fontFamily: typography.fontFamily.primary,
            fontSize: typography.fontSize.sm,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          {actionButton.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
