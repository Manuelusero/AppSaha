/**
 * Hook personalizado para intersección (lazy loading de imágenes)
 * Detecta cuando un elemento entra en el viewport para cargar contenido bajo demanda
 */

import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
  freezeOnceVisible?: boolean;
}

export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
): [React.RefObject<HTMLDivElement | null>, boolean] {
  const {
    root = null,
    rootMargin = '50px', // Cargar 50px antes de llegar
    threshold = 0,
    freezeOnceVisible = true,
  } = options;

  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Si ya es visible y se congela, no hacer nada
    if (freezeOnceVisible && isVisible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isIntersecting = entry.isIntersecting;
        setIsVisible(isIntersecting);

        // Si se congela al hacerse visible, desconectar observer
        if (isIntersecting && freezeOnceVisible) {
          observer.disconnect();
        }
      },
      { root, rootMargin, threshold }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [root, rootMargin, threshold, freezeOnceVisible, isVisible]);

  return [elementRef, isVisible];
}
