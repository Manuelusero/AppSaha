<<<<<<< HEAD

# AppSerco - MVP Full-Stack

Proyecto MVP desarrollado con TypeScript, separando Frontend y Backend para una arquitectura escalable.

## 🏗️ Arquitectura

```
AppSerco/
├── FrontEnd/          # Next.js + React + TypeScript
├── BackEnd/           # Express + Node.js + TypeScript
└── .github/           # Configuraciones GitHub
```

## 🚀 Tecnologías

### Frontend

- **Next.js 15** - Framework React con SSR/SSG
- **React 18** - Biblioteca UI
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utilitarios
- **ESLint** - Linting

### Backend

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **TypeScript** - Tipado estático
- **CORS** - Cross-origin requests
- **dotenv** - Variables de entorno
- **Prisma** - ORM para base de datos
- **SQLite** - Base de datos (desarrollo)

## ⚡ Inicio Rápido

### Backend

```bash
cd BackEnd
npm install
npm run dev     # Servidor en http://localhost:8000
```

### Frontend

```bash
cd FrontEnd
npm install
npm run dev     # Aplicación en http://localhost:3000
```

## 📁 Estructura de Carpetas

### Backend (`/BackEnd`)

```
BackEnd/
├── src/
│   ├── index.ts       # Servidor principal
│   └── routes/        # Rutas API
├── dist/              # Compilado TypeScript
├── .env               # Variables entorno
├── package.json
└── tsconfig.json
```

### Frontend (`/FrontEnd`)

```
FrontEnd/
├── src/
│   ├── app/           # App Router (Next.js 15)
│   └── components/    # Componentes React
├── public/            # Archivos estáticos
├── package.json
└── tsconfig.json
```

## 🔗 API Endpoints

- `GET http://localhost:8000/` - Estado del servidor
- `GET http://localhost:8000/api/health` - Health check

## 🛠️ Scripts Disponibles

### Backend

- `npm run dev` - Desarrollo con hot reload
- `npm run build` - Compilar TypeScript
- `npm start` - Servidor producción

### Frontend

- `npm run dev` - Desarrollo con hot reload
- `npm run build` - Build para producción
- `npm start` - Servidor producción

## 📝 Variables de Entorno

### Backend (`.env`)

```env
PORT=8000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
DATABASE_URL="file:./prisma/dev.db"
```

## 🗄️ Base de Datos

Este proyecto usa **Prisma ORM** con **SQLite** para desarrollo local.

### Comandos de Base de Datos:

```bash
# Ver/editar datos con interfaz visual
cd BackEnd
npx prisma studio

# Crear nueva migración después de cambios en schema
npx prisma migrate dev --name nombre_migracion

# Ver más información
cat BackEnd/DATABASE.md
```

### Modelos actuales:

- **User**: Usuarios del sistema
- **Post**: Publicaciones/Artículos

Para más detalles, ver [`BackEnd/DATABASE.md`](BackEnd/DATABASE.md)

## 🚀 Deploy

- **Frontend**: Recomendado Vercel
- **Backend**: Recomendado Railway/Render

## 📄 Licencia

# ISC

# AppSaha

> > > > > > > 7b3e04ddeca31e7482a6180e3eae94a668da70a2

# SAHA / AppSaha

Plataforma marketplace que conecta proveedores de servicios del hogar con clientes en Argentina.

Resumen rápido

- Frontend: Next.js + React + TypeScript
- Backend: Express + Node.js + TypeScript + Prisma
- Deploy: Vercel (Front + Back) / DB en PostgreSQL

Quickstart

1. Backend

```bash
cd BackEnd
npm install
cp .env.example .env
# editar .env (DATABASE_URL, JWT_SECRET, CLOUDINARY_*)
npx prisma generate
npx prisma migrate dev
npm run dev
```

Servidor en http://localhost:8000

2. Frontend

```bash
cd FrontEnd
npm install
cp .env.example .env.local
# editar .env.local (NEXT_PUBLIC_API_URL, NEXTAUTH_URL, etc.)
npm run dev
```

Frontend en http://localhost:3000

Estructura y documentación importante

- `FrontEnd/` - código y guías específicas (Design tokens, testing, guides)
- `BackEnd/` - API, migrations y guías (DATABASE_COMPLETE.md, TESTING.md)
- `RELEASE.md` - estrategia de versionado (semantic-release)
- `CHANGELOG.md` - generado automáticamente
- `docs/archive/` - documentación archivada (moved old README variants)

Contribuir

- Usa conventional commits para releases automáticas (see `RELEASE.md`).
- Abrí PRs contra `main`; usamos GitHub Actions para CI and semantic-release for releases.

Contacto

- Repo: https://github.com/Manuelusero/AppSaha
