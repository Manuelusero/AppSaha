'use client';

import { useState, useCallback } from 'react';

/**
 * Hook personalizado para manejar estados booleanos con toggle
 * Simplifica el manejo de modales, dropdowns, y otros componentes on/off
 * 
 * @param initialValue - Valor inicial (default: false)
 * 
 * @example
 * ```tsx
 * const [isOpen, toggleOpen, setIsOpen] = useToggle(false);
 * 
 * // Toggle (cambiar entre true/false)
 * <button onClick={toggleOpen}>Toggle Modal</button>
 * 
 * // Set directo
 * <button onClick={() => setIsOpen(true)}>Abrir</button>
 * <button onClick={() => setIsOpen(false)}>Cerrar</button>
 * 
 * {isOpen && <Modal onClose={toggleOpen} />}
 * ```
 */
export function useToggle(initialValue: boolean = false): [boolean, () => void, (value: boolean) => void] {
  const [value, setValue] = useState<boolean>(initialValue);

  // Función para hacer toggle
  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  return [value, toggle, setValue];
}
