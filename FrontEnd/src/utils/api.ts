/**
 * Utilidades para hacer llamadas a la API con autenticación
 */

import { API_URL, TOKEN_KEY } from './constants';

interface FetchOptions extends RequestInit {
  token?: string;
}

/**
 * Wrapper para fetch que incluye autenticación automática
 */
export async function fetchWithAuth(
  endpoint: string,
  options: FetchOptions = {}
): Promise<Response> {
  const { token, headers, ...restOptions } = options;
  
  // Obtener token del localStorage si no se proporciona
  const authToken = token || localStorage.getItem(TOKEN_KEY);
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
  };

  const finalHeaders = {
    ...defaultHeaders,
    ...headers,
  };

  const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`;

  return fetch(url, {
    ...restOptions,
    headers: finalHeaders,
  });
}

/**
 * GET request con autenticación
 */
export async function apiGet<T = unknown>(endpoint: string): Promise<T> {
  const response = await fetchWithAuth(endpoint);
  
  if (!response.ok) {
    // Si es 401, limpiar token y redirigir a login
    if (response.status === 401) {
      console.error('❌ Token inválido o expirado, redirigiendo a login...');
      localStorage.removeItem('token');
      localStorage.removeItem('providerId');
      localStorage.removeItem('userId');
      window.location.href = '/login';
      throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
    }
    
    const error = await response.json().catch(() => ({ error: 'Error desconocido' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }
  
  return response.json();
}

/**
 * POST request con autenticación
 */
export async function apiPost<T = unknown>(
  endpoint: string,
  data: unknown
): Promise<T> {
  const response = await fetchWithAuth(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    // Si es 401, limpiar token y redirigir a login
    if (response.status === 401) {
      console.error('❌ Token inválido o expirado, redirigiendo a login...');
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem('providerId');
      localStorage.removeItem('userId');
      window.location.href = '/login';
      throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
    }
    
    const error = await response.json().catch(() => ({ error: 'Error desconocido' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }
  
  return response.json();
}

/**
 * PUT request con autenticación
 */
export async function apiPut<T = unknown>(
  endpoint: string,
  data: unknown
): Promise<T> {
  const response = await fetchWithAuth(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Error desconocido' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }
  
  return response.json();
}

/**
 * DELETE request con autenticación
 */
export async function apiDelete<T = unknown>(endpoint: string): Promise<T> {
  const response = await fetchWithAuth(endpoint, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Error desconocido' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }
  
  return response.json();
}

/**
 * Upload de archivos con autenticación (multipart/form-data)
 */
export async function apiUpload<T = unknown>(
  endpoint: string,
  formData: FormData
): Promise<T> {
  const token = localStorage.getItem(TOKEN_KEY);
  
  const headers: HeadersInit = {
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
  // No incluir Content-Type, el navegador lo establece automáticamente con el boundary correcto

  const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`;

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: formData,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Error desconocido' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }
  
  return response.json();
}
