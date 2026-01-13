import React, { useEffect } from 'react';
import { colors, typography, spacing } from '@/styles/tokens';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'brown' | 'orange' | 'blue';
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
}

/**
 * Componente Modal reutilizable
 * 
 * @example
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 * 
 * <Modal 
 *   isOpen={isOpen} 
 *   onClose={() => setIsOpen(false)}
 *   title="Título del Modal"
 *   variant="brown"
 * >
 *   <p>Contenido del modal</p>
 * </Modal>
 * ```
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  maxWidth = 'md',
  variant = 'default',
  showCloseButton = true,
  closeOnBackdropClick = true,
}) => {
  // Cerrar con tecla ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const maxWidthMap = {
    sm: '432px',
    md: '600px',
    lg: '800px',
    xl: '1200px',
  };

  const variantColors = {
    default: '#FFFFFF',
    brown: '#A0724E',
    orange: '#B45B39',
    blue: colors.primary.main,
  };

  const handleBackdropClick = () => {
    if (closeOnBackdropClick) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={handleBackdropClick}
    >
      <div
        className="relative w-full overflow-y-auto"
        style={{
          maxWidth: maxWidthMap[maxWidth],
          maxHeight: '90vh',
          backgroundColor: variantColors[variant],
          borderRadius: '24px',
          padding: spacing[8],
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón cerrar */}
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 hover:opacity-80 transition-opacity"
            style={{
              cursor: 'pointer',
              background: 'none',
              border: 'none',
              padding: '8px',
            }}
            aria-label="Cerrar modal"
          >
            <svg
              width="24"
              height="24"
              fill="none"
              stroke={variant === 'default' ? colors.neutral.black : '#FFFFFF'}
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Título */}
        {title && (
          <h2
            className="mb-6"
            style={{
              fontFamily: typography.fontFamily.primary,
              fontSize: typography.fontSize['2xl'],
              fontWeight: typography.fontWeight.semibold,
              color: variant === 'default' ? colors.neutral.black : '#FFFFFF',
            }}
          >
            {title}
          </h2>
        )}

        {/* Contenido */}
        <div>{children}</div>
      </div>
    </div>
  );
};
