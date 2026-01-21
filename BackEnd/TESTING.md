# Configuración de Testing - Backend SAHA

## 🧪 Stack de Testing

- **Vitest** - Framework de testing (mismo que frontend)
- **Supertest** - Testing de APIs HTTP
- **Prisma** - Database testing con PostgreSQL

## 📁 Estructura de Tests

```
BackEnd/
├── src/
│   └── tests/
│       ├── setup.ts          # Configuración global de tests
│       ├── helpers.ts        # Funciones auxiliares para tests
│       ├── auth.test.ts      # Tests de autenticación
│       ├── bookings.test.ts  # Tests de bookings
│       └── reviews.test.ts   # Tests de reviews
├── vitest.config.ts          # Configuración de Vitest
└── coverage/                 # Reportes de cobertura
```

## 🚀 Scripts Disponibles

```bash
# Ejecutar todos los tests una vez
npm test

# Ejecutar tests en modo watch (re-ejecuta al cambiar código)
npm run test:watch

# Ejecutar tests con UI interactiva
npm run test:ui

# Generar reporte de cobertura
npm run test:coverage
```

## 📊 Cobertura de Tests

### Auth Routes (auth.test.ts)

- ✅ POST `/api/auth/signup` - Registro de proveedores
- ✅ POST `/api/auth/signup-client` - Registro de clientes
- ✅ POST `/api/auth/login` - Login
- ✅ GET `/api/auth/me` - Usuario actual

### Bookings Routes (bookings.test.ts)

- ✅ POST `/api/bookings` - Crear booking
- ✅ GET `/api/bookings` - Listar bookings
- ✅ GET `/api/bookings/:id` - Detalle de booking
- ✅ PATCH `/api/bookings/:id/status` - Actualizar estado
- ✅ DELETE `/api/bookings/:id` - Eliminar booking

### Reviews Routes (reviews.test.ts)

- ✅ POST `/api/reviews` - Crear review
- ✅ GET `/api/reviews/provider/:providerId` - Reviews de proveedor
- ✅ GET `/api/reviews/booking/:bookingId` - Review de booking
- ✅ PATCH `/api/reviews/:id/response` - Responder review

## 🗄️ Base de Datos de Testing

Los tests usan una base de datos separada configurada en `.env.test`:

```env
DATABASE_URL_TEST="postgresql://user:password@localhost:5432/saha_test"
```

**Importante:**

- La DB de test se limpia después de cada test
- Los tests son aislados e independientes
- No afectan la base de datos de desarrollo

## 📝 Escribir Tests

### Estructura de un Test

```typescript
import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../index.js";
import { createTestClient, generateTestToken } from "./helpers.js";

describe("Feature Name", () => {
  beforeEach(async () => {
    // Setup antes de cada test
  });

  it("should do something", async () => {
    // Arrange - Preparar datos
    const user = await createTestClient();
    const token = generateTestToken(user.id, user.email, "CLIENT");

    // Act - Ejecutar acción
    const response = await request(app)
      .post("/api/endpoint")
      .set("Authorization", `Bearer ${token}`)
      .send({ data: "test" })
      .expect(200);

    // Assert - Verificar resultado
    expect(response.body).toHaveProperty("success");
  });
});
```

### Helpers Disponibles

```typescript
// Crear usuarios de test
await createTestClient({ email: "custom@test.com" });
await createTestProvider(
  {
    email: "provider@test.com",
  },
  {
    serviceCategory: "PLOMERIA",
    pricePerHour: 1500,
  },
);

// Generar tokens JWT
const token = generateTestToken(userId, email, role);

// Crear bookings y reviews
await createTestBooking(clientId, providerId);
await createTestReview(bookingId, clientId, providerId, rating);

// Limpiar base de datos
await cleanDatabase();
```

## ✅ Checklist de Tests

Al agregar una nueva feature, asegúrate de testear:

- [ ] **Happy path** - Caso exitoso con datos válidos
- [ ] **Validación de inputs** - Campos requeridos, formatos
- [ ] **Autenticación** - Con/sin token, token inválido
- [ ] **Autorización** - Roles y permisos correctos
- [ ] **Edge cases** - Valores límite, datos faltantes
- [ ] **Error handling** - Respuestas de error apropiadas
- [ ] **Database state** - Verificar cambios en DB

## 🎯 Buenas Prácticas

1. **Tests independientes** - Cada test debe poder ejecutarse solo
2. **Clean up** - Limpiar datos después de cada test
3. **Nombres descriptivos** - Describe claramente qué testea
4. **Arrange-Act-Assert** - Estructura clara en 3 pasos
5. **No hardcodear datos** - Usa helpers para generar datos
6. **Test edge cases** - No solo el happy path
7. **Fast tests** - Tests rápidos = feedback rápido

## 🐛 Debugging Tests

```bash
# Ver output detallado
npm test -- --reporter=verbose

# Ejecutar un solo archivo
npm test -- auth.test.ts

# Ejecutar tests que coincidan con patrón
npm test -- --grep "should create"

# Debug con VSCode
# Agregar breakpoint y usar "Debug Test" en el editor
```

## 📈 Objetivos de Cobertura

- **Objetivo mínimo**: 70%
- **Objetivo recomendado**: 80%
- **Crítico (auth, payments)**: 100%

## 🚀 CI/CD Integration

Los tests se ejecutan automáticamente en:

- Cada push a repositorio
- Pull requests
- Antes de deploy a producción

## 🔧 Troubleshooting

### Error: "Cannot find module"

```bash
npm install
npx prisma generate
```

### Error: "Database connection failed"

```bash
# Verificar DATABASE_URL_TEST en .env.test
# Asegurar que PostgreSQL esté corriendo
# Ejecutar migraciones: npx prisma migrate dev
```

### Tests lentos

```bash
# Usar base de datos en memoria (SQLite) para tests
# Reducir timeout en vitest.config.ts
# Paralelizar tests con --pool=threads
```

## 📚 Recursos

- [Vitest Documentation](https://vitest.dev)
- [Supertest GitHub](https://github.com/visionmedia/supertest)
- [Prisma Testing Guide](https://www.prisma.io/docs/guides/testing)
