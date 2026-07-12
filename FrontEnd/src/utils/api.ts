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

  if (!endpoint.startsWith('http') && !API_URL) {
    throw new Error('Configuración faltante: NEXT_PUBLIC_API_URL no está definida en producción.');
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`;

  try {
    return await fetch(url, {
      ...restOptions,
      headers: finalHeaders,
    });
  } catch (error) {
    console.error('❌ Error de red al conectar con la API:', error);
    throw new Error('No se pudo conectar con el servidor. Verificá que el backend esté iniciado e intentá nuevamente.');
  }
}

/**
 * GET request con autenticación
 */
export async function apiGet<T = unknown>(endpoint: string): Promise<T> {
  const response = await fetchWithAuth(endpoint);
  
  if (!response.ok) {
    // Si es 401, limpiar token y redirigir a login
    if (response.status === 401) {
      // Do not perform an unconditional redirect here: some flows (OAuth callbacks)
      // may complete while a background request returns 401. Instead, clear
      // authentication state and surface an error so the caller can decide how
      // to handle it (show modal, redirect, etc.). This avoids interrupting
      // in-progress OAuth redirects.
      console.error('❌ Token inválido o expirado (401) — cleared local auth state.');
      localStorage.removeItem('token');
      localStorage.removeItem('providerId');
      localStorage.removeItem('userId');
      throw new Error('UNAUTHORIZED');
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
      // Same behavior as GET: clear local auth state but do not redirect automatically.
      console.error('❌ Token inválido o expirado (401) — cleared local auth state.');
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem('providerId');
      localStorage.removeItem('userId');
      throw new Error('UNAUTHORIZED');
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
 * PATCH request con autenticación
 */
export async function apiPatch<T = unknown>(
  endpoint: string,
  data: unknown
): Promise<T> {
  const response = await fetchWithAuth(endpoint, {
    method: 'PATCH',
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
