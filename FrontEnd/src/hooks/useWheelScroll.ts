'use client';

import { useEffect } from 'react';

/**
 * Hook para permitir que el scroll de la página se propague
 * incluso cuando el cursor está sobre un elemento con overflow-y-auto
 * 
 * Uso:
 * const ref = useRef(null);
 * useWheelScroll(ref);
 * 
 * <div ref={ref} className="overflow-y-auto max-h-60">
 *   content here
 * </div>
 */
export const useWheelScroll = (ref: React.RefObject<any>) => {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleWheel = (event: WheelEvent) => {
      const { scrollTop, scrollHeight, clientHeight } = element;
      const isAtTop = scrollTop === 0;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight;

      // Si el scroll está en el límite y el evento va en esa dirección,
      // permitir que el scroll se propague al padre
      if ((isAtTop && event.deltaY < 0) || (isAtBottom && event.deltaY > 0)) {
        // No prevenir el evento - dejar que se propague
        return;
      }

      // Si no estamos en el límite, prevenir que se propague
      event.preventDefault();
    };

    element.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      element.removeEventListener('wheel', handleWheel);
    };
  }, [ref]);
};
