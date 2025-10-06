# 🗄️ Base de Datos - Configuración

## ✅ **Ya está configurado:**

- **Prisma ORM** ✅
- **SQLite** para desarrollo local ✅
- **Migraciones** creadas ✅
- **Modelos**: User y Post ✅

## 📊 **Estructura de la Base de Datos:**

### **Modelo User (Usuario)**

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### **Modelo Post (Artículo)**

```prisma
model Post {
  id        String   @id @default(cuid())
  title     String
  content   String?
  published Boolean  @default(false())
  authorId  String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## 🔧 **Comandos útiles:**

### Ver la base de datos (Interfaz visual)

```bash
cd BackEnd
npx prisma studio
```

Abre una interfaz web en `http://localhost:5555` para ver y editar datos.

### Crear nuevas tablas/modelos

1. Edita `BackEnd/prisma/schema.prisma`
2. Ejecuta:

```bash
npx prisma migrate dev --name nombre_migracion
```

### Resetear la base de datos

```bash
npx prisma migrate reset
```

## 🚀 **API Endpoints (Cuando descomentes las rutas):**

### **Usuarios:**

- `GET    /api/users` - Listar todos
- `GET    /api/users/:id` - Ver uno
- `POST   /api/users` - Crear nuevo
- `PUT    /api/users/:id` - Actualizar
- `DELETE /api/users/:id` - Eliminar

### **Ejemplo de uso:**

```bash
# Crear usuario
curl -X POST http://localhost:8000/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User"}'

# Listar usuarios
curl http://localhost:8000/api/users
```

## 🌐 **Para pasar a producción (PostgreSQL gratis):**

### **Opción 1: Supabase (Recomendado)**

1. Crea cuenta en [supabase.com](https://supabase.com)
2. Crea un proyecto
3. Copia la conexión PostgreSQL
4. Actualiza en `.env`:

```env
DATABASE_URL="postgresql://..."
```

5. Cambia en `schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

6. Ejecuta: `npx prisma migrate dev`

### **Opción 2: Railway**

1. Crea cuenta en [railway.app](https://railway.app)
2. Crea una base de datos PostgreSQL
3. Sigue los pasos anteriores

## 💡 **Próximos pasos:**

1. **Descomentar las rutas** en `src/index.ts`
2. **Probar con Prisma Studio**: `npx prisma studio`
3. **Crear más modelos** según tu aplicación
4. **Implementar autenticación** con JWT

## 📝 **Notas:**

- La base de datos SQLite actual está en: `BackEnd/prisma/dev.db`
- No se sube al repositorio (está en `.gitignore`)
- SQLite es solo para desarrollo, usa PostgreSQL en producción
