# 🚀 Guía Completa de Despliegue - SERCO

## ✅ Estado del Proyecto

### Cambios Completados

- ✅ **Rebranding**: SAHA → SERCO (todos los textos actualizados)
- ✅ **Optimización iOS**: Safe areas, notch, viewport configurado
- ✅ **Build exitoso**: Sin errores de compilación
- ✅ **State Management**: Zustand implementado
- ✅ **API Utilities**: Centralizadas y optimizadas
- ✅ **Custom Hooks**: useForm, useToggle, useFetch, etc.

### Pendiente

- ⚠️ **Logo**: Actualizar Logo.png y Frame16.png con branding SERCO
- ⚠️ **Variables de Entorno**: Configurar para producción

---

## 📋 Pre-requisitos

### Frontend

```bash
cd FrontEnd
npm install
npm run build  # Verificar que compile sin errores
```

### Backend

```bash
cd BackEnd
npm install
npx prisma generate
npx prisma migrate deploy
```

---

## 🚀 Opción 1: Vercel + Railway (Recomendado)

### A) Frontend en Vercel

**Ventajas:**

- ✅ Gratis para proyectos personales
- ✅ Deploy automático con git push
- ✅ HTTPS incluido
- ✅ CDN global
- ✅ Optimizado para Next.js

**Pasos:**

1. **Subir a GitHub:**

```bash
cd /Users/manuelusero/Desktop/Proyect\ SAHA
git init
git add .
git commit -m "Initial commit - SERCO platform"
# Crear repo en GitHub y hacer push
```

2. **Deploy en Vercel:**

   - Ir a [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Importar repositorio de GitHub
   - Configuración:
     - Framework: Next.js
     - Root Directory: `FrontEnd`
     - Build Command: `npm run build`
     - Output Directory: `.next`
   - Variables de entorno:
     ```
     NEXT_PUBLIC_API_URL=https://tu-backend.railway.app
     ```
   - Click "Deploy"

3. **Dominio personalizado (opcional):**
   - Settings → Domains
   - Agregar tu dominio (ej: serco.com)

### B) Backend en Railway

**Ventajas:**

- ✅ $5 gratis al mes
- ✅ Base de datos incluida
- ✅ Deploy automático
- ✅ Variables de entorno seguras

**Pasos:**

1. **Crear cuenta en Railway:**

   - Ir a [railway.app](https://railway.app)
   - Registrarse con GitHub

2. **Crear nuevo proyecto:**

   - Click "New Project"
   - Seleccionar "Deploy from GitHub repo"
   - Seleccionar tu repositorio
   - Configurar:
     - Root Directory: `BackEnd`
     - Start Command: `npm run dev`

3. **Agregar PostgreSQL:**

   - Click "New" → "Database" → "PostgreSQL"
   - Railway genera DATABASE_URL automáticamente

4. **Variables de entorno:**

   ```
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   JWT_SECRET=tu-secreto-super-seguro-cambiar-esto
   NODE_ENV=production
   PORT=8000
   FRONTEND_URL=https://tu-app.vercel.app
   ```

5. **Migrar base de datos:**
   ```bash
   # Desde tu local, conectado a Railway
   DATABASE_URL="postgresql://..." npx prisma migrate deploy
   ```

---

## 🚀 Opción 2: Vercel + Supabase

### A) Frontend en Vercel

(Igual que Opción 1)

### B) Backend en Vercel Serverless

1. **Adaptar backend a serverless:**

   - Crear `/BackEnd/api/index.ts`:

   ```typescript
   import app from "../src/index";
   export default app;
   ```

2. **Crear vercel.json:**

   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "api/index.ts",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "/api/index.ts"
       }
     ]
   }
   ```

3. **Base de datos Supabase:**
   - Ir a [supabase.com](https://supabase.com)
   - Crear proyecto (gratis)
   - Obtener DATABASE_URL
   - Configurar en variables de entorno de Vercel

---

## 🚀 Opción 3: Deploy Rápido con CLI

### Vercel CLI (5 minutos)

```bash
# Instalar Vercel CLI
npm install -g vercel

# Frontend
cd FrontEnd
vercel
# Seguir instrucciones en pantalla

# Backend (si usas Vercel)
cd ../BackEnd
vercel
```

### Netlify CLI (Alternativa)

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Frontend
cd FrontEnd
netlify deploy --prod
```

---

## 🔧 Variables de Entorno

### Frontend (.env.local)

```bash
NEXT_PUBLIC_API_URL=https://tu-backend.railway.app
```

### Backend (.env)

```bash
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=tu-secreto-super-seguro-cambiar-esto
NODE_ENV=production
PORT=8000
FRONTEND_URL=https://tu-app.vercel.app
```

---

## ✅ Checklist Post-Deploy

### Frontend

- [ ] La app carga correctamente
- [ ] Las imágenes se ven bien
- [ ] Login funciona
- [ ] Registro de proveedores funciona
- [ ] Búsqueda de proveedores funciona
- [ ] Dashboard provider funciona
- [ ] Dashboard client funciona

### Backend

- [ ] `/api/health` responde OK
- [ ] `/api/providers` devuelve datos
- [ ] Login funciona
- [ ] Registro funciona
- [ ] Subida de archivos funciona
- [ ] Base de datos tiene datos

### Seguridad

- [ ] CORS configurado correctamente
- [ ] JWT_SECRET cambiado del default
- [ ] Variables de entorno no expuestas
- [ ] HTTPS activo en producción

---

## 🐛 Troubleshooting

### Error: "Module not found"

```bash
# Limpiar y reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Error: "Prisma Client not generated"

```bash
npx prisma generate
```

### Error: CORS

```typescript
// BackEnd/src/index.ts - Agregar frontend URL a CORS
const allowedOrigins = ["https://tu-app.vercel.app", "http://localhost:3000"];
```

### Error: "Cannot find module '@/utils'"

```bash
# Verificar tsconfig.json paths
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

## 📊 Monitoreo

### Logs en Vercel

- Dashboard → Tu proyecto → Deployments → Logs

### Logs en Railway

- Dashboard → Tu proyecto → Deployments → View Logs

### Analytics

- Vercel incluye analytics básicos gratis
- Agregar Google Analytics (opcional)

---

## 🔄 Updates y CI/CD

Una vez configurado:

1. **Hacer cambios localmente**
2. **Commit y push a GitHub**
   ```bash
   git add .
   git commit -m "Feature: nueva funcionalidad"
   git push origin main
   ```
3. **Deploy automático** - Vercel y Railway detectan el push y despliegan automáticamente

---

## 💰 Costos Estimados

### Gratis (Ideal para comenzar)

- Vercel: Gratis (100GB bandwidth/mes)
- Railway: $5 gratis/mes (suficiente para empezar)
- Supabase: Gratis (500MB DB, 2GB bandwidth)

### Escalado ($20-50/mes)

- Vercel Pro: $20/mes
- Railway: $10-30/mes (según uso)
- PostgreSQL dedicado: $5-15/mes

---

## 📚 Recursos Adicionales

- [Docs de Vercel](https://vercel.com/docs)
- [Docs de Railway](https://docs.railway.app)
- [Next.js Deploy](https://nextjs.org/docs/deployment)
- [Prisma Deploy](https://www.prisma.io/docs/guides/deployment)

---

**¿Dudas? Revisa los logs de deployment o contacta soporte de la plataforma elegida.**
