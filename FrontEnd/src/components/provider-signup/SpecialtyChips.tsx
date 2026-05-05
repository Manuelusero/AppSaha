'use client';

import { colors, typography } from '@/styles/tokens';

interface SpecialtyChipsProps {
  label: string;
  specialties: string[];
  selectedSpecialties: string[];
  onToggle: (specialty: string) => void;
  required?: boolean;
}

/**
 * Chips seleccionables para especialidades
 */
export default function SpecialtyChips({
  label,
  specialties,
  selectedSpecialties,
  onToggle,
  required = true
}: SpecialtyChipsProps) {
  return (
    <div>
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
      <div className="flex flex-wrap gap-2">
        {specialties.map((specialty) => {
          const isSelected = selectedSpecialties.includes(specialty);
          return (
            <button
              key={specialty}
              type="button"
              onClick={() => onToggle(specialty)}
              className={`px-4 py-2 rounded-full border-2 transition-colors ${
                isSelected
                  ? 'bg-[#244C87] text-white border-[#244C87]'
                  : 'bg-white border-black hover:border-[#244C87]'
              }`}
              style={{
                fontFamily: typography.fontFamily.primary,
                fontSize: typography.fontSize.small
              }}
            >
              {specialty}
            </button>
          );
        })}
      </div>
    </div>
  );
}
