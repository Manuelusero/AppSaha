import { useState } from 'react';
import { colors, typography, spacing, borderRadius, shadows, withOpacity } from '@/styles/tokens';

interface GeolocationButtonProps {
  onLocation: (lat: number, lng: number) => void;
  disabled?: boolean;
}

export default function GeolocationButton({ onLocation, disabled = false }: GeolocationButtonProps) {
  const [loading, setLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = () => {
    if (!navigator.geolocation) {
      setError('Geolocalización no soportada por tu navegador');
      setTimeout(() => setError(null), 3000);
      return;
    }
    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        onLocation(latitude, longitude);
        setLoading(false);
        setShowTooltip(false);
      },
      (err) => {
        console.error('Error al obtener ubicación:', err.code, err.message);
        let errorMsg = 'No se pudo obtener tu ubicación';
        if (err.code === 1) {
          errorMsg = 'Permiso denegado. Habilita la geolocalización en tu navegador';
        } else if (err.code === 2) {
          errorMsg = 'Ubicación no disponible. Intenta de nuevo';
        } else if (err.code === 3) {
          errorMsg = 'Tiempo de espera agotado. Intenta de nuevo';
        }
        setError(errorMsg);
        setLoading(false);
        setTimeout(() => setError(null), 4000);
      }
    );
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled || loading}
        onMouseEnter={() => !loading && setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="flex items-center justify-center transition-all duration-300 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10"
        style={{
          borderRadius: borderRadius.full,
          backgroundColor: withOpacity(colors.primary.pale, 0.1),
          border: `2px solid ${colors.primary.main}`,
          cursor: disabled || loading ? 'not-allowed' : 'pointer',
          opacity: disabled || loading ? 0.6 : 1,
          boxShadow: showTooltip ? shadows.md : 'none',
        }}
        aria-label="Obtener ubicación actual"
      >
        {loading ? (
          // Spinner
          <svg 
            className="animate-spin w-4 h-4 sm:w-5 sm:h-5" 
            viewBox="0 0 24 24"
            style={{ color: colors.primary.main }}
          >
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.3" />
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" 
              style={{
                strokeDasharray: '62.83',
                strokeDashoffset: '31.4',
                opacity: 1
              }}
            />
          </svg>
        ) : (
          // Location icon
          <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke={colors.primary.main} strokeWidth="2" style={{ maxWidth: '18px', maxHeight: '18px' }}>
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        )}
      </button>

      {/* Tooltip */}
      {showTooltip && !error && (
        <div
          style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginBottom: spacing[2],
            padding: `${spacing[1]} ${spacing[2]} ${spacing[1]} ${spacing[3]}`,
            backgroundColor: colors.neutral.black,
            color: colors.neutral.white,
            borderRadius: borderRadius.md,
            fontSize: typography.fontSize.xs,
            fontFamily: typography.fontFamily.serif,
            fontWeight: 500,
            whiteSpace: 'nowrap',
            zIndex: 50,
            boxShadow: shadows.md,
            pointerEvents: 'none',
          }}
        >
          Localizar
          {/* Flecha hacia abajo */}
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '4px solid transparent',
              borderRight: '4px solid transparent',
              borderTop: `4px solid ${colors.neutral.black}`,
            }}
          />
        </div>
      )}

      {/* Error message */}
      {error && (
        <div
          style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginBottom: spacing[2],
            padding: `${spacing[2]} ${spacing[2]}`,
            backgroundColor: colors.error.main,
            color: colors.neutral.white,
            borderRadius: borderRadius.md,
            fontSize: typography.fontSize.xs,
            fontFamily: typography.fontFamily.primary,
            whiteSpace: 'normal',
            maxWidth: '160px',
            zIndex: 50,
            boxShadow: shadows.md,
            pointerEvents: 'none',
            textAlign: 'center',
            lineHeight: '1.3',
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}
