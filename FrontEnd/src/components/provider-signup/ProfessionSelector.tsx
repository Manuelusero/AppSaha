'use client';

import { useState, useRef, useEffect } from 'react';
import { colors, typography } from '@/styles/tokens';

interface ProfessionSelectorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  required?: boolean;
}

/**
 * Selector de profesión con dropdown personalizado
 */
export default function ProfessionSelector({
  label,
  value,
  onChange,
  options,
  placeholder = 'Seleccionar profesión',
  required = true
}: ProfessionSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown cuando se hace click afuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      <label
        className="block mb-2"
        style={{
          fontFamily: typography.fontFamily.primary,
          fontSize: typography.fontSize.base,
          color: colors.neutral.black
        }}
      >
        {label} {required && '*'}
      </label>
      <div className="relative">
        <input
          type="text"
          value={value}
          onClick={() => setIsOpen(!isOpen)}
          readOnly
          required={required}
          className="w-full px-4 py-3 rounded-full border-2 border-gray-300 focus:border-[#244C87] focus:outline-none cursor-pointer"
          style={{
            fontFamily: typography.fontFamily.primary,
            fontSize: typography.fontSize.base,
            color: colors.neutral.black
          }}
          placeholder={placeholder}
        />
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border-2 border-gray-300 rounded-2xl shadow-lg max-h-60 overflow-y-auto">
            {options.map((option) => (
              <div
                key={option}
                onClick={() => handleSelect(option)}
                className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors"
                style={{
                  fontFamily: typography.fontFamily.primary,
                  fontSize: typography.fontSize.base,
                  color: colors.neutral.black
                }}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
