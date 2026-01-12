'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Header, Footer } from '@/components/layout';

interface Experience {
  id: string;
  providerName: string;
  providerImage: string;
  serviceType: string;
  rating: number;
  comment: string;
  date: string;
  location: string;
  clientsServed: number;
  monthsActive: number;
}

export default function Experiencias() {
  const router = useRouter();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Cargar experiencias desde la API
    // Por ahora, datos de ejemplo
    const mockExperiences: Experience[] = [
      {
        id: '1',
        providerName: 'Juan Pérez',
        providerImage: '/Frame16.png',
        serviceType: 'Plomería',
        rating: 5,
        comment: 'SERCO cambió mi negocio por completo. Antes dependía del boca a boca y pasaba semanas sin trabajos. Ahora tengo mi agenda llena y puedo elegir los trabajos que más me convienen. La plataforma es súper fácil de usar.',
        date: 'Miembro desde Marzo 2024',
        location: 'Buenos Aires',
        clientsServed: 127,
        monthsActive: 9
      },
      {
        id: '2',
        providerName: 'Carlos Martínez',
        providerImage: '/Frame16.png',
        serviceType: 'Electricidad',
        rating: 5,
        comment: 'Lo mejor de SERCO es que me permitió independizarme. Trabajaba para una empresa y ahora tengo mi propio negocio. Los clientes confían en mí porque ven mis verificaciones y reseñas. Mis ingresos aumentaron un 60%.',
        date: 'Miembro desde Junio 2024',
        location: 'Córdoba',
        clientsServed: 89,
        monthsActive: 6
      },
      {
        id: '3',
        providerName: 'Ana López',
        providerImage: '/Frame16.png',
        serviceType: 'Limpieza',
        rating: 5,
        comment: 'Como mujer trabajando sola, la seguridad era mi mayor preocupación. SERCO verifica a los clientes y me da tranquilidad. Además, el sistema de pagos seguros me evita problemas de cobro. Es la mejor decisión que tomé.',
        date: 'Miembro desde Enero 2024',
        location: 'Rosario',
        clientsServed: 156,
        monthsActive: 11
      },
      {
        id: '4',
        providerName: 'Roberto Silva',
        providerImage: '/Frame16.png',
        serviceType: 'Jardinería',
        rating: 5,
        comment: 'Empecé con SERCO como un ingreso extra y ahora es mi trabajo principal. La plataforma me conecta con clientes de toda la zona que nunca hubiera alcanzado por mi cuenta. El soporte técnico siempre responde rápido.',
        date: 'Miembro desde Agosto 2024',
        location: 'Mendoza',
        clientsServed: 73,
        monthsActive: 4
      },
      {
        id: '5',
        providerName: 'María Fernández',
        providerImage: '/Frame16.png',
        serviceType: 'Pintura',
        rating: 5,
        comment: 'SERCO me ayudó a construir mi reputación desde cero. Cada trabajo bien hecho se refleja en las reseñas y eso atrae más clientes. Ya no tengo que andar repartiendo volantes, los clientes me encuentran solos.',
        date: 'Miembro desde Abril 2024',
        location: 'La Plata',
        clientsServed: 94,
        monthsActive: 8
      },
      {
        id: '6',
        providerName: 'Diego Ramírez',
        providerImage: '/Frame16.png',
        serviceType: 'Carpintería',
        rating: 5,
        comment: 'Lo que más valoro es la transparencia. Los clientes saben lo que van a pagar desde el principio y yo sé qué esperar. No hay malentendidos. Además, las herramientas para gestionar presupuestos son excelentes.',
        date: 'Miembro desde Mayo 2024',
        location: 'Santa Fe',
        clientsServed: 61,
        monthsActive: 7
      }
    ];

    setTimeout(() => {
      setExperiences(mockExperiences);
      setLoading(false);
    }, 500);
  }, []);

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, idx) => (
      <svg
        key={idx}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill={idx < rating ? '#FFC107' : 'none'}
        stroke={idx < rating ? '#FFC107' : '#D1D5DB'}
        strokeWidth="2"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ));
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-16">
        {/* Título principal */}
        <h1 
          className="text-center mb-6"
          style={{ 
            fontFamily: 'Maitree, serif', 
            fontSize: '48px', 
            fontWeight: 700, 
            color: '#244C87',
            lineHeight: '1.2'
          }}
        >
          Experiencias de Nuestros Proveedores
        </h1>

        <p 
          className="text-center mb-12 max-w-3xl mx-auto"
          style={{ 
            fontFamily: 'Maitree, serif', 
            fontSize: '18px', 
            color: '#666',
            lineHeight: '1.6'
          }}
        >
          Conocé las historias reales de profesionales que transformaron sus negocios usando SERCO. 
          Descubrí cómo nuestra plataforma les ayudó a conseguir más clientes y hacer crecer sus ingresos.
        </p>

        {/* Grid de experiencias */}
        {loading ? (
          <div className="text-center py-12">
            <p style={{ fontFamily: 'Maitree, serif', fontSize: '20px', color: '#244C87' }}>
              Cargando experiencias...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {experiences.map((exp) => (
              <div 
                key={exp.id}
                className="bg-white rounded-3xl overflow-hidden border-2 border-gray-200 hover:shadow-xl transition-all duration-300"
                style={{ height: 'auto' }}
              >
                {/* Header de la tarjeta con info del proveedor */}
                <div className="p-6 bg-blue-50">
                  <div className="flex items-center gap-4 mb-4">
                    <div 
                      style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        border: '3px solid #244C87'
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={exp.providerImage}
                        alt={exp.providerName}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <div>
                      <h3 
                        style={{ 
                          fontFamily: 'Maitree, serif', 
                          fontSize: '20px', 
                          fontWeight: 600, 
                          color: '#244C87',
                          marginBottom: '4px'
                        }}
                      >
                        {exp.providerName}
                      </h3>
                      <p 
                        style={{ 
                          fontFamily: 'Maitree, serif', 
                          fontSize: '14px', 
                          color: '#666'
                        }}
                      >
                        {exp.serviceType}
                      </p>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-2">
                    {renderStars(exp.rating)}
                  </div>
                </div>

                {/* Contenido del comentario */}
                <div className="p-6">
                  <p 
                    style={{ 
                      fontFamily: 'Maitree, serif', 
                      fontSize: '16px', 
                      color: '#333',
                      lineHeight: '1.6',
                      marginBottom: '16px'
                    }}
                  >
                    &ldquo;{exp.comment}&rdquo;
                  </p>

                  {/* Estadísticas del proveedor */}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div className="text-center bg-blue-50 rounded-xl p-3">
                        <p 
                          style={{ 
                            fontFamily: 'Maitree, serif', 
                            fontSize: '24px', 
                            fontWeight: 700, 
                            color: '#244C87'
                          }}
                        >
                          {exp.clientsServed}
                        </p>
                        <p 
                          style={{ 
                            fontFamily: 'Maitree, serif', 
                            fontSize: '12px', 
                            color: '#666'
                          }}
                        >
                          Clientes atendidos
                        </p>
                      </div>
                      <div className="text-center bg-blue-50 rounded-xl p-3">
                        <p 
                          style={{ 
                            fontFamily: 'Maitree, serif', 
                            fontSize: '24px', 
                            fontWeight: 700, 
                            color: '#244C87'
                          }}
                        >
                          {exp.monthsActive}
                        </p>
                        <p 
                          style={{ 
                            fontFamily: 'Maitree, serif', 
                            fontSize: '12px', 
                            color: '#666'
                          }}
                        >
                          Meses en SERCO
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm" style={{ color: '#999' }}>
                      <span style={{ fontFamily: 'Maitree, serif' }}>
                        📍 {exp.location}
                      </span>
                      <span style={{ fontFamily: 'Maitree, serif', fontSize: '12px' }}>
                        {exp.date}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Call to action */}
        <div className="mt-16 text-center bg-blue-50 rounded-3xl p-12">
          <h2 
            className="mb-4"
            style={{ 
              fontFamily: 'Maitree, serif', 
              fontSize: '32px', 
              fontWeight: 600, 
              color: '#244C87'
            }}
          >
            ¿Querés formar parte de estas historias de éxito?
          </h2>
          <p 
            className="mb-8 max-w-2xl mx-auto"
            style={{ 
              fontFamily: 'Maitree, serif', 
              fontSize: '18px', 
              color: '#666',
              lineHeight: '1.6'
            }}
          >
            Uníte a nuestra comunidad de profesionales y comenzá a crecer tu negocio hoy mismo.
          </p>
          <button
            onClick={() => router.push('/provider-signup')}
            className="px-12 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
            style={{ 
              fontFamily: 'Maitree, serif', 
              fontSize: '20px',
              fontWeight: 500,
              backgroundColor: '#244C87',
              color: '#FFFFFF',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Registrate como Proveedor
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
