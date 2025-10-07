import { PrismaClient } from './src/generated/prisma/index.js';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createTestData() {
    try {
        // Obtener cliente existente
        const clients = await prisma.user.findMany({
            where: { role: 'CLIENT' },
            take: 1
        });

        if (clients.length === 0) {
            console.log('❌ No hay clientes. Regístrate primero como cliente.');
            return;
        }

        const client = clients[0];
        console.log('✅ Cliente encontrado:', client.name);

        // Buscar o crear proveedor
        let provider = await prisma.providerProfile.findFirst({
            include: { user: true }
        });

        if (!provider) {
            const hashedPassword = await bcrypt.hash('123456', 10);
            const providerUser = await prisma.user.create({
                data: {
                    email: 'manuel.gonzales@test.com',
                    password: hashedPassword,
                    name: 'manuel gonzales',
                    phone: '555-1234',
                    role: 'PROVIDER'
                }
            });

            provider = await prisma.providerProfile.create({
                data: {
                    userId: providerUser.id,
                    serviceCategory: 'JARDINERIA',
                    serviceDescription: 'Servicio profesional de jardinería y poda',
                    experience: 5,
                    pricePerHour: 50,
                    location: 'Ciudad de México',
                    isAvailable: true
                },
                include: { user: true }
            });
            console.log('✅ Proveedor creado:', provider.user.name);
        } else {
            console.log('✅ Proveedor existente:', provider.user.name);
        }

        // Crear booking COMPLETADO para poder calificarlo
        const booking = await prisma.booking.create({
            data: {
                clientId: client.id,
                providerId: provider.id,
                serviceDate: new Date('2025-10-05'),
                serviceTime: '10:00 AM',
                description: 'Cortar el césped y podar árboles',
                address: 'Av. Principal 123',
                status: 'COMPLETED',
                totalPrice: 150,
                estimatedHours: 3,
                completedAt: new Date()
            }
        });

        console.log('\n🎉 ¡Listo! Booking completado creado:');
        console.log('   ID:', booking.id);
        console.log('   Servicio:', booking.description);
        console.log('   Estado: COMPLETED');
        console.log('\n📍 Próximo paso:');
        console.log('   Ve a http://localhost:3000/dashboard-client');
        console.log('   Verás el servicio con botón "⭐ Calificar Servicio"');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createTestData();
