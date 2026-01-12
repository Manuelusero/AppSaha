/**
 * ============================================================================
 * DESIGN TOKENS - Sistema de Diseño Centralizado SERCO/SAHA
 * ============================================================================
 * 
 * Este archivo contiene TODOS los tokens de diseño de la aplicación.
 * 
 * ⚠️ IMPORTANTE: 
 * - NO modificar valores directamente en componentes
 * - SIEMPRE usar tokens para mantener consistencia
 * - Antes de crear un nuevo token, verifica que no exista
 * 
 * 📖 Documentación completa: /FrontEnd/DESIGN_TOKENS.md
 * 
 * 🎨 Uso:
 *   import { colors, typography, spacing } from '@/styles/tokens';
 *   style={{ color: colors.primary.main, fontSize: typography.fontSize.base }}
 */

// ============================================================================
// COLORES
// ============================================================================

/**
 * Sistema de colores de la aplicación
 * 
 * Primary: Azul corporativo (#244C87) - Usado en:
 *   - Botones principales
 *   - Headers/Footers
 *   - Links importantes
 *   - Bordes de inputs al hacer focus
 * 
 * Secondary: Beige/Crema - Usado en:
 *   - Fondos de secciones
 *   - Backgrounds alternativos
 * 
 * Accent: Colores de énfasis - Usado en:
 *   - Estrellas (gold)
 *   - Errores (red)
 *   - Éxitos (green)
 *   - Advertencias (orange)
 * 
 * Neutral: Escala de grises - Usado en:
 *   - Textos
 *   - Bordes
 *   - Fondos neutrales
 */
export const colors = {
  primary: {
    main: '#244C87',      // ⭐ Color principal de la marca - Headers, botones, links
    light: '#3A5FA0',     // Hover states, estados activos
    dark: '#1A3A65',      // Textos sobre fondos claros, énfasis fuerte
    pale: '#BFC6EE',      // Fondos suaves con transparencia, botones ghost
  },
  
  secondary: {
    main: '#FFFCF9',      // Beige/Crema para fondos cálidos
    light: '#FFFFFF',     // Blanco puro para cards, modales
    dark: '#F5F2EF',      // Beige oscuro para separadores sutiles
  },
  
  accent: {
    gold: '#FFD700',      // ⭐ Estrellas de rating, badges premium
    red: '#DC2626',       // ❌ Errores, alertas, botón de eliminar
    green: '#10B981',     // ✅ Mensajes de éxito, disponibilidad
    orange: '#F97316',    // ⚠️ Advertencias, estados pendientes
    brown: '#B45B39',     // Color exacto usado en landing (botones/fondos)
  },
  
  neutral: {
    50: '#F9FAFB',        // Fondo muy claro
    100: '#F3F4F6',       // Fondo claro (hover en listas)
    200: '#E5E7EB',       // Bordes suaves, separadores
    300: '#D1D5DB',       // Bordes de inputs normales
    400: '#9CA3AF',       // Textos deshabilitados
    500: '#6B7280',       // Textos secundarios
    600: '#4B5563',       // Textos principales alternativos
    700: '#374151',       // Textos enfatizados
    800: '#1F2937',       // Textos muy oscuros
    900: '#111827',       // Casi negro
    black: '#000000',     // Negro puro
    white: '#FFFFFF',     // Blanco puro
  },
  
  // Estados de UI - Usado en notificaciones, alertas, badges
  success: {
    main: '#10B981',      // Color principal de éxito
    light: '#D1FAE5',     // Fondo de alertas de éxito
    dark: '#065F46',      // Texto sobre fondo claro de éxito
  },
  
  error: {
    main: '#DC2626',      // ❌ Color principal de error
    light: '#FEE2E2',     // Fondo de alertas de error
    dark: '#991B1B',      // Texto sobre fondo claro de error
  },
  
  warning: {
    main: '#F59E0B',      // ⚠️ Color principal de advertencia
    light: '#FEF3C7',     // Fondo de alertas de advertencia
    dark: '#92400E',      // Texto sobre fondo claro de advertencia
  },
  
  info: {
    main: '#3B82F6',      // ℹ️ Color principal informativo
    light: '#DBEAFE',     // Fondo de alertas informativas
    dark: '#1E40AF',      // Texto sobre fondo claro informativo
  },
};

