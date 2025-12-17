#!/bin/bash

# Script de prueba para registro de proveedor
# Ejecuta: bash test-register.sh

curl -X POST http://localhost:8000/api/providers/register \
  -F "nombre=Juan" \
  -F "apellido=Perez" \
  -F "email=juan.perez@test.com" \
  -F "telefono=+54 11 1234 5678" \
  -F "password=Password123" \
  -F "profesion=Plomeros" \
  -F "especialidades=[\"Instalación\",\"Reparación\"]" \
  -F "profesionesAdicionales=[]" \
  -F "ubicacion=Buenos Aires, Buenos Aires" \
  -F "alcanceTrabajo=25" \
  -F "descripcion=Plomero profesional con 10 años de experiencia" \
  -F "dni=12345678" \
  -F "instagram=@juanplomero" \
  -F "facebook=juanplomero" \
  -F "linkedin=juan-perez"

echo ""
echo "✅ Si ves 'success: true', el registro funcionó!"
echo "Copia el 'id' del provider para usar en el dashboard"
