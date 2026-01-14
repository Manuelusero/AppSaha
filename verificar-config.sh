#!/bin/bash

# Script para verificar la configuración del despliegue
# Autor: GitHub Copilot
# Fecha: 14 de enero de 2026

echo "🔍 VERIFICACIÓN DE CONFIGURACIÓN - PROYECTO SERCO"
echo "=================================================="
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para verificar archivos
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅${NC} $1 existe"
        return 0
    else
        echo -e "${RED}❌${NC} $1 NO existe"
        return 1
    fi
}

# Función para verificar contenido
check_content() {
    if grep -q "$2" "$1" 2>/dev/null; then
        echo -e "${GREEN}✅${NC} $3 configurado en $1"
        return 0
    else
        echo -e "${RED}❌${NC} $3 NO configurado en $1"
        return 1
    fi
}

echo "📂 VERIFICANDO ESTRUCTURA DE ARCHIVOS..."
echo ""

# Backend
check_file "BackEnd/api/index.ts"
check_file "BackEnd/src/index.ts"
check_file "BackEnd/vercel.json"
check_file "BackEnd/prisma/schema.prisma"

echo ""

# Frontend
check_file "FrontEnd/.env.local"
check_file "FrontEnd/src/utils/constants.ts"
check_file "FrontEnd/vercel.json"

echo ""
echo "🔐 VERIFICANDO CONFIGURACIÓN..."
echo ""

# Verificar .env.local
if [ -f "FrontEnd/.env.local" ]; then
    if grep -q "tu-backend-proyecto" "FrontEnd/.env.local"; then
        echo -e "${YELLOW}⚠️${NC}  FrontEnd/.env.local tiene URL de ejemplo"
        echo "   → Necesitas actualizar NEXT_PUBLIC_API_URL con tu URL real"
    else
        echo -e "${GREEN}✅${NC} FrontEnd/.env.local parece configurado"
    fi
else
    echo -e "${RED}❌${NC} FrontEnd/.env.local no existe"
fi

echo ""

# Verificar api/index.ts
if [ -f "BackEnd/api/index.ts" ]; then
    if grep -q "import app from" "BackEnd/api/index.ts"; then
        echo -e "${GREEN}✅${NC} BackEnd/api/index.ts usa la app completa"
    else
        echo -e "${YELLOW}⚠️${NC}  BackEnd/api/index.ts podría necesitar actualización"
    fi
fi

echo ""
echo "📋 PRÓXIMOS PASOS:"
echo ""
echo "1️⃣  Actualiza FrontEnd/.env.local con tu URL real del backend"
echo "    → Abre: code FrontEnd/.env.local"
echo "    → Reemplaza: https://tu-backend-proyecto.vercel.app"
echo ""
echo "2️⃣  Haz commit de los cambios:"
echo "    → git add ."
echo "    → git commit -m 'Fix: Configurar variables de entorno para producción'"
echo "    → git push origin main"
echo ""
echo "3️⃣  Configura variables en Vercel:"
echo "    Backend:"
echo "    → DATABASE_URL (desde Neon)"
echo "    → JWT_SECRET (genera uno nuevo)"
echo "    → FRONTEND_URL=https://serco-eosin.vercel.app"
echo ""
echo "    Frontend:"
echo "    → NEXT_PUBLIC_API_URL (URL de tu backend en Vercel)"
echo ""
echo "4️⃣  Redespliega ambos proyectos en Vercel"
echo ""
echo "=================================================="
echo "Para más detalles, lee: SOLUCION_URGENTE.md"
echo ""