// ============================================================================
// TIPOGRAFÍA
// ============================================================================

/**
 * Sistema tipográfico
 * 
 * FontFamily:
 *   - primary (Maitree): Fuente serif para títulos, textos importantes, inputs
 *   - secondary (Inter): Sans-serif para UI elementos (actualmente no usado)
 * 
 * FontSize: Escala basada en 16px (base)
 *   - xs-sm: Textos auxiliares
 *   - base: Tamaño estándar para cuerpo de texto
 *   - lg-xl: Subtítulos
 *   - 2xl-5xl: Títulos jerárquicos
 * 
 * FontWeight:
 *   - 400 (normal): Uso general en textos
 *   - 500-600: Énfasis moderado
 *   - 700+: Títulos principales
 */
export const typography = {
  fontFamily: {
    primary: "'Maitree', serif",     // 🎯 Fuente principal - Usada en TODA la app
    secondary: "'Inter', sans-serif", // Alternativa (no implementada aún)
    system: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif",
  },
  
  fontSize: {
    xs: '12px',      // Badges, etiquetas pequeñas
    sm: '14px',      // Texto secundario, metadatos
    base: '16px',    // ⭐ Tamaño estándar - Inputs, párrafos, links
    lg: '18px',      // Subtítulos menores
    xl: '20px',      // Subtítulos importantes
    '2xl': '24px',   // ⭐ Títulos de sección (H3)
    '3xl': '30px',   // Títulos principales (H2)
    '32': '32px',    // Título personalizado exacto usado en landing
    '4xl': '36px',   // Títulos grandes (H1)
    '5xl': '48px',   // Títulos hero, landing pages
    '6xl': '64px',   // Títulos extra grandes (exacto usado en landing)
  },
  
  fontWeight: {
    light: 300,      // Textos ligeros (poco usado)
    normal: 400,     // ⭐ Peso estándar - Mayoría de textos
    medium: 500,     // Énfasis moderado
    semibold: 600,   // Subtítulos, labels importantes
    bold: 700,       // ⭐ Títulos, botones con texto bold
    extrabold: 800,  // Títulos muy destacados
  },
  
  lineHeight: {
    tight: 1.2,      // Títulos compactos
    normal: 1.5,     // ⭐ Estándar para lectura
    relaxed: 1.75,   // Textos largos, mayor legibilidad
    loose: 2,        // Espaciado muy abierto
  },
  
  letterSpacing: {
    tighter: '-0.05em',  // Títulos grandes compactos
    tight: '-0.025em',   // Ligera compresión
    normal: '0',         // ⭐ Estándar - Mayoría de textos
    wide: '0.025em',     // Ligera expansión
    wider: '0.05em',     // Más espacio (CAPS)
    widest: '0.1em',     // Muy espaciado (headings)
  },
};

// ============================================================================
// SPACING (Espaciado)
// ============================================================================

/**
 * Sistema de espaciado
 * 
 * Escala: Incrementos de 4px (base)
 * 
 * Uso común:
 *   - 1-3 (4-12px): Espaciado interno pequeño (gap entre elementos cercanos)
 *   - 4-6 (16-24px): ⭐ Padding de componentes, márgenes estándar
 *   - 8-12 (32-48px): Separación entre secciones
 *   - 16-24 (64-96px): Espaciado grande entre secciones principales
 *   - 36+ (144px+): Márgenes top de footers, espaciado hero
 * 
 * 💡 Tip: Usa múltiplos de 4 para mantener una grilla consistente
 */
