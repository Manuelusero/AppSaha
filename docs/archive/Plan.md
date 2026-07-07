# PLAN: SAHA — Estado actual y roadmap de implementación

## Contexto del proyecto

**SAHA** — Marketplace argentino que conecta clientes con proveedores de servicios del hogar (plomeros, electricistas, pintores, etc.).

**Stack:** Next.js 15 / React 19 · Express 5 / TypeScript · Prisma ORM · PostgreSQL (Neon) · Cloudinary · Vercel  
**Testing:** Vitest + Supertest · **State:** Zustand 5 · **Design:** Tailwind CSS 4 + Design Tokens

---

## Lo que ya está construido ✅

### Backend

- Auth completo: JWT + bcrypt, roles CLIENT / PROVIDER / ADMIN
- Providers: listado, filtrado, perfil, registro con upload (DNI, certificados, portfolio via Cloudinary)
- Bookings: state machine completo (`PENDING → ACCEPTED → CONFIRMED → IN_PROGRESS → COMPLETED / REJECTED / CANCELLED`), guest booking, token para cliente invitado
- Reviews: crear (1 por booking completado), listar por provider/cliente, respuesta del proveedor, recalculo automático de rating
- Prisma schema: User, ProviderProfile, ProviderReference, Booking, Review, Favorite, Notification, Message — todos migrados
- Tests: auth.test, bookings.test, reviews.test (~85% coverage)

### Frontend

- **25+ páginas:** home, buscar, select-specialty, search-results, provider profile + booking, job-request (guest), contact-details, client-contact (token), login, signup (provider), signup-client, provider-signup (multi-step), dashboard, dashboard-client, dashboard-provider, solicitudes-trabajo (mock), recomendaciones (mock), recomendacion/[id] (hardcoded), sobre-nosotros, contacto, soporte-proveedores, privacidad
- **Componentes:** Button, Input, PasswordInput, LoadingSpinner, Modal, StarRating, StatusBadge, CookieBanner, Header, Footer, ProviderHeader, ProtectedRoute
- **9 hooks:** useRequireAuth, useRedirectIfAuthenticated, useCookieConsent, useDebounce, useFetch, useForm, useLocalStorage, useLocationSearch, useToggle
- **Zustand stores:** authStore (persistido) + bookingsStore
- **Utils:** fetchWithAuth + wrappers (api.ts), constants, categories, images
- **Contexts:** AuthContext (wrapper de compatibilidad sobre Zustand)
- Design tokens + integración Figma (`641V0jz66WQSmdDqCN8KXV`)

---

## Bugs críticos / Seguridad 🔴

| #   | Problema                                                                                                  | Archivo                           |
| --- | --------------------------------------------------------------------------------------------------------- | --------------------------------- |
| 1   | `prisma.$disconnect()` en cada route handler — rompe el singleton y falla requests siguientes             | múltiples routes                  |
| 2   | **Route order bug**: `GET /providers/categories/list` definido DESPUÉS de `GET /providers/:id` → 404      | `BackEnd/src/routes/providers.ts` |
| 3   | **CORS permisivo**: fallback `callback(null, true)` permite cualquier origen en prod                      | `BackEnd/src/index.ts`            |
| 4   | `/api/users`: GET / PUT /:id / DELETE /:id **sin autenticación** — cualquiera puede listar/borrar cuentas | `BackEnd/src/routes/users.ts`     |
| 5   | `/api/providers`: POST register / portfolio **sin auth guard**                                            | `BackEnd/src/routes/providers.ts` |
| 6   | `clientDataToken` generado con `Math.random()` (no criptográfico) — debe usar `crypto.randomBytes`        | `BackEnd/src/routes/bookings.ts`  |
| 7   | `BackEnd/.env` con credenciales reales **no está en `.gitignore`** — rotar JWT secret y DB password       | —                                 |

---

## Features incompletas 🟡

### Backend

- **Notificaciones** — `BackEnd/src/utils/notifications.ts`: las 5 funciones son stubs (`console.log`). Pendiente: Nodemailer + Twilio
- **`/api/support/contact`** — solo `console.log`, no envía email
- **`/api/messages`** — modelo `Message` listo en schema, ruta no existe
- **`/api/favorites`** — modelo `Favorite` listo en schema, rutas no existen
- **Email verification** — campo `isEmailVerified` en User pero sin flujo implementado
- **Admin routes** — rol ADMIN existe pero no hay rutas protegidas para admin

### Frontend

