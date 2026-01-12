# 🚀 Guía de Migración a Zustand

## ✅ Implementación Completa

Zustand está completamente integrado y funcionando. El código legacy sigue funcionando sin cambios.

---

## 📊 Dos formas de usar el estado

### Opción 1: useAuth (Compatible con código existente) ✅

```tsx
import { useAuth } from "@/contexts";

function MiComponente() {
  const { user, isAuthenticated, login, logout } = useAuth();

  // Funciona igual que antes
  if (!isAuthenticated) return <Login />;

  return <h1>Hola {user?.name}</h1>;
}
```

### Opción 2: useAuthStore (Más rápido - RECOMENDADO) 🔥

```tsx
import { useAuthStore } from "@/store";

function MiComponente() {
  // Suscripción selectiva = menos re-renders
  const user = useAuthStore((state) => state.user);
  const login = useAuthStore((state) => state.login);

  return <h1>Hola {user?.name}</h1>;
}
```

---

## ⚡ Ventajas de Performance

### Antes (Context API):

```tsx
// ❌ Se re-renderiza cuando CUALQUIER parte del estado cambia
const { user, token, isLoading } = useAuth();
```

### Ahora (Zustand):

```tsx
// ✅ Solo se re-renderiza cuando user cambia
const user = useAuthStore((state) => state.user);

// ✅ Solo cuando isLoading cambia
const isLoading = useAuthStore((state) => state.isLoading);
```

---

## 🎯 Ejemplo de Migración Progresiva

### Login (Ya funciona sin cambios)

```tsx
// app/login/page.tsx - NO necesita cambios
const { login } = useAuth(); // ✅ Funciona

const handleSubmit = async () => {
  const data = await apiPost("/auth/login", { email, password });
  login(data.token, data.user); // ✅ Funciona igual
};
```

### Opción Mejorada (Cuando quieras optimizar)

```tsx
// Usar directamente el store para mejor performance
import { useAuthStore } from "@/store";

const login = useAuthStore((state) => state.login);

const handleSubmit = async () => {
  const data = await apiPost("/auth/login", { email, password });
  login(data.user, data.token); // Nota: orden de parámetros diferente
};
```

---

## 🔧 Persistencia Automática

```tsx
// ✅ El estado se guarda AUTOMÁTICAMENTE en localStorage
// ✅ Se restaura al recargar la página
// ✅ Sin código extra necesario

// Zustand se encarga de todo:
{
  name: 'auth-storage',
  partialize: (state) => ({
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
  }),
}
```

---

## 📈 Próximos Pasos (Opcional)

### 1. Crear bookingsStore

```tsx
// store/bookingsStore.ts
export const useBookingsStore = create((set) => ({
  bookings: [],
  loading: false,
  fetchBookings: async () => {
    set({ loading: true });
    const data = await apiGet("/bookings");
    set({ bookings: data, loading: false });
  },
}));
```

### 2. Usar en Dashboard

```tsx
// ✅ Solo se re-renderiza cuando bookings cambian
const bookings = useBookingsStore((state) => state.bookings);
const fetchBookings = useBookingsStore((state) => state.fetchBookings);

useEffect(() => {
  fetchBookings();
}, []);
```

---

## 🎨 DevTools (Opcional)

```bash
# Instalar extension para Chrome/Firefox
# https://github.com/pmndrs/zustand-devtools

npm install zustand-devtools
```

---

## ✨ Resumen

- ✅ **Instalado**: Zustand + persist middleware
- ✅ **AuthStore**: Estado global optimizado
- ✅ **Compatibilidad**: Código existente funciona sin cambios
- ✅ **Performance**: Menos re-renders, más rápido
- ✅ **Persistencia**: Automática en localStorage
- ✅ **TypeScript**: Totalmente tipado

**No necesitas hacer nada más**. Todo sigue funcionando, pero ahora es más rápido y escalable.
