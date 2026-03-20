# 🗄️ Guía de Base de Datos – Estado Actual y Migración a Producción

> **Complementa** `DATABASE_COMPLETE.md` (que documenta el schema).  
> Este archivo responde: _¿dónde está la DB hoy, cómo funciona, y qué necesitamos para escalar?_

---

## 1. Estado Actual

### Stack

| Capa                       | Tecnología                       | Estado                     |
| -------------------------- | -------------------------------- | -------------------------- |
| ORM                        | **Prisma**                       | ✅ Configurado             |
| Motor de DB                | **PostgreSQL**                   | ✅ En schema y migraciones |
| Proveedor actual           | **Neon** (serverless PostgreSQL) | ✅ Free tier               |
| Almacenamiento de archivos | `uploads/` local (filesystem)    | ⚠️ Solo dev                |
| Connection pooling         | Ninguno                          | ⚠️ Pendiente               |
| Backups automáticos        | Ninguno configurado              | ⚠️ Pendiente               |

### Cómo conecta hoy

```
BackEnd/.env
  └─> DATABASE_URL="postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require"
        └─> Prisma Client lee esta variable
              └─> Todas las queries de src/routes/*.ts
```

### Migraciones aplicadas

```
prisma/migrations/
  ├── 20260113175548_init/                    ← Tablas iniciales
  ├── 20260114182837_add_dni_photos/          ← dniPhotoFront + dniPhotoBack
  └── 20260212200117_add_guest_client_support/ ← clientDataToken, clientName, etc.
```

Cada migración genera un SQL que vive en `migration.sql` dentro de su carpeta.  
Prisma trackea cuáles fueron aplicadas en la tabla `_prisma_migrations`.

---

## 2. Problemas Actuales (Deuda Técnica)

### 2.1 JSON almacenado como String

Varios campos usan `String` para guardar arrays JSON — esto funciona pero no es óptimo:

```prisma
// Actualmente (problema)
specialties   String?   // JSON array: '["Plomería", "Gas"]'
workPhotos    String?   // JSON array: '["url1.jpg", "url2.jpg"]'
videoUrls     String?   // JSON array: '["https://..."]'
certifications String?  // JSON: '[{"name":"...", "url":"..."}]'
metadata      String?   // JSON en Notification
```

**Consecuencias:**

- No se puede hacer queries filtradas por elemento del array directamente
- Riesgo de JSON malformado en runtime
- No hay validación de tipos en DB

**Solución en PostgreSQL:** Cambiar a tipo nativo `Json` de Prisma (mapea a `jsonb` en Postgres).

### 2.2 Archivos subidos en filesystem local

```
BackEnd/uploads/
  ├── profile/     ← Fotos de perfil
  ├── dni/         ← Fotos del DNI
  ├── certificates/← Certificados
  ├── portfolio/   ← Fotos de trabajos
  └── problems/    ← Fotos de problemas en bookings
```

**Consecuencias:**

- En Vercel, el filesystem es **efímero** — los archivos se pierden en cada deploy
- No escala horizontalmente (múltiples instancias no comparten archivos)
- No hay CDN

### 2.3 Campos legacy sin limpiar

```prisma
dniDocument      String?  // ← LEGACY (reemplazado por dniPhotoFront/Back)
portfolioImages  String?  // ← LEGACY (reemplazado por workPhotos)
```

Ambos campos siguen en el schema pero no deberían usarse.

### 2.4 Falta de índices para búsqueda principal

La query más crítica (buscar proveedores) no tiene índices compuestos:

```prisma
// Falta esto en ProviderProfile:
@@index([serviceCategory, location, isAvailable, isVerified])
@@index([rating])
```

### 2.5 `pricePerHour` es `Float`, no `Decimal`

Los `Float` tienen errores de precisión de punto flotante. Para precios se recomienda `Decimal`.

---

## 3. Opciones de Base de Datos para Producción

| Proveedor       | Tipo             | Free Tier         | Ventajas                    | Ideal para                |
| --------------- | ---------------- | ----------------- | --------------------------- | ------------------------- |
| **Neon** ⭐     | Serverless PG    | ✅ Generoso       | Ya lo usamos, branching     | Deploy en Vercel          |
| **Supabase**    | Hosted PG        | ✅ 500MB          | Storage + Auth incluidos    | Full stack                |
| **Railway**     | Hosted PG        | ✅ 5$/mes crédito | Simple, sin cold starts     | Staging                   |
| **PlanetScale** | MySQL serverless | ✅                | Branching DB                | Solo si cambiamos a MySQL |
| **AWS RDS**     | Hosted PG        | ❌                | Enterprise, backups nativos | >10k usuarios             |
| **Render**      | Hosted PG        | ✅ 90 días        | Simple pricing              | MVP                       |

