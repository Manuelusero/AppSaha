# Sistema de Design Tokens

## 📋 Descripción

Sistema centralizado de tokens de diseño que define colores, tipografía, espaciado y otros valores reutilizables para mantener consistencia en toda la aplicación.

## 🎨 Estructura

```
FrontEnd/src/
├── styles/
│   ├── tokens.ts          # Definición de todos los tokens
│   └── index.ts           # Exports
├── app/
│   └── globals.css        # Variables CSS basadas en tokens
└── components/
    └── ui/
        ├── Button.tsx     # Usa tokens para estilos
        └── Input.tsx      # Usa tokens para estilos
```

## 🚀 Uso

### En Componentes TypeScript/React

```tsx
import { colors, typography, spacing } from "@/styles/tokens";

function MyComponent() {
  return (
    <div
      style={{
        backgroundColor: colors.primary.main,
        fontFamily: typography.fontFamily.primary,
        padding: spacing[4],
        borderRadius: borderRadius.lg,
      }}
    >
      Contenido
    </div>
  );
}
```

### En CSS con Variables

```css
.my-class {
  background-color: var(--color-primary-main);
  font-family: var(--font-primary);
  padding: var(--spacing-base);
  border-radius: var(--radius-lg);
  transition: var(--transition-all);
}
```

### En Tailwind CSS

```tsx
<div className="bg-[#244C87] text-white rounded-lg p-4">
  {/* Los valores de tokens están disponibles */}
</div>
```

## 🎨 Tokens Disponibles

### Colores

#### Primarios

```ts
colors.primary.main; // #244C87 - Azul principal
colors.primary.light; // #3A5FA0 - Azul claro
colors.primary.dark; // #1A3A65 - Azul oscuro
colors.primary.pale; // #BFC6EE - Azul pálido
```

#### Secundarios

```ts
colors.secondary.main; // #FFFCF9 - Beige/Crema
colors.secondary.light; // #FFFFFF - Blanco
colors.secondary.dark; // #F5F2EF - Beige oscuro
```

#### Acentos

```ts
colors.accent.gold; // #FFD700 - Dorado
colors.accent.red; // #DC2626 - Rojo
colors.accent.green; // #10B981 - Verde
colors.accent.orange; // #F97316 - Naranja
```

#### Estados

```ts
colors.success.main; // #10B981 - Éxito
colors.error.main; // #DC2626 - Error
colors.warning.main; // #F59E0B - Advertencia
colors.info.main; // #3B82F6 - Info
```

#### Neutrales

```ts
colors.neutral[50 - 900]; // Escala de grises
colors.neutral.black; // #000000
colors.neutral.white; // #FFFFFF
```

### Tipografía

```ts
typography.fontFamily.primary; // 'Maitree', serif
typography.fontFamily.secondary; // 'Inter', sans-serif

typography.fontSize.xs; // 12px
typography.fontSize.sm; // 14px
typography.fontSize.base; // 16px
typography.fontSize.lg; // 18px
typography.fontSize.xl; // 20px
typography.fontSize["2xl"]; // 24px
typography.fontSize["3xl"]; // 30px
typography.fontSize["4xl"]; // 36px
typography.fontSize["5xl"]; // 48px

typography.fontWeight.light; // 300
typography.fontWeight.normal; // 400
typography.fontWeight.medium; // 500
typography.fontWeight.semibold; // 600
typography.fontWeight.bold; // 700

typography.lineHeight.tight; // 1.2
typography.lineHeight.normal; // 1.5
typography.lineHeight.relaxed; // 1.75
```

### Espaciado

```ts
spacing[0]; // 0
spacing[1]; // 4px
spacing[2]; // 8px
spacing[3]; // 12px
spacing[4]; // 16px
spacing[6]; // 24px
spacing[8]; // 32px
spacing[10]; // 40px
spacing[12]; // 48px
spacing[16]; // 64px
spacing[20]; // 80px
// ... hasta spacing[60] = 240px
```

### Border Radius

```ts
borderRadius.none; // 0
borderRadius.sm; // 4px
borderRadius.base; // 8px
borderRadius.md; // 12px
borderRadius.lg; // 16px
borderRadius.xl; // 20px
borderRadius["2xl"]; // 24px
borderRadius["3xl"]; // 32px
borderRadius.full; // 9999px (círculo perfecto)
```

### Sombras

```ts
shadows.none; // Ninguna sombra
shadows.sm; // Sombra pequeña
shadows.base; // Sombra base
shadows.md; // Sombra media
shadows.lg; // Sombra grande
shadows.xl; // Sombra extra grande
shadows["2xl"]; // Sombra 2xl

// Personalizadas
shadows.card; // Para tarjetas
shadows.button; // Para botones
shadows.glass; // Efecto glassmorphism
```

### Transiciones

