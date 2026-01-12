/**
 * Mapeo de categorías de servicio a etiquetas legibles
 * Centraliza las traducciones de ServiceCategory enum
 */
export const serviceCategoryLabels: Record<string, string> = {
  PLOMERIA: 'Plomero',
  ELECTRICIDAD: 'Electricista',
  CARPINTERIA: 'Carpintero',
  PINTURA: 'Pintor',
  LIMPIEZA: 'Limpiador',
  JARDINERIA: 'Jardinero',
  MECANICA: 'Mecánico',
  CONSTRUCCION: 'Constructor',
  REPARACIONES: 'Reparador',
  MUDANZAS: 'Servicio de mudanzas',
  TECNOLOGIA: 'Técnico',
  OTRO: 'Otro',
};

/**
 * Obtiene la etiqueta legible de una categoría de servicio
 * @param category - Clave de la categoría (ej: 'PLOMERIA')
 * @returns Etiqueta legible (ej: 'Plomero') o la categoría original si no existe
 */
export function getServiceCategoryLabel(category: string): string {
  return serviceCategoryLabels[category] || category;
}
