'use client';
import React from 'react';
import { colors, typography, spacing } from '@/styles/tokens';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'tel' | 'number' | 'password';
  required?: boolean;
  disabled?: boolean;
  error?: string;
  success?: boolean | string; // ✨ New: Show success state (true for default, or custom message)
  className?: string; // Para casos especiales que necesiten override
}

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  required = false,
  disabled = false,
  error,
  success = false,
  className = '',
}) => {
  const [isFocused, setIsFocused] = React.useState(false);
  
  const isSuccess = !!success; // Normalize success to boolean
  const successMessage = typeof success === 'string' ? success : undefined;

  const getBorderColor = () => {
    if (error) return colors.error.main;
    if (isSuccess) return colors.success.main;
    if (isFocused) return colors.primary.main;
    return colors.neutral[300];
  };

  const getBackgroundColor = () => {
    if (error) return colors.error.light;
    if (isSuccess) return colors.success.light;
    return 'white';
  };

  const getRingColor = () => {
    if (error) return colors.error.main;
    if (isSuccess) return colors.success.main;
    return colors.primary.main;
  };

  return (
    <div className="w-full">
      {label && (
        <label 
          className="block mb-2 flex items-center gap-1" 
          style={{ 
            fontFamily: typography.fontFamily.primary,
            fontSize: typography.fontSize.base,
            color: colors.neutral.black,
            fontWeight: typography.fontWeight.normal,
          }}
        >
          {label}
          {required && (
            <span 
              title="Campo requerido"
              style={{ 
                color: colors.error.main, 
                fontWeight: 'bold',
                fontSize: typography.fontSize.sm
              }}
            >
              *
            </span>
          )}
        </label>
      )}
      
      {/* Input container with icon support */}
      <div className="relative flex items-center">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          aria-required={required}
          aria-invalid={!!error}
          className={`w-full px-4 py-3 pr-10 rounded-full border-2 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-white transition-all duration-300 ${
            disabled ? 'opacity-50 cursor-not-allowed grayscale' : ''
          } ${className}`}
          style={{ 
            fontFamily: typography.fontFamily.primary,
            fontSize: typography.fontSize.base,
            color: colors.neutral.black,
            borderColor: getBorderColor(),
            backgroundColor: getBackgroundColor(),
            boxShadow: isFocused ? `0 0 0 2px ${getRingColor()}20` : 'none',
            transition: 'border-color 300ms ease-in-out, box-shadow 300ms ease-in-out, background-color 300ms ease-in-out',
          }}
        />
        
        {/* ✅ Success Icon */}
        {isSuccess && !error && (
          <svg
            className="absolute right-3 w-5 h-5"
            style={{ color: colors.success.main }}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
          </svg>
        )}
        
        {/* ❌ Error Icon */}
        {error && (
          <svg
            className="absolute right-3 w-5 h-5"
            style={{ color: colors.error.main }}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
        )}
      </div>
      
      {/* Error message with icon */}
      {error && (
        <div className="mt-2 flex items-start gap-2">
          <svg
            className="w-4 h-4 flex-shrink-0 mt-0.5"
            style={{ color: colors.error.main }}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
          <p 
            className="text-sm flex-1" 
            style={{ 
              fontFamily: typography.fontFamily.primary,
              color: colors.error.main,
              fontWeight: typography.fontWeight.normal
            }}
            role="alert"
          >
            {error}
          </p>
        </div>
      )}
      
      {/* Success message */}
      {isSuccess && !error && (
        <p 
          className="mt-2 text-sm flex items-center gap-2" 
          style={{ 
            fontFamily: typography.fontFamily.primary,
            color: colors.success.main,
            fontWeight: typography.fontWeight.normal
          }}
          role="status"
        >
          <svg
            className="w-4 h-4 flex-shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
          </svg>
          <span>{successMessage || 'Campo válido'}</span>
        </p>
      )}
    </div>
  );
};
