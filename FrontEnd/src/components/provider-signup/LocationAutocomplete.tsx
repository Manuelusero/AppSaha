'use client';

import { useState, useRef, useEffect } from 'react';
import { colors, typography } from '@/styles/tokens';

interface LocationAutocompleteProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  locations: string[];
  placeholder?: string;
  required?: boolean;
  maxResults?: number;
}

/**
 * Input con autocomplete para ubicaciones
 */
export default function LocationAutocomplete({
  label,
  value,
  onChange,
  locations,
  placeholder = 'Ingresa tu ubicación',
  required = true,
  maxResults = 5
}: LocationAutocompleteProps) {
  const [filteredLocations, setFilteredLocations] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown cuando se hace click afuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (inputValue: string) => {
    onChange(inputValue);

    if (inputValue.length > 0) {
      const filtered = locations.filter((location) =>
        location.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredLocations(filtered.slice(0, maxResults));
      setShowDropdown(true);
    } else {
      setFilteredLocations([]);
      setShowDropdown(false);
    }
  };

  const handleSelectLocation = (location: string) => {
    onChange(location);
    setShowDropdown(false);
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocalización no soportada por tu navegador');
      return;
    }
    setIsFetchingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const value = `${latitude.toFixed(4)},${longitude.toFixed(4)}`;
        onChange(value);
        setIsFetchingLocation(false);
      },
      (err) => {
        console.error('Error al obtener ubicación:', err);
        setIsFetchingLocation(false);
      }
    );
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
      <input
        type="text"
        value={value}
        onChange={(e) => handleInputChange(e.target.value)}
        required={required}
        className="w-full px-4 py-3 rounded-full border-2 focus:outline-none"
        style={{
          fontFamily: typography.fontFamily.primary,
          fontSize: typography.fontSize.base,
          color: colors.neutral.black,
          borderColor: colors.neutral[300],
          // focus border handled by Tailwind focus:border-[#244C87] (kept for consistency)
        }}
        placeholder={placeholder}
        autoComplete="off"
      />
      {showDropdown && filteredLocations.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border-2 rounded-full shadow-lg max-h-60 overflow-y-auto">
          {filteredLocations.map((location) => (
            <div
              key={location}
              onClick={() => handleSelectLocation(location)}
              className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors"
              style={{
                fontFamily: typography.fontFamily.primary,
                fontSize: typography.fontSize.base,
                color: colors.neutral.black
              }}
            >
              {location}
            </div>
          ))}
        </div>
      )}
      {/* Botón de geolocalización */}
      <button
        type="button"
        onClick={handleGetLocation}
        className="absolute inset-y-0 right-0 flex items-center pr-3"
        disabled={isFetchingLocation}
        aria-label="Obtener ubicación actual"
      >
        {isFetchingLocation ? (
          <svg className="animate-spin h-5 w-5 text-primary-500" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          </svg>
        ) : (
          <svg className="h-5 w-5 text-primary-500" viewBox="0 0 24 24">
            <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16z" fill="currentColor" />
          </svg>
        )}
      </button>
    </div>
  );
}
