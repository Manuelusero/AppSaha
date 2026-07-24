'use client';

import React, { useEffect, useState } from 'react';
import { useToastContext } from '@/contexts/ToastContext';
import { colors, typography } from '@/styles/tokens';

interface ToastDisplayProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

const getIcon = (type: string) => {
  switch (type) {
    case 'success':
      return '✓';
    case 'error':
      return '✕';
    case 'warning':
      return '⚠';
    case 'info':
      return 'ⓘ';
    default:
      return '●';
  }
};

const getColors = (type: string) => {
  switch (type) {
    case 'success':
      return {
        bg: colors.success.light,
        border: colors.success.main,
        text: colors.success.dark,
        icon: colors.success.main,
      };
    case 'error':
      return {
        bg: colors.error.light,
        border: colors.error.main,
        text: colors.error.dark,
        icon: colors.error.main,
      };
    case 'warning':
      return {
        bg: colors.warning.light,
        border: colors.warning.main,
        text: colors.warning.dark,
        icon: colors.warning.main,
      };
    case 'info':
      return {
        bg: colors.info.light,
        border: colors.info.main,
        text: colors.info.dark,
        icon: colors.info.main,
      };
    default:
      return {
        bg: colors.neutral[50],
        border: colors.neutral[300],
        text: colors.neutral[800],
        icon: colors.neutral[600],
      };
  }
};

/**
 * Componente que renderiza los Toasts en pantalla
 * Debe colocarse en el layout principal
 */
export const ToastDisplay: React.FC<ToastDisplayProps> = ({
  position = 'top-right',
}) => {
  const { toasts, removeToast } = useToastContext();
  const [displayedToasts, setDisplayedToasts] = useState(toasts);

  useEffect(() => {
    setDisplayedToasts(toasts);
  }, [toasts]);

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
  };

  return (
    <div
      className={`fixed ${positionClasses[position]} z-50 pointer-events-none flex flex-col gap-3`}
      style={{
        maxWidth: '380px',
      }}
    >
      {displayedToasts.map((toast) => {
        const colorScheme = getColors(toast.type);
        const icon = getIcon(toast.type);

        return (
          <div
            key={toast.id}
            className="animate-in fade-in slide-in-from-right-4 pointer-events-auto"
            style={{
              animation: 'fadeInSlideIn 0.3s ease-out',
              backgroundColor: colorScheme.bg,
              borderLeft: `4px solid ${colorScheme.border}`,
              borderRadius: '8px',
              padding: '12px 16px',
              boxShadow: `0 2px 8px ${colors.neutral[400]}33`,
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
            }}
          >
            {/* Icono */}
            <div
              style={{
                fontSize: '18px',
                color: colorScheme.icon,
                fontWeight: 'bold',
                flexShrink: 0,
                marginTop: '2px',
              }}
            >
              {icon}
            </div>

            {/* Contenido */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                style={{
                  margin: 0,
                  color: colorScheme.text,
                  fontSize: typography.fontSize.sm,
                  fontFamily: typography.fontFamily.primary,
                  fontWeight: 500,
                  wordWrap: 'break-word',
                  lineHeight: typography.lineHeight.normal,
                }}
              >
                {toast.message}
              </p>
            </div>

            {/* Botón cerrar */}
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'none',
                border: 'none',
                color: colorScheme.text,
                cursor: 'pointer',
                fontSize: '18px',
                padding: '0',
                opacity: 0.7,
                transition: 'opacity 0.2s',
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.opacity = '1';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.opacity = '0.7';
              }}
            >
              ✕
            </button>
          </div>
        );
      })}

      {/* Animación CSS */}
      <style>{`
        @keyframes fadeInSlideIn {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ToastDisplay;
