# 🚀 Guía de Deployment - Backend en Vercel

## ✅ Pre-requisitos completados

- [x] Código pusheado a GitHub
- [x] vercel.json configurado
- [x] Scripts de build listos

## 📋 Pasos para Desplegar Backend

### 1. Crear Base de Datos en Neon

✅ Ya deberías tener esto:

- URL de conexión: `postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require`

### 2. Crear Proyecto de Backend en Vercel

1. **Ve a Vercel Dashboard**

   - URL: https://vercel.com/dashboard

2. **Click en "Add New" → "Project"**

3. **Importar Repository**

   - Selecciona tu repo: `Manuelusero/AppSaha`
   - Click "Import"

4. **Configure Project** ⚠️ IMPORTANTE:

   **Framework Preset**: Other

   **Root Directory**:

   ```
   BackEnd
   ```

   ↑ Usa el botón "Edit" y selecciona la carpeta BackEnd

   **Build & Development Settings**:

   - **Build Command**: `npm run vercel-build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
   - **Development Command**: Dejar vacío

5. **Environment Variables** (Click en "Add" para cada una):

   ```env
   DATABASE_URL
   postgresql://tu_usuario:tu_password@ep-xxx.neon.tech/neondb?sslmode=require
   ```

   ↑ Pega tu URL de Neon aquí

   ```env
   JWT_SECRET
   mi_super_secreto_jwt_12345
   ```

   ↑ Genera uno random aquí: https://www.uuidgenerator.net/

   ```env
   FRONTEND_URL
   https://serco-eosin.vercel.app
   ```

   ```env
   NODE_ENV
   production
   ```

   **IMPORTANTE**: Marca todas como disponibles en:

   - ☑️ Production
   - ☑️ Preview
   - ☑️ Development

6. **Click en "Deploy"** 🚀

   Espera 2-3 minutos mientras Vercel:

   - Instala dependencias
   - Genera Prisma Client
   - Ejecuta migraciones
   - Compila TypeScript
   - Despliega

### 3. Obtener URL del Backend

Una vez desplegado, verás:

```
🎉 Your project has been deployed
https://app-saha-backend-xxx.vercel.app
```

**Copia esta URL** ← La necesitarás para el frontend

### 4. Configurar Frontend con URL del Backend

1. Ve a tu proyecto **Frontend** en Vercel:

   - https://vercel.com/tu-usuario/serco-eosin

2. **Settings** → **Environment Variables**

3. **Add New Variable**:

   ```env
   NEXT_PUBLIC_API_URL
   https://app-saha-backend-xxx.vercel.app
   ```

   ↑ Reemplaza con tu URL del backend

4. Marca todas las opciones:

   - ☑️ Production
   - ☑️ Preview
   - ☑️ Development

5. **Save**

6. **Redeploy el Frontend**:
   - Ve a **Deployments**
   - Click en los 3 puntos del último deployment
   - Click **"Redeploy"**

### 5. Verificar que Todo Funciona

1. **Backend Health Check**:

   - Ve a: `https://tu-backend.vercel.app/api/health`
   - Deberías ver: `{"status":"ok"}`

2. **Frontend conectado**:
   - Ve a: `https://serco-eosin.vercel.app/search-results?servicio=Pintores`
   - Ya NO debería dar error de CORS
   - Debería cargar (aunque sin datos aún)

---

## 🐛 Troubleshooting

### Error: "Prisma Client could not locate..."

**Solución**: Verifica que `vercel-build` incluya `prisma generate`

### Error: "DATABASE_URL is not defined"

**Solución**: Verifica que la variable esté en Vercel y que tenga `?sslmode=require` al final

### Error: CORS

**Solución**: Verifica que `FRONTEND_URL` en backend sea exactamente igual a la URL del frontend

### El backend no responde

**Solución**: Revisa los logs en Vercel:

- Dashboard → Tu proyecto Backend → Functions → Ver logs

---

## 📊 Resumen Final

Después de completar estos pasos tendrás:

✅ **Frontend**: `serco-eosin.vercel.app`  
✅ **Backend**: `app-saha-backend-xxx.vercel.app`  
✅ **Database**: PostgreSQL en Neon (gratis)  
✅ **CORS**: Configurado correctamente  
✅ **SSL**: Automático en todos lados

**Total tiempo**: ~10 minutos ⚡

---

## 🎯 Próximos Pasos

1. Crear usuarios de prueba en la DB
2. Subir imágenes de perfil de proveedores
3. Configurar dominio personalizado (opcional)

¡Listo! Tu app está en producción 🎉
