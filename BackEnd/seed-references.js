// Script para agregar referencias de ejemplo a los profesionales
import { PrismaClient } from './src/generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Agregando referencias a los profesionales...');

    try {
        // Obtener todos los proveedores
        const providers = await prisma.user.findMany({
            where: {
                role: 'PROVIDER'
            },
            include: {
                providerProfile: true
            }
        });

        console.log(`✅ Encontrados ${providers.length} proveedores`);

        for (const provider of providers) {
            if (!provider.providerProfile) continue;

            // Crear 2-3 referencias para cada proveedor
            const referencesToCreate = [
                {
                    providerId: provider.providerProfile.id,
                    name: 'María González',
                    phone: '+54 11 9876-5432',
                    relationship: 'Cliente - Proyecto residencial'
                },
                {
                    providerId: provider.providerProfile.id,
                    name: 'Carlos Pérez',
                    phone: '+54 11 5555-4444',
                    relationship: 'Cliente - Oficinas comerciales'
                },
                {
                    providerId: provider.providerProfile.id,
                    name: 'Ana Martínez',
                    phone: '+54 11 3333-2222',
                    relationship: 'Empleador anterior'
                }
            ];

            // Crear referencias
            for (const ref of referencesToCreate) {
                await prisma.providerReference.create({
                    data: ref
                });
            }

            console.log(`  ✅ Referencias agregadas para ${provider.name}`);
        }

        // Agregar algunas fotos de trabajo de ejemplo
        for (const provider of providers) {
            if (!provider.providerProfile) continue;

            const workPhotos = [
                '/Rectangle7.png',
                '/Rectangle8.png'
            ]; await prisma.providerProfile.update({
                where: { id: provider.providerProfile.id },
                data: {
                    workPhotos: JSON.stringify(workPhotos),
                    bio: `Profesional con amplia experiencia en ${provider.providerProfile.serviceCategory.toLowerCase()}. Trabajo con dedicación y compromiso, garantizando la satisfacción del cliente.`,
                    instagram: '@profesional_' + provider.name.toLowerCase().replace(' ', '_'),
                    website: 'www.profesional' + provider.name.toLowerCase().replace(' ', '') + '.com.ar'
                }
            });

            console.log(`  ✅ Fotos y bio actualizadas para ${provider.name}`);
        }

        console.log('🎉 ¡Referencias y datos adicionales agregados exitosamente!');

    } catch (error) {
        console.error('❌ Error al agregar referencias:', error);
        throw error;
    }
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
