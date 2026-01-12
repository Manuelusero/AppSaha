'use client';

import { useState, useEffect, useCallback } from 'react';

interface UseFetchOptions extends RequestInit {
  skip?: boolean; // Permite saltar la petición inicial
  token?: string | null; // Token de autenticación
}

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  setData: (data: T | null) => void;
}

/**
 * Hook personalizado para hacer fetch con manejo automático de estados
 * 
 * @param url - URL del endpoint a consultar
 * @param options - Opciones de configuración (incluye opciones de fetch estándar)
 * @param options.skip - Si es true, no ejecuta el fetch inicial (default: false)
 * @param options.token - Token de autenticación para añadir en headers
 * 
 * @example
 * ```tsx
 * const { data, loading, error, refetch } = useFetch<Provider[]>(
 *   'http://localhost:8000/api/providers',
 *   { token: localStorage.getItem('token') }
 * );
 * 
 * // Con skip para fetch manual
 * const { data, loading, refetch } = useFetch('/api/bookings', { skip: true });
 * // Luego llamar: await refetch();
 * ```
 */
export function useFetch<T = any>(
  url: string,
  options: UseFetchOptions = {}
): UseFetchResult<T> {
  const { skip = false, token, ...fetchOptions } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(!skip);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!url) return;

    setLoading(true);
    setError(null);

    try {
      // Preparar headers
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(fetchOptions.headers as Record<string, string>),
      };

      // Añadir token si existe
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(url, {
        ...fetchOptions,
        headers,
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error en useFetch:', errorMessage);
    } finally {
      setLoading(false);
    }
  }, [url, token, fetchOptions]);

  // Ejecutar fetch inicial si no está en modo skip
  useEffect(() => {
    if (!skip) {
      fetchData();
    }
  }, [skip, fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    setData,
  };
}
