import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'CLIENT' | 'PROVIDER';
  phone?: string;
  avatar?: string;
}

interface AuthState {
  // State
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
  
  // Helper
  getToken: () => string | null;
  getUserRole: () => 'CLIENT' | 'PROVIDER' | null;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      // Login: establece usuario y token
      login: (user, token) => {
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
        
        // Guardar también en localStorage para compatibilidad
        localStorage.setItem('token', token);
        localStorage.setItem('userId', user.id);
        if (user.role === 'PROVIDER') {
          localStorage.setItem('providerId', user.id);
        }
      },

      // Logout: limpia todo el estado
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
        
        // Limpiar también localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('providerId');
        localStorage.removeItem('registroCompleto');
      },

      // Establecer usuario (útil para actualizar después de fetch)
      setUser: (user) => {
        set({ user, isAuthenticated: true });
      },

      // Actualizar parcialmente el usuario
      updateUser: (updates) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...updates } });
        }
      },

      // Controlar estado de carga
      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      // Obtener token actual
      getToken: () => {
        return get().token;
      },

      // Obtener rol del usuario
      getUserRole: () => {
        return get().user?.role || null;
      },
    }),
    {
      name: 'auth-storage', // Nombre en localStorage
      partialize: (state) => ({
        // Solo persistir estos campos
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Hook personalizado para compatibilidad con código existente
export const useAuth = () => {
  const { user, token, isAuthenticated, isLoading, login, logout } = useAuthStore();
  
  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };
};
