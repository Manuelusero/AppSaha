# 🪝 Hooks Personalizados - SAHA App

Documentación completa de todos los hooks personalizados disponibles en la aplicación.

---

## 📚 Índice

1. [Hooks de Autenticación](#hooks-de-autenticación)
2. [Hooks de Datos](#hooks-de-datos)
3. [Hooks de Formularios](#hooks-de-formularios)
4. [Hooks de UI](#hooks-de-ui)
5. [Hooks de Utilidades](#hooks-de-utilidades)

---

## 🔐 Hooks de Autenticación

### `useRequireAuth`

Protege rutas que requieren autenticación. Redirige automáticamente si el usuario no está autenticado.

**Uso:**

```tsx
import { useRequireAuth } from "@/hooks";

function ProtectedPage() {
  const { user, isAuthenticated, isLoading } = useRequireAuth({
    redirectTo: "/login",
    requireRole: "PROVIDER", // Opcional: 'CLIENT' | 'PROVIDER'
  });

  if (isLoading) return <div>Cargando...</div>;

  return <div>Bienvenido {user?.name}</div>;
}
```

**Opciones:**

- `redirectTo?: string` - Ruta de redirección (default: `/login`)
- `requireRole?: 'CLIENT' | 'PROVIDER'` - Rol requerido (opcional)

---

### `useRedirectIfAuthenticated`

Redirige usuarios autenticados. Útil para páginas de login/signup.

**Uso:**

```tsx
import { useRedirectIfAuthenticated } from "@/hooks";

function LoginPage() {
  useRedirectIfAuthenticated("/dashboard");

  return <LoginForm />;
}
```

---

## 📡 Hooks de Datos

### `useFetch`

Realiza peticiones HTTP con manejo automático de estados de loading, error y datos.

**Uso:**

```tsx
import { useFetch } from "@/hooks";

function ProvidersList() {
  const { data, loading, error, refetch } = useFetch<Provider[]>(
    "http://localhost:8000/api/providers",
    {
      token: localStorage.getItem("token"),
    }
  );

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {data?.map((provider) => (
        <ProviderCard key={provider.id} {...provider} />
      ))}
      <button onClick={refetch}>Recargar</button>
    </div>
  );
}
```

**Opciones:**

- `skip?: boolean` - No ejecuta el fetch inicial (para fetch manual)
- `token?: string` - Token de autenticación
- Todas las opciones estándar de `fetch`

**Retorna:**

- `data: T | null` - Datos obtenidos
- `loading: boolean` - Estado de carga
- `error: string | null` - Mensaje de error
- `refetch: () => Promise<void>` - Función para rehacer el fetch
- `setData: (data: T | null) => void` - Actualizar datos manualmente

---

### `useLocationSearch`

Búsqueda de ubicaciones con debounce usando la API de Nominatim (OpenStreetMap).

**Uso:**

```tsx
import { useLocationSearch } from "@/hooks";

function LocationInput() {
  const {
    ubicacion,
    setUbicacion,
    sugerencias,
    loading,
    mostrarDropdown,
    setMostrarDropdown,
    seleccionarUbicacion,
    limpiar,
  } = useLocationSearch({
    minChars: 3,
    debounceMs: 300,
    country: "Argentina",
    limit: 15,
  });

  return (
    <div>
      <input
        value={ubicacion}
        onChange={(e) => setUbicacion(e.target.value)}
        onFocus={() => setMostrarDropdown(true)}
        placeholder="Escribe tu ciudad..."
      />

      {mostrarDropdown && sugerencias.length > 0 && (
        <div className="dropdown">
          {loading && <div>Buscando...</div>}
          {sugerencias.map((s) => (
            <div key={s.name} onClick={() => seleccionarUbicacion(s.name)}>
              {s.display_name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

**Opciones:**

- `minChars?: number` - Mínimo de caracteres para buscar (default: 3)
- `debounceMs?: number` - Tiempo de debounce en ms (default: 300)
- `country?: string` - País para filtrar (default: 'Argentina')
- `limit?: number` - Límite de resultados (default: 15)

---

## 📝 Hooks de Formularios

### `useForm`

Manejo completo de formularios con validación, estados de error y submit.

**Uso:**

```tsx
import { useForm } from "@/hooks";

function SignupForm() {
  const { values, errors, handleChange, handleSubmit, loading } = useForm({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validate: {
      email: (value) => {
        if (!value) return "Email requerido";
        if (!/\S+@\S+\.\S+/.test(value)) return "Email inválido";
      },
      password: (value) => {
        if (!value) return "Contraseña requerida";
        if (value.length < 6) return "Mínimo 6 caracteres";
      },
      confirmPassword: (value, allValues) => {
        if (value !== allValues.password) return "Las contraseñas no coinciden";
      },
    },
    onSubmit: async (values) => {
      await registerUser(values);
    },
  });

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={values.email}
        onChange={(e) => handleChange("email")(e.target.value)}
      />
      {errors.email && <span>{errors.email}</span>}

      <input
        type="password"
        value={values.password}
        onChange={(e) => handleChange("password")(e.target.value)}
      />
      {errors.password && <span>{errors.password}</span>}

      <button type="submit" disabled={loading}>
        {loading ? "Enviando..." : "Registrar"}
      </button>
    </form>
  );
}
```

**Retorna:**

- `values: T` - Valores actuales del formulario
- `errors: FormErrors` - Errores de validación
- `loading: boolean` - Estado de envío
- `touched: Record<keyof T, boolean>` - Campos que han sido tocados
- `handleChange: (name) => (value) => void` - Manejar cambios
- `handleChangeEvent: (e) => void` - Manejar eventos de cambio
- `handleBlur: (name) => () => void` - Manejar blur
- `handleSubmit: (e?) => Promise<void>` - Manejar submit
- `setFieldValue: (name, value) => void` - Establecer valor manualmente
- `setFieldError: (name, error) => void` - Establecer error manualmente
- `resetForm: () => void` - Resetear formulario
- `isValid: boolean` - Si el formulario es válido

---

## 🎨 Hooks de UI

### `useToggle`

Simplifica el manejo de estados booleanos (modales, dropdowns, etc.).

**Uso:**

```tsx
import { useToggle } from "@/hooks";

function ModalExample() {
  const [isOpen, toggle, setIsOpen] = useToggle(false);

  return (
    <div>
      <button onClick={toggle}>Toggle Modal</button>
      <button onClick={() => setIsOpen(true)}>Abrir</button>
      <button onClick={() => setIsOpen(false)}>Cerrar</button>

      {isOpen && (
        <Modal onClose={toggle}>
          <h2>Contenido del Modal</h2>
        </Modal>
      )}
    </div>
  );
}
```

**Retorna:**

- `[0]: boolean` - Valor actual
- `[1]: () => void` - Función toggle
- `[2]: (value: boolean) => void` - Función setter

---

## 🛠️ Hooks de Utilidades

### `useDebounce`

Aplica debounce a cualquier valor. Útil para optimizar búsquedas.

**Uso:**

```tsx
import { useDebounce } from "@/hooks";
import { useState, useEffect } from "react";

function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm) {
      // Esta función solo se ejecuta 500ms después de que el usuario deja de escribir
      fetchSearchResults(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Buscar..."
    />
  );
}
```

**Parámetros:**

- `value: T` - Valor a aplicar debounce
- `delay?: number` - Tiempo de espera en ms (default: 500)

---

### `useLocalStorage`

Sincroniza estado con localStorage automáticamente.

**Uso:**

```tsx
import { useLocalStorage } from "@/hooks";

function ThemeToggle() {
  const [theme, setTheme, removeTheme] = useLocalStorage("theme", "light");

  return (
    <div>
      <p>Tema actual: {theme}</p>
      <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
        Cambiar Tema
      </button>
      <button onClick={removeTheme}>Resetear</button>
    </div>
  );
}
```

**Características:**

- ✅ Persiste automáticamente en localStorage
- ✅ Se sincroniza entre tabs/ventanas
- ✅ API similar a `useState`
- ✅ Manejo de errores integrado

**Retorna:**

- `[0]: T` - Valor almacenado
- `[1]: (value: T | ((val: T) => T)) => void` - Función setter
- `[2]: () => void` - Función para eliminar

---

## 📊 Comparativa de Hooks

| Hook                         | Uso Principal          | Complejidad | Performance    |
| ---------------------------- | ---------------------- | ----------- | -------------- |
| `useRequireAuth`             | Protección de rutas    | Baja        | ⚡️ Alta       |
| `useRedirectIfAuthenticated` | Redirección automática | Baja        | ⚡️ Alta       |
| `useFetch`                   | Peticiones HTTP        | Media       | ⚡️⚡️ Media   |
| `useLocationSearch`          | Búsqueda geográfica    | Media       | ⚡️⚡️ Media   |
| `useForm`                    | Formularios complejos  | Alta        | ⚡️⚡️⚡️ Baja |
| `useToggle`                  | Estados booleanos      | Baja        | ⚡️ Alta       |
| `useDebounce`                | Optimizar búsquedas    | Baja        | ⚡️ Alta       |
| `useLocalStorage`            | Persistencia local     | Media       | ⚡️⚡️ Media   |

---

## 🎯 Mejores Prácticas

### ✅ Do's

- **Usa `useLocationSearch`** en lugar de duplicar lógica de búsqueda de ubicaciones
- **Usa `useFetch`** para todas las peticiones HTTP simples
- **Usa `useForm`** para formularios con más de 3 campos o que requieran validación
- **Usa `useDebounce`** para búsquedas en tiempo real
- **Usa `useToggle`** para modales, dropdowns y estados on/off

### ❌ Don'ts

- No uses `useForm` para formularios muy simples (1-2 campos sin validación)
- No uses `useFetch` si necesitas lógica muy personalizada (mejor crear tu propio hook)
- No abuses de `useLocalStorage` para datos sensibles (usa cookies httpOnly)
- No uses `useDebounce` con delays muy largos (>1000ms) para búsquedas

---

## 🔄 Migración de Código Existente

### Antes (sin hooks):

```tsx
const [ubicacion, setUbicacion] = useState("");
const [sugerencias, setSugerencias] = useState([]);
const [loading, setLoading] = useState(false);

useEffect(() => {
  const timer = setTimeout(() => {
    if (ubicacion.length >= 3) {
      fetchLocations(ubicacion);
    }
  }, 300);
  return () => clearTimeout(timer);
}, [ubicacion]);

const fetchLocations = async (query) => {
  setLoading(true);
  // ... 50 líneas de código
};
```

### Después (con hooks):

```tsx
const { ubicacion, setUbicacion, sugerencias, loading } = useLocationSearch();
```

**Reducción:** ~50 líneas → 6 líneas ✨

---

## 📦 Importación

Todos los hooks se pueden importar desde un solo lugar:

```tsx
import {
  // Auth
  useRequireAuth,
  useRedirectIfAuthenticated,

  // Data
  useFetch,
  useLocationSearch,

  // Forms
  useForm,

  // UI
  useToggle,

  // Utils
  useDebounce,
  useLocalStorage,
} from "@/hooks";
```

---

## 🚀 Próximos Hooks Planificados

- [ ] `useInfiniteScroll` - Scroll infinito para listas
- [ ] `useMediaQuery` - Responsive breakpoints
- [ ] `usePagination` - Paginación de datos
- [ ] `useAsync` - Operaciones asíncronas genéricas
- [ ] `useClickOutside` - Detectar clicks fuera de un elemento

---

**Última actualización:** 9 de enero de 2026
**Versión:** 1.0.0