export const spacing = {
  0: '0',          // Sin espaciado
  1: '4px',        // Muy pequeño - Gap entre iconos y texto
  2: '8px',        // ⭐ Pequeño - Padding de botones pequeños
  3: '12px',       // ⭐ Mediano - Padding de botones, dropdown items
  4: '16px',       // ⭐ Estándar - Padding de inputs, cards
  5: '20px',       // Entre elementos relacionados
  6: '24px',       // ⭐ Padding de cards grandes, secciones
  7: '28px',       // Raramente usado
  8: '32px',       // Separación entre grupos de elementos
  9: '36px',       // Espaciado generoso
  10: '40px',      // ⭐ Separación entre secciones menores
  12: '48px',      // Separación entre secciones
  14: '56px',      // Espaciado grande
  16: '64px',      // Separación entre secciones principales
  20: '80px',      // Espaciado muy grande
  24: '96px',      // Espaciado extra grande
  28: '112px',     // Espaciado hero
  32: '128px',     // Espaciado hero grande
  36: '150px',     // ⭐ marginTop de Footer - VALOR EXACTO ORIGINAL
  40: '160px',     // Espaciado extra
  44: '176px',     // Espaciado extra
  48: '192px',     // Espaciado extra
  52: '208px',     // Espaciado extra
  56: '224px',     // Espaciado extra
  60: '240px',     // Espaciado máximo
};

// ============================================================================
// BORDER RADIUS (Bordes Redondeados)
// ============================================================================

/**
 * Radios de borde
 * 
 * Uso común:
 *   - none (0): Sin redondeo
 *   - sm-base (4-8px): Elementos pequeños, badges
 *   - md (12px): ⭐ Cards, modales, dropdowns
 *   - lg-xl (16-20px): Botones principales, inputs con esquinas suaves
 *   - 2xl-3xl (24-32px): Elementos grandes con esquinas muy redondeadas
 *   - full (9999px): ⭐ Círculos perfectos, pills, botones completamente redondeados
 * 
 * Ejemplo:
 *   - Inputs: borderRadius.full (pills style)
 *   - Botones: borderRadius.full
 *   - Cards: borderRadius.md o borderRadius.lg
 *   - Profile images: borderRadius.full
 */
export const borderRadius = {
  none: '0',           // Sin redondeo
  sm: '4px',          // Esquinas apenas redondeadas
  base: '8px',        // Redondeo suave
  md: '12px',         // ⭐ Cards, modales, dropdown menus
  lg: '16px',         // Elementos grandes
  xl: '20px',         // ⭐ Botones login/registro header (20px original)
  '2xl': '24px',      // ⭐ Dropdown del perfil (24px original)
  '3xl': '32px',      // Elementos muy redondeados
  full: '9999px',     // ⭐ Círculos perfectos, pills, inputs redondeados
};

// ============================================================================
// SOMBRAS (Shadows)
// ============================================================================

/**
 * Sistema de sombras
 * 
 * Niveles estándar (sm → 2xl): Sombras progresivas de Tailwind
 * 
 * Sombras personalizadas SERCO:
 *   - glass: Efecto glassmorphism con borde sutil
 *   - card: ⭐ Sombra suave para cards de proveedores
 *   - button: ⭐ Sombra para botones con efecto de profundidad
 * 
 * Uso:
 *   boxShadow: shadows.card
 */
export const shadows = {
  none: 'none',          // Sin sombra
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',            // Sombra muy sutil
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',  // Sombra suave
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',  // ⭐ Dropdown menus
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',  // ⭐ Modales, dropdowns importantes
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',  // Sombras grandes
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',   // Sombras muy profundas
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',  // Sombra interna
  
  // ⭐ Sombras personalizadas SERCO (valores exactos del diseño)
  glass: '0 4px 6px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.3)',  // Glassmorphism
  card: '0 2px 8px rgba(36, 76, 135, 0.1)',        // Cards de proveedores
  button: '0 4px 12px rgba(36, 76, 135, 0.2)',     // Botones con profundidad
};

