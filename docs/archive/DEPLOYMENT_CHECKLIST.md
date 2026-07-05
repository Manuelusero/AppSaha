# ✅ Checklist de Deployment - SAHA Platform

Usa este checklist para asegurar un deployment exitoso a producción.

---

## 📋 Pre-Deployment

### Preparación Local

- [ ] **Git**: Todo committeado y pusheado
  ```bash
  git status  # No uncommitted changes
  git push origin main
  ```

- [ ] **Tests**: Todos los tests pasando
  ```bash
  cd FrontEnd && npm run test
  # Expected: All tests passing, 79%+ coverage
  ```

- [ ] **Build**: Proyecto compila sin errores
  ```bash
  # Frontend
  cd FrontEnd && npm run build
  
  # Backend
  cd BackEnd && npm run build
  ```

- [ ] **Verificación**: Script de setup pasa
  ```bash
  ./verify-setup.sh
  # Expected: ✅ All critical checks passed!
  ```

---

## 🗄️ Database Setup

### Opción A: Neon (Recomendado)

- [ ] Crear cuenta en [neon.tech](https://neon.tech)
- [ ] Crear nuevo proyecto
- [ ] Copiar connection string
- [ ] Formato: `postgresql://user:pass@host/db?sslmode=require`
- [ ] Guardar para usar en Vercel

### Opción B: Azure PostgreSQL

- [ ] Crear Azure Database for PostgreSQL
- [ ] Configurar firewall (permitir Azure services)
- [ ] Copiar connection string
- [ ] Verificar SSL habilitado

---

## ☁️ Cloudinary Setup

- [ ] Crear cuenta en [cloudinary.com](https://cloudinary.com)
- [ ] Dashboard → Copiar:
  - [ ] Cloud Name: `__________________`
  - [ ] API Key: `__________________`
  - [ ] API Secret: `__________________`

---

## 🔐 Google OAuth Setup

### Desarrollo (Ya configurado)

- [x] Google Cloud project creado
- [x] OAuth Client ID creado
- [x] Local redirect URIs configurados:
  - `http://localhost:3000/api/auth/callback/google`

### Producción (Pendiente)

- [ ] Ir a [console.cloud.google.com](https://console.cloud.google.com)
- [ ] Credentials → OAuth 2.0 Client → Edit
- [ ] **Authorized JavaScript origins**: Agregar
  ```
  https://your-app.vercel.app
  ```
- [ ] **Authorized redirect URIs**: Agregar
  ```
  https://your-app.vercel.app/api/auth/callback/google
  ```
- [ ] Guardar cambios
- [ ] Verificar Client ID y Secret actuales

---

## 🚀 Backend Deployment (Vercel)

### 1. Importar Proyecto

- [ ] Ir a [vercel.com/new](https://vercel.com/new)
- [ ] Import Git Repository
- [ ] Seleccionar: `Proyect SAHA`
- [ ] Root Directory: `BackEnd`
- [ ] Framework Preset: **Other**
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `.`

### 2. Environment Variables

Agregar en Vercel Dashboard → Settings → Environment Variables:

```bash
# Database
DATABASE_URL=postgresql://...?sslmode=require

# JWT (generar nuevo)
JWT_SECRET=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# CORS
FRONTEND_URL=https://your-frontend.vercel.app

# Node
NODE_ENV=production
```

**Checklist de Variables:**
- [ ] DATABASE_URL
- [ ] JWT_SECRET (nuevo, no el de desarrollo)
- [ ] CLOUDINARY_CLOUD_NAME
- [ ] CLOUDINARY_API_KEY
- [ ] CLOUDINARY_API_SECRET
- [ ] FRONTEND_URL (esperar hasta tener URL del frontend)
- [ ] NODE_ENV=production

### 3. Deploy

- [ ] Click "Deploy"
- [ ] Esperar build (2-3 minutos)
- [ ] Verificar deployment exitoso
- [ ] Copiar URL: `https://your-backend.vercel.app`

### 4. Run Migrations

Después del primer deploy:

```bash
# Clonar repo (si no lo tienes)
git clone https://github.com/your-repo/proyect-saha.git
cd proyect-saha/BackEnd

# Instalar deps
npm install

# Crear .env temporal con DATABASE_URL de producción
echo "DATABASE_URL=your-production-db-url" > .env

# Ejecutar migrations
npx prisma migrate deploy

# ✅ Verificar
npx prisma db push --preview-feature
```

- [ ] Migrations ejecutadas exitosamente
- [ ] Database tiene las tablas necesarias

### 5. Verificar Backend

- [ ] Abrir: `https://your-backend.vercel.app`
- [ ] Debe mostrar: `{"message": "Backend API funcionando correctamente! 🚀"}`
- [ ] Probar health: `https://your-backend.vercel.app/api/health`
- [ ] Debe retornar: `{"status": "OK", ...}`

**URL Backend**: `https://__________________.vercel.app`

---

## 💻 Frontend Deployment (Vercel)

### 1. Importar Proyecto

- [ ] Ir a [vercel.com/new](https://vercel.com/new)
- [ ] Import Git Repository (mismo repo)
- [ ] Root Directory: `FrontEnd`
- [ ] Framework Preset: **Next.js**
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `.next`

### 2. Environment Variables

Agregar en Vercel Dashboard → Settings → Environment Variables:

```bash
# Backend API
NEXT_PUBLIC_API_URL=https://your-backend.vercel.app

# NextAuth
NEXTAUTH_URL=https://your-frontend.vercel.app
NEXTAUTH_SECRET=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret

# (Opcional) Facebook
FACEBOOK_CLIENT_ID=
FACEBOOK_CLIENT_SECRET=

# (Opcional) Apple
APPLE_CLIENT_ID=
APPLE_CLIENT_SECRET=
```

**Checklist de Variables:**
- [ ] NEXT_PUBLIC_API_URL (usar URL del backend deployado)
- [ ] NEXTAUTH_URL (esperar URL de Vercel)
- [ ] NEXTAUTH_SECRET (generar nuevo: `openssl rand -base64 32`)
- [ ] GOOGLE_CLIENT_ID (mismo que desarrollo)
- [ ] GOOGLE_CLIENT_SECRET (mismo que desarrollo)

### 3. Deploy

- [ ] Click "Deploy"
- [ ] Esperar build (3-5 minutos)
- [ ] Verificar deployment exitoso
- [ ] Copiar URL: `https://your-frontend.vercel.app`

**URL Frontend**: `https://__________________.vercel.app`

### 4. Actualizar NEXTAUTH_URL

- [ ] Ir a Vercel Dashboard → Settings → Environment Variables
- [ ] Edit `NEXTAUTH_URL`
- [ ] Cambiar a: `https://your-actual-frontend-url.vercel.app`
- [ ] Guardar
- [ ] Redeploy (Deployments → Latest → More → Redeploy)

### 5. Actualizar FRONTEND_URL en Backend

- [ ] Ir a Backend Vercel Dashboard → Settings → Environment Variables
- [ ] Edit `FRONTEND_URL`
- [ ] Cambiar a: `https://your-actual-frontend-url.vercel.app`
- [ ] Guardar
- [ ] Redeploy backend

---

## 🔄 Finalizar OAuth Google

### Actualizar Redirect URIs

- [ ] Ir a [console.cloud.google.com](https://console.cloud.google.com)
- [ ] Credentials → OAuth 2.0 Client IDs → Edit
- [ ] **Authorized JavaScript origins**: Agregar
  ```
  https://your-frontend.vercel.app
  ```
- [ ] **Authorized redirect URIs**: Agregar
  ```
  https://your-frontend.vercel.app/api/auth/callback/google
  ```
- [ ] **Importante**: MANTENER los URIs de localhost para desarrollo
- [ ] Save

---

## ✅ Verificación Final

### Backend Health

- [ ] `https://your-backend.vercel.app/` responde OK
- [ ] `https://your-backend.vercel.app/api/health` responde OK
- [ ] Logs sin errores críticos

### Frontend Health

- [ ] `https://your-frontend.vercel.app/` carga correctamente
- [ ] Página principal se ve bien
- [ ] No hay errores en console del navegador
- [ ] Imágenes cargan correctamente

### OAuth Flow

- [ ] Ir a: `https://your-frontend.vercel.app`
- [ ] Click: "Acceder Como Trabajador"
- [ ] Click: "No, registrarme"
- [ ] Click: Botón "Continuar con Google"
- [ ] Debería:
  - [ ] Redirigir a Google login
  - [ ] Después de autorizar, volver a la app
  - [ ] Mostrar `/provider-signup` con datos autocompletados
  - [ ] Email y nombre cargados automáticamente

### Login Tradicional

- [ ] Ir a: `https://your-frontend.vercel.app/login`
- [ ] Probar login con credenciales de prueba
- [ ] Debe iniciar sesión correctamente
- [ ] Debe redirigir al dashboard apropiado

### Database

- [ ] Verificar que usuarios OAuth se crean en la DB
- [ ] Prisma Studio: `npx prisma studio` (con DATABASE_URL de prod)
- [ ] Tabla `User` debe tener registros
- [ ] Emails deben ser únicos

---

## 🔒 Security Checklist

### Secrets

- [ ] JWT_SECRET diferente al de desarrollo
- [ ] NEXTAUTH_SECRET generado con `openssl rand -base64 32`
- [ ] No hay secrets hardcodeados en el código
- [ ] `.env` y `.env.local` en `.gitignore`
- [ ] No se pushearon archivos `.env` a Git

### CORS

- [ ] Backend CORS solo permite frontend URL de producción
- [ ] `FRONTEND_URL` configurado correctamente

### OAuth

- [ ] Google redirect URIs solo incluyen dominios verificados
- [ ] No hay wildcards en redirect URIs
- [ ] Client ID y Secret en variables de entorno

### Database

- [ ] Connection string incluye `?sslmode=require`
- [ ] Firewall configurado (si aplica)
- [ ] Backups automáticos habilitados

---

## 📊 Post-Deployment

### Monitoreo

- [ ] Configurar Vercel Analytics (opcional)
- [ ] Monitor logs: `vercel logs your-project --follow`
- [ ] Configurar alertas de errores (Sentry, opcional)

### Performance

- [ ] Lighthouse score > 90
- [ ] Time to First Byte < 600ms
- [ ] Core Web Vitals OK

### SEO (Opcional)

- [ ] Google Search Console configurado
- [ ] Sitemap generado
- [ ] robots.txt configurado

---

## 🎉 Deployment Completo!

### URLs Finales

- **Frontend**: `https://__________________.vercel.app`
- **Backend**: `https://__________________.vercel.app`
- **Database**: Neon / Azure Dashboard

### Credenciales Importantes

- **Database URL**: (guardada en Vercel)
- **JWT_SECRET**: (guardada en Vercel)
- **NEXTAUTH_SECRET**: (guardada en Vercel)
- **Google Client ID**: `__________________`
- **Google Client Secret**: (guardada en Vercel)

### Next Steps

- [ ] Probar todas las funcionalidades en producción
- [ ] Invitar usuarios beta testers
- [ ] Configurar dominio custom (opcional)
- [ ] Setup email service (SendGrid, Resend)
- [ ] Configurar Facebook OAuth (opcional)
- [ ] Configurar Apple OAuth (opcional)

---

## 📞 Support

Si algo falla:

1. **Logs**: `vercel logs your-project`
2. **Documentation**: Ver `VERCEL_DEPLOYMENT_GUIDE.md`
3. **OAuth Issues**: Verificar redirect URIs en Google Console
4. **Database Issues**: Verificar connection string y migrations
5. **CORS Issues**: Verificar `FRONTEND_URL` en backend

---

**¡Felicidades! 🎊 Tu plataforma SAHA está en producción.**

**Fecha de deployment**: ___________________
**Deployed by**: ___________________
