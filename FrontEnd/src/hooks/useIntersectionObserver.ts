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
): [React.RefObject<HTMLDivElement>, boolean] {
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

/**
 * Componente lazy image con loading placeholder
 */
interface LazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  placeholder?: string;
}

export function LazyImage({
  src,
  alt,
  width,
  height,
  className = '',
  placeholder = '/placeholder.png',
}: LazyImageProps) {
  const [ref, isVisible] = useIntersectionObserver({
    rootMargin: '100px', // Cargar 100px antes
    freezeOnceVisible: true,
  });

  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {isVisible ? (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setIsLoaded(true)}
          loading="lazy"
        />
      ) : (
        <div
          className="bg-neutral-200 animate-pulse"
          style={{ width: width ? `${width}px` : '100%', height: height ? `${height}px` : '100%' }}
        />
      )}
    </div>
  );
}
