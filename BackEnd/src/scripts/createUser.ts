import { PrismaClient } from '../generated/prisma/index.js';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createUser() {
  try {
    const hashedPassword = await bcrypt.hash('123456', 10);
    
    const user = await prisma.user.create({
      data: {
        email: 'usuario@example.com',
        name: 'Usuario de Prueba',
        password: hashedPassword
      }
    });

    console.log('✅ Usuario creado exitosamente:');
    console.log(user);
  } catch (error) {
    console.error('❌ Error al crear usuario:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createUser();
