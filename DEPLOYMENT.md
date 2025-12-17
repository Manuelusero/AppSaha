# 🚀 Guía de Despliegue - Serco

## Cambios Realizados

### ✅ Rebranding: SAHA → SERCO

- ✅ Todos los textos actualizados en el código
- ✅ Metadata actualizada (título, descripción)
- ⚠️ **Pendiente**: Actualizar logos/imágenes (Logo.png, Frame16.png)

### ✅ Optimización para iPhone

- ✅ Soporte para notch y safe areas
- ✅ Viewport optimizado para iOS
- ✅ Prevención de zoom en inputs
- ✅ Scroll bounce deshabilitado
- ✅ Touch targets mínimos (44px)

## 📱 Opciones de Despliegue

### Opción 1: Vercel (Recomendado - Más Fácil)

#### Frontend:

1. **Preparar el repositorio:**

```bash
cd /Users/manuelusero/Desktop/Proyect\ SAHA/FrontEnd
git init
git add .
git commit -m "Initial commit - Serco platform"
```

2. **Subir a GitHub:**

   - Crear un nuevo repositorio en GitHub
   - Seguir las instrucciones para push

3. **Desplegar en Vercel:**
   - Ir a [vercel.com](https://vercel.com)
   - Click en "Add New Project"
   - Importar tu repositorio de GitHub
   - Vercel detectará automáticamente que es Next.js
   - Click en "Deploy"

#### Backend:

Para el backend tienes varias opciones:

**A) Railway.app (Gratis para empezar):**

```bash
cd /Users/manuelusero/Desktop/Proyect\ SAHA/BackEnd
npm install -g @railway/cli
railway login
railway init
railway up
```

**B) Render.com:**

- Crear cuenta en render.com
- New → Web Service
- Conectar tu repo del backend
- Build: `npm install && npx prisma generate`
- Start: `npm start`

### Opción 2: Netlify

```bash
cd /Users/manuelusero/Desktop/Proyect\ SAHA/FrontEnd
npm run build
npx netlify-cli deploy --prod
```

## 🔧 Configuración Necesaria

### Variables de Entorno (Frontend)

Crear `.env.local`:

```
NEXT_PUBLIC_API_URL=https://tu-backend-url.com
```

### Variables de Entorno (Backend)

Crear `.env`:

```
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET="tu-secret-key-super-segura"
PORT=8000
```

## 📝 Checklist Pre-Despliegue

- [ ] Actualizar logos (Logo.png) con branding de Serco
- [ ] Actualizar favicon
- [ ] Configurar variables de entorno
- [ ] Probar en diferentes dispositivos móviles
- [ ] Verificar que no haya errores en consola
- [ ] Actualizar URLs del backend en el frontend
- [ ] Configurar dominio personalizado (opcional)

## 🎨 Assets Pendientes

### Logos a Actualizar:

1. `/public/Logo.png` - Logo principal
2. `/public/Frame16.png` - Imagen de perfil por defecto
3. Favicon (`/public/favicon.ico`)

### Dimensiones Recomendadas:

- Logo principal: 484x134px (actual)
- Logo header: 120x40px
- Perfil default: 200x200px
- Favicon: 32x32px, 16x16px

## 🧪 Testing en iPhone

Para probar en iPhone antes del despliegue:

1. **Modo desarrollo:**

```bash
cd FrontEnd
npm run dev
```

2. **Obtener IP local:**

```bash
ifconfig | grep "inet "
```

3. **Acceder desde iPhone:**
   - Conectar iPhone a la misma red WiFi
   - Abrir Safari
   - Ir a: `http://TU-IP:3000`

## 🌐 URLs Sugeridas

- **Frontend**: `serco.vercel.app` o dominio personalizado
- **Backend**: `serco-api.railway.app` o similar

## 📞 Próximos Pasos

1. Mostrar a la diseñadora para feedback de UI/UX
2. Actualizar logos y branding
3. Configurar dominio personalizado
4. Implementar analytics (Google Analytics, Mixpanel)
5. Configurar monitoreo de errores (Sentry)

## 🐛 Problemas Conocidos

- Algunos enlaces del footer pueden necesitar ajustes finales
- La base de datos SQLite necesitará migrarse a PostgreSQL para producción
- Las imágenes de perfil están usando placeholders

## 💡 Notas Importantes

- El proyecto está optimizado para iPhone con notch
- La fuente Maitree se carga correctamente
- Smooth scroll está habilitado
- Touch targets son de mínimo 44px (estándar iOS)