**Recomendación**: Seguir con **Neon** para producción también.  
Razones: ya configurado, Vercel tiene integración nativa, plan Pro es barato ($19/mes), soporta branching de DB para staging.

---

## 4. Opciones de Almacenamiento de Archivos

El problema de `uploads/` local **debe resolverse antes de ir a producción**.

| Servicio             | Free    | CDN            | SDK para Node   | Recomendación                 |
| -------------------- | ------- | -------------- | --------------- | ----------------------------- |
| **Cloudinary** ⭐    | 25GB    | ✅             | ✅              | Imágenes con transformaciones |
| **Supabase Storage** | 1GB     | ✅             | ✅              | Si ya usamos Supabase         |
| **AWS S3**           | 5GB/12m | Vía CloudFront | ✅              | Enterprise                    |
| **UploadThing**      | 2GB     | ✅             | ✅ para Next.js | Full-stack Next.js            |
| **Vercel Blob**      | 1GB     | ✅             | ✅              | Ya estamos en Vercel          |

**Recomendación**: **Cloudinary** (imágenes con redimensionado automático, compresión, CDN incluido).

---

## 5. Checklist de Migración a Producción

### Fase 1: Preparación del Schema (sin downtime)

- [ ] **Limpiar campos legacy**

  ```bash
  # Crear migración:
  npx prisma migrate dev --name remove_legacy_fields
  ```

  Campos a eliminar: `dniDocument`, `portfolioImages`

- [ ] **Cambiar JSON String → tipo Json de Prisma**

  ```prisma
  // En schema.prisma, cambiar:
  specialties    String?
  // Por:
  specialties    Json?    // Se mapea a jsonb en PostgreSQL
  workPhotos     Json?
  videoUrls      Json?
  certifications Json?
  // En Notification:
  metadata       Json?
  ```

  > ⚠️ Requiere migración de datos: parsear strings existentes y re-guardar como JSON nativo.

- [ ] **Agregar índices compuestos**

  ```prisma
  // En ProviderProfile:
  @@index([serviceCategory, location])
  @@index([isAvailable, isVerified, rating])

  // En Booking:
  @@index([clientId, status])
  @@index([providerId, status])
  @@index([createdAt])

  // En Message:
  @@index([senderId, receiverId, createdAt])
  ```

- [ ] **Agregar campo `slug` para SEO** (ver `SEO_ROADMAP.md`)

  ```prisma
  // En ProviderProfile:
  slug    String?   @unique
  // Formato: "juan-perez-plomero-cordoba"
  ```

- [ ] **Cambiar `pricePerHour` de Float a Decimal**
  ```prisma
  pricePerHour   Decimal?   @db.Decimal(10, 2)
  ```

### Fase 2: Migración de Archivos

- [ ] **Configurar Cloudinary**

  ```bash
  cd BackEnd
  npm install cloudinary multer-storage-cloudinary
  ```

  Variables a agregar a `.env`:

  ```
  CLOUDINARY_CLOUD_NAME=xxx
  CLOUDINARY_API_KEY=xxx
  CLOUDINARY_API_SECRET=xxx
  ```

- [ ] **Modificar `src/middleware/upload.ts`**

  Actualmente usa `multer` con `diskStorage` local.  
  Cambiar a `CloudinaryStorage`:

  ```typescript
  // upload.ts - nuevo comportamiento
  import { v2 as cloudinary } from "cloudinary";
  import { CloudinaryStorage } from "multer-storage-cloudinary";

  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "serco/uploads",
      allowed_formats: ["jpg", "jpeg", "png", "pdf"],
      transformation: [{ width: 1200, quality: "auto" }],
    },
  });
  ```

- [ ] **Migrar URLs existentes**: Correr script que descargue archivos locales y re-suba a Cloudinary, actualizando las URLs en DB.

### Fase 3: Producción Real (cuando haya usuarios reales)

- [ ] **Connection Pooling con Prisma Accelerate**

  ```
  DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=xxx"
  ```

  O PgBouncer (gratis con Neon Pro).

- [ ] **Variables de entorno separadas**

  ```
  BackEnd/.env             ← desarrollo local (no commitear)
  BackEnd/.env.production  ← plantilla (no commitear valores reales)
  Vercel Dashboard         ← valores reales de producción
  ```

