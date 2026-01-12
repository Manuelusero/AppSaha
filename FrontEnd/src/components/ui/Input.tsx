import React from 'react';
import { colors, typography } from '@/styles/tokens';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'tel' | 'number' | 'password';
  required?: boolean;
  disabled?: boolean;
  error?: string;
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
  className = '',
}) => {
  const [isFocused, setIsFocused] = React.useState(false);

  const getBorderColor = () => {
    if (error) return colors.error.main;
    if (isFocused) return colors.primary.main;
    return colors.neutral[300];
  };

  return (
    <div className="w-full">
      {label && (
        <label 
          className="block mb-2" 
          style={{ 
            fontFamily: typography.fontFamily.primary,
            fontSize: typography.fontSize.base,
            color: colors.neutral.black,
            fontWeight: typography.fontWeight.normal,
          }}
        >
          {label}
          {required && <span style={{ color: colors.error.main, marginLeft: '4px' }}>*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`w-full px-4 py-3 rounded-full border-2 focus:outline-none bg-white ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        } ${className}`}
        style={{ 
          fontFamily: typography.fontFamily.primary,
          fontSize: typography.fontSize.base,
          color: colors.neutral.black,
          borderColor: getBorderColor(),
          transition: 'border-color 300ms ease-in-out',
        }}
      />
      {error && (
        <p 
          className="mt-1 text-sm" 
          style={{ 
            fontFamily: typography.fontFamily.primary,
            color: colors.error.main 
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
};
