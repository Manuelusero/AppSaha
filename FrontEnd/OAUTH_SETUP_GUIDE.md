# 🔐 OAuth Implementation Guide - SAHA Platform

## Configuración Completa de NextAuth.js

Implementación de OAuth para login con **Google**, **Facebook** y **Apple**.

---

## 📦 Instalación

```bash
cd FrontEnd
npm install next-auth@latest @auth/prisma-adapter
```

---

## 🔧 Archivos Creados

### 1. **API Route** - `/app/api/auth/[...nextauth]/route.ts`

Configuración principal de NextAuth con 4 providers:

- ✅ Google OAuth
- ✅ Facebook OAuth
- ✅ Apple OAuth
- ✅ Credentials (Email + Password)

### 2. **Type Definitions** - `/types/next-auth.d.ts`

Tipos TypeScript para extender Session y User con:

- `role`: CLIENT | PROVIDER | ADMIN
- `accessToken`: JWT del backend
- `provider`: google | facebook | apple | credentials

### 3. **OAuth Buttons Component** - `/components/auth/OAuthButtons.tsx`

Componente reutilizable con botones de login social.

### 4. **Session Provider** - `/components/auth/SessionProvider.tsx`

Wrapper para `SessionProvider` de NextAuth.

### 5. **Variables de Entorno** - `/.env.example`

Template con todas las variables necesarias.

---

## 🔐 Configuración de Providers

### 1. Google OAuth