- **`/solicitudes-trabajo`** — datos mock hardcodeados, sin conexión a `bookingsStore`
- **`/recomendaciones`** — `MOCK_RECOMENDACIONES` hardcodeado, sin fetch a API
- **`/recomendacion/[providerId]`** — datos del proveedor hardcodeados; submit solo hace `console.log`
- **Login OAuth** — botones Google/Facebook/Apple son stubs
- **Header** — sin menú para rol CLIENT
- **`/register`** — página legacy con `fetch` cruda, sin componentes de diseño (superada por `/signup-client`)
- **`/welcome`** — logo placeholder `[Logo aquí]` no reemplazado
- **`/privacidad`** — TODOs: OG image, email de privacidad, dirección de empresa

---

## Roadmap priorizado

### Fase 1 — Bugs críticos (bloqueante) 🔴

1. Eliminar `prisma.$disconnect()` de todos los route handlers
2. Mover `GET /categories/list` ANTES de `GET /:id` en providers
3. Fix CORS: cambiar fallback a deny en producción
4. Agregar `.env` a `.gitignore` y rotar credenciales (JWT secret + DB password)
5. Reemplazar `Math.random()` por `crypto.randomBytes` en `clientDataToken`
6. Agregar `authenticateToken` middleware a `/api/users` y `/api/providers`

### Fase 2 — Conectar Frontend con Backend real 🟡

7. `/solicitudes-trabajo` → conectar a `bookingsStore.fetchBookings()` (proveedor)
8. `/recomendaciones` → fetch real a `/api/reviews/provider/:id`
9. `/recomendacion/[providerId]` → cargar proveedor desde API + wiring del submit

### Fase 3 — Features del modelo pendientes

10. API de Messages: `GET/POST /api/messages` (conversaciones cliente ↔ proveedor)
11. API de Favorites: `POST/DELETE/GET /api/favorites`
12. Menú CLIENT en Header según `user.role`

### Fase 4 — Notificaciones y comunicación

13. Nodemailer: confirmación de booking, envío de presupuesto a cliente
14. Endpoint `/api/support/contact` con envío real de email
15. Twilio/WhatsApp (opcional)

### Fase 5 — Calidad y producción

16. Email verification flow
17. Admin dashboard (rutas protegidas por rol ADMIN)
18. Static file serving en dev (para imágenes subidas)
19. Limpiar `/register` legacy
20. Actualizar `README.md` (tiene conflictos de merge) → promover `README_NEW.md`
21. E2E tests
22. Variables de entorno de producción + migración a Azure PostgreSQL

---

## Archivos clave

| Archivo                                                | Relevancia                                |
| ------------------------------------------------------ | ----------------------------------------- |
| `BackEnd/src/index.ts`                                 | CORS, montado de rutas, graceful shutdown |
| `BackEnd/src/routes/providers.ts`                      | Route order bug, falta auth               |
| `BackEnd/src/routes/users.ts`                          | Sin auth en todos los métodos             |
| `BackEnd/src/routes/bookings.ts`                       | clientDataToken, state machine            |
| `BackEnd/src/utils/notifications.ts`                   | Stubs de notificaciones                   |
| `BackEnd/src/db/prisma.ts`                             | Singleton Prisma                          |
| `BackEnd/prisma/schema.prisma`                         | Schema completo de DB                     |
| `FrontEnd/src/app/solicitudes-trabajo/page.tsx`        | Mock data a conectar                      |
| `FrontEnd/src/app/recomendaciones/page.tsx`            | Mock data a conectar                      |
| `FrontEnd/src/app/recomendacion/[providerId]/page.tsx` | Hardcoded + sin submit                    |
| `FrontEnd/src/store/bookingsStore.ts`                  | Store a conectar                          |
| `FrontEnd/src/utils/api.ts`                            | Wrappers HTTP centralizados               |

---

## Decisiones arquitectónicas

- **Monorepo**: FrontEnd + BackEnd como sub-proyectos con sus propios `package.json`
- **Despliegue**: Vercel para ambos (FrontEnd como Next.js app, BackEnd como serverless via `api/index.ts`)
- **Imágenes**: Cloudinary en prod, local `uploads/` en dev
- **Auth**: JWT en Bearer header; Zustand `persist` en localStorage
- **Estado global**: Zustand (authStore + bookingsStore); AuthContext como capa de compatibilidad
- **DB**: Neon PostgreSQL (actual) → Azure PostgreSQL (producción planificada)
- **Diseño**: Design tokens en `FrontEnd/src/styles/tokens.ts`, Figma `641V0jz66WQSmdDqCN8KXV`
