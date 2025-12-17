'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function SeguridadConfianza() {
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
      <main className="max-w-5xl mx-auto px-6 py-16">
        {/* Título principal */}
        <h1 
          className="text-center mb-12"
          style={{ 
            fontFamily: 'Maitree, serif', 
            fontSize: '48px', 
            fontWeight: 700, 
            color: '#244C87',
            lineHeight: '1.2'
          }}
        >
          Seguridad y Confianza
        </h1>

        <div className="space-y-12">
          {/* Sección 1: Verificación de profesionales */}
          <div className="bg-blue-50 rounded-3xl p-8">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#244C87' }}
                >
                  <svg width="32" height="32" fill="white" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h2 
                  className="mb-4"
                  style={{ 
                    fontFamily: 'Maitree, serif', 
                    fontSize: '28px', 
                    fontWeight: 600, 
                    color: '#244C87'
                  }}
                >
                  Verificación de Profesionales
                </h2>
                <p 
                  style={{ 
                    fontFamily: 'Maitree, serif', 
                    fontSize: '18px', 
                    color: '#333',
                    lineHeight: '1.6'
                  }}
                >
                  Todos los profesionales que forman parte de nuestra plataforma pasan por un riguroso proceso de verificación. 
                  Validamos su identidad, credenciales profesionales y antecedentes para garantizar que solo trabajen con vos 
                  los mejores en su rubro. Tu seguridad es nuestra prioridad.
                </p>
              </div>
            </div>
          </div>

          {/* Sección 2: Reseñas verificadas */}
          <div className="bg-blue-50 rounded-3xl p-8">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#244C87' }}
                >
                  <svg width="32" height="32" fill="white" viewBox="0 0 24 24">
                    <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h2 
                  className="mb-4"
                  style={{ 
                    fontFamily: 'Maitree, serif', 
                    fontSize: '28px', 
                    fontWeight: 600, 
                    color: '#244C87'
                  }}
                >
                  Reseñas Verificadas
                </h2>
                <p 
                  style={{ 
                    fontFamily: 'Maitree, serif', 
                    fontSize: '18px', 
                    color: '#333',
                    lineHeight: '1.6'
                  }}
                >
                  Todas las reseñas y calificaciones que ves en nuestra plataforma provienen de clientes reales que completaron 
                  trabajos con nuestros profesionales. No permitimos reseñas falsas ni manipuladas, para que puedas tomar 
                  decisiones informadas basadas en experiencias genuinas de otros usuarios.
                </p>
              </div>
            </div>
          </div>

          {/* Sección 3: Pagos seguros */}
          <div className="bg-blue-50 rounded-3xl p-8">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#244C87' }}
                >
                  <svg width="32" height="32" fill="white" viewBox="0 0 24 24">
                    <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h2 
                  className="mb-4"
                  style={{ 
                    fontFamily: 'Maitree, serif', 
                    fontSize: '28px', 
                    fontWeight: 600, 
                    color: '#244C87'
                  }}
                >
                  Transacciones Seguras
                </h2>
                <p 
                  style={{ 
                    fontFamily: 'Maitree, serif', 
                    fontSize: '18px', 
                    color: '#333',
                    lineHeight: '1.6'
                  }}
                >
                  Utilizamos tecnología de encriptación de última generación para proteger tus datos personales y financieros. 
                  Tus pagos están respaldados por sistemas seguros que cumplen con los más altos estándares internacionales de 
                  seguridad. Nunca compartimos tu información con terceros sin tu consentimiento.
                </p>
              </div>
            </div>
          </div>

          {/* Sección 4: Soporte 24/7 */}
          <div className="bg-blue-50 rounded-3xl p-8">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#244C87' }}
                >
                  <svg width="32" height="32" fill="white" viewBox="0 0 24 24">
                    <path d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"/>
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h2 
                  className="mb-4"
                  style={{ 
                    fontFamily: 'Maitree, serif', 
                    fontSize: '28px', 
                    fontWeight: 600, 
                    color: '#244C87'
                  }}
                >
                  Soporte Continuo
                </h2>
                <p 
                  style={{ 
                    fontFamily: 'Maitree, serif', 
                    fontSize: '18px', 
                    color: '#333',
                    lineHeight: '1.6'
                  }}
                >
                  Nuestro equipo de soporte está disponible para ayudarte cuando lo necesites. Si tenés algún problema o 
                  inquietud durante el proceso de contratación o ejecución del servicio, estamos acá para mediar y asegurar 
                  que tu experiencia sea positiva. Tu satisfacción es nuestra meta.
                </p>
              </div>
            </div>
          </div>

          {/* Sección 5: Garantía de calidad */}
          <div className="bg-blue-50 rounded-3xl p-8">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#244C87' }}
                >
                  <svg width="32" height="32" fill="white" viewBox="0 0 24 24">
                    <path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/>
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h2 
                  className="mb-4"
                  style={{ 
                    fontFamily: 'Maitree, serif', 
                    fontSize: '28px', 
                    fontWeight: 600, 
                    color: '#244C87'
                  }}
                >
                  Garantía de Satisfacción
                </h2>
                <p 
                  style={{ 
                    fontFamily: 'Maitree, serif', 
                    fontSize: '18px', 
                    color: '#333',
                    lineHeight: '1.6'
                  }}
                >
                  Trabajamos constantemente para mejorar la calidad del servicio en nuestra plataforma. Si no estás satisfecho 
                  con el trabajo realizado, contamos con políticas claras de resolución de conflictos. Nos comprometemos a 
                  encontrar soluciones justas para todas las partes involucradas.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="mt-16 text-center">
          <button
            onClick={() => router.push('/')}
            className="px-12 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
            style={{ 
              fontFamily: 'Maitree, serif', 
              fontSize: '20px',
              fontWeight: 500,
              backgroundColor: '#244C87',
              color: '#FFFFFF'
            }}
          >
            Volver al inicio
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
            {/* Iconos de redes sociales */}
            <div className="flex justify-center mb-16" style={{ gap: '86px', paddingLeft: '49.05px', paddingRight: '49.05px' }}>
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

            {/* Navegación en 3 columnas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16 text-center">
              {/* Para Clientes */}
              <div>
                <h3 className="mb-6" style={{ fontFamily: 'Maitree, serif', fontWeight: 400, fontSize: '24px', lineHeight: '100%', letterSpacing: '0%', textAlign: 'center' }}>Para Clientes</h3>
                <ul className="space-y-3">
                  <li><a href="/#buscar-servicios" className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontWeight: 400, fontSize: '16px', lineHeight: '100%', letterSpacing: '0%', textAlign: 'center' }}>Buscar Servidores</a></li>
                  <li><a href="/#como-funciona" className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontWeight: 400, fontSize: '16px', lineHeight: '100%', letterSpacing: '0%', textAlign: 'center' }}>¿Cómo Funciona?</a></li>
                  <li><a href="/seguridad-confianza" className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontWeight: 400, fontSize: '16px', lineHeight: '100%', letterSpacing: '0%', textAlign: 'center' }}>Seguridad y Confianza</a></li>
                  <li><a href="/ayuda" className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontWeight: 400, fontSize: '16px', lineHeight: '100%', letterSpacing: '0%', textAlign: 'center' }}>Ayuda</a></li>
                </ul>
              </div>

              {/* Para Proveedores */}
              <div>
                <h3 className="mb-6" style={{ fontFamily: 'Maitree, serif', fontWeight: 400, fontSize: '24px', lineHeight: '100%', letterSpacing: '0%', textAlign: 'center' }}>Para Proveedores</h3>
                <ul className="space-y-3">
                  <li><a href="/provider-signup" className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontWeight: 400, fontSize: '16px', lineHeight: '100%', letterSpacing: '0%', textAlign: 'center' }}>Sumate como proveedor</a></li>
                  <li><a href="/experiencias" className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontWeight: 400, fontSize: '16px', lineHeight: '100%', letterSpacing: '0%', textAlign: 'center' }}>Experiencias</a></li>
                  <li><a href="/recursos" className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontWeight: 400, fontSize: '16px', lineHeight: '100%', letterSpacing: '0%', textAlign: 'center' }}>Recursos útiles</a></li>
                  <li><a href="/soporte-proveedores" className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontWeight: 400, fontSize: '16px', lineHeight: '100%', letterSpacing: '0%', textAlign: 'center' }}>Soporte Proveedores</a></li>
                </ul>
              </div>

              {/* Empresa */}
              <div>
                <h3 className="mb-6" style={{ fontFamily: 'Maitree, serif', fontWeight: 400, fontSize: '24px', lineHeight: '100%', letterSpacing: '0%', textAlign: 'center' }}>Empresa</h3>
                <ul className="space-y-3">
                  <li><a href="#" className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontWeight: 400, fontSize: '16px', lineHeight: '100%', letterSpacing: '0%', textAlign: 'center' }}>Sobre nosotros</a></li>
                  <li><a href="#" className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontWeight: 400, fontSize: '16px', lineHeight: '100%', letterSpacing: '0%', textAlign: 'center' }}>Trabaja con nosotros</a></li>
                  <li><a href="#" className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontWeight: 400, fontSize: '16px', lineHeight: '100%', letterSpacing: '0%', textAlign: 'center' }}>Contacto</a></li>
                  <li><a href="#" className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontWeight: 400, fontSize: '16px', lineHeight: '100%', letterSpacing: '0%', textAlign: 'center' }}>Prensa</a></li>
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
