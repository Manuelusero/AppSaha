'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Header, Footer } from '@/components/layout';

export default function TrabajaConNosotros() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

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

      <Footer />
    </div>
  );
}
