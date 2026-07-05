# 🚀 Guía Completa de Deployment - SAHA Platform

Esta guía te ayudará a deployar la plataforma SAHA en Vercel con OAuth funcional.

## 📋 Pre-requisitos

- [ ] Cuenta de Vercel
- [ ] Base de datos PostgreSQL (Neon recomendado para empezar)
- [ ] Cuenta de Cloudinary
- [ ] Cuenta de Google Cloud Platform (para OAuth)
- [ ] (Opcional) Cuenta de Facebook Developer
- [ ] (Opcional) Cuenta de Apple Developer

---

## 🗄️ PASO 1: Configurar Base de Datos

### Opción A: Neon (Recomendado - Gratis)

1. Ir a [neon.tech](https://neon.tech)
2. Crear cuenta y nuevo proyecto
3. Copiar connection string (PostgreSQL)
4. Guardar para usar en variables de entorno

```
postgresql://user:password@ep-xxx-xxx.region.neon.tech/database?sslmode=require
```

### Opción B: Azure Database for PostgreSQL

1. Ir a Azure Portal → Create Resource → Azure Database for PostgreSQL
2. Elegir plan (Basic, General Purpose, o Memory Optimized)
3. Configurar:
   - Server name
   - Admin username/password
   - Location
   - Version: PostgreSQL 14 o superior
4. Firewall → Add client IP + Allow Azure services
5. Connection strings → Copiar connection string

```
postgresql://username@servername:password@servername.postgres.database.azure.com:5432/dbname?sslmode=require
```

---

## ☁️ PASO 2: Configurar Cloudinary

1. Ir a [cloudinary.com](https://cloudinary.com)  
2. Crear cuenta gratuita
3. Dashboard → Copiar:
   - Cloud Name
   - API Key
   - API Secret

---

## 🔐 PASO 3: Configurar Google OAuth

### 3.1 Crear Proyecto en Google Cloud

1. Ir a [console.cloud.google.com](https://console.cloud.google.com)
2. Crear nuevo proyecto o usar existente
3. Habilitar "Google+ API"
4. Ir a "Credentials" → Create Credentials → OAuth 2.0 Client ID

### 3.2 Configurar OAuth Client

1. **Application type**: Web application
2. **Name**: SAHA Platform (o el nombre que prefieras)
3. **Authorized JavaScript origins**:
   ```
   http://localhost:3000
   https://your-app.vercel.app
   ```
4. **Authorized redirect URIs**:
   ```
   http://localhost:3000/api/auth/callback/google
   https://your-app.vercel.app/api/auth/callback/google
   ```
5. **Crear** y copiar:
   - Client ID
   - Client Secret

> ⚠️ **IMPORTANTE**: Reemplaza `your-app.vercel.app` con tu URL real de Vercel

---

## 🌐 PASO 4: Deploy Backend en Vercel

### 4.1 Importar Proyecto Backend

1. Ir a [vercel.com/new](https://vercel.com/new)
2. Importar repositorio → Seleccionar `Proyect SAHA/BackEnd`
3. Framework Preset: **Other**
4. Root Directory: `BackEnd`
5. Build Command: `npm run build`
6. Output Directory: `.`

### 4.2 Configurar Variables de Entorno (Backend)

En Vercel Dashboard → Settings → Environment Variables:

```bash
# Database
DATABASE_URL=postgresql://user:password@host/db?sslmode=require

# JWT Secret (generar nuevo)
JWT_SECRET=YOUR_PRODUCTION_SECRET_HERE

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# CORS
FRONTEND_URL=https://your-frontend.vercel.app

# Node Environment
NODE_ENV=production
```

### 4.3 Ejecutar Migraciones de Base de Datos

Después del primer deploy:

```bash
# Clonar repo localmente
git clone https://github.com/your-repo.git
cd BackEnd

# Instalar dependencias
npm install

# Configurar DATABASE_URL en .env
echo "DATABASE_URL=your-production-database-url" > .env

# Ejecutar migraciones
npx prisma migrate deploy

# (Opcional) Seed inicial
npx prisma db seed
```

### 4.4 Verificar Deployment

1. Abrir URL del backend: `https://your-backend.vercel.app`
2. Debería mostrar: `{"message": "Backend API funcionando correctamente! 🚀"}`
3. Probar health check: `https://your-backend.vercel.app/api/health`

---

## 💻 PASO 5: Deploy Frontend en Vercel

### 5.1 Importar Proyecto Frontend

1. Ir a [vercel.com/new](https://vercel.com/new)
2. Importar repositorio → Seleccionar `Proyect SAHA/FrontEnd`
3. Framework Preset: **Next.js**
4. Root Directory: `FrontEnd`
5. Build Command: `npm run build`
6. Output Directory: `.next`

### 5.2 Configurar Variables de Entorno (Frontend)

En Vercel Dashboard → Settings → Environment Variables:

```bash
# Backend API
NEXT_PUBLIC_API_URL=https://your-backend.vercel.app

# NextAuth
NEXTAUTH_URL=https://your-frontend.vercel.app
NEXTAUTH_SECRET=YOUR_NEW_PRODUCTION_SECRET_HERE

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# (Opcional) Facebook OAuth
FACEBOOK_CLIENT_ID=your-facebook-app-id
FACEBOOK_CLIENT_SECRET=your-facebook-app-secret

# (Opcional) Apple OAuth
APPLE_CLIENT_ID=your-apple-service-id
APPLE_CLIENT_SECRET=your-apple-client-secret
```

#### Generar NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

### 5.3 Actualizar Google OAuth

Ir a Google Cloud Console → Credentials → OAuth 2.0 Client:

1. **Authorized JavaScript origins**: Agregar
   ```
   https://your-frontend.vercel.app
   ```

2. **Authorized redirect URIs**: Agregar
   ```
   https://your-frontend.vercel.app/api/auth/callback/google
   ```

3. **Guardar cambios**

---

## ✅ PASO 6: Verificación Final

### 6.1 Checklist Backend

- [ ] Backend URL accesible
- [ ] Endpoint `/` retorna mensaje de bienvenida
- [ ] Endpoint `/api/health` retorna status OK
- [ ] Database migrations aplicadas
- [ ] Variables de entorno configuradas
- [ ] CORS permite frontend URL

### 6.2 Checklist Frontend

- [ ] Frontend URL accesible
- [ ] Página principal carga correctamente
- [ ] Login tradicional funciona
- [ ] **OAuth Google funciona**:
  - [ ] Click en "Continuar con Google"
  - [ ] Redirige a Google login
  - [ ] Después de autorizar, vuelve a la app
  - [ ] Usuario se crea en la base de datos
  - [ ] Sesión iniciada correctamente

### 6.3 Probar OAuth Flow Completo

1. **Ir a**: `https://your-app.vercel.app`
2. **Click**: "Acceder Como Trabajador" → "No, registrarme"
3. **Click**: Botón "Continuar con Google"
4. **Autorizar** con tu cuenta de Google
5. **Verificar**: 
   - Redirección a `/provider-signup`
   - Nombre y email autocompletados
   - Formulario listo para completar datos restantes

---

## 🐛 Troubleshooting

### Error: "Redirect URI mismatch"

**Solución**: Verificar que en Google Cloud Console los Redirect URIs coincidan exactamente con:
```
https://your-actual-vercel-url.vercel.app/api/auth/callback/google
```

### Error: "CORS policy"

**Solución**: En backend `.env`, asegurar que `FRONTEND_URL` sea exactamente:
```
FRONTEND_URL=https://your-frontend.vercel.app
```

### Error: "Database connection failed"

**Solución**: 
1. Verificar que DATABASE_URL tenga `?sslmode=require`
2. En Neon/Azure, verificar que IP de Vercel esté permitida
3. Probar conexión localmente:
   ```bash
   npx prisma db push --preview-feature
   ```

### Error: "NextAuth session not found"

**Solución**:
1. Verificar que `NEXTAUTH_URL` coincida con URL de Vercel
2. Verificar que `NEXTAUTH_SECRET` esté configurado
3. Limpiar cookies del navegador

### OAuth funciona en local pero no en producción

**Solución**:
1. Verificar que Google OAuth Client tenga ambas URLs (dev + prod)
2. Verificar que `NEXTAUTH_URL` en Vercel sea HTTPS
3. Verificar que backend `/api/auth/oauth` esté accesible

---

## 🔒 Seguridad en Producción

### Checklist de Seguridad

- [ ] **JWT_SECRET** diferente al de desarrollo
- [ ] **NEXTAUTH_SECRET** generado con `openssl rand -base64 32`
- [ ] Todas las variables en Vercel (no en código)
- [ ] `.env` y `.env.local` en `.gitignore`
- [ ] CORS configurado solo para dominios confiables
- [ ] Database connection con SSL (`sslmode=require`)
- [ ] Cloudinary credentials protegidas
- [ ] OAuth redirects solo a dominios verificados

### Rotar Secrets

Si crees que algún secret fue comprometido:

1. **JWT_SECRET**: Generar nuevo → Actualizar en Vercel → Redeploy backend
2. **NEXTAUTH_SECRET**: Generar nuevo → Actualizar en Vercel → Redeploy frontend
3. **OAuth Credentials**: Regenerar en Google Console → Actualizar en Vercel

---

## 📊 Monitoreo Post-Deployment

### Vercel Analytics

1. Habilitar Analytics en Vercel Dashboard
2. Monitorear:
   - Tiempo de respuesta
   - Errores 404/500
   - Tráfico por página

### Logs

Ver logs en tiempo real:
```bash
vercel logs your-project-name --follow
```

### Database Monitoring

- **Neon**: Dashboard → Metrics
- **Azure**: Portal → Metrics → CPU, Memory, Connections

---

## 🎯 Próximos Pasos

Después del deployment exitoso:

1. **Configurar Facebook OAuth** (opcional)
2. **Configurar Apple OAuth** (opcional)
3. **Setup custom domain** (ejemplo: saha.com.ar)
4. **Enable Vercel Edge Functions** para mejor performance
5. **Setup Analytics** (Google Analytics, Vercel Analytics)
6. **Configure Email Service** (SendGrid, Resend)
7. **Setup Monitoring** (Sentry, LogRocket)

---

## 📞 Soporte

Si algo no funciona:

1. Revisar logs en Vercel: `vercel logs`
2. Verificar variables de entorno
3. Probar endpoints con Postman/curl
4. Revisar Google Cloud Console logs
5. Verificar database connectivity

---

## ✨ Checklist Final - ¡Listo para Producción!

- [ ] Backend deployado en Vercel
- [ ] Frontend deployado en Vercel
- [ ] Database configurada (Neon/Azure)
- [ ] Migrations aplicadas
- [ ] Cloudinary configurado
- [ ] Google OAuth funcionando
- [ ] CORS configurado
- [ ] Variables de entorno en Vercel
- [ ] Secrets rotados (diferentes a dev)
- [ ] OAuth probado end-to-end
- [ ] Login tradicional funcionando
- [ ] Registro de proveedores funcionando
- [ ] Tests básicos pasando

---

**¡Felicidades!** 🎉 Tu plataforma SAHA está deployada y lista para usar.

**URLs de referencia**:
- Frontend: `https://your-frontend.vercel.app`
- Backend: `https://your-backend.vercel.app`
- Database: Tu dashboard de Neon/Azure
- Google OAuth: https://console.cloud.google.com
