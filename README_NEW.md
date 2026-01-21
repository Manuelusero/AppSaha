# 🏠 SAHA - Sistema de Ayuda del Hogar

Plataforma marketplace que conecta proveedores de servicios del hogar con clientes en Argentina.

## 🎯 Features

- ✅ Sistema de autenticación (JWT + bcrypt)
- ✅ Registro de proveedores con perfiles completos
- ✅ Sistema de bookings con workflow completo
- ✅ Reviews y ratings (1-5 estrellas)
- ✅ File uploads con Cloudinary
- ✅ Mensajería entre usuarios
- ✅ Sistema de favoritos
- ✅ Notificaciones en tiempo real
- ✅ Testing completo (Frontend 79%, Backend 85%+)

## 🏗️ Arquitectura

```
SAHA/
├── FrontEnd/          # Next.js 15 + React + TypeScript
├── BackEnd/           # Express + Node.js + TypeScript + Prisma
└── .github/           # Configuraciones GitHub + AI Agents
```

## 🚀 Tecnologías

### Frontend

- **Next.js 15** - Framework React con App Router
- **TypeScript 5** - Tipado estático
- **Zustand** - State management
- **TailwindCSS 4** - Estilos con Design Tokens
- **Vitest** - Testing (79% coverage)

### Backend

- **Express 5** - Framework web
- **TypeScript 5** - Tipado estático
- **Prisma** - ORM para PostgreSQL
- **JWT + bcrypt** - Autenticación
- **Cloudinary** - File storage
- **Vitest + Supertest** - Testing (85%+ coverage)

### Base de Datos

- **PostgreSQL** - Base de datos (desarrollo)
- **Azure Database for PostgreSQL** - Producción (planificado)

## ⚡ Inicio Rápido

### Requisitos

- Node.js 20.x
- PostgreSQL 14+
- npm o yarn

### Backend

```bash
cd BackEnd
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# Ejecutar migraciones
npx prisma migrate dev

# Iniciar servidor de desarrollo
npm run dev     # http://localhost:8000
```

### Frontend

```bash
cd FrontEnd
npm install

# Configurar variables de entorno
cp .env.local.example .env.local
# Editar .env.local

# Iniciar aplicación
npm run dev     # http://localhost:3000
```

## 🧪 Testing

### Backend

```bash
cd BackEnd

# Setup inicial (solo una vez)
cp .env.test.example .env.test
./setup-test-db.sh

# Ejecutar tests
npm test                    # Una vez
npm run test:watch          # Watch mode
npm run test:coverage       # Con reporte

# Ver guía completa
cat TESTING_QUICKSTART.md
```

### Frontend

```bash
cd FrontEnd

# Ejecutar tests
npm test                    # Una vez
npm run test:watch          # Watch mode
npm run test:coverage       # Con reporte
open coverage/index.html    # Ver reporte
```

## 📁 Estructura del Proyecto

### Backend (`/BackEnd`)

```
BackEnd/
├── src/
│   ├── index.ts           # Servidor principal
│   ├── routes/            # API routes
│   │   ├── auth.ts        # Autenticación
│   │   ├── bookings.ts    # Gestión de bookings
│   │   ├── providers.ts   # Perfiles de proveedores
│   │   ├── reviews.ts     # Sistema de reviews
│   │   ├── support.ts     # Soporte
│   │   └── users.ts       # Gestión de usuarios
│   ├── middleware/        # Express middleware
│   │   └── upload.ts      # Multer + Cloudinary
│   ├── db/                # Database connection
│   │   └── prisma.ts      # Prisma client
│   └── tests/             # Tests
│       ├── setup.ts       # Setup global
│       ├── helpers.ts     # Helpers de testing
│       ├── auth.test.ts   # Tests de auth
│       ├── bookings.test.ts
│       └── reviews.test.ts
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── migrations/        # Database migrations
├── api/                   # Vercel serverless
│   └── index.ts           # Serverless entry
├── vitest.config.ts       # Vitest config
├── TESTING.md             # Guía de testing
└── package.json
```

### Frontend (`/FrontEnd`)

```
FrontEnd/
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── layout.tsx     # Layout principal
│   │   ├── page.tsx       # Home page
│   │   ├── login/         # Login
│   │   ├── register/      # Registro
│   │   ├── dashboard/     # Dashboards
│   │   └── ...            # Otras páginas
│   ├── components/        # Componentes React
│   │   ├── auth/          # Auth components
│   │   ├── layout/        # Layout components
│   │   └── ui/            # UI components
│   ├── contexts/          # React Context
│   │   └── AuthContext.tsx
│   ├── hooks/             # Custom hooks
│   ├── store/             # Zustand stores
│   │   └── authStore.ts   # Auth store
│   ├── styles/            # Design tokens
│   │   └── tokens.ts      # Color, spacing, etc.
│   ├── utils/             # Utilidades
│   │   ├── api.ts         # API wrapper
│   │   └── constants.ts   # Constantes
│   └── tests/             # Tests
│       └── ...
├── public/                # Assets estáticos
├── coverage/              # Coverage reports
├── vitest.config.ts       # Vitest config
├── TESTING.md             # Guía de testing
└── package.json
```

## 🔗 API Endpoints

### Auth

- `POST /api/auth/signup` - Registro de proveedores
- `POST /api/auth/signup-client` - Registro de clientes
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Usuario actual

### Bookings

