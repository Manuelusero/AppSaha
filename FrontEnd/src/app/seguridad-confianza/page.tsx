'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Header, Footer } from '@/components/layout';
import { colors, typography, spacing } from '@/styles/tokens';

export default function SeguridadConfianza() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-16">
        {/* Título principal */}
        <h1 
          className="text-center mb-12"
          style={{ 
            fontFamily: typography.fontFamily.primary, 
            fontSize: '48px', 
            fontWeight: 700, 
            color: colors.primary.main,
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
                  style={{ backgroundColor: 'colors.primary.main' }}
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
                    fontFamily: typography.fontFamily.primary, 
                    fontSize: '28px', 
                    fontWeight: 600, 
                    color: colors.primary.main
                  }}
                >
                  Verificación de Profesionales
                </h2>
                <p 
                  style={{ 
                    fontFamily: typography.fontFamily.primary, 
                    fontSize: typography.fontSize.lg, 
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
                  style={{ backgroundColor: 'colors.primary.main' }}
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
                    fontFamily: typography.fontFamily.primary, 
                    fontSize: '28px', 
                    fontWeight: 600, 
                    color: colors.primary.main
                  }}
                >
                  Reseñas Verificadas
                </h2>
                <p 
                  style={{ 
                    fontFamily: typography.fontFamily.primary, 
                    fontSize: typography.fontSize.lg, 
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
                  style={{ backgroundColor: 'colors.primary.main' }}
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
                    fontFamily: typography.fontFamily.primary, 
                    fontSize: '28px', 
                    fontWeight: 600, 
                    color: colors.primary.main
                  }}
                >
                  Transacciones Seguras
                </h2>
                <p 
                  style={{ 
                    fontFamily: typography.fontFamily.primary, 
                    fontSize: typography.fontSize.lg, 
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
                  style={{ backgroundColor: 'colors.primary.main' }}
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
                    fontFamily: typography.fontFamily.primary, 
                    fontSize: '28px', 
                    fontWeight: 600, 
                    color: colors.primary.main
                  }}
                >
                  Soporte Continuo
                </h2>
                <p 
                  style={{ 
                    fontFamily: typography.fontFamily.primary, 
                    fontSize: typography.fontSize.lg, 
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
                  style={{ backgroundColor: 'colors.primary.main' }}
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
                    fontFamily: typography.fontFamily.primary, 
                    fontSize: '28px', 
                    fontWeight: 600, 
                    color: colors.primary.main
                  }}
                >
                  Garantía de Satisfacción
                </h2>
                <p 
                  style={{ 
                    fontFamily: typography.fontFamily.primary, 
                    fontSize: typography.fontSize.lg, 
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
              fontFamily: typography.fontFamily.primary, 
              fontSize: '20px',
              fontWeight: 500,
              backgroundColor: 'colors.primary.main',
              color: '#FFFFFF'
            }}
          >
            Volver al inicio
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
