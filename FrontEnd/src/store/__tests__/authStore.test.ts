/**
 * TESTS PARA ZUSTAND AUTH STORE
 * 
 * CONCEPTOS NUEVOS:
 * - Testing de state management global
 * - act(): Función de React Testing Library para envolver actualizaciones de estado
 * - renderHook: Permite usar hooks en tests sin necesidad de componentes
 * - Testing de persistencia en localStorage
 * 
 * IMPORTANTE:
 * Zustand es diferente de Context API - los stores son más simples de testear
 * porque son funciones puras sin necesidad de Providers.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuthStore } from '../authStore';
import type { User } from '../authStore';

describe('authStore', () => {
  // Usuario de ejemplo para los tests
  const mockUser: User = {
    id: '123',
    email: 'test@example.com',
    name: 'Test User',
    role: 'CLIENT',
    phone: '1234567890',
  };

  const mockToken = 'mock-jwt-token-abc123';

  // Antes de cada test, limpiamos el store y localStorage
  beforeEach(() => {
    // Reset del store a su estado inicial
    const { result } = renderHook(() => useAuthStore());
    act(() => {
      result.current.logout();
    });
    
    // Limpiar localStorage
    localStorage.clear();
  });

  describe('Estado inicial', () => {
    it('debe tener valores iniciales correctos', () => {
      const { result } = renderHook(() => useAuthStore());

      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('login()', () => {
    it('debe establecer usuario y token correctamente', () => {
      const { result } = renderHook(() => useAuthStore());

      // ACT: Ejecutamos el login
      act(() => {
        result.current.login(mockUser, mockToken);
      });

      // ASSERT: Verificamos que el estado cambió
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.token).toBe(mockToken);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.isLoading).toBe(false);
    });

    it('debe guardar token en localStorage', () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.login(mockUser, mockToken);
      });

      // Verificar que se guardó en localStorage
      expect(localStorage.getItem('token')).toBe(mockToken);
      expect(localStorage.getItem('userId')).toBe(mockUser.id);
    });

    it('debe guardar providerId si el usuario es PROVIDER', () => {
      const providerUser: User = {
        ...mockUser,
        role: 'PROVIDER',
      };

      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.login(providerUser, mockToken);
      });

      expect(localStorage.getItem('providerId')).toBe(providerUser.id);
    });

    it('NO debe guardar providerId si el usuario es CLIENT', () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.login(mockUser, mockToken);
      });

      // Como es CLIENT, no debe haber providerId
      expect(localStorage.getItem('providerId')).toBeNull();
    });
  });

  describe('logout()', () => {
    it('debe limpiar todo el estado', () => {
      const { result } = renderHook(() => useAuthStore());

      // Primero hacemos login
      act(() => {
        result.current.login(mockUser, mockToken);
      });

      // Verificamos que está logueado
      expect(result.current.isAuthenticated).toBe(true);

      // Ahora hacemos logout
      act(() => {
        result.current.logout();
      });

      // Verificamos que todo se limpió
      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.isLoading).toBe(false);
    });

    it('debe limpiar localStorage', () => {
      const { result } = renderHook(() => useAuthStore());

      // Login primero
      act(() => {
        result.current.login(mockUser, mockToken);
        localStorage.setItem('registroCompleto', 'true'); // Simular otros datos
      });

      // Logout
      act(() => {
        result.current.logout();
      });

      // Verificar que se limpió todo
      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('userId')).toBeNull();
      expect(localStorage.getItem('providerId')).toBeNull();
      expect(localStorage.getItem('registroCompleto')).toBeNull();
    });
  });

  describe('setUser()', () => {
    it('debe actualizar el usuario y marcar como autenticado', () => {
      const { result } = renderHook(() => useAuthStore());

      const newUser: User = {
        id: '456',
        email: 'new@example.com',
        name: 'New User',
        role: 'PROVIDER',
      };

      act(() => {
        result.current.setUser(newUser);
      });

      expect(result.current.user).toEqual(newUser);
      expect(result.current.isAuthenticated).toBe(true);
    });
  });

  describe('updateUser()', () => {
    it('debe actualizar parcialmente el usuario', () => {
      const { result } = renderHook(() => useAuthStore());

      // Login primero para tener un usuario
      act(() => {
        result.current.login(mockUser, mockToken);
      });

      // Actualizar solo el nombre
      act(() => {
        result.current.updateUser({ name: 'Updated Name' });
      });

      // El nombre debe cambiar, pero el resto debe mantenerse
      expect(result.current.user?.name).toBe('Updated Name');
      expect(result.current.user?.email).toBe(mockUser.email);
      expect(result.current.user?.id).toBe(mockUser.id);
    });

    it('debe actualizar múltiples campos', () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.login(mockUser, mockToken);
      });

      act(() => {
        result.current.updateUser({
          name: 'New Name',
          phone: '9999999999',
          avatar: 'https://example.com/avatar.jpg',
        });
      });

      expect(result.current.user?.name).toBe('New Name');
      expect(result.current.user?.phone).toBe('9999999999');
      expect(result.current.user?.avatar).toBe('https://example.com/avatar.jpg');
    });

    it('NO debe actualizar si no hay usuario', () => {
      const { result } = renderHook(() => useAuthStore());

      // Sin login, user es null
      expect(result.current.user).toBeNull();

      // Intentar actualizar
      act(() => {
        result.current.updateUser({ name: 'Should not work' });
      });

      // User sigue siendo null
      expect(result.current.user).toBeNull();
    });
  });

  describe('setLoading()', () => {
    it('debe cambiar el estado de loading', () => {
      const { result } = renderHook(() => useAuthStore());

      expect(result.current.isLoading).toBe(false);

      act(() => {
        result.current.setLoading(true);
      });

      expect(result.current.isLoading).toBe(true);

      act(() => {
        result.current.setLoading(false);
      });

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('getToken()', () => {
    it('debe retornar el token actual', () => {
      const { result } = renderHook(() => useAuthStore());

      // Sin login
      expect(result.current.getToken()).toBeNull();

      // Con login
      act(() => {
        result.current.login(mockUser, mockToken);
      });

      expect(result.current.getToken()).toBe(mockToken);
    });
  });

  describe('getUserRole()', () => {
    it('debe retornar null si no hay usuario', () => {
      const { result } = renderHook(() => useAuthStore());

      expect(result.current.getUserRole()).toBeNull();
    });

    it('debe retornar CLIENT para usuarios CLIENT', () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.login(mockUser, mockToken);
      });

      expect(result.current.getUserRole()).toBe('CLIENT');
    });

    it('debe retornar PROVIDER para usuarios PROVIDER', () => {
      const { result } = renderHook(() => useAuthStore());

      const providerUser: User = { ...mockUser, role: 'PROVIDER' };

      act(() => {
        result.current.login(providerUser, mockToken);
      });

      expect(result.current.getUserRole()).toBe('PROVIDER');
    });
  });

  describe('Flujo completo de autenticación', () => {
    it('debe manejar login -> update -> logout correctamente', () => {
      const { result } = renderHook(() => useAuthStore());

      // 1. Estado inicial
      expect(result.current.isAuthenticated).toBe(false);

      // 2. Login
      act(() => {
        result.current.login(mockUser, mockToken);
      });
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user?.name).toBe('Test User');

      // 3. Actualizar usuario
      act(() => {
        result.current.updateUser({ name: 'Updated User', phone: '555-0000' });
      });
      expect(result.current.user?.name).toBe('Updated User');
      expect(result.current.user?.phone).toBe('555-0000');
      expect(result.current.isAuthenticated).toBe(true); // Sigue autenticado

      // 4. Logout
      act(() => {
        result.current.logout();
      });
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
      expect(localStorage.getItem('token')).toBeNull();
    });
  });
});

/**
 * ¿QUÉ APRENDIMOS?
 * 
 * 1. renderHook(): Permite usar hooks en tests sin componentes
 * 2. act(): Envuelve actualizaciones de estado para que React las procese correctamente
 * 3. Testing de estado global: Verificar que las acciones cambien el estado
 * 4. Testing de side effects: Verificar localStorage
 * 5. Flujos completos: Testear secuencias de acciones (login -> update -> logout)
 * 6. beforeEach: Resetear el estado antes de cada test (importante para aislamiento)
 * 7. Testing de funciones helper: getToken(), getUserRole()
 * 
 * PATRÓN DE TESTING DE STORES:
 * - Setup: renderHook() para acceder al store
 * - Act: Envolver las acciones en act()
 * - Assert: Verificar el estado resultante
 * - Cleanup: beforeEach para resetear entre tests
 */