- `POST /api/bookings` - Crear booking
- `GET /api/bookings` - Listar bookings
- `GET /api/bookings/:id` - Detalle de booking
- `PATCH /api/bookings/:id/status` - Actualizar estado
- `DELETE /api/bookings/:id` - Eliminar booking

### Reviews

- `POST /api/reviews` - Crear review
- `GET /api/reviews/provider/:providerId` - Reviews de proveedor
- `GET /api/reviews/booking/:bookingId` - Review de booking
- `PATCH /api/reviews/:id/response` - Responder review

### Providers

- `GET /api/providers` - Listar proveedores
- `GET /api/providers/:id` - Detalle de proveedor
- `POST /api/providers/register` - Registro completo con archivos
- `PUT /api/providers/:id` - Actualizar perfil

Ver documentación completa en `BackEnd/API_REVIEWS.md`

## 📝 Variables de Entorno

### Backend (`.env`)

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/saha"

# Auth
JWT_SECRET="your_super_secret_jwt_key"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# CORS
FRONTEND_URL="http://localhost:3000"
```

### Frontend (`.env.local`)

```env
NEXT_PUBLIC_API_URL="http://localhost:8000"
```

### Testing (`.env.test`)

```env
DATABASE_URL_TEST="postgresql://user:password@localhost:5432/saha_test"
JWT_SECRET="test_jwt_secret"
```

## 🗄️ Base de Datos

### Modelos principales:

- **User**: Usuarios (CLIENT, PROVIDER, ADMIN)
- **ProviderProfile**: Perfil extendido de proveedores
- **Booking**: Reservas/Contrataciones (PENDING → COMPLETED)
- **Review**: Reviews y ratings (1-5 estrellas)
- **Message**: Mensajería entre usuarios
- **Notification**: Notificaciones del sistema
- **Favorite**: Favoritos de usuarios

### Comandos útiles:

```bash
cd BackEnd

# Ver/editar datos con interfaz visual
npx prisma studio

# Crear nueva migración
npx prisma migrate dev --name nombre_migracion

# Generar Prisma Client después de cambios
npx prisma generate

# Reset DB (¡cuidado en producción!)
npx prisma migrate reset
```

Ver schema completo en `BackEnd/DATABASE_COMPLETE.md`

## 🚀 Scripts Disponibles

### Backend

```bash
npm run dev         # Desarrollo con hot reload
npm run build       # Compilar TypeScript
npm start           # Servidor producción
npm test            # Ejecutar tests
npm run test:watch  # Tests en modo watch
npm run test:coverage  # Tests con cobertura
```

### Frontend

```bash
npm run dev         # Desarrollo con hot reload
npm run build       # Build para producción
npm start           # Servidor producción
npm run lint        # Linting
npm test            # Ejecutar tests
npm run test:watch  # Tests en modo watch
npm run test:coverage  # Tests con cobertura
```

## 📊 Test Coverage

- **Frontend**: 79.48% ✅ (Objetivo: 80%)
- **Backend**: 85%+ ✅ (Objetivo: 80%)
- **Crítico (auth)**: 95%+ ✅

## 🚀 Deploy

### Frontend (Vercel)

1. Conectar repositorio a Vercel
2. Configurar environment variables
3. Deploy automático en cada push a `main`

### Backend (Vercel Serverless)

1. Configurado en `/BackEnd/api/index.ts`
2. Deploy automático con frontend
3. Variables de entorno en Vercel dashboard

### Base de Datos

- **Desarrollo**: PostgreSQL local
- **Producción**: Planeado migrar a Azure Database for PostgreSQL

## 🎓 Documentación Adicional

- [TESTING.md](BackEnd/TESTING.md) - Guía completa de testing
- [TESTING_QUICKSTART.md](BackEnd/TESTING_QUICKSTART.md) - Inicio rápido testing
- [DATABASE_COMPLETE.md](BackEnd/DATABASE_COMPLETE.md) - Schema de base de datos
- [API_REVIEWS.md](BackEnd/API_REVIEWS.md) - Documentación de API
- [ZUSTAND_GUIDE.md](FrontEnd/ZUSTAND_GUIDE.md) - Guía de Zustand
- [DESIGN_TOKENS.md](FrontEnd/DESIGN_TOKENS.md) - Sistema de diseño
- [ERROR_HANDLING_AND_TESTING_GUIDE.md](FrontEnd/ERROR_HANDLING_AND_TESTING_GUIDE.md) - Manejo de errores

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

**Importante**: Asegúrate de que todos los tests pasen antes de hacer PR:

```bash
# Backend
cd BackEnd && npm test

# Frontend
cd FrontEnd && npm test
```

## 📄 Licencia

ISC License

## 👥 Equipo

- **Desarrollo**: Manuel Usero
- **Diseño**: En progreso

## 🗺️ Roadmap

### ✅ Completado

- [x] Sistema de autenticación
- [x] Perfiles de proveedores
- [x] Sistema de bookings
- [x] Reviews y ratings
- [x] File uploads
- [x] Testing completo

### 🚧 En Progreso

- [ ] Páginas informativas (esperando diseño)
- [ ] Búsqueda avanzada de proveedores
- [ ] Chat en tiempo real

### 📅 Planificado

- [ ] Sistema de pagos (Mercado Pago)
- [ ] Verificación de proveedores
- [ ] PWA (Progressive Web App)
- [ ] E2E testing con Playwright
- [ ] Migración a Azure Database
- [ ] App móvil nativa

---

**SAHA** - Conectando hogares con profesionales de confianza 🏠✨