```ts
transitions.duration.fast; // 150ms
transitions.duration.base; // 300ms
transitions.duration.slow; // 500ms

transitions.timing.ease; // ease
transitions.timing.easeIn; // ease-in
transitions.timing.easeOut; // ease-out
transitions.timing.easeInOut; // ease-in-out

// Presets
transitions.all; // 'all 300ms ease-in-out'
transitions.colors; // Transición de colores
transitions.transform; // Transición de transform
transitions.opacity; // Transición de opacidad
```

### Gradientes

```ts
gradients.primary; // Gradiente azul principal
gradients.hero; // Gradiente para hero sections
gradients.overlay; // Overlay oscuro
gradients.glass; // Efecto glassmorphism
```

### Breakpoints

```ts
breakpoints.xs; // 320px
breakpoints.sm; // 640px
breakpoints.md; // 768px
breakpoints.lg; // 1024px
breakpoints.xl; // 1280px
breakpoints["2xl"]; // 1536px
```

### Z-Index

```ts
zIndex.hide; // -1
zIndex.base; // 0
zIndex.dropdown; // 10
zIndex.sticky; // 20
zIndex.fixed; // 30
zIndex.modalBackdrop; // 40
zIndex.modal; // 50
zIndex.popover; // 60
zIndex.tooltip; // 70
zIndex.notification; // 80
```

### Componentes Específicos

```ts
components.button.height.sm; // 32px
components.button.height.md; // 40px
components.button.height.lg; // 48px

components.input.height.sm; // 36px
components.input.height.md; // 44px
components.input.height.lg; // 52px

components.card.padding.sm; // 16px
components.card.padding.md; // 24px
components.card.padding.lg; // 32px
```

## 🛠️ Funciones Auxiliares

### `toRem(value: string)`

Convierte un valor de spacing a rem:

```ts
import { toRem, spacing } from "@/styles/tokens";

const padding = toRem(spacing[4]); // '1rem'
```

### `withOpacity(color: string, opacity: number)`

Añade opacidad a un color hex:

```ts
import { withOpacity, colors } from "@/styles/tokens";

const semiTransparent = withOpacity(colors.primary.main, 0.5);
// 'rgba(36, 76, 135, 0.5)'
```

## 📝 Ejemplos Prácticos

### Botón con Tokens

```tsx
import { colors, typography, borderRadius, shadows } from "@/styles/tokens";

function CustomButton() {
  return (
    <button
      style={{
        backgroundColor: colors.primary.main,
        color: colors.neutral.white,
        fontFamily: typography.fontFamily.primary,
        fontSize: typography.fontSize.base,
        padding: "12px 24px",
        borderRadius: borderRadius.full,
        boxShadow: shadows.button,
        transition: "all 300ms ease-in-out",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = colors.primary.dark;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = colors.primary.main;
      }}
    >
      Haz clic aquí
    </button>
  );
}
```

### Card con Tokens

```tsx
import { colors, spacing, borderRadius, shadows } from "@/styles/tokens";

function Card({ children }) {
  return (
    <div
      style={{
        backgroundColor: colors.neutral.white,
        padding: spacing[6],
        borderRadius: borderRadius.lg,
        boxShadow: shadows.card,
        border: `1px solid ${colors.neutral[200]}`,
      }}
    >
      {children}
    </div>
  );
}
```

### Input con Estados

```tsx
import { colors, typography, borderRadius } from "@/styles/tokens";
import { useState } from "react";

function Input() {
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState("");

  const getBorderColor = () => {
    if (error) return colors.error.main;
    if (isFocused) return colors.primary.main;
    return colors.neutral[300];
  };

  return (
    <input
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      style={{
        fontFamily: typography.fontFamily.primary,
        fontSize: typography.fontSize.base,
        padding: "12px 16px",
        borderRadius: borderRadius.full,
        border: `2px solid ${getBorderColor()}`,
        transition: "border-color 300ms ease-in-out",
      }}
    />
  );
}
```

## ✅ Componentes Actualizados

- ✅ `Button.tsx` - Usa tokens para colores y tipografía
- ✅ `Input.tsx` - Usa tokens con estados focus/error
- ✅ `globals.css` - Variables CSS definidas

## 🎯 Próximos Pasos

- [ ] Actualizar Footer con tokens
- [ ] Actualizar Header con tokens
- [ ] Crear componente Card con tokens
- [ ] Documentar patrones de uso en componentes complejos
- [ ] Agregar tokens para dark mode

## 📊 Beneficios

1. **Consistencia**: Todos los componentes usan los mismos valores
2. **Mantenibilidad**: Cambiar un token actualiza toda la app
3. **TypeScript**: Autocompletado y type-safety
4. **Documentación**: Todos los valores están centralizados
5. **Escalabilidad**: Fácil agregar nuevos tokens
6. **Performance**: Imports solo lo necesario (tree-shaking)

## 🔍 Referencias

- Archivo principal: `/src/styles/tokens.ts`
- Variables CSS: `/src/app/globals.css`
- Ejemplos: `/src/components/ui/Button.tsx`, `/src/components/ui/Input.tsx`
