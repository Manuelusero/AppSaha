import React from 'react';
import { colors, typography } from '@/styles/tokens';

interface ButtonProps {
  variant?: 'primary' | 'outline' | 'secondary';
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  fullWidth?: boolean;
  loading?: boolean; // ✨ New: Show loading state with spinner
  className?: string; // Para casos especiales que necesiten override
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  onClick,
  type = 'button',
  disabled = false,
  loading = false,
  fullWidth = false,
  className = '',
}) => {
  // Combine disabled and loading states
  const isDisabled = disabled || loading;

  // Estilos base - usar solo clases Tailwind que NO dependen de interpolación dinámica
  const getBaseClasses = () => {
    const base = 'px-8 py-3 rounded-full font-medium transition-all duration-300 inline-flex items-center justify-center gap-2';
    const focus = 'focus:outline-none focus:ring-2 focus:ring-offset-2';
    const ring = `focus:ring-[${colors.primary.main}]`;
    const width = fullWidth ? 'w-full' : '';
    const cursor = isDisabled ? 'cursor-not-allowed' : 'cursor-pointer';
    
    return `${base} ${focus} ${width} ${cursor} ${className}`;
  };

  // Determinar estilos según el variant y estado
  const getStyles = () => {
    let bgColor = colors.neutral.white;
    let borderColor = colors.neutral[300];
    let textColor = colors.neutral.black;
    let hoverBg = colors.neutral.white;
    let hoverBorder = colors.neutral[300];

    if (!isDisabled) {
      if (variant === 'primary') {
        bgColor = colors.primary.main;
        textColor = colors.neutral.white;
        hoverBg = colors.primary.dark || colors.primary.main;
        borderColor = colors.primary.main;
      } else if (variant === 'outline') {
        bgColor = 'transparent';
        borderColor = colors.primary.main;
        textColor = colors.primary.main;
        hoverBg = colors.primary.pale;
      } else if (variant === 'secondary') {
        bgColor = colors.neutral.white;
        borderColor = colors.primary.main;
        textColor = colors.primary.main;
        hoverBg = colors.neutral[100];
      }
    } else {
      // Disabled state: opacidad + grayscale
      bgColor = colors.neutral[200];
      borderColor = colors.neutral[300];
      textColor = colors.neutral[600];
    }

    return {
      backgroundColor: bgColor,
      borderColor: borderColor,
      color: textColor,
      borderWidth: variant !== 'primary' ? '2px' : '0px',
      transition: 'all 300ms ease-in-out',
      opacity: isDisabled ? 0.6 : 1,
      filter: isDisabled ? 'grayscale(100%)' : 'grayscale(0%)',
    };
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      aria-busy={loading}
      aria-disabled={isDisabled}
      className={getBaseClasses()}
      style={getStyles()}
      onMouseEnter={(e) => {
        if (!isDisabled) {
          const target = e.currentTarget;
          if (variant === 'primary') {
            target.style.filter = 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))';
          }
        }
      }}
      onMouseLeave={(e) => {
        const target = e.currentTarget;
        target.style.filter = isDisabled ? 'grayscale(100%)' : 'grayscale(0%)';
      }}
    >
      {/* 🔄 Loading Spinner */}
      {loading && (
        <svg
          className="w-4 h-4 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      
      {/* Button text */}
      <span>{children}</span>
    </button>
  );
};

