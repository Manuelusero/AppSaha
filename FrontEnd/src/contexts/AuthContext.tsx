'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useAuthStore, User } from '@/store/authStore';

// Re-exportar User type
export type { User } from '@/store/authStore';

export interface AuthContextType {
  user: User | null;
  token: string | null;
  providerId: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User, providerId?: string) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

// Contexto (mantenido solo para compatibilidad con código legacy)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Provider que envuelve Zustand para mantener compatibilidad
export function AuthProvider({ children }: AuthProviderProps) {
  const store = useAuthStore();

  // Adapter: mantener providerId por separado (legacy)
  const providerId = typeof window !== 'undefined' 
    ? localStorage.getItem('providerId') 
    : null;

  // Adapter para la función login
  const login = (newToken: string, newUser: User, newProviderId?: string) => {
    store.login(newUser, newToken);
    
    // Guardar providerId (debe ser el USER ID, no el ProviderProfile ID)
    if (newProviderId) {
      localStorage.setItem('providerId', newProviderId);
    } else if (newUser.role === 'PROVIDER') {
      // Usar el ID del usuario, NO el ID del providerProfile
      localStorage.setItem('providerId', newUser.id);
    }
  };

  // Adapter para logout
  const logout = () => {
    store.logout();
  };

  // Adapter para updateUser
  const updateUser = (updatedUser: User) => {
    store.setUser(updatedUser);
  };

  const value: AuthContextType = {
    user: store.user,
    token: store.token,
    providerId,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook personalizado - Ahora usa el contexto que envuelve Zustand
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}

