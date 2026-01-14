# 🔧 Variables de Entorno Requeridas para Vercel

## Backend (Vercel)
Configura estas variables en: Vercel Dashboard → Tu Backend → Settings → Environment Variables

```bash
# Base de datos PostgreSQL (Neon o Railway)
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# JWT Secret (genera uno seguro)
JWT_SECRET=tu-secret-key-super-seguro-aqui

# Node Environment
NODE_ENV=production

# URL del Frontend para CORS
FRONTEND_URL=https://serco-eosin.vercel.app

# Puerto (Vercel lo asigna automáticamente, pero por si acaso)
PORT=8000
```

## Frontend (Vercel)
Configura esta variable en: Vercel Dashboard → Tu Frontend → Settings → Environment Variables

```bash
# URL del Backend desplegado
NEXT_PUBLIC_API_URL=https://tu-backend-proyecto.vercel.app
```

---

## 🔍 Cómo obtener DATABASE_URL (Neon)

1. Ve a https://console.neon.tech/
2. Selecciona tu proyecto
3. Dashboard → Connection String
4. Copia la URL que dice "Pooled connection"
5. Pégala en DATABASE_URL

---

## 🔍 Cómo generar JWT_SECRET

Opción 1 - Terminal:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Opción 2 - Online:
https://www.uuidgenerator.net/

---

## ⚠️ IMPORTANTE

Después de configurar las variables:
1. Redeploy el backend
2. Redeploy el frontend
3. Prueba en el navegador