// ============================================================================
// TRANSICIONES (Transitions)
// ============================================================================

/**
 * Sistema de transiciones
 * 
 * Duration:
 *   - fast (150ms): Cambios sutiles (hover en iconos)
 *   - base (300ms): ⭐ Transición estándar (hover botones, cambio de colores)
 *   - slow (500ms): Transiciones complejas (modales, side panels)
 * 
 * Timing: Curvas de aceleración
 *   - ease-in-out: ⭐ Más usada - Suave al inicio y final
 *   - ease-out: Rápida al inicio, suave al final
 *   - ease-in: Suave al inicio, rápida al final
 * 
 * Presets listos para usar:
 *   - transitions.all: Para múltiples propiedades
 *   - transitions.colors: Solo colores (más performante)
 */
export const transitions = {
  duration: {
    fast: '150ms',    // Cambios rápidos
    base: '300ms',    // ⭐ Estándar - Mayoría de transiciones
    slow: '500ms',    // Transiciones complejas
  },
  
  timing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    linear: 'linear',
  },
  
  // Presets completos
  all: 'all 300ms ease-in-out',
  colors: 'color 300ms ease-in-out, background-color 300ms ease-in-out, border-color 300ms ease-in-out',
  transform: 'transform 300ms ease-in-out',
  opacity: 'opacity 300ms ease-in-out',
};

// ============================================================================
// BREAKPOINTS (Para media queries)
// ============================================================================

export const breakpoints = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// ============================================================================
// Z-INDEX (Para gestionar capas)
// ============================================================================

export const zIndex = {
  hide: -1,
  base: 0,
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  modalBackdrop: 40,
  modal: 50,
  popover: 60,
  tooltip: 70,
  notification: 80,
};

// ============================================================================
// GRADIENTES
// Definiciones de gradientes reutilizables
// 
// Uso:
//   style={{ background: gradients.hero }}
// 
// 💡 Todos los valores mantienen opacidad original del diseño
// ============================================================================

export const gradients = {
  /**
   * Gradiente principal de marca
   * Uso: Botones con efecto degradado, banners destacados
   * Colores: primary.main → primary.light
   */
  primary: 'linear-gradient(135deg, #244C87 0%, #3A5FA0 100%)',
  
  /**
   * Gradiente para Hero Section y Header
   * ⭐ VALOR EXACTO ORIGINAL - NO MODIFICAR
   * Uso: Header principal, backgrounds de hero sections
   * Opacidad: 80% azul → 80% beige para efecto glassmorphism
   */
  hero: 'linear-gradient(180deg, rgba(36, 76, 135, 0.8) 0%, rgba(255, 252, 249, 0.8) 100%)',
  
  /**
   * Overlay oscuro para imágenes
   * Uso: Superponer sobre imágenes para mejorar legibilidad de texto
   * Opacidad: Transparente → 50% negro
   */
  overlay: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 100%)',
  
  /**
   * Efecto glassmorphism sutil
   * Uso: Cards con efecto vidrio, modales modernos
   * Opacidad: 10% blanco → 5% blanco
   */
  glass: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
};

// ============================================================================
// COMPONENTES ESPECÍFICOS
// Dimensiones y valores específicos para componentes comunes
// 
// 💡 Estos valores son estándares de la industria para accesibilidad
//    - Altura mínima táctil: 44px (Apple HIG) / 48px (Material Design)
//    - Estos valores aseguran que los elementos sean fáciles de tocar en móviles
// ============================================================================

