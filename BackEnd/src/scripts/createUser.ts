import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

async function createUser() {
  try {
    const user = await prisma.user.create({
      data: {
        email: 'usuario@example.com',
        name: 'Usuario de Prueba'
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
