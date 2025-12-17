'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

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
        comment: 'SAHA cambió mi negocio por completo. Antes dependía del boca a boca y pasaba semanas sin trabajos. Ahora tengo mi agenda llena y puedo elegir los trabajos que más me convienen. La plataforma es súper fácil de usar.',
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
        comment: 'Lo mejor de SAHA es que me permitió independizarme. Trabajaba para una empresa y ahora tengo mi propio negocio. Los clientes confían en mí porque ven mis verificaciones y reseñas. Mis ingresos aumentaron un 60%.',
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
        comment: 'Como mujer trabajando sola, la seguridad era mi mayor preocupación. SAHA verifica a los clientes y me da tranquilidad. Además, el sistema de pagos seguros me evita problemas de cobro. Es la mejor decisión que tomé.',
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
        comment: 'Empecé con SAHA como un ingreso extra y ahora es mi trabajo principal. La plataforma me conecta con clientes de toda la zona que nunca hubiera alcanzado por mi cuenta. El soporte técnico siempre responde rápido.',
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
        comment: 'SAHA me ayudó a construir mi reputación desde cero. Cada trabajo bien hecho se refleja en las reseñas y eso atrae más clientes. Ya no tengo que andar repartiendo volantes, los clientes me encuentran solos.',
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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header 
        className="px-6 py-4 flex items-center justify-between"
        style={{ 
          background: 'linear-gradient(180deg, rgba(36, 76, 135, 0.8) 0%, rgba(255, 252, 249, 0.8) 100%)',
          height: '150px'
        }}
      >
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
          <Image 
            src="/Logo.png" 
            alt="SaHa Logo" 
            width={120} 
            height={40}
            className="h-10 w-auto"
            priority
          />
        </div>
        <button
          onClick={() => router.push('/provider-signup')}
          className="px-6 py-2 rounded-full border-2 transition-colors"
          style={{ 
            fontFamily: 'Maitree, serif',
            fontSize: '16px',
            borderColor: '#244C87',
            color: '#244C87',
            backgroundColor: 'transparent',
            cursor: 'pointer'
          }}
        >
          Espacio del trabajador
        </button>
      </header>

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
          Conocé las historias reales de profesionales que transformaron sus negocios usando SAHA. 
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
                          Meses en SAHA
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

      {/* Footer */}
      <footer className="w-full text-white mt-20">
        <div className="w-full bg-[#244C87]" style={{ height: '60px' }}></div>
        
        <div className="w-full bg-white py-8">
          <div className="flex justify-center">
            <Image 
              src="/Logo.png" 
              alt="SaHa Logo" 
              width={484} 
              height={134}
              className="w-auto"
              style={{ maxWidth: '484px', height: 'auto' }}
            />
          </div>
        </div>

        <div className="w-full bg-[#244C87] py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-center mb-16" style={{ gap: '86px' }}>
              <a href="#" className="hover:opacity-80 transition-opacity">
                <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a href="#" className="hover:opacity-80 transition-opacity">
                <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                </svg>
              </a>
              <a href="#" className="hover:opacity-80 transition-opacity">
                <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                </svg>
              </a>
              <a href="#" className="hover:opacity-80 transition-opacity">
                <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16 text-center">
              <div>
                <h3 className="mb-6" style={{ fontFamily: 'Maitree, serif', fontWeight: 400, fontSize: '24px' }}>Para Clientes</h3>
                <ul className="space-y-3">
                  <li><button onClick={() => router.push('/#buscar-servicios')} className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>Buscar Servidores</button></li>
                  <li><button onClick={() => router.push('/#como-funciona')} className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>¿Cómo Funciona?</button></li>
                  <li><button onClick={() => router.push('/seguridad-confianza')} className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>Seguridad y Confianza</button></li>
                  <li><button onClick={() => router.push('/ayuda')} className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>Ayuda</button></li>
                </ul>
              </div>

              <div>
                <h3 className="mb-6" style={{ fontFamily: 'Maitree, serif', fontWeight: 400, fontSize: '24px' }}>Para Proveedores</h3>
                <ul className="space-y-3">
                  <li><button onClick={() => router.push('/provider-signup')} className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>Sumate como proveedor</button></li>
                  <li><button onClick={() => router.push('/experiencias')} className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>Experiencias</button></li>
                  <li><button onClick={() => router.push('/recursos')} className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>Recursos útiles</button></li>
                  <li><button onClick={() => router.push('/soporte-proveedores')} className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>Soporte Proveedores</button></li>
                </ul>
              </div>

              <div>
                <h3 className="mb-6" style={{ fontFamily: 'Maitree, serif', fontWeight: 400, fontSize: '24px' }}>Empresa</h3>
                <ul className="space-y-3">
                  <li><a href="#" className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontSize: '16px' }}>Sobre nosotros</a></li>
                  <li><a href="#" className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontSize: '16px' }}>Trabaja con nosotros</a></li>
                  <li><a href="#" className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontSize: '16px' }}>Contacto</a></li>
                  <li><a href="#" className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontSize: '16px' }}>Prensa</a></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-white/30 mb-8"></div>

            <div className="text-center">
              <p style={{ fontFamily: 'Maitree, serif', fontStyle: 'italic', fontSize: '16px' }}>Creado por Bren y Manu</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
