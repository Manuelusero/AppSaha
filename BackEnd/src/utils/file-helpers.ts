import { Express } from 'express';

/**
 * Helper para determinar si estamos en entorno de producción
 */
export const isProduction = (): boolean => {
  return !!(process.env.VERCEL || process.env.NODE_ENV === 'production');
};

/**
 * Extrae la URL o filename de un archivo subido
 * En producción (Cloudinary): usa path o url
 * En desarrollo: usa filename local
 */
export const getFileUrl = (file: Express.Multer.File | any): string | null => {
  if (!file) return null;
  
  if (isProduction()) {
    return file.path || file.url || file.filename;
  }
  
  return file.filename;
};

/**
 * Extrae URLs de múltiples archivos subidos
 */
export const getFileUrls = (files: Express.Multer.File[] | any[]): string[] => {
  if (!files || files.length === 0) return [];
  
  return files.map(f => getFileUrl(f)).filter(Boolean) as string[];
};

/**
 * Procesa un campo de archivo opcional (puede ser undefined)
 */
export const getOptionalFileUrl = (
  files: { [fieldname: string]: Express.Multer.File[] },
  fieldName: string
): string | null => {
  const fileArray = files[fieldName];
  if (!fileArray || fileArray.length === 0) return null;
  
  return getFileUrl(fileArray[0]);
};

/**
 * Procesa múltiples campos de archivos
 */
export const getOptionalFileUrls = (
  files: { [fieldname: string]: Express.Multer.File[] },
  fieldName: string
): string[] => {
  const fileArray = files[fieldName];
  if (!fileArray || fileArray.length === 0) return [];
  
  return getFileUrls(fileArray);
};
