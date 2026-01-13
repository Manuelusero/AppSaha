import React from 'react';
import { colors } from '@/styles/tokens';

interface StarRatingProps {
  rating: number;
  totalStars?: number;
  size?: 'sm' | 'md' | 'lg';
  onChange?: (rating: number) => void;
  readonly?: boolean;
  showLabel?: boolean;
}

/**
 * Componente de rating con estrellas
 * Puede ser readonly (solo lectura) o editable
 * 
 * @example
 * ```tsx
 * // Solo lectura
 * <StarRating rating={4.5} readonly />
 * 
 * // Editable
 * const [rating, setRating] = useState(5);
 * <StarRating rating={rating} onChange={setRating} showLabel />
 * ```
 */
export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  totalStars = 5,
  size = 'md',
  onChange,
  readonly = false,
  showLabel = false,
}) => {
  const sizeMap = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  const ratingLabels: { [key: number]: string } = {
    5: '😊 Excelente',
    4: '🙂 Muy Bueno',
    3: '😐 Bueno',
    2: '😕 Regular',
    1: '😞 Malo',
  };

  const handleClick = (newRating: number) => {
    if (!readonly && onChange) {
      onChange(newRating);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-1">
        {[...Array(totalStars)].map((_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= rating;

          return (
            <button
              key={index}
              type="button"
              onClick={() => handleClick(starValue)}
              disabled={readonly}
              className={`${sizeMap[size]} transition-colors ${
                readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
              }`}
              style={{
                color: isFilled ? '#FFC107' : colors.neutral[300],
                border: 'none',
                background: 'none',
                padding: '2px',
              }}
              aria-label={`${starValue} ${starValue === 1 ? 'estrella' : 'estrellas'}`}
            >
              ★
            </button>
          );
        })}
      </div>

      {showLabel && !readonly && (
        <p
          className="text-center font-medium"
          style={{
            color: colors.neutral[700],
            fontSize: '14px',
          }}
        >
          {ratingLabels[rating] || 'Selecciona una calificación'}
        </p>
      )}

      {readonly && rating > 0 && (
        <p
          className="text-sm"
          style={{
            color: colors.neutral[600],
          }}
        >
          {rating.toFixed(1)} / {totalStars}
        </p>
      )}
    </div>
  );
};
