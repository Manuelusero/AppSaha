import { PrismaClient } from '../generated/prisma/index.js';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

/**
 * Script de desarrollo para crear usuarios de prueba
 * ⚠️ NO USAR EN PRODUCCIÓN
 * 
 * Uso:
 * 1. Configurar TEST_USER_PASSWORD en .env (opcional, default: 123456)
 * 2. Ejecutar: npm run create-user
 */

async function createUser() {
  try {
    // Password de prueba desde variable de entorno o default para desarrollo
    const testPassword = process.env.TEST_USER_PASSWORD || '123456';
    const hashedPassword = await bcrypt.hash(testPassword, 10);
    
    const user = await prisma.user.create({
      data: {
        email: 'usuario@example.com',
        name: 'Usuario de Prueba',
        password: hashedPassword
      }
    });

    console.log('✅ Usuario de prueba creado exitosamente:');
    console.log(user);
  } catch (error) {
    console.error('❌ Error al crear usuario:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createUser();
