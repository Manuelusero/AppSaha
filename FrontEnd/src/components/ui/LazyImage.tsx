'use client';

import { useState } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

/**
 * Componente de imagen con lazy loading y placeholder
 * Carga la imagen solo cuando entra en el viewport
 */
interface LazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  placeholder?: string;
}

export default function LazyImage({
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
