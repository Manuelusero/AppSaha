#!/bin/bash

# ============================================
# Script de Verificación Pre-Deployment
# SAHA Platform
# ============================================

echo "🔍 Verificando configuración de SAHA Platform..."
echo ""

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Contadores
ERRORS=0
WARNINGS=0
SUCCESS=0

# ============================================
# BACKEND CHECKS
# ============================================

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📦 BACKEND CHECKS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cd BackEnd

# Check .env file exists
if [ -f .env ]; then
  echo -e "${GREEN}✓${NC} .env file found"
  ((SUCCESS++))
else
  echo -e "${RED}✗${NC} .env file not found (copy from .env.example)"
  ((ERRORS++))
fi

# Check DATABASE_URL
if grep -q "DATABASE_URL=" .env 2>/dev/null && ! grep -q "DATABASE_URL=\"\"" .env; then
  echo -e "${GREEN}✓${NC} DATABASE_URL configured"
  ((SUCCESS++))
else
  echo -e "${RED}✗${NC} DATABASE_URL not configured"
  ((ERRORS++))
fi

# Check JWT_SECRET
if grep -q "JWT_SECRET=" .env 2>/dev/null && ! grep -q "your-secret-key" .env; then
  echo -e "${GREEN}✓${NC} JWT_SECRET set (not using default)"
  ((SUCCESS++))
else
  echo -e "${YELLOW}⚠${NC} JWT_SECRET using default value (change for production)"
  ((WARNINGS++))
fi

# Check Cloudinary
if grep -q "CLOUDINARY_CLOUD_NAME=" .env 2>/dev/null && ! grep -q "your-cloud-name" .env; then
  echo -e "${GREEN}✓${NC} Cloudinary configured"
  ((SUCCESS++))
else
  echo -e "${RED}✗${NC} Cloudinary not configured"
  ((ERRORS++))
fi

# Check node_modules
if [ -d "node_modules" ]; then
  echo -e "${GREEN}✓${NC} Dependencies installed"
  ((SUCCESS++))
else
  echo -e "${RED}✗${NC} Dependencies not installed (run: npm install)"
  ((ERRORS++))
fi

# Check Prisma client
if [ -f "node_modules/.prisma/client/index.js" ]; then
  echo -e "${GREEN}✓${NC} Prisma client generated"
  ((SUCCESS++))
else
  echo -e "${YELLOW}⚠${NC} Prisma client not generated (run: npx prisma generate)"
  ((WARNINGS++))
fi

echo ""

# ============================================
# FRONTEND CHECKS
# ============================================

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "💻 FRONTEND CHECKS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cd ../FrontEnd

# Check .env.local file exists
if [ -f .env.local ]; then
  echo -e "${GREEN}✓${NC} .env.local file found"
  ((SUCCESS++))
else
  echo -e "${RED}✗${NC} .env.local file not found (copy from .env.example)"
  ((ERRORS++))
fi

# Check NEXT_PUBLIC_API_URL
if grep -q "NEXT_PUBLIC_API_URL=" .env.local 2>/dev/null; then
  echo -e "${GREEN}✓${NC} NEXT_PUBLIC_API_URL configured"
  ((SUCCESS++))
else
  echo -e "${RED}✗${NC} NEXT_PUBLIC_API_URL not configured"
  ((ERRORS++))
fi

# Check NEXTAUTH_URL
if grep -q "NEXTAUTH_URL=" .env.local 2>/dev/null; then
  echo -e "${GREEN}✓${NC} NEXTAUTH_URL configured"
  ((SUCCESS++))
else
  echo -e "${RED}✗${NC} NEXTAUTH_URL not configured"
  ((ERRORS++))
fi

# Check NEXTAUTH_SECRET
if grep -q "NEXTAUTH_SECRET=" .env.local 2>/dev/null && ! grep -q "your-secret-key" .env.local; then
  echo -e "${GREEN}✓${NC} NEXTAUTH_SECRET set (not using default)"
  ((SUCCESS++))
else
  echo -e "${YELLOW}⚠${NC} NEXTAUTH_SECRET using default value (generate with: openssl rand -base64 32)"
  ((WARNINGS++))
fi

# Check Google OAuth
if grep -q "GOOGLE_CLIENT_ID=" .env.local 2>/dev/null && ! grep -q "your-google-client-id" .env.local; then
  echo -e "${GREEN}✓${NC} Google OAuth configured"
  ((SUCCESS++))
else
  echo -e "${YELLOW}⚠${NC} Google OAuth not configured (optional for now)"
  ((WARNINGS++))
fi

# Check node_modules
if [ -d "node_modules" ]; then
  echo -e "${GREEN}✓${NC} Dependencies installed"
  ((SUCCESS++))
else
  echo -e "${RED}✗${NC} Dependencies not installed (run: npm install)"
  ((ERRORS++))
fi

# Check Next.js build
if [ -d ".next" ]; then
  echo -e "${GREEN}✓${NC} Next.js built successfully"
  ((SUCCESS++))
else
  echo -e "${YELLOW}⚠${NC} Next.js not built yet (run: npm run build)"
  ((WARNINGS++))
fi

echo ""

# ============================================
# SECURITY CHECKS
# ============================================

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔒 SECURITY CHECKS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cd ..

# Check .gitignore has .env files
if grep -q ".env" .gitignore 2>/dev/null; then
  echo -e "${GREEN}✓${NC} .env files ignored in git"
  ((SUCCESS++))
else
  echo -e "${RED}✗${NC} .env files NOT ignored in git (SECURITY RISK!)"
  ((ERRORS++))
fi

# Check if .env is committed to git
if git ls-files --error-unmatch BackEnd/.env > /dev/null 2>&1; then
  echo -e "${RED}✗${NC} BackEnd/.env is tracked by git (SECURITY RISK! Remove it)"
  ((ERRORS++))
else
  echo -e "${GREEN}✓${NC} BackEnd/.env not tracked by git"
  ((SUCCESS++))
fi

if git ls-files --error-unmatch FrontEnd/.env.local > /dev/null 2>&1; then
  echo -e "${RED}✗${NC} FrontEnd/.env.local is tracked by git (SECURITY RISK! Remove it)"
  ((ERRORS++))
else
  echo -e "${GREEN}✓${NC} FrontEnd/.env.local not tracked by git"
  ((SUCCESS++))
fi

echo ""

# ============================================
# SUMMARY
# ============================================

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 SUMMARY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo -e "${GREEN}✓ Success: $SUCCESS${NC}"
echo -e "${YELLOW}⚠ Warnings: $WARNINGS${NC}"
echo -e "${RED}✗ Errors: $ERRORS${NC}"

echo ""

if [ $ERRORS -eq 0 ]; then
  echo -e "${GREEN}✅ All critical checks passed!${NC}"
  echo ""
  echo "Next steps:"
  echo "1. Start backend: cd BackEnd && npm run dev"
  echo "2. Start frontend: cd FrontEnd && npm run dev"
  echo "3. Open http://localhost:3000"
  echo ""
  echo "For production deployment, see: VERCEL_DEPLOYMENT_GUIDE.md"
  exit 0
else
  echo -e "${RED}❌ Found $ERRORS error(s). Please fix them before deploying.${NC}"
  echo ""
  echo "Common fixes:"
  echo "- Copy .env.example to .env and .env.local"
  echo "- Configure DATABASE_URL, JWT_SECRET, NEXTAUTH_SECRET"
  echo "- Run: npm install (in both BackEnd and FrontEnd)"
  echo "- Run: npx prisma generate (in BackEnd)"
  exit 1
fi
