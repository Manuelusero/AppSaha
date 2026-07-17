import React from 'react';
import { colors, typography } from '@/styles/tokens';

interface ButtonProps {
  variant?: 'primary' | 'outline' | 'secondary';
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string; // Para casos especiales que necesiten override
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  onClick,
  type = 'button',
  disabled = false,
  fullWidth = false,
  className = '',
}) => {
  // Estilos base - usar solo clases Tailwind que NO dependen de interpolación dinámica
  const getBaseClasses = () => {
    const base = 'px-8 py-3 rounded-full font-medium transition-all duration-300';
    const focus = 'focus:outline-none focus:ring-2 focus:ring-offset-2';
    const ring = `focus:ring-[${colors.primary.main}]`;
    const width = fullWidth ? 'w-full' : '';
    const cursor = disabled ? 'cursor-not-allowed' : 'cursor-pointer';
    
    return `${base} ${focus} ${width} ${cursor} ${className}`;
  };

  // Determinar estilos según el variant y estado
  const getStyles = () => {
    let bgColor = colors.neutral.white;
    let borderColor = colors.neutral[300];
    let textColor = colors.neutral.black;
    let hoverBg = colors.neutral.white;
    let hoverBorder = colors.neutral[300];

    if (!disabled) {
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
      opacity: disabled ? 0.6 : 1,
      filter: disabled ? 'grayscale(100%)' : 'grayscale(0%)',
    };
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={getBaseClasses()}
      style={getStyles()}
      onMouseEnter={(e) => {
        if (!disabled) {
          const target = e.currentTarget;
          if (variant === 'primary') {
            target.style.filter = 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))';
          }
        }
      }}
      onMouseLeave={(e) => {
        const target = e.currentTarget;
        target.style.filter = disabled ? 'grayscale(100%)' : 'grayscale(0%)';
      }}
    >
      {children}
    </button>
  );
};

