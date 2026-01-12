# Sistema de Autenticación - Context API

## 📋 Descripción

Sistema centralizado de autenticación usando React Context API para gestionar el estado de usuario, token y sesión en toda la aplicación.

## 🏗️ Arquitectura

```
FrontEnd/src/
├── contexts/
│   ├── AuthContext.tsx      # Context principal de autenticación
│   └── index.ts             # Exports
├── components/
│   └── auth/
│       ├── ProtectedRoute.tsx  # HOC para proteger rutas
│       └── index.ts
└── hooks/
    ├── useAuth.ts           # Hooks personalizados
    └── index.ts
```

## 🚀 Uso

### 1. AuthContext - Estado Global

El `AuthProvider` ya está configurado en el `layout.tsx` principal y envuelve toda la aplicación.

```tsx
import { useAuth } from "@/contexts";

function MyComponent() {
  const { user, token, isAuthenticated, isLoading, login, logout, updateUser } =
    useAuth();

  return (
    <div>
      {isAuthenticated ? <p>Hola, {user?.name}</p> : <p>No autenticado</p>}
    </div>
  );
}
```

### 2. Login y Logout

```tsx
import { useAuth } from "@/contexts";

function LoginPage() {
  const { login } = useAuth();

  const handleLogin = async (email: string, password: string) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    // Login automático (guarda en localStorage también)
    login(data.token, data.user, data.user.providerProfile?.id);
  };
}

function Header() {
  const { logout } = useAuth();

  return <button onClick={logout}>Cerrar Sesión</button>;
}
```

### 3. Proteger Rutas - Componente HOC

```tsx
import { ProtectedRoute } from "@/components/auth";

export default function DashboardPage() {
  return (
    <ProtectedRoute requireAuth={true} requireRole="PROVIDER">
      <div>
        <h1>Dashboard de Proveedor</h1>
        {/* Contenido protegido */}
      </div>
    </ProtectedRoute>
  );
}
```

Props de `ProtectedRoute`:

- `requireAuth` (boolean): Requiere autenticación (default: true)
- `requireRole` ('CLIENT' | 'PROVIDER'): Requiere rol específico
- `redirectTo` (string): Ruta de redirección si no cumple (default: '/login')

### 4. Hooks Personalizados

#### `useRequireAuth` - Para proteger páginas

```tsx
import { useRequireAuth } from "@/hooks";

export default function PrivatePage() {
  const { user, isLoading } = useRequireAuth({
    requireRole: "PROVIDER",
  });

  if (isLoading) return <div>Cargando...</div>;

  return <div>Bienvenido {user?.name}</div>;
}
```

#### `useRedirectIfAuthenticated` - Para login/signup

```tsx
import { useRedirectIfAuthenticated } from "@/hooks";

export default function LoginPage() {
  // Redirige automáticamente si ya está logueado
  useRedirectIfAuthenticated();

  return <div>Formulario de login</div>;
}
```

## 📊 API del AuthContext

### Estado

```typescript
interface AuthContextType {
  user: User | null; // Datos del usuario actual
  token: string | null; // JWT token
  providerId: string | null; // ID del proveedor (si es PROVIDER)
  isAuthenticated: boolean; // true si hay token y usuario
  isLoading: boolean; // true mientras se carga del localStorage
  login: (token, user, providerId?) => void;
  logout: () => void;
  updateUser: (user) => void;
}
```

### Métodos

#### `login(token: string, user: User, providerId?: string)`

Inicia sesión guardando datos en Context + localStorage.

```tsx
const { login } = useAuth();

login(
  "jwt_token_here",
  { id: "1", name: "Juan", email: "juan@example.com", role: "PROVIDER" },
  "provider_id_123"
);
```

#### `logout()`

Cierra sesión limpiando Context + localStorage y redirige a `/`.

```tsx
const { logout } = useAuth();

<button onClick={logout}>Salir</button>;
```

#### `updateUser(user: User)`

Actualiza datos del usuario en Context + localStorage.

```tsx
const { updateUser } = useAuth();

updateUser({
  ...user,
  name: "Nuevo Nombre",
});
```

## 🔄 Flujo de Autenticación

### Login

1. Usuario envía credenciales
2. Backend responde con `{ token, user }`
3. Llamar `login(token, user, providerId?)`
4. Context actualiza estado + localStorage
5. Redirigir según rol

### Logout

1. Usuario hace click en "Cerrar sesión"
2. Llamar `logout()`
3. Context limpia estado + localStorage
4. Redirección automática a `/`

### Carga Inicial

1. App monta, `AuthProvider` se inicializa
2. Lee `token`, `user`, `providerId` desde localStorage
3. Si existen, actualiza Context
4. `isLoading` pasa a `false`
5. Componentes pueden usar `useAuth()`

### Protección de Rutas

1. Página usa `useRequireAuth()` o `<ProtectedRoute>`
2. Si no autenticado → redirige a `/login`
3. Si rol incorrecto → redirige a dashboard correspondiente
4. Si todo OK → muestra contenido

## ✅ Páginas Actualizadas

- ✅ `/login` - Usa `useAuth()` + `useRedirectIfAuthenticated()`
- ✅ `/signup-client` - Usa `useAuth()` + `useRedirectIfAuthenticated()`
- ✅ `/dashboard` - Usa `useAuth()` para verificar token
- ✅ `<Header />` - Usa `useAuth()` para estado de autenticación
- ✅ `<Layout />` - Envuelve todo con `<AuthProvider>`

## 🎯 Próximos Pasos

- [ ] Actualizar `/provider-signup` para usar Context
- [ ] Actualizar `/dashboard-provider` con `useRequireAuth()`
- [ ] Actualizar `/dashboard-client` con `useRequireAuth()`
- [ ] Agregar refresh token automático
- [ ] Agregar persistencia en sessionStorage como opción

## 📝 Notas

- **localStorage**: Se mantiene para persistencia entre sesiones
- **Context**: Proporciona acceso reactivo sin prop drilling
- **TypeScript**: Todos los tipos están definidos
- **Performance**: Context solo re-renderiza cuando cambia el estado de auth
- **Seguridad**: Token se envía en headers, nunca en URL

## 🐛 Troubleshooting

### "useAuth must be used within AuthProvider"

Asegúrate de que el componente está dentro del `<AuthProvider>` en `layout.tsx`.

### Redirect loop infinito

Verifica que las rutas de redirección no creen ciclos. Por ejemplo, no uses `useRequireAuth()` en la página `/login`.

### Estado no se actualiza

El Context es reactivo. Si usas `localStorage` directamente, llama `login()` o `updateUser()` para sincronizar.
