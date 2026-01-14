# 🔐 DATOS GENERADOS PARA VERCEL

## JWT_SECRET (Generado ahora)
```
ead486596183168ec85cb2647a811b7c037dbfa5f0feb265875971283398848cc5e68986c3d260cc214bc410af76a79b11aced26157d33590708e7a949db2a6d
```

---

## 📋 VARIABLES PARA CONFIGURAR EN VERCEL

### Backend (tu-backend-proyecto.vercel.app)
Ir a: Vercel Dashboard → Backend → Settings → Environment Variables

```bash
# Base de datos (obtener de Neon)
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# JWT Secret (copialo de arriba)
JWT_SECRET=ead486596183168ec85cb2647a811b7c037dbfa5f0feb265875971283398848cc5e68986c3d260cc214bc410af76a79b11aced26157d33590708e7a949db2a6d

# Environment
NODE_ENV=production

# Frontend URL (tu frontend desplegado)
FRONTEND_URL=https://serco-eosin.vercel.app
```

### Frontend (serco-eosin.vercel.app)
Ir a: Vercel Dashboard → Frontend → Settings → Environment Variables

```bash
# Backend URL (IMPORTANTE: Usa tu URL real del backend)
NEXT_PUBLIC_API_URL=https://tu-backend-proyecto.vercel.app
```

---

## 🎯 PASOS RÁPIDOS

### 1. Obtén la URL de tu backend
1. Ve a Vercel Dashboard
2. Busca tu proyecto de backend
3. Copia la URL de producción (ej: `https://saha-backend-xyz.vercel.app`)

### 2. Obtén tu DATABASE_URL de Neon
1. Ve a https://console.neon.tech/
2. Selecciona tu base de datos
3. Dashboard → Connection String
4. Copia "Pooled connection"

### 3. Configura Backend en Vercel
- DATABASE_URL → (de Neon)
- JWT_SECRET → (copiar de arriba)
- NODE_ENV → `production`
- FRONTEND_URL → `https://serco-eosin.vercel.app`

### 4. Configura Frontend en Vercel
- NEXT_PUBLIC_API_URL → (URL de tu backend)

### 5. Redespliega
- Redespliega el backend
- Redespliega el frontend

### 6. Prueba
Abre https://serco-eosin.vercel.app y busca profesionales.

---

## ✅ TODO LIST

- [ ] Obtener URL del backend de Vercel
- [ ] Obtener DATABASE_URL de Neon
- [ ] Configurar 4 variables en Backend de Vercel
- [ ] Configurar 1 variable en Frontend de Vercel
- [ ] Redesplegar backend
- [ ] Redesplegar frontend
- [ ] Actualizar FrontEnd/.env.local para desarrollo local
- [ ] Hacer commit y push de cambios
- [ ] Probar en producción

---

**Guardado:** 14 de enero de 2026
**JWT_SECRET generado:** ✅
**Archivos actualizados:** ✅
- BackEnd/api/index.ts
- FrontEnd/.env.local

**Próximo paso:** Configura las variables de entorno en Vercel y redespliega.