**Paso 1:** Ve a [Google Cloud Console](https://console.cloud.google.com/)

**Paso 2:** Crea un proyecto o selecciona uno existente

**Paso 3:** Habilita "Google+ API"

**Paso 4:** Crea credenciales OAuth 2.0:

1. APIs & Services → Credentials
2. Create Credentials → OAuth 2.0 Client ID
3. Application type: Web application
4. Authorized redirect URIs:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://saha.vercel.app/api/auth/callback/google`

**Paso 5:** Copia Client ID y Client Secret

**Paso 6:** Agrega a `.env.local`:

```env
GOOGLE_CLIENT_ID=your-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-secret
```

---

### 2. Facebook OAuth

**Paso 1:** Ve a [Facebook Developers](https://developers.facebook.com/)

**Paso 2:** Crea una nueva app

**Paso 3:** Agrega "Facebook Login" como producto

**Paso 4:** Configuración de Facebook Login:

1. Settings → Basic
2. Add Platform → Website
3. Site URL: `http://localhost:3000` (dev) o `https://saha.vercel.app` (prod)

**Paso 5:** Valid OAuth Redirect URIs:

- Development: `http://localhost:3000/api/auth/callback/facebook`
- Production: `https://saha.vercel.app/api/auth/callback/facebook`

**Paso 6:** Copia App ID y App Secret

**Paso 7:** Agrega a `.env.local`:

```env
FACEBOOK_CLIENT_ID=your-app-id
FACEBOOK_CLIENT_SECRET=your-app-secret
```

---

### 3. Apple OAuth

**Paso 1:** Ve a [Apple Developer](https://developer.apple.com/account/resources/identifiers/list/serviceId)

**Paso 2:** Crea un Service ID

**Paso 3:** Configurac Sign in with Apple:

1. Enable Sign in with Apple
2. Configure:
   - Domains: `saha.vercel.app` o `localhost`
   - Return URLs:
     - `http://localhost:3000/api/auth/callback/apple` (dev)
     - `https://saha.vercel.app/api/auth/callback/apple` (prod)

**Paso 4:** Crea una Private Key:

1. Keys → Create a new key
2. Enable Sign in with Apple
3. Download `.p8` file

**Paso 5:** Genera Client Secret:

⚠️ **Apple requiere generar el secret con JWT**. Usa esta herramienta:

- https://github.com/ananay/apple-auth/blob/master/token-generator.js

O usa este código Node.js:

```javascript
const jwt = require("jsonwebtoken");
const fs = require("fs");

const privateKey = fs.readFileSync("AuthKey_XXXXXX.p8");
const token = jwt.sign({}, privateKey, {
  algorithm: "ES256",
  expiresIn: "180d",
  audience: "https://appleid.apple.com",
  issuer: "YOUR_TEAM_ID", // Tu Team ID
  subject: "com.yourdomain.services", // Tu Service ID
  keyid: "YOUR_KEY_ID", // Key ID del archivo .p8
});

console.log(token);
```

**Paso 6:** Agrega a `.env.local`:

```env
APPLE_CLIENT_ID=com.yourdomain.services
APPLE_CLIENT_SECRET=eyJhbGciOiJFUzI1NiIsImtpZCI6IlhZWiJ9...
```

---

## 🔑 Variables de Entorno

Copia `.env.example` a `.env.local`:

```bash
cp .env.example .env.local
```

Completa todas las variables:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generar-con-comando-de-abajo

# Google OAuth
GOOGLE_CLIENT_ID=your-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-secret

# Facebook OAuth
FACEBOOK_CLIENT_ID=your-app-id
FACEBOOK_CLIENT_SECRET=your-app-secret

# Apple OAuth
APPLE_CLIENT_ID=com.yourdomain.services
APPLE_CLIENT_SECRET=eyJhbGciOiJFUzI1NiIs...

# SAHA API
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Generar NEXTAUTH_SECRET:**

```bash
openssl rand -base64 32
```

---

## 💻 Uso en el Código

### 1. Agregar SessionProvider al Layout

Edita `/app/layout.tsx`:

```tsx
import { SessionProvider } from "@/components/auth";

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
```

### 2. Usar OAuth Buttons en Login

Edita `/app/login/page.tsx`:

```tsx
import { OAuthButtons } from "@/components/auth";

export default function LoginPage() {
  return (
    <div>
      <h1>Iniciar Sesión</h1>

      {/* Formulario tradicional */}
      <form>
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Contraseña" />
        <button type="submit">Entrar</button>
      </form>

      {/* Botones OAuth */}
      <OAuthButtons callbackUrl="/dashboard" />
    </div>
  );
}
```

### 3. Acceder a la Sesión

```tsx
"use client";

import { useSession, signOut } from "next-auth/react";

export default function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Cargando...</div>;
  }

  if (status === "unauthenticated") {
    return <div>No autenticado</div>;
  }

  return (
    <div>
      <h1>Hola, {session?.user?.name}</h1>
      <p>Email: {session?.user?.email}</p>
      <p>Role: {session?.user?.role}</p>
      <p>Provider: {session?.user?.provider}</p>

      <button onClick={() => signOut()}>Cerrar Sesión</button>
    </div>
  );
}
```

### 4. Proteger Rutas (Server Component)

```tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div>
      <h1>Página Protegida</h1>
      <p>Solo usuarios autenticados pueden ver esto</p>
    </div>
  );
}
```

---

## 🔄 Flujo de OAuth

### 1. Usuario hace click en "Continuar con Google"

```
Usuario → Google Login → Google autoriza → Callback a SAHA
```

### 2. NextAuth procesa el callback

```
NextAuth recibe token → Callback JWT → Crear sesión
```

### 3. Backend (opcional)

Si necesitas sincronizar con tu DB:

```typescript
// En el callback JWT (route.ts)
async jwt({ token, account }) {
  if (account?.provider) {
    // Llamar a tu backend para crear/obtener usuario
    const response = await fetch(`${apiUrl}/api/auth/oauth`, {
      method: 'POST',
      body: JSON.stringify({
        provider: account.provider,
        email: token.email,
        name: token.name,
        image: token.picture
      })
    });

    const userData = await response.json();
    token.id = userData.user.id;
    token.role = userData.user.role;
  }
  return token;
}
```

Necesitas crear un endpoint en el backend:

```typescript
// BackEnd/src/routes/auth.ts
router.post("/oauth", async (req, res) => {
  const { provider, email, name, image } = req.body;

  // Buscar o crear usuario
  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        name,
        avatar: image,
        role: "CLIENT", // O determinar según lógica
        password: "", // OAuth users no tienen password
        isEmailVerified: true, // OAuth users ya están verificados
      },
    });
  }

  res.json({
    success: true,
    user: {
      id: user.id,
      role: user.role,
      email: user.email,
      name: user.name,
    },
  });
});
```

---

## 🧪 Testing

### 1. Modo Development

```bash
npm run dev
```

Visita: `http://localhost:3000/login`

### 2. Test OAuth Flow

1. Click en "Continuar con Google"
2. Selecciona cuenta de Google
3. Acepta permisos
4. Debería redirigir a `/dashboard` o la URL configurada

### 3. Verificar Sesión

```bash
# En Chrome DevTools
# Application → Storage → Cookies
# Buscar: next-auth.session-token
```

---

## 📊 Monitoreo

### Ver sesiones activas

```tsx
"use client";

import { useSession } from "next-auth/react";

export default function DebugSession() {
  const { data, status } = useSession();

  return <pre>{JSON.stringify({ status, data }, null, 2)}</pre>;
}
```

---

## ⚠️ Troubleshooting

### Error: "Redirect URI mismatch"

- Verifica que las URLs en Google/Facebook/Apple coincidan EXACTAMENTE
- Incluye `http://` o `https://`
- No olvides el puerto en desarrollo (`:3000`)

### Error: "Invalid client"

- Verifica que Client ID y Secret estén correctos en `.env.local`
- Reinicia el servidor (`npm run dev`)

### Error: "NEXTAUTH_URL not set"

- Agrega `NEXTAUTH_URL=http://localhost:3000` a `.env.local`

### Error: "Cannot read property 'user' of null"

- Sesión no está disponible, verifica que `SessionProvider` esté en layout
- Redirecciona a login si no hay sesión

---

## 🚀 Deploy a Producción (Vercel)

### 1. Configurar Variables de Entorno en Vercel

```bash
vercel env add NEXTAUTH_URL production
vercel env add NEXTAUTH_SECRET production
vercel env add GOOGLE_CLIENT_ID production
vercel env add GOOGLE_CLIENT_SECRET production
vercel env add FACEBOOK_CLIENT_ID production
vercel env add FACEBOOK_CLIENT_SECRET production
vercel env add APPLE_CLIENT_ID production
vercel env add APPLE_CLIENT_SECRET production
```

O via Dashboard:

- Settings → Environment Variables

### 2. Actualizar Redirect URIs

En Google/Facebook/Apple, agrega:

```
https://saha.vercel.app/api/auth/callback/google
https://saha.vercel.app/api/auth/callback/facebook
https://saha.vercel.app/api/auth/callback/apple
```

### 3. Deploy

```bash
git push origin main
# Vercel autodeploy
```

---

## 📚 Recursos

- [NextAuth.js Docs](https://next-auth.js.org/)
- [Google OAuth](https://console.cloud.google.com/)
- [Facebook OAuth](https://developers.facebook.com/)
- [Apple OAuth](https://developer.apple.com/)

---

**Última actualización:** 4 de mayo de 2026
