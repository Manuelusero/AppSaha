#!/bin/bash

# Script para configurar la base de datos de testing

echo "🧪 Configurando base de datos de testing..."

# Verificar que existe .env.test
if [ ! -f .env.test ]; then
    echo "❌ Error: .env.test no existe"
    echo "📝 Copia .env.test.example a .env.test y configura tus credenciales"
    exit 1
fi

# Cargar variables de entorno de test
export $(cat .env.test | grep -v '^#' | xargs)

# Crear base de datos de test si no existe
echo "📊 Creando base de datos de test..."
createdb saha_test 2>/dev/null || echo "✓ Base de datos ya existe"

# Ejecutar migraciones en DB de test
echo "🔄 Ejecutando migraciones..."
DATABASE_URL=$DATABASE_URL_TEST npx prisma migrate deploy

echo "✅ Base de datos de testing configurada correctamente!"
echo ""
echo "🚀 Ahora puedes ejecutar los tests con:"
echo "   npm test"
echo "   npm run test:watch"
echo "   npm run test:coverage"
