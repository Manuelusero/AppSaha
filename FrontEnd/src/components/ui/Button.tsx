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
  const baseStyles = 'px-8 py-3 rounded-full font-medium';
  
  const variantStyles = {
    primary: `text-white hover:bg-[${colors.primary.dark}] disabled:bg-gray-400`,
    outline: `border-2 text-white disabled:border-gray-400 disabled:text-gray-400`,
    secondary: `bg-white border-2 hover:bg-gray-50 disabled:bg-gray-200`,
  };

  // Estilos inline para usar tokens (compatible con style props)
  const getBackgroundColor = () => {
    if (disabled) return undefined;
    if (variant === 'primary') return colors.primary.main;
    return undefined;
  };

  const getBorderColor = () => {
    if (disabled) return undefined;
    if (variant === 'outline' || variant === 'secondary') return colors.primary.main;
    return undefined;
  };

  const getTextColor = () => {
    if (disabled) return undefined;
    if (variant === 'outline' || variant === 'secondary') return colors.primary.main;
    return undefined;
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${
        fullWidth ? 'w-full' : ''
      } ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} ${className}`}
      style={{ 
        fontFamily: typography.fontFamily.primary,
        fontSize: typography.fontSize.base,
        backgroundColor: getBackgroundColor(),
        borderColor: getBorderColor(),
        color: getTextColor(),
        transition: 'all 300ms ease-in-out',
      }}
    >
      {children}
    </button>
  );
};

