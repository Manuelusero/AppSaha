'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { colors } from '@/styles/tokens';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number; // ms, 0 = no auto-dismiss
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (message: string, type?: ToastType, duration?: number) => string;
  removeToast: (id: string) => void;
  clearAll: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    (message: string, type: ToastType = 'info', duration = 3000) => {
      const id = `toast-${Date.now()}-${Math.random()}`;
      const newToast: Toast = { id, type, message, duration };

      setToasts((prev) => [...prev, newToast]);

      // Auto-dismiss si duration > 0
      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }

      return id;
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearAll }}>
      {children}
    </ToastContext.Provider>
  );
};

/**
 * Hook para usar notificaciones (Toasts)
 * 
 * @example
 * ```tsx
 * const { addToast, removeToast, clearAll } = useToast();
 * 
 * addToast('Guardado con éxito', 'success');
 * addToast('Error al guardar', 'error');
 * ```
 */
export const useToast = (): Omit<ToastContextType, 'toasts'> => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast debe usarse dentro de ToastProvider');
  }
  const { addToast, removeToast, clearAll } = context;
  return { addToast, removeToast, clearAll };
};

// Hook interno para acceder a los toasts (usado por el componente Toast)
export const useToastContext = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('ToastContext debe estar dentro de ToastProvider');
  }
  return context;
};
