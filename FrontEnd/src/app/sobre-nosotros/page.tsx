'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function SobreNosotros() {
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
        {/* Hero Section */}
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
            Nuestra Historia
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
                  backgroundColor: '#244C87'
                }}
              >
                <span style={{ fontSize: '32px' }}>💡</span>
              </div>
              <div>
                <h2 
                  className="mb-4"
                  style={{ 
                    fontFamily: 'Maitree, serif', 
                    fontSize: '28px', 
                    fontWeight: 600, 
                    color: '#244C87'
                  }}
                >
                  El Problema que Identificamos
                </h2>
                <p 
                  style={{ 
                    fontFamily: 'Maitree, serif', 
                    fontSize: '18px', 
                    color: '#666',
                    lineHeight: '1.8'
                  }}
                >
                  Todo comenzó cuando Bren y Manu enfrentaron el desafío de encontrar un plomero confiable 
                  para una emergencia en casa. Después de horas buscando en internet, llamando números sin respuesta 
                  y sin tener forma de verificar la reputación de los profesionales, nos dimos cuenta de que había 
                  un problema enorme: <strong style={{ color: '#244C87' }}>la desconexión entre las personas que necesitan servicios 
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
                  backgroundColor: '#244C87'
                }}
              >
                <span style={{ fontSize: '32px' }}>🚀</span>
              </div>
              <div>
                <h2 
                  className="mb-4"
                  style={{ 
                    fontFamily: 'Maitree, serif', 
                    fontSize: '28px', 
                    fontWeight: 600, 
                    color: '#244C87'
                  }}
                >
                  Cómo Nació SERCO
                </h2>
                <p 
                  style={{ 
                    fontFamily: 'Maitree, serif', 
                    fontSize: '18px', 
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
                    fontFamily: 'Maitree, serif', 
                    fontSize: '18px', 
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
                  backgroundColor: '#244C87'
                }}
              >
                <span style={{ fontSize: '32px' }}>🎯</span>
              </div>
              <div>
                <h2 
                  className="mb-4"
                  style={{ 
                    fontFamily: 'Maitree, serif', 
                    fontSize: '28px', 
                    fontWeight: 600, 
                    color: '#244C87'
                  }}
                >
                  Nuestra Misión
                </h2>
                <p 
                  style={{ 
                    fontFamily: 'Maitree, serif', 
                    fontSize: '18px', 
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
              fontFamily: 'Maitree, serif', 
              fontSize: '36px', 
              fontWeight: 600, 
              color: '#244C87'
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
                    fontFamily: 'Maitree, serif', 
                    fontSize: '24px', 
                    fontWeight: 600, 
                    color: '#244C87'
                  }}
                >
                  {valor.title}
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
              fontFamily: 'Maitree, serif', 
              fontSize: '36px', 
              fontWeight: 600, 
              color: '#244C87'
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
                    backgroundColor: '#244C87'
                  }}
                >
                  {/* Placeholder para foto */}
                </div>
                <h3 
                  style={{ 
                    fontFamily: 'Maitree, serif', 
                    fontSize: '24px', 
                    fontWeight: 600, 
                    color: '#244C87',
                    marginBottom: '8px'
                  }}
                >
                  {member.name}
                </h3>
                <p 
                  style={{ 
                    fontFamily: 'Maitree, serif', 
                    fontSize: '16px', 
                    fontWeight: 500, 
                    color: '#244C87',
                    marginBottom: '12px'
                  }}
                >
                  {member.role}
                </p>
                <p 
                  style={{ 
                    fontFamily: 'Maitree, serif', 
                    fontSize: '16px', 
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
              fontFamily: 'Maitree, serif', 
              fontSize: '32px', 
              fontWeight: 600, 
              color: '#244C87'
            }}
          >
            ¿Querés ser parte de SERCO?
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
            Ya sea que necesites un servicio o quieras ofrecer tu trabajo, estamos acá para ayudarte.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => router.push('/')}
              className="px-8 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
              style={{ 
                fontFamily: 'Maitree, serif', 
                fontSize: '18px',
                fontWeight: 500,
                backgroundColor: '#244C87',
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
                fontFamily: 'Maitree, serif', 
                fontSize: '18px',
                fontWeight: 500,
                backgroundColor: 'transparent',
                color: '#244C87',
                borderColor: '#244C87',
                cursor: 'pointer'
              }}
            >
              Ofrecer Servicios
            </button>
          </div>
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
