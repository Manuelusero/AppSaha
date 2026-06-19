# 🏠 SAHA - Sistema de Ayuda del Hogar

Plataforma marketplace que conecta proveedores de servicios del hogar con clientes en Argentina.

## 🎯 Características Principales

### Para Clientes
- ✅ Búsqueda de profesionales por categoría y ubicación
- ✅ Sistema de reservas/bookings
- ✅ Reviews y calificaciones (1-5 estrellas)
- ✅ Mensajería directa con proveedores
- ✅ Favoritos/guardados
- ✅ **Login con Google OAuth** (nuevo)

### Para Proveedores
- ✅ Perfil profesional completo
- ✅ Gestión de servicios y especialidades
- ✅ Recepción y gestión de solicitudes
- ✅ Portfolio de trabajos
- ✅ Certificaciones y referencias
- ✅ **Registro rápido con Google OAuth** (nuevo)

### Sistema
- ✅ Autenticación JWT + OAuth 2.0
- ✅ Roles: CLIENT, PROVIDER, ADMIN
- ✅ Notificaciones en tiempo real
- ✅ Upload de archivos (Cloudinary)
- ✅ Testing: 79% coverage (Frontend)

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript 5+
- **Auth**: NextAuth.js (OAuth + Credentials)
- **State**: Zustand + Context API
- **Styling**: TailwinCSS 4 + Design Tokens
- **Testing**: Vitest + React Testing Library
- **HTTP**: Custom API wrapper (axios)

### Backend
- **Framework**: Express 5+ (TypeScript)
- **Database**: PostgreSQL (Prisma ORM)
- **Auth**: JWT + Google OAuth
- **File Upload**: Multer + Cloudinary
- **Testing**: Vitest (pendiente implementación completa)

### Infrastructure
- **Deployment**: Vercel (Frontend + Backend)
- **Database**: Neon PostgreSQL (gratis) o Azure
- **Storage**: Cloudinary
- **CI/CD**: Vercel automatic deployments

---

## 🚀 Quick Start - Desarrollo Local

### Pre-requisitos

```bash
Node.js 20.x
PostgreSQL (local o Neon)
Git
```

### 1. Clonar Repositorio

```bash
git clone https://github.com/your-repo/proyect-saha.git
cd proyect-saha
```

### 2. Configurar Backend

```bash
cd BackEnd

# Instalar dependencias
npm install

# Copiar .env.example a .env
cp .env.example .env

# Editar .env con tus credenciales:
# - DATABASE_URL (PostgreSQL)
# - JWT_SECRET
# - CLOUDINARY_*

# Generar Prisma Client
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev

# (Opcional) Seed de datos de prueba
npx prisma db seed

# Iniciar servidor
npm run dev
```

Backend corriendo en: **http://localhost:8000**

### 3. Configurar Frontend

```bash
cd ../FrontEnd

# Instalar dependencias
npm install

# Copiar .env.example a .env.local
cp .env.example .env.local

# Editar .env.local:
# - NEXT_PUBLIC_API_URL=http://localhost:8000
# - NEXTAUTH_URL=http://localhost:3000
# - NEXTAUTH_SECRET (generar con: openssl rand -base64 32)
# - GOOGLE_CLIENT_ID y GOOGLE_CLIENT_SECRET (ver guía abajo)

# Iniciar servidor de desarrollo
npm run dev
```

Frontend corriendo en: **http://localhost:3000**

### 4. Verificar Instalación

Ejecutar script de verificación:

```bash
cd ..
./verify-setup.sh
```

---

## 🔐 Configurar Google OAuth (Opcional pero Recomendado)

### 1. Crear Proyecto en Google Cloud

