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
                  ? `bg-${colors.primary.main} text-white border-${colors.primary.main}`
                  : `bg-white border-${colors.neutral[300]} hover:border-${colors.primary.main}`
              }`}
              style={{
                fontFamily: typography.fontFamily.primary,
                fontSize: typography.fontSize.sm
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
