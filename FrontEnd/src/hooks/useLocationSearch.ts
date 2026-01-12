'use client';

import { useState, useEffect, useCallback } from 'react';

interface LocationSuggestion {
  display_name: string;
  name: string;
}

interface UseLocationSearchOptions {
  minChars?: number;
  debounceMs?: number;
  country?: string;
  limit?: number;
}

/**
 * Hook personalizado para búsqueda de ubicaciones con debounce
 * Utiliza la API de Nominatim (OpenStreetMap) para buscar ubicaciones en Argentina
 * 
 * @param options - Opciones de configuración
 * @param options.minChars - Mínimo de caracteres para iniciar búsqueda (default: 3)
 * @param options.debounceMs - Tiempo de debounce en ms (default: 300)
 * @param options.country - Código del país (default: 'Argentina')
 * @param options.limit - Límite de resultados (default: 15)
 * 
 * @example
 * ```tsx
 * const { 
 *   ubicacion, 
 *   setUbicacion, 
 *   sugerencias, 
 *   loading, 
 *   mostrarDropdown,
 *   setMostrarDropdown 
 * } = useLocationSearch({ minChars: 3, debounceMs: 300 });
 * ```
 */
export function useLocationSearch(options: UseLocationSearchOptions = {}) {
  const {
    minChars = 3,
    debounceMs = 300,
    country = 'Argentina',
    limit = 15
  } = options;

  const [ubicacion, setUbicacion] = useState('');
  const [sugerencias, setSugerencias] = useState<LocationSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [mostrarDropdown, setMostrarDropdown] = useState(false);

  // Función para buscar ubicaciones
  const buscarUbicaciones = useCallback(async (query: string) => {
    if (query.length < minChars) {
      setSugerencias([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
        `q=${encodeURIComponent(query)},${country}` +
        `&format=json` +
        `&addressdetails=1` +
        `&limit=${limit}` +
        `&accept-language=es`,
        {
          headers: {
            'User-Agent': 'SAHA-App/1.0'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Error al buscar ubicaciones');
      }

      const data = await response.json();
      
      // Filtrar y formatear resultados
      const ubicacionesFiltradas = data
        .filter((item: any) => {
          // Aceptar múltiples tipos de lugares
          const esLugarValido = 
            item.type === 'city' || 
            item.type === 'town' || 
            item.type === 'village' || 
            item.type === 'municipality' ||
            item.type === 'administrative' ||
            item.class === 'place' ||
            item.class === 'boundary' ||
            item.addresstype === 'city' ||
            item.addresstype === 'town' ||
            item.addresstype === 'village';
          
          return esLugarValido;
        })
        .map((item: any) => {
          // Obtener el nombre más apropiado
          const nombre = item.name || 
                        item.address?.city || 
                        item.address?.town || 
                        item.address?.village || 
                        item.address?.municipality ||
                        item.display_name.split(',')[0];
          
          return {
            display_name: item.display_name,
            name: nombre
          };
        });
      
      setSugerencias(ubicacionesFiltradas);
    } catch (error) {
      console.error('Error al buscar ubicaciones:', error);
      setSugerencias([]);
    } finally {
      setLoading(false);
    }
  }, [minChars, country, limit]);

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (ubicacion.length >= minChars) {
        buscarUbicaciones(ubicacion);
      } else {
        setSugerencias([]);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [ubicacion, minChars, debounceMs, buscarUbicaciones]);

  // Función helper para seleccionar ubicación
  const seleccionarUbicacion = useCallback((nombreUbicacion: string) => {
    setUbicacion(nombreUbicacion);
    setMostrarDropdown(false);
  }, []);

  // Función helper para limpiar búsqueda
  const limpiar = useCallback(() => {
    setUbicacion('');
    setSugerencias([]);
    setMostrarDropdown(false);
  }, []);

  return {
    ubicacion,
    setUbicacion,
    sugerencias,
    loading,
    mostrarDropdown,
    setMostrarDropdown,
    seleccionarUbicacion,
    limpiar
  };
}
