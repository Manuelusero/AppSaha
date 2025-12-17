'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function TrabajaConNosotros() {
  const router = useRouter();

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
            alt="Serco Logo" 
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
      <main className="max-w-5xl mx-auto px-6 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 
            className="mb-6"
            style={{ 
              fontFamily: 'Maitree, serif', 
              fontSize: '48px', 
              fontWeight: 700, 
              color: '#244C87',
              lineHeight: '1.2'
            }}
          >
            Trabaja con Nosotros
          </h1>
          <p 
            className="max-w-3xl mx-auto"
            style={{ 
              fontFamily: 'Maitree, serif', 
              fontSize: '20px', 
              color: '#666',
              lineHeight: '1.8'
            }}
          >
            ¿Te apasiona transformar la forma en que las personas se conectan? Únete a nuestro equipo y ayudanos a construir el futuro del mercado de servicios.
          </p>
        </div>

        {/* Por qué SERCO */}
        <div className="mb-16">
          <h2 
            className="text-center mb-12"
            style={{ 
              fontFamily: 'Maitree, serif', 
              fontSize: '36px', 
              fontWeight: 600, 
              color: '#244C87'
            }}
          >
            ¿Por Qué Trabajar en SERCO?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: '🚀',
                title: 'Impacto Real',
                description: 'Tu trabajo afectará directamente la vida de miles de personas y profesionales en toda Argentina.'
              },
              {
                icon: '💡',
                title: 'Innovación Constante',
                description: 'Trabajamos con las últimas tecnologías y estamos siempre buscando nuevas formas de mejorar.'
              },
              {
                icon: '🌱',
                title: 'Crecimiento Profesional',
                description: 'Fomentamos el aprendizaje continuo y el desarrollo de habilidades en todas las áreas.'
              },
              {
                icon: '🤝',
                title: 'Equipo Colaborativo',
                description: 'Un ambiente de trabajo donde tus ideas son valoradas y tu voz es escuchada.'
              },
              {
                icon: '⚖️',
                title: 'Flexibilidad',
                description: 'Entendemos la importancia del balance entre vida personal y profesional.'
              },
              {
                icon: '🎯',
                title: 'Propósito Claro',
                description: 'Trabajamos por algo más grande: democratizar el acceso a servicios de calidad.'
              }
            ].map((benefit, idx) => (
              <div 
                key={idx}
                className="bg-blue-50 rounded-3xl p-8 hover:shadow-lg transition-shadow"
              >
                <div 
                  className="flex items-center justify-center rounded-full mb-4"
                  style={{ 
                    width: '70px', 
                    height: '70px', 
                    backgroundColor: '#244C87',
                    margin: '0 auto'
                  }}
                >
                  <span style={{ fontSize: '36px' }}>{benefit.icon}</span>
                </div>
                <h3 
                  className="text-center mb-3"
                  style={{ 
                    fontFamily: 'Maitree, serif', 
                    fontSize: '22px', 
                    fontWeight: 600, 
                    color: '#244C87'
                  }}
                >
                  {benefit.title}
                </h3>
                <p 
                  className="text-center"
                  style={{ 
                    fontFamily: 'Maitree, serif', 
                    fontSize: '16px', 
                    color: '#666',
                    lineHeight: '1.6'
                  }}
                >
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Posiciones Abiertas */}
        <div className="mb-16">
          <h2 
            className="text-center mb-12"
            style={{ 
              fontFamily: 'Maitree, serif', 
              fontSize: '36px', 
              fontWeight: 600, 
              color: '#244C87'
            }}
          >
            Posiciones Abiertas
          </h2>

          <div className="space-y-6">
            {[
              {
                title: 'Desarrollador Full Stack',
                area: 'Tecnología',
                type: 'Tiempo completo',
                location: 'Remoto / Buenos Aires',
                description: 'Buscamos un desarrollador con experiencia en React, Node.js y bases de datos para unirse a nuestro equipo técnico.'
              },
              {
                title: 'Diseñador UX/UI',
                area: 'Diseño',
                type: 'Tiempo completo',
                location: 'Remoto / Buenos Aires',
                description: 'Necesitamos alguien apasionado por crear experiencias intuitivas y atractivas para nuestros usuarios.'
              },
              {
                title: 'Community Manager',
                area: 'Marketing',
                type: 'Tiempo completo',
                location: 'Híbrido',
                description: 'Gestiona nuestras redes sociales, crea contenido y conecta con nuestra comunidad de usuarios.'
              },
              {
                title: 'Especialista en Customer Success',
                area: 'Atención al Cliente',
                type: 'Tiempo completo',
                location: 'Remoto',
                description: 'Ayuda a nuestros usuarios y profesionales a tener la mejor experiencia posible en la plataforma.'
              }
            ].map((job, idx) => (
              <div 
                key={idx}
                className="bg-white rounded-3xl p-8 border-2 border-gray-200 hover:border-blue-300 transition-all hover:shadow-lg"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <h3 
                      style={{ 
                        fontFamily: 'Maitree, serif', 
                        fontSize: '24px', 
                        fontWeight: 600, 
                        color: '#244C87',
                        marginBottom: '8px'
                      }}
                    >
                      {job.title}
                    </h3>
                    <div className="flex flex-wrap gap-3 mb-3">
                      <span 
                        className="px-3 py-1 rounded-full text-sm"
                        style={{ 
                          fontFamily: 'Maitree, serif',
                          backgroundColor: '#E8F0FC',
                          color: '#244C87'
                        }}
                      >
                        {job.area}
                      </span>
                      <span 
                        className="px-3 py-1 rounded-full text-sm"
                        style={{ 
                          fontFamily: 'Maitree, serif',
                          backgroundColor: '#E8F0FC',
                          color: '#244C87'
                        }}
                      >
                        {job.type}
                      </span>
                      <span 
                        className="px-3 py-1 rounded-full text-sm"
                        style={{ 
                          fontFamily: 'Maitree, serif',
                          backgroundColor: '#E8F0FC',
                          color: '#244C87'
                        }}
                      >
                        📍 {job.location}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => router.push('/contacto')}
                    className="px-6 py-3 rounded-full transition-all duration-300 whitespace-nowrap"
                    style={{ 
                      fontFamily: 'Maitree, serif', 
                      fontSize: '16px',
                      fontWeight: 500,
                      backgroundColor: '#244C87',
                      color: '#FFFFFF',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    Aplicar
                  </button>
                </div>
                <p 
                  style={{ 
                    fontFamily: 'Maitree, serif', 
                    fontSize: '16px', 
                    color: '#666',
                    lineHeight: '1.6'
                  }}
                >
                  {job.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Proceso de Selección */}
        <div className="mb-16">
          <h2 
            className="text-center mb-12"
            style={{ 
              fontFamily: 'Maitree, serif', 
              fontSize: '36px', 
              fontWeight: 600, 
              color: '#244C87'
            }}
          >
            Nuestro Proceso de Selección
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: '1',
                title: 'Aplicación',
                description: 'Envianos tu CV y contanos por qué querés unirte a SERCO'
              },
              {
                step: '2',
                title: 'Primera Entrevista',
                description: 'Conocemos tu experiencia y hablamos sobre tus expectativas'
              },
              {
                step: '3',
                title: 'Prueba Técnica',
                description: 'Según el rol, puede incluir un desafío práctico'
              },
              {
                step: '4',
                title: 'Entrevista Final',
                description: 'Conoces al equipo y definimos los detalles'
              }
            ].map((step, idx) => (
              <div 
                key={idx}
                className="bg-blue-50 rounded-2xl p-6 text-center"
              >
                <div 
                  className="flex items-center justify-center rounded-full mx-auto mb-4"
                  style={{ 
                    width: '60px', 
                    height: '60px', 
                    backgroundColor: '#244C87',
                    color: '#FFFFFF',
                    fontFamily: 'Maitree, serif',
                    fontSize: '28px',
                    fontWeight: 700
                  }}
                >
                  {step.step}
                </div>
                <h3 
                  className="mb-2"
                  style={{ 
                    fontFamily: 'Maitree, serif', 
                    fontSize: '20px', 
                    fontWeight: 600, 
                    color: '#244C87'
                  }}
                >
                  {step.title}
                </h3>
                <p 
                  style={{ 
                    fontFamily: 'Maitree, serif', 
                    fontSize: '14px', 
                    color: '#666',
                    lineHeight: '1.6'
                  }}
                >
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-blue-50 rounded-3xl p-12 text-center">
          <h2 
            className="mb-4"
            style={{ 
              fontFamily: 'Maitree, serif', 
              fontSize: '32px', 
              fontWeight: 600, 
              color: '#244C87'
            }}
          >
            ¿No encontraste la posición ideal?
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
            Siempre estamos buscando talento excepcional. Envianos tu CV y contanos cómo podrías aportar a SERCO.
          </p>
          <button
            onClick={() => router.push('/contacto')}
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
            Enviar Aplicación Espontánea
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
              alt="Serco Logo" 
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
                  <li><button onClick={() => router.push('/sobre-nosotros')} className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>Sobre nosotros</button></li>
                  <li><button onClick={() => router.push('/trabaja-con-nosotros')} className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>Trabaja con nosotros</button></li>
                  <li><button onClick={() => router.push('/contacto')} className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>Contacto</button></li>
                  <li><button onClick={() => router.push('/prensa')} className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>Prensa</button></li>
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
