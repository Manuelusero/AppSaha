/**
 * Constantes globales de la aplicación
 */

// URLs del backend
const configuredApiBaseUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
const isProduction = process.env.NODE_ENV === 'production';

export const API_BASE_URL = configuredApiBaseUrl || (!isProduction ? 'http://localhost:8000' : '');
export const API_URL = API_BASE_URL ? `${API_BASE_URL}/api` : '';
export const UPLOADS_URL = API_BASE_URL ? `${API_BASE_URL}/uploads` : '';

export function getRequiredApiBaseUrl(): string {
  if (API_BASE_URL) {
    return API_BASE_URL;
  }

  throw new Error('Configuración faltante: NEXT_PUBLIC_API_URL no está definida en producción.');
}

// Log para debugging en desarrollo
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('🔗 API_BASE_URL:', API_BASE_URL);
}

// Configuración
export const TOKEN_KEY = 'token';
export const USER_ID_KEY = 'userId';
export const PROVIDER_ID_KEY = 'providerId';

// Límites de archivos
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
export const ALLOWED_DOCUMENT_TYPES = ['application/pdf', ...ALLOWED_IMAGE_TYPES];

// Paginación
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;
