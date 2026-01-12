'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Header, Footer } from '@/components/layout';
import { colors, typography, spacing } from '@/styles/tokens';

export default function SobreNosotros() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 
            className="mb-6"
            style={{ 
              fontFamily: typography.fontFamily.primary, 
              fontSize: '48px', 
              fontWeight: 700, 
              color: colors.primary.main,
              lineHeight: '1.2'
            }}
          >
            Nuestra Historia
          </h1>
          <p 
            className="max-w-3xl mx-auto"
            style={{ 
              fontFamily: typography.fontFamily.primary, 
              fontSize: '20px', 
              color: '#666',
              lineHeight: '1.8'
            }}
          >
            SERCO nació de una experiencia personal que cambió nuestra forma de ver el mercado de servicios.
          </p>
        </div>

        {/* Story Section */}
        <div className="space-y-12 mb-16">
          {/* El Problema */}
          <div className="bg-blue-50 rounded-3xl p-8 md:p-12">
            <div className="flex items-start gap-6">
              <div 
                className="flex-shrink-0 flex items-center justify-center rounded-full"
                style={{ 
                  width: '60px', 
                  height: '60px', 
                  backgroundColor: 'colors.primary.main'
                }}
              >
                <span style={{ fontSize: '32px' }}>💡</span>
              </div>
              <div>
                <h2 
                  className="mb-4"
                  style={{ 
                    fontFamily: typography.fontFamily.primary, 
                    fontSize: '28px', 
                    fontWeight: 600, 
                    color: colors.primary.main
                  }}
                >
                  El Problema que Identificamos
                </h2>
                <p 
                  style={{ 
                    fontFamily: typography.fontFamily.primary, 
                    fontSize: typography.fontSize.lg, 
                    color: '#666',
                    lineHeight: '1.8'
                  }}
                >
                  Todo comenzó cuando Bren y Manu enfrentaron el desafío de encontrar un plomero confiable 
                  para una emergencia en casa. Después de horas buscando en internet, llamando números sin respuesta 
                  y sin tener forma de verificar la reputación de los profesionales, nos dimos cuenta de que había 
                  un problema enorme: <strong style={{ color: colors.primary.main }}>la desconexión entre las personas que necesitan servicios 
                  y los profesionales capacitados que los ofrecen.</strong>
                </p>
              </div>
            </div>
          </div>

          {/* La Inspiración */}
          <div className="bg-white rounded-3xl p-8 md:p-12 border-2 border-gray-200">
            <div className="flex items-start gap-6">
              <div 
                className="flex-shrink-0 flex items-center justify-center rounded-full"
                style={{ 
                  width: '60px', 
                  height: '60px', 
                  backgroundColor: 'colors.primary.main'
                }}
              >
                <span style={{ fontSize: '32px' }}>🚀</span>
              </div>
              <div>
                <h2 
                  className="mb-4"
                  style={{ 
                    fontFamily: typography.fontFamily.primary, 
                    fontSize: '28px', 
                    fontWeight: 600, 
                    color: colors.primary.main
                  }}
                >
                  Cómo Nació SERCO
                </h2>
                <p 
                  style={{ 
                    fontFamily: typography.fontFamily.primary, 
                    fontSize: typography.fontSize.lg, 
                    color: '#666',
                    lineHeight: '1.8',
                    marginBottom: '16px'
                  }}
                >
                  En 2024, decidimos crear la solución que nosotros mismos necesitábamos. SERCO es una plataforma 
                  que conecta de manera segura y transparente a clientes con profesionales verificados. 
                </p>
                <p 
                  style={{ 
                    fontFamily: typography.fontFamily.primary, 
                    fontSize: typography.fontSize.lg, 
                    color: '#666',
                    lineHeight: '1.8'
                  }}
                >
                  Queríamos democratizar el acceso a servicios de calidad y al mismo tiempo ayudar a profesionales 
                  independientes a hacer crecer sus negocios sin depender únicamente del boca a boca.
                </p>
              </div>
            </div>
          </div>

          {/* La Misión */}
          <div className="bg-blue-50 rounded-3xl p-8 md:p-12">
            <div className="flex items-start gap-6">
              <div 
                className="flex-shrink-0 flex items-center justify-center rounded-full"
                style={{ 
                  width: '60px', 
                  height: '60px', 
                  backgroundColor: 'colors.primary.main'
                }}
              >
                <span style={{ fontSize: '32px' }}>🎯</span>
              </div>
              <div>
                <h2 
                  className="mb-4"
                  style={{ 
                    fontFamily: typography.fontFamily.primary, 
                    fontSize: '28px', 
                    fontWeight: 600, 
                    color: colors.primary.main
                  }}
                >
                  Nuestra Misión
                </h2>
                <p 
                  style={{ 
                    fontFamily: typography.fontFamily.primary, 
                    fontSize: typography.fontSize.lg, 
                    color: '#666',
                    lineHeight: '1.8'
                  }}
                >
                  Construir un ecosistema donde la confianza sea la base de cada interacción. Queremos que cada 
                  persona pueda encontrar el profesional que necesita con la tranquilidad de saber que está en 
                  buenas manos, y que cada profesional pueda desarrollar su carrera con dignidad y reconocimiento.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Valores */}
        <div className="mb-16">
          <h2 
            className="text-center mb-12"
            style={{ 
              fontFamily: typography.fontFamily.primary, 
              fontSize: '36px', 
              fontWeight: 600, 
              color: colors.primary.main
            }}
          >
            Nuestros Valores
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: '🤝',
                title: 'Confianza',
                description: 'Verificamos cada profesional y protegemos cada transacción para garantizar seguridad en ambos lados.'
              },
              {
                icon: '💎',
                title: 'Transparencia',
                description: 'Precios claros, reseñas auténticas y comunicación directa entre clientes y profesionales.'
              },
              {
                icon: '🌟',
                title: 'Calidad',
                description: 'Conectamos solo con profesionales calificados que cumplen nuestros estándares de excelencia.'
              },
              {
                icon: '🚀',
                title: 'Innovación',
                description: 'Mejoramos constantemente nuestra plataforma para ofrecer la mejor experiencia posible.'
              }
            ].map((valor, idx) => (
              <div 
                key={idx}
                className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div 
                  className="flex items-center justify-center rounded-full mx-auto mb-4"
                  style={{ 
                    width: '80px', 
                    height: '80px', 
                    backgroundColor: '#E8F0FC'
                  }}
                >
                  <span style={{ fontSize: '40px' }}>{valor.icon}</span>
                </div>
                <h3 
                  className="text-center mb-3"
                  style={{ 
                    fontFamily: typography.fontFamily.primary, 
                    fontSize: '24px', 
                    fontWeight: 600, 
                    color: colors.primary.main
                  }}
                >
                  {valor.title}
                </h3>
                <p 
                  className="text-center"
                  style={{ 
                    fontFamily: typography.fontFamily.primary, 
                    fontSize: typography.fontSize.base, 
                    color: '#666',
                    lineHeight: '1.6'
                  }}
                >
                  {valor.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Equipo */}
        <div className="mb-16">
          <h2 
            className="text-center mb-12"
            style={{ 
              fontFamily: typography.fontFamily.primary, 
              fontSize: '36px', 
              fontWeight: 600, 
              color: colors.primary.main
            }}
          >
            El Equipo Fundador
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                name: 'Brenda',
                role: 'Co-fundadora',
                description: 'Apasionada por crear soluciones que mejoren la vida de las personas.'
              },
              {
                name: 'Manuel',
                role: 'Co-fundador',
                description: 'Dedicado a construir tecnología que conecte y empodere comunidades.'
              }
            ].map((member, idx) => (
              <div 
                key={idx}
                className="bg-blue-50 rounded-3xl p-8 text-center"
              >
                <div 
                  className="mx-auto mb-6 rounded-full"
                  style={{ 
                    width: '120px', 
                    height: '120px', 
                    backgroundColor: 'colors.primary.main'
                  }}
                >
                  {/* Placeholder para foto */}
                </div>
                <h3 
                  style={{ 
                    fontFamily: typography.fontFamily.primary, 
                    fontSize: '24px', 
                    fontWeight: 600, 
                    color: colors.primary.main,
                    marginBottom: '8px'
                  }}
                >
                  {member.name}
                </h3>
                <p 
                  style={{ 
                    fontFamily: typography.fontFamily.primary, 
                    fontSize: typography.fontSize.base, 
                    fontWeight: 500, 
                    color: colors.primary.main,
                    marginBottom: '12px'
                  }}
                >
                  {member.role}
                </p>
                <p 
                  style={{ 
                    fontFamily: typography.fontFamily.primary, 
                    fontSize: typography.fontSize.base, 
                    color: '#666',
                    lineHeight: '1.6'
                  }}
                >
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Final */}
        <div className="bg-blue-50 rounded-3xl p-12 text-center">
          <h2 
            className="mb-4"
            style={{ 
              fontFamily: typography.fontFamily.primary, 
              fontSize: '32px', 
              fontWeight: 600, 
              color: colors.primary.main
            }}
          >
            ¿Querés ser parte de SERCO?
          </h2>
          <p 
            className="mb-8 max-w-2xl mx-auto"
            style={{ 
              fontFamily: typography.fontFamily.primary, 
              fontSize: typography.fontSize.lg, 
              color: '#666',
              lineHeight: '1.6'
            }}
          >
            Ya sea que necesites un servicio o quieras ofrecer tu trabajo, estamos acá para ayudarte.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => router.push('/')}
              className="px-8 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
              style={{ 
                fontFamily: typography.fontFamily.primary, 
                fontSize: typography.fontSize.lg,
                fontWeight: 500,
                backgroundColor: 'colors.primary.main',
                color: '#FFFFFF',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Buscar Servicios
            </button>
            <button
              onClick={() => router.push('/provider-signup')}
              className="px-8 py-4 rounded-full transition-all duration-300 border-2"
              style={{ 
                fontFamily: typography.fontFamily.primary, 
                fontSize: typography.fontSize.lg,
                fontWeight: 500,
                backgroundColor: 'transparent',
                color: colors.primary.main,
                borderColor: 'colors.primary.main',
                cursor: 'pointer'
              }}
            >
              Ofrecer Servicios
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
