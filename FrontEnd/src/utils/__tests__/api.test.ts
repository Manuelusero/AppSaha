/**
 * TESTS PARA UTILIDADES DE API
 * 
 * En este archivo testeamos las funciones que hacen llamadas HTTP.
 * 
 * CONCEPTOS CLAVE:
 * - describe(): Agrupa tests relacionados
 * - it() o test(): Define un test individual
 * - expect(): Hace afirmaciones sobre el resultado
 * - vi.fn(): Crea una función "mock" (simulada)
 * - beforeEach(): Se ejecuta antes de cada test
 * - afterEach(): Se ejecuta después de cada test
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { apiGet, apiPost, apiPut, apiDelete, fetchWithAuth } from '../api';

// Mock de fetch global (reemplazamos la función real por una simulada)
const mockFetch = vi.fn();
global.fetch = mockFetch as any;

// Mock de window.location.href
delete (window as any).location;
window.location = { href: '' } as any;

describe('fetchWithAuth', () => {
  // Antes de cada test, limpiamos los mocks y localStorage
  beforeEach(() => {
    mockFetch.mockClear();
    localStorage.clear();
  });

  it('debe incluir el token de localStorage en el header Authorization', async () => {
    // ARRANGE (Preparar): Configuramos el escenario
    const mockToken = 'test-token-123';
    localStorage.setItem('token', mockToken);
    
    // Simulamos una respuesta exitosa del servidor
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: 'test' }),
    });

    // ACT (Actuar): Ejecutamos la función que queremos testear
    await fetchWithAuth('/api/test');

    // ASSERT (Afirmar): Verificamos que se comportó como esperábamos
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/test'),
      expect.objectContaining({
        headers: expect.objectContaining({
          'Authorization': `Bearer ${mockToken}`,
        }),
      })
    );
  });

  it('debe usar token proporcionado en options si existe', async () => {
    // Si pasamos un token manualmente, debe usar ese en lugar del localStorage
    const customToken = 'custom-token-456';
    
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: 'test' }),
    });

    await fetchWithAuth('/api/test', { token: customToken });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          'Authorization': `Bearer ${customToken}`,
        }),
      })
    );
  });

  it('debe construir URL completa si el endpoint no empieza con http', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: 'test' }),
    });

    await fetchWithAuth('/users');

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringMatching(/^http.*\/users$/),
      expect.any(Object)
    );
  });

  it('debe mantener URL completa si el endpoint ya incluye http', async () => {
    const fullUrl = 'https://external-api.com/data';
    
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: 'test' }),
    });

    await fetchWithAuth(fullUrl);

    expect(mockFetch).toHaveBeenCalledWith(fullUrl, expect.any(Object));
  });
});

describe('apiGet', () => {
  beforeEach(() => {
    mockFetch.mockClear();
    localStorage.clear();
    window.location.href = '';
  });

  it('debe retornar los datos cuando la respuesta es exitosa', async () => {
    // Simulamos una respuesta exitosa con datos
    const mockData = { id: 1, name: 'Test User', email: 'test@example.com' };
    
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const result = await apiGet('/users/1');

    expect(result).toEqual(mockData);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('debe lanzar error cuando la respuesta no es ok', async () => {
    // Simulamos un error del servidor
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({ error: 'Usuario no encontrado' }),
    });

    // Verificamos que la función lanza un error
    await expect(apiGet('/users/999')).rejects.toThrow('Usuario no encontrado');
  });

  it('debe redirigir a /login cuando recibe 401 (no autorizado)', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ error: 'No autorizado' }),
    });

    await expect(apiGet('/protected-resource')).rejects.toThrow('Sesión expirada');
    expect(window.location.href).toBe('/login');
    expect(localStorage.getItem('token')).toBeNull();
  });
});

describe('apiPost', () => {
  beforeEach(() => {
    mockFetch.mockClear();
    localStorage.clear();
    window.location.href = '';
  });

  it('debe enviar datos en el body como JSON', async () => {
    const postData = { username: 'testuser', password: 'password123' };
    const responseData = { token: 'new-token', userId: 1 };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => responseData,
    });

    const result = await apiPost('/auth/login', postData);

    expect(result).toEqual(responseData);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(postData),
      })
    );
  });

  it('debe manejar errores de validación del servidor', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ error: 'Email ya registrado' }),
    });

    await expect(
      apiPost('/auth/register', { email: 'test@test.com' })
    ).rejects.toThrow('Email ya registrado');
  });

  it('debe limpiar tokens y redirigir en 401', async () => {
    localStorage.setItem('token', 'old-token');
    localStorage.setItem('providerId', '123');
    localStorage.setItem('userId', '456');

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ error: 'Token expirado' }),
    });

    await expect(apiPost('/api/test', {})).rejects.toThrow();
    
    // Verificar que se limpiaron todos los tokens
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('providerId')).toBeNull();
    expect(localStorage.getItem('userId')).toBeNull();
    expect(window.location.href).toBe('/login');
  });
});

describe('apiPut', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('debe actualizar datos existentes', async () => {
    const updateData = { name: 'Updated Name', phone: '123456789' };
    const responseData = { ...updateData, id: 1, updatedAt: new Date().toISOString() };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => responseData,
    });

    const result = await apiPut('/users/1', updateData);

    expect(result).toEqual(responseData);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify(updateData),
      })
    );
  });
});

describe('apiDelete', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('debe eliminar un recurso', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Eliminado correctamente' }),
    });

    const result = await apiDelete('/bookings/123');

    expect(result).toEqual({ message: 'Eliminado correctamente' });
    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: 'DELETE',
      })
    );
  });

  it('debe manejar errores al eliminar', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 403,
      json: async () => ({ error: 'No tienes permiso para eliminar este recurso' }),
    });

    await expect(apiDelete('/bookings/999')).rejects.toThrow(
      'No tienes permiso para eliminar este recurso'
    );
  });
});

/**
 * RESUMEN DE LO QUE HEMOS APRENDIDO:
 * 
 * 1. ✅ Mocking de fetch: Reemplazamos la función real para controlar las respuestas
 * 2. ✅ Arrange-Act-Assert: Patrón AAA para organizar tests
 * 3. ✅ toHaveBeenCalledWith: Verifica que una función fue llamada con argumentos específicos
 * 4. ✅ rejects.toThrow: Verifica que una promesa lanza un error
 * 5. ✅ beforeEach/afterEach: Preparación y limpieza para cada test
 * 6. ✅ localStorage mock: Simular storage del navegador
 * 7. ✅ window.location mock: Simular redirecciones
 * 
 * NEXT STEPS:
 * - Testear componentes React
 * - Testear Zustand stores
 * - Usar MSW para mocks más realistas
 */
