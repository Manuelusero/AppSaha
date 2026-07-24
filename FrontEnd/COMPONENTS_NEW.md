# Nuevos Componentes UI - Documentación

## EmptyState

Componente reutilizable para mostrar estados vacíos cuando no hay contenido disponible.

### Características

- Icono personalizable (emoji o elemento React)
- Título y descripción
- Botón de acción opcional
- Responsive y accesible
- Fondo gris claro con ícono en círculo

### Uso

```tsx
import { EmptyState } from '@/components/ui';

// Forma básica
<EmptyState
  title="No hay recomendaciones"
  description="Comparte tu enlace con clientes para recibir opiniones"
  icon="⭐"
/>

// Con botón de acción
<EmptyState
  title="No hay solicitudes"
  description="Espera a que clientes envíen sus solicitudes"
  icon="📋"
  actionButton={{
    label: "Volver al inicio",
    onClick: () => router.push('/')
  }}
/>

// Con ícono personalizado
<EmptyState
  title="Sin resultados"
  description="Intenta con otros términos de búsqueda"
  icon={<SearchIcon size={36} />}
/>
```

### Props

| Prop           | Tipo                                     | Requerido | Descripción                         |
| -------------- | ---------------------------------------- | --------- | ----------------------------------- |
| `title`        | `string`                                 | Sí        | Título principal del estado vacío   |
| `description`  | `string`                                 | No        | Descripción detallada               |
| `icon`         | `string \| ReactNode`                    | No        | Emoji o elemento React para mostrar |
| `actionButton` | `{ label: string, onClick: () => void }` | No        | Botón opcional con acción           |
| `className`    | `string`                                 | No        | Clases CSS personalizadas           |

---

## Toast (Notificaciones)

Sistema de notificaciones con auto-dismiss y soporte para múltiples tipos.

### Características

- 4 tipos: `success`, `error`, `warning`, `info`
- Auto-dismiss después de 3 segundos (configurable)
- Icono y color según tipo
- Botón para cerrar manualmente
- Animación suave de entrada
- Notificaciones apiladas en esquina

### Configuración

El `ToastProvider` y `ToastDisplay` ya están integrados en [src/app/layout.tsx](FrontEnd/src/app/layout.tsx) (líneas 46-47).

### Uso

```tsx
import { useToast } from "@/contexts/ToastContext";

export function MiComponente() {
  const { addToast, removeToast, clearAll } = useToast();

  const handleGuardar = async () => {
    try {
      await apiPost("/endpoint", data);
      addToast("Guardado con éxito", "success", 3000);
    } catch (error) {
      addToast("Error al guardar", "error", 5000);
    }
  };

  return <button onClick={handleGuardar}>Guardar</button>;
}
```

### Métodos del Hook

#### `addToast(message, type, duration)`

Muestra una notificación.

- `message` (string): Texto a mostrar
- `type` (ToastType, default: 'info'): `'success'`, `'error'`, `'warning'`, `'info'`
- `duration` (number, default: 3000): Milisegundos antes de auto-cerrar (0 = sin auto-cerrar)
- **Retorna**: ID único de la notificación

```tsx
const id = addToast("Cambios guardados", "success");
```

#### `removeToast(id)`

Cierra una notificación manualmente.

```tsx
removeToast(id);
```

#### `clearAll()`

Cierra todas las notificaciones.

```tsx
clearAll();
```

### Ejemplos Avanzados

```tsx
// Notificación sin auto-cerrar (usuario debe cerrar manualmente)
addToast("Esta es una notificación importante", "warning", 0);

// Notificación después de acción asincrónica
const handleEliminar = async (id: string) => {
  try {
    await apiDelete(`/item/${id}`);
    addToast("Elemento eliminado correctamente", "success");
    // Recargar lista, etc.
  } catch (error) {
    addToast("No se pudo eliminar: " + error.message, "error", 5000);
  }
};

// Encadenar múltiples toasts
addToast("Iniciando...");
setTimeout(() => addToast("Completado", "success"), 2000);
```

### Colores por Tipo

| Tipo      | Color Fondo    | Color Borde | Color Texto     | Ícono |
| --------- | -------------- | ----------- | --------------- | ----- |
| `success` | Verde claro    | Verde       | Verde oscuro    | ✓     |
| `error`   | Rojo claro     | Rojo        | Rojo oscuro     | ✕     |
| `warning` | Amarillo claro | Amarillo    | Amarillo oscuro | ⚠     |
| `info`    | Azul claro     | Azul        | Azul oscuro     | ⓘ     |

---

## Mejoras de Hover States

Se han mejorado los hover states en componentes interactivos para mejor feedback visual:

### Solicitudes de Trabajo

- **Efecto**: Elevación (translateY -4px) + aumento de sombra + borde primario
- **Transición**: 0.2s ease-out suave
- **Ubicación**: [FrontEnd/src/app/solicitudes-trabajo/page.tsx](FrontEnd/src/app/solicitudes-trabajo/page.tsx)

### Recomendaciones

- **Efecto**: Elevación (translateY -4px) + aumento de sombra azulado
- **Transición**: 0.2s ease-out suave
- **Ubicación**: [FrontEnd/src/app/recomendaciones/page.tsx](FrontEnd/src/app/recomendaciones/page.tsx)

Estos efectos crean mejor feedback visual sin cambiar la estructura o interfaz.

---

## Resumen de Cambios

### Archivos Creados

- ✅ `FrontEnd/src/components/ui/EmptyState.tsx` - Componente reutilizable
- ✅ `FrontEnd/src/components/ui/Toast.tsx` - Componente visual de notificaciones
- ✅ `FrontEnd/src/contexts/ToastContext.tsx` - Context + hooks

### Archivos Modificados

- ✅ `FrontEnd/src/components/ui/index.ts` - Exportaciones
- ✅ `FrontEnd/src/app/layout.tsx` - Integración ToastProvider
- ✅ `FrontEnd/src/app/solicitudes-trabajo/page.tsx` - Hover states
- ✅ `FrontEnd/src/app/recomendaciones/page.tsx` - Hover states

### Compilación

- ✅ Build exitoso: 24/24 páginas generadas
- ✅ TypeScript: Sin errores
- ✅ Tiempo: ~5-10 segundos

---

## Próximas Mejoras Sugeridas

1. **Modal de Confirmación**: Reutilizable para eliminar/rechazar
2. **Paginación**: Componente para listados largos
3. **Breadcrumbs**: Navegación contextual
4. **Skeleton Loaders**: Estados de carga mejorados
5. **Tooltip**: Para ayuda en hover sobre elementos
