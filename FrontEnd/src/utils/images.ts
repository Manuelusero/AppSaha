import { UPLOADS_URL } from './constants';

/**
 * Construye URL completa para archivos subidos
 */
export const getUploadUrl = (folder: string, filename?: string | null): string => {
  if (!filename) return '/default-avatar.png';
  if (filename.startsWith('http')) return filename;
  if (filename.startsWith('data:')) return filename; // Base64
  return `${UPLOADS_URL}/${folder}/${filename}`;
};

/**
 * Helpers específicos para cada tipo de imagen
 */
export const getProfileImageUrl = (filename?: string | null) => 
  getUploadUrl('profile', filename);

export const getPortfolioImageUrl = (filename?: string | null) => 
  getUploadUrl('portfolio', filename);

export const getDniImageUrl = (filename?: string | null) => 
  getUploadUrl('dni', filename);

export const getCertificateUrl = (filename?: string | null) => 
  getUploadUrl('certificates', filename);

export const getProblemPhotoUrl = (filename?: string | null) => 
  getUploadUrl('problems', filename);

/**
 * Procesa array de URLs de imágenes
 */
export const processImageUrls = (
  images: string | string[] | null | undefined, 
  folder: string
): string[] => {
  if (!images) return [];
  
  try {
    // Si es string, intentar parsear como JSON
    const imagesArray = typeof images === 'string' ? JSON.parse(images) : images;
    
    if (!Array.isArray(imagesArray)) return [];
    
    return imagesArray
      .filter((img): img is string => typeof img === 'string' && img.length > 0)
      .map(img => getUploadUrl(folder, img));
  } catch {
    return [];
  }
};
