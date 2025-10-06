# Proyecto SAHA - MVP Full-Stack

Proyecto MVP desarrollado con TypeScript, separando Frontend y Backend para una arquitectura escalable.

## 🏗️ Arquitectura

```
Proyect SAHA/
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

## ⚡ Inicio Rápido

### Backend
```bash
cd BackEnd
npm install
npm run dev     # Servidor en http://localhost:5000
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

- `GET /` - Estado del servidor
- `GET /api/health` - Health check

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
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## 🚀 Deploy

- **Frontend**: Recomendado Vercel
- **Backend**: Recomendado Railway/Render

## 📄 Licencia

ISC