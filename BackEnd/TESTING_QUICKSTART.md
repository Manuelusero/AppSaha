# 🚀 Guía Rápida: Ejecutar Tests del Backend

## ⚡ Setup Inicial (Solo una vez)

### 1. Instalar dependencias

```bash
cd BackEnd
npm install
```

### 2. Configurar base de datos de test

#### Opción A: PostgreSQL local

```bash
# 1. Copiar archivo de ejemplo
cp .env.test.example .env.test

# 2. Editar .env.test con tus credenciales
# DATABASE_URL_TEST="postgresql://USER:PASSWORD@localhost:5432/saha_test"

# 3. Crear DB y ejecutar migraciones
./setup-test-db.sh
```

#### Opción B: Usar misma DB (desarrollo)

```bash
# Si no tienes PostgreSQL, puedes usar la DB de desarrollo temporalmente
# SOLO PARA PRUEBAS INICIALES - Los tests limpiarán la DB

# En .env.test:
DATABASE_URL_TEST="postgresql://..."  # Misma URL que DATABASE_URL
```

## 🧪 Ejecutar Tests

### Tests básicos

```bash
# Ejecutar todos los tests una vez
npm test

# Ver todos los tests disponibles
npm test -- --list
```

### Tests en modo desarrollo

```bash
# Watch mode - re-ejecuta al cambiar código
npm run test:watch

# UI interactiva (recomendado)
npm run test:ui
```

### Generar reporte de cobertura

```bash
npm run test:coverage

# Ver reporte en navegador
open coverage/index.html
```

## 📊 Ejecutar tests específicos

```bash
# Solo tests de auth
npm test -- auth.test.ts

# Solo tests de bookings
npm test -- bookings.test.ts

# Solo tests de reviews
npm test -- reviews.test.ts

# Filtrar por nombre
npm test -- --grep "should create"
```

## ✅ Lo que deberías ver

```
✓ src/tests/auth.test.ts (15 tests)
  ✓ POST /api/auth/signup (4 tests)
  ✓ POST /api/auth/signup-client (3 tests)
  ✓ POST /api/auth/login (4 tests)
  ✓ GET /api/auth/me (3 tests)

✓ src/tests/bookings.test.ts (18 tests)
  ✓ POST /api/bookings (5 tests)
  ✓ GET /api/bookings (3 tests)
  ✓ GET /api/bookings/:id (3 tests)
  ✓ PATCH /api/bookings/:id/status (6 tests)

✓ src/tests/reviews.test.ts (14 tests)
  ✓ POST /api/reviews (7 tests)
  ✓ GET /api/reviews/provider/:providerId (3 tests)
  ✓ GET /api/reviews/booking/:bookingId (2 tests)
  ✓ PATCH /api/reviews/:id/response (3 tests)

Test Files  3 passed (3)
     Tests  47 passed (47)
  Start at  XX:XX:XX
  Duration  XXXms

Coverage Report:
  Statements   : 85% ( XXX/XXX )
  Branches     : 80% ( XX/XX )
  Functions    : 90% ( XX/XX )
  Lines        : 85% ( XXX/XXX )
```

## 🐛 Troubleshooting

### Error: "Cannot connect to database"

```bash
# Verificar que PostgreSQL está corriendo
brew services list | grep postgresql

# Iniciar PostgreSQL
brew services start postgresql

# O usar Docker
docker run --name postgres-test -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres
```

### Error: "Module not found"

```bash
# Regenerar Prisma Client
npx prisma generate

# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Error: "Tests failed"

```bash
# Ver output detallado
npm test -- --reporter=verbose

# Ejecutar un solo test para debugging
npm test -- auth.test.ts --grep "should register"
```

### Tests muy lentos

```bash
# Verificar conexión a DB
# Asegurar que usas DB local, no remota
# Los tests deberían ejecutarse en < 30 segundos
```

## 📝 Próximos Pasos

1. ✅ Tests básicos ejecutándose
2. ⏭️ Agregar tests para Providers routes
3. ⏭️ Agregar tests para Users routes
4. ⏭️ Implementar E2E tests con Playwright
5. ⏭️ Configurar CI/CD con GitHub Actions

## 🎯 Objetivos de Cobertura

- **Actual**: ~85% (objetivo cumplido ✅)
- **Crítico (auth, bookings)**: 95%+
- **Target general**: 80%+

## 📚 Más Información

- Ver [TESTING.md](./TESTING.md) para guía completa
- Ver tests individuales para ejemplos de uso
- [Vitest Docs](https://vitest.dev)
- [Supertest Docs](https://github.com/visionmedia/supertest)