export const components = {
  /**
   * Dimensiones de botones
   * sm: Botones secundarios, tags, badges interactivos
   * md: ⭐ Botones estándar en la mayoría de la app
   * lg: Botones principales, CTAs importantes
   */
  button: {
    height: {
      sm: '32px',      // Botones pequeños (no recomendado para móvil)
      md: '40px',      // ⭐ Altura estándar de botones
      lg: '48px',      // Botones grandes, CTAs principales
    },
    padding: {
      sm: '8px 16px',     // Padding horizontal pequeño
      md: '12px 24px',    // ⭐ Padding estándar (usado en Button.tsx)
      lg: '16px 32px',    // Padding generoso para botones hero
    },
  },
  
  /**
   * Dimensiones de inputs
   * sm: Inputs compactos en formularios densos
   * md: ⭐ Inputs estándar (usado en Input.tsx)
   * lg: Inputs destacados, búsquedas principales
   */
  input: {
    height: {
      sm: '36px',      // Inputs compactos
      md: '44px',      // ⭐ Altura estándar de inputs (mínimo accesibilidad móvil)
      lg: '52px',      // Inputs grandes, búsquedas hero
    },
    padding: {
      sm: '8px 12px',     // Padding compacto
      md: '12px 16px',    // ⭐ Padding estándar (usado en Input.tsx)
      lg: '16px 20px',    // Padding generoso
    },
  },
  
  /**
   * Padding de cards/containers
   * sm: Cards compactas, elementos de lista
   * md: ⭐ Cards estándar
   * lg: Secciones principales, containers hero
   */
  card: {
    padding: {
      sm: '16px',      // Padding compacto (spacing[4])
      md: '24px',      // ⭐ Padding estándar (spacing[6])
      lg: '32px',      // Padding generoso (spacing[8])
    },
  },
};

// ============================================================================
// HELPERS - Funciones auxiliares
// Utilidades para manipular tokens de forma programática
// ============================================================================

/**
 * Convierte píxeles a rem
 * 
 * Útil cuando necesitas unidades rem en lugar de px para mejor escalabilidad
 * Base: 16px = 1rem
 * 
 * @param value - Valor en px (ej: spacing[4] = '16px')
 * @returns Valor en rem (ej: '1rem')
 * 
 * @example
 * ```tsx
 * import { toRem, spacing } from '@/styles/tokens';
 * 
 * const padding = toRem(spacing[4]); // '1rem'
 * <div style={{ padding }} />
 * ```
 */
export const toRem = (value: string): string => {
  const px = parseInt(value);
  return `${px / 16}rem`;
};

/**
 * Agrega opacidad a un color hexadecimal
 * 
 * Convierte colores hex (#RRGGBB) a rgba con opacidad personalizada
 * 
 * @param color - Color hexadecimal (ej: '#244C87')
 * @param opacity - Valor de opacidad entre 0 y 1 (ej: 0.5 para 50%)
 * @returns Color en formato rgba (ej: 'rgba(36, 76, 135, 0.5)')
 * 
 * @example
 * ```tsx
 * import { withOpacity, colors } from '@/styles/tokens';
 * 
 * // Fondo azul semi-transparente
 * const bgColor = withOpacity(colors.primary.main, 0.2);
 * // Resultado: 'rgba(36, 76, 135, 0.2)'
 * 
 * <div style={{ backgroundColor: bgColor }} />
 * ```
 * 
 * 💡 Usado en Header para efecto glassmorphism:
 *    backgroundColor: withOpacity(colors.primary.pale, 0.2)
 */
export const withOpacity = (color: string, opacity: number): string => {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// ============================================================================
// EXPORT DEFAULT
// Exportación completa del sistema de tokens para imports simplificados
// ============================================================================

/**
 * Export default con todos los tokens agrupados
 * 
 * Permite importar todo el sistema de una vez si es necesario
 * 
 * @example
 * ```tsx
 * import tokens from '@/styles/tokens';
 * 
 * const primaryColor = tokens.colors.primary.main;
 * const standardSpacing = tokens.spacing[4];
 * ```
 * 
 * 💡 Recomendado: Importar solo lo que necesitas para tree-shaking
 * ```tsx
 * import { colors, spacing } from '@/styles/tokens';
 * ```
 */
export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  transitions,
  breakpoints,
  zIndex,
  gradients,
  components,
  helpers: { toRem, withOpacity },
};