- [ ] **Backups automáticos**
  - Neon Pro: backups continuos con PITR (Point-in-Time Recovery)
  - Alternativa manual: `pg_dump` via cron job

- [ ] **Monitoring**
  - Neon Dashboard para métricas de queries lentas
  - Sentry para errores del backend

---

## 6. Variables de Entorno Necesarias en Producción

```bash
# ─── BASE DE DATOS ───────────────────────────────────────────────
DATABASE_URL="postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require"

# ─── AUTENTICACIÓN ───────────────────────────────────────────────
JWT_SECRET="[string aleatoria de 64+ chars]"  # Generar con: openssl rand -hex 32

# ─── SERVIDOR ────────────────────────────────────────────────────
NODE_ENV="production"
PORT=8000
FRONTEND_URL="https://serco.com.ar"

# ─── ALMACENAMIENTO (cuando se migre) ────────────────────────────
CLOUDINARY_CLOUD_NAME="xxx"
CLOUDINARY_API_KEY="xxx"
CLOUDINARY_API_SECRET="xxx"

# ─── EMAIL (cuando se implemente) ────────────────────────────────
# SMTP_HOST="smtp.resend.com"
# SMTP_PORT=465
# SMTP_USER="resend"
# SMTP_PASS="xxx"
# EMAIL_FROM="no-reply@serco.com.ar"
```

---

## 7. Cambios que Requieren Migración de Datos

> Estos son los únicos cambios que necesitan transformar datos existentes (más riesgosos).

| Cambio                                         | Estrategia                                 | Script necesario                 |
| ---------------------------------------------- | ------------------------------------------ | -------------------------------- |
| String → Json para specialties/workPhotos/etc. | Parsear cada fila y re-insertar            | `scripts/migrate-json-fields.ts` |
| Local uploads → Cloudinary                     | Descargar y re-subir archivos              | `scripts/migrate-uploads.ts`     |
| `id` de Int a CUID                             | No aplica — ya usamos CUID                 | —                                |
| Agregar `slug` a ProviderProfile               | Generar slugs desde name+category+location | `scripts/generate-slugs.ts`      |

---

## 8. Cómo Hacer una Migración Segura

```bash
# 1. SIEMPRE respaldar antes de migrar en producción
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# 2. Aplicar solo en staging primero
# (crear branch de Neon para staging)
neon branches create --name staging

# 3. Probar la migración en staging
DATABASE_URL="postgresql://...staging..." npx prisma migrate deploy

# 4. Si todo OK, aplicar en producción
npx prisma migrate deploy

# 5. Verificar
npx prisma studio  # UI visual en localhost:5555
```

---

## 9. Funcionalidades que Faltan en DB (Futuro)

Estas features no están modeladas aún y requerirán nuevas migraciones:

| Feature                             | Tablas nuevas necesarias            | Prioridad |
| ----------------------------------- | ----------------------------------- | --------- |
| **Pagos** (Mercado Pago)            | `Payment`, `Refund`                 | Alta      |
| **Categorías dinámicas**            | `Category` (ahora es enum estático) | Media     |
| **Zonas de servicio detalladas**    | `ServiceZone` (polygon geográfico)  | Media     |
| **Verificación de email**           | `EmailVerificationToken`            | Alta      |
| **Recuperar contraseña**            | `PasswordResetToken`                | Alta      |
| **Plan/suscripción de proveedores** | `Subscription`, `Plan`              | Media     |
| **Reportes/denuncias**              | `Report`                            | Alta      |
| **Historial de precios**            | `PriceHistory`                      | Baja      |

---

## 10. Diagrama Simplificado

```
User ──────────────────── ProviderProfile
 │                              │
 │ (como cliente)               │
 ├──> Booking ──────────────────┘
 │       │
 │       └──> Review
 │       └──> (clientDataToken para guest bookings)
 │
 ├──> Favorite ──────> ProviderProfile
 ├──> Notification
 └──> Message (sender/receiver)

ProviderProfile
 ├──> ProviderReference
 └──> (slug para SEO — pendiente)
```

---

**Para ver el schema completo:** [`prisma/schema.prisma`](prisma/schema.prisma)  
**Para ver documentación del schema:** [`DATABASE_COMPLETE.md`](DATABASE_COMPLETE.md)  
**Para ver roadmap SEO (slugs):** [`../FrontEnd/SEO_ROADMAP.md`](../FrontEnd/SEO_ROADMAP.md)
