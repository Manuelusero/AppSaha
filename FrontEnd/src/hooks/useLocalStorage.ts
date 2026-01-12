'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * Hook personalizado para sincronizar estado con localStorage
 * Persiste automáticamente el estado y se sincroniza entre tabs/ventanas
 * 
 * @param key - Clave de localStorage
 * @param initialValue - Valor inicial si no existe en localStorage
 * 
 * @example
 * ```tsx
 * const [user, setUser] = useLocalStorage('user', null);
 * const [theme, setTheme] = useLocalStorage('theme', 'light');
 * 
 * // Usar como useState normal:
 * setUser({ id: 1, name: 'Juan' });
 * setTheme('dark');
 * ```
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void, () => void] {
  // Estado para almacenar el valor
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error al leer localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Función para establecer el valor
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Permitir que value sea una función para API similar a useState
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        
        setStoredValue(valueToStore);
        
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error(`Error al guardar en localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  // Función para eliminar el valor
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error al eliminar localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Sincronizar entre tabs/ventanas
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(`Error al parsear localStorage key "${key}":`, error);
        }
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, [key]);

  return [storedValue, setValue, removeValue];
}