1. Ir a [console.cloud.google.com](https://console.cloud.google.com)
2. Crear nuevo proyecto: "SAHA Platform"
3. Habilitar "Google+ API"

### 2. Crear OAuth 2.0 Client

1. Credentials → Create Credentials → OAuth 2.0 Client ID
2. **Application type**: Web application
3. **Authorized JavaScript origins**:
   ```
   http://localhost:3000
   ```
4. **Authorized redirect URIs**:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
5. Copiar **Client ID** y **Client Secret**

### 3. Configurar en .env.local

```bash
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
```

### 4. Probar OAuth

1. Abrir: http://localhost:3000
2. Click: "Acceder Como Trabajador"
3. Click: "No, registrarme"
4. Click: Botón de Google
5. Autorizar con cuenta de Google
6. ✅ Datos autocompletados en formulario

---

## 📁 Estructura del Proyecto

```
Proyect SAHA/
├── BackEnd/                    # Express API
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.ts        # Login, registro tradicional
│   │   │   ├── oauth.ts       # 🆕 OAuth sincronización
│   │   │   ├── providers.ts   # CRUD proveedores
│   │   │   ├── bookings.ts    # Sistema de reservas
│   │   │   └── reviews.ts     # Sistema de reviews
│   │   ├── middleware/        # Auth, uploads
│   │   └── db/                # Prisma client
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── migrations/        # Database migrations
│   ├── .env.example           # 🆕 Template de variables
│   └── package.json
│
├── FrontEnd/                   # Next.js App
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/auth/[...nextauth]/ # 🆕 NextAuth handler
│   │   │   ├── login/         # Página de login (OAuth enabled)
│   │   │   ├── provider-signup/ # 🆕 OAuth autocompletar
│   │   │   └── page.tsx       # Home (OAuth enabled)
│   │   ├── components/
│   │   │   ├── auth/          # 🆕 OAuthButtons, SessionProvider
│   │   │   ├── ui/            # Componentes reutilizables
│   │   │   └── layout/        # Header, Footer
│   │   ├── store/             # Zustand stores
│   │   ├── contexts/          # Auth context
│   │   └── utils/             # API helpers
│   ├── .env.example           # 🆕 Template completo
│   └── package.json
│
├── VERCEL_DEPLOYMENT_GUIDE.md # 🆕 Guía completa de deploy
├── verify-setup.sh            # 🆕 Script de verificación
└── README.md                  # Este archivo
```

---

## 🗄️ Database Schema

### Modelos Principales

- **User**: Usuarios base (CLIENT, PROVIDER, ADMIN)
- **ProviderProfile**: Perfil extendido de proveedores
- **Booking**: Reservas/citas de servicios
- **Review**: Sistema de calificaciones (1-5 estrellas)
- **Message**: Mensajería directa
- **Notification**: Notificaciones in-app
- **Favorite**: Guardados/favoritos

### Categorías de Servicio

PLOMERIA, ELECTRICIDAD, CARPINTERIA, PINTURA, LIMPIEZA, JARDINERIA, MECANICA, CONSTRUCCION, REPARACIONES, MUDANZAS, TECNOLOGIA, OTRO

### Estados de Booking

PENDING → ACCEPTED/REJECTED → CONFIRMED → IN_PROGRESS → COMPLETED/CANCELLED

---

## 🧪 Testing

### Frontend (Vitest)

```bash
cd FrontEnd

# Ejecutar tests
npm run test

# Coverage report
npm run test:coverage

# Watch mode
npm run test:watch
```

**Coverage actual**: 79.48% 🎯

### Backend (Pendiente)

```bash
cd BackEnd

# TODO: Implementar tests
npm run test
```

---

## 📦 Deployment a Vercel

### Guía Completa

Ver: [`VERCEL_DEPLOYMENT_GUIDE.md`](VERCEL_DEPLOYMENT_GUIDE.md)

### Resumen Rápido

1. **Database**: Crear en Neon o Azure PostgreSQL
2. **Cloudinary**: Obtener API keys
3. **Google OAuth**: Configurar redirect URIs para producción
4. **Backend**: Deploy en Vercel + configurar env vars + migrations
5. **Frontend**: Deploy en Vercel + configurar env vars
6. **Verificar**: OAuth flow end-to-end

### URLs de Ejemplo

- Frontend: `https://saha-platform.vercel.app`
- Backend: `https://saha-api.vercel.app`

---

## 🔒 Seguridad

### Checklist de Producción

- [ ] JWT_SECRET único y seguro (min 32 caracteres)
- [ ] NEXTAUTH_SECRET generado con `openssl rand -base64 32`
- [ ] Database con SSL (`sslmode=require`)
- [ ] CORS configurado para dominio específico
- [ ] `.env` files en `.gitignore`
- [ ] OAuth redirect URIs solo para dominios verificados
- [ ] Cloudinary API keys en variables de entorno
- [ ] Passwords hasheados con bcrypt (salt rounds: 10)

### Rotar Secrets

Si un secret fue comprometido:

```bash
# Generar nuevo secret
openssl rand -base64 32

# Actualizar en Vercel
vercel env rm JWT_SECRET
vercel env add JWT_SECRET

# Redeploy
vercel --prod
```

---

## 📊 Features Implementadas

### ✅ Completadas

- [x] Autenticación JWT
- [x] **OAuth Google** (login + registro)
- [x] CRUD Usuarios y Proveedores
- [x] Sistema de Bookings
- [x] Reviews con rating 1-5
- [x] Mensajería directa
- [x] Notificaciones
- [x] Upload de archivos (Cloudinary)
- [x] Testing Frontend (79% coverage)
- [x] Design Tokens System
- [x] Zustand + Context API
- [x] Database Performance Indices (14 índices)
- [x] Componentes Reutilizables
- [x] **OAuth autocompletado en signup**

### 🚧 En Progreso

- [ ] Testing Backend (unit + integration)
- [ ] E2E tests (Playwright)
- [ ] Email notifications (SendGrid)
- [ ] Pagos (Mercado Pago)
- [ ] Chat en tiempo real (Socket.io)

### 🎯 Roadmap

#### Corto Plazo
- [ ] Facebook OAuth
- [ ] Apple OAuth  
- [ ] Backend testing completo
- [ ] Sistema de pagos
- [ ] Email notifications

#### Mediano Plazo
- [ ] Mobile app (React Native)
- [ ] Video consultas
- [ ] Sistema de disputas
- [ ] Analytics dashboard
- [ ] SEO optimization

#### Largo Plazo
- [ ] Migración a Azure Database
- [ ] Microservicios
- [ ] ML recommendations
- [ ] Multi-idioma
- [ ] Expansión regional

---

## 🤝 Contribuir

### Workflow

1. Fork el repositorio
2. Crear branch: `git checkout -b feature/nueva-feature`
3. Commit cambios: `git commit -m 'Add: nueva feature'`
4. Push: `git push origin feature/nueva-feature`
5. Crear Pull Request

### Coding Standards

- **TypeScript**: Strict mode, no `any`
- **Components**: Functional components + hooks
- **Naming**: camelCase (variables), PascalCase (components)
- **Files**: kebab-case (`user-profile.tsx`)
- **Tests**: Co-located con componentes
- **Commits**: Conventional commits (feat:, fix:, docs:)

Ver: [`.github/copilot-instructions.md`](.github/copilot-instructions.md) para guías detalladas

---

## 📝 Scripts Útiles

### Backend

```bash
npm run dev          # Servidor desarrollo
npm run build        # Build producción
npm run start        # Servidor producción
npx prisma studio    # DB GUI
npx prisma migrate dev  # Crear migración
npx prisma generate  # Generar client
```

### Frontend

```bash
npm run dev          # Servidor desarrollo
npm run build        # Build producción
npm run start        # Servidor producción
npm run test         # Tests
npm run test:coverage  # Coverage report
npm run lint         # ESLint
```

---

## 🐛 Troubleshooting

### "Module not found"

```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### "Prisma Client not generated"

```bash
cd BackEnd
npx prisma generate
```

### "OAuth redirect URI mismatch"

Verificar que en Google Console los URIs coincidan exactamente:
```
http://localhost:3000/api/auth/callback/google
```

### "CORS error"

Verificar `FRONTEND_URL` en backend `.env`:
```
FRONTEND_URL=http://localhost:3000
```

### "Database connection failed"

1. Verificar `DATABASE_URL` en `.env`
2. Asegurar `?sslmode=require` al final
3. Verificar que database esté corriendo
4. Probar: `npx prisma db push`

---

## 📞 Soporte

- **Documentación**: Ver archivos `.md` en el proyecto
- **Guía Deploy**: [`VERCEL_DEPLOYMENT_GUIDE.md`](VERCEL_DEPLOYMENT_GUIDE.md)
- **OAuth Setup**: [`FrontEnd/OAUTH_SETUP_GUIDE.md`](FrontEnd/OAUTH_SETUP_GUIDE.md)
- **Issues**: GitHub Issues
- **Email**: soporte@saha.com (pendiente)

---

## 📄 Licencia

MIT License - Ver [LICENSE](LICENSE) para más detalles

---

## 🎉 ¿Listo para Desplegar?

### Checklist Rápido

1. [ ] Ejecutar `./verify-setup.sh`
2. [ ] Todos los tests pasando
3. [ ] OAuth funcionando localmente
4. [ ] Variables de entorno configuradas
5. [ ] Database migrations aplicadas
6. [ ] Leer `VERCEL_DEPLOYMENT_GUIDE.md`
7. [ ] Deploy! 🚀

---

**Construido con ❤️ para facilitar el acceso a servicios del hogar en Argentina**
