'use client';

import { useState, useRef, useEffect } from 'react';
import { colors, typography } from '@/styles/tokens';

interface ProfessionOption {
  value: string;
  label: string;
}

interface ProfessionSelectorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: ProfessionOption[];
  placeholder?: string;
  required?: boolean;
}

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(
    option => option.value === value
  );

  return (
    <div className="relative w-full" ref={containerRef}>
      <label
        className="block mb-2"
        style={{
          fontFamily: typography.fontFamily.primary,
          fontSize: typography.fontSize.base,
          color: colors.neutral.black
        }}
      >
        {label}
        {required && ' *'}
      </label>

      <input
        type="text"
        readOnly
        value={selectedOption?.label ?? ''}
        placeholder={placeholder}
        onClick={() => setIsOpen(prev => !prev)}
        className="w-full px-4 py-3 rounded-full border-2 border-gray-300 focus:border-[#244C87] focus:outline-none cursor-pointer"
        style={{
          fontFamily: typography.fontFamily.primary,
          fontSize: typography.fontSize.base,
          color: colors.neutral.black
        }}
      />

      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-300 rounded-2xl shadow-lg max-h-64 overflow-y-auto z-50">

          {options.map(option => (
            <button
              key={option.value}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-3 transition-colors hover:bg-gray-100 ${
                option.value === value
                  ? 'bg-blue-50 font-semibold'
                  : ''
              }`}
              style={{
                fontFamily: typography.fontFamily.primary,
                fontSize: typography.fontSize.base,
                color: colors.neutral.black
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}