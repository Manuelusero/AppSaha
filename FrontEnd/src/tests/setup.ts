/**
 * SETUP DE TESTS
 * 
 * Este archivo se ejecuta ANTES de cada test.
 * Aquí configuramos:
 * - Matchers personalizados (como toBeInTheDocument)
 * - Mocks globales (fetch, localStorage, etc.)
 * - Limpieza automática después de cada test
 */

import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Limpieza automática después de cada test
// Esto elimina todos los componentes montados en el DOM
afterEach(() => {
  cleanup();
});

// Mock de window.matchMedia (usado por algunos componentes responsive)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock de IntersectionObserver (usado por lazy loading, animaciones, etc.)
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
} as any;

// Mock de fetch global (opcional, también podemos usar MSW)
global.fetch = vi.fn();

// Mock de localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

global.localStorage = localStorageMock as any;

// Mock de console.error para tests más limpios (opcional)
// Descomenta si quieres silenciar errores esperados en tests
// const originalError = console.error;
// beforeAll(() => {
//   console.error = vi.fn();
// });
// afterAll(() => {
//   console.error = originalError;
// });
