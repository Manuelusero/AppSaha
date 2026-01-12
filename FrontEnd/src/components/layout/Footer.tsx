'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { colors, typography, spacing } from '@/styles/tokens';

interface FooterProps {
  variant?: 'full' | 'minimal';
}

export default function Footer({ variant = 'full' }: FooterProps) {
  const router = useRouter();

  // Estilos reutilizables basados en tokens
  const titleStyle = {
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeight.normal,
    fontSize: typography.fontSize['2xl'],
    lineHeight: '100%',
    letterSpacing: '0%',
    textAlign: 'center' as const,
  };

  const linkStyle = {
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeight.normal,
    fontSize: typography.fontSize.base,
    lineHeight: '100%',
    letterSpacing: '0%',
    textAlign: 'center' as const,
  };

  const copyrightStyle = {
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeight.normal,
    fontSize: typography.fontSize.base,
    fontStyle: 'italic' as const,
    lineHeight: '100%',
    letterSpacing: '0%',
    textAlign: 'center' as const,
  };

  if (variant === 'minimal') {
    return (
      <footer className="w-full text-white py-6 px-4" style={{ backgroundColor: colors.primary.main }}>
        <div className="text-center">
          <p style={{ 
            fontFamily: typography.fontFamily.primary,
            fontStyle: 'italic',
            fontSize: typography.fontSize.base
          }}>
            Creado por Bren y Manu
          </p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="w-full text-white" style={{ marginTop: spacing[36] }}>
      {/* Franja azul superior */}
      <div className="w-full" style={{ backgroundColor: colors.primary.main, height: '60px' }}></div>
      
      {/* Contenedor del logo con fondo blanco */}
      <div className="w-full py-6 sm:py-8 px-4" style={{ backgroundColor: colors.neutral.white }}>
        <div className="flex justify-center">
          <Image 
            src="/Logo.png" 
            alt="Serco Logo" 
            width={484} 
            height={134}
            className="w-full sm:w-auto max-w-[300px] sm:max-w-[484px]"
            style={{ height: 'auto' }}
          />
        </div>
      </div>

      {/* Resto del footer con fondo azul */}
      <div className="w-full py-8 sm:py-12 px-4 sm:px-6" style={{ backgroundColor: colors.primary.main }}>
        <div className="max-w-6xl mx-auto">
          {/* Redes Sociales */}
          <div className="flex justify-center items-center mb-8 sm:mb-16 gap-6 sm:gap-12">
            {/* LinkedIn */}
            <a href="#" className="hover:opacity-80 transition-opacity flex-shrink-0" aria-label="LinkedIn">
              <svg width="28" height="28" className="sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>

            {/* YouTube */}
            <a href="#" className="hover:opacity-80 transition-opacity flex-shrink-0" aria-label="YouTube">
              <svg width="28" height="28" className="sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
              </svg>
            </a>

            {/* Facebook */}
            <a href="#" className="hover:opacity-80 transition-opacity flex-shrink-0" aria-label="Facebook">
              <svg width="28" height="28" className="sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
              </svg>
            </a>

            {/* Instagram */}
            <a href="#" className="hover:opacity-80 transition-opacity flex-shrink-0" aria-label="Instagram">
              <svg width="28" height="28" className="sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
          </div>

          {/* Navegación en 3 columnas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 mb-12 sm:mb-16 text-center">
            {/* Para Clientes */}
            <div>
              <h3 
                className="mb-6" 
                style={{ 
                  fontFamily: 'Maitree, serif', 
                  fontWeight: 400, 
                  fontSize: '24px', 
                  lineHeight: '100%', 
                  letterSpacing: '0%', 
                  textAlign: 'center' 
                }}
              >
                Para Clientes
              </h3>
              <ul className="space-y-3">
                <li>
                  <a 
                    href="#buscar-servicios" 
                    className="hover:opacity-80 transition-opacity" 
                    style={{ 
                      fontFamily: 'Maitree, serif', 
                      fontWeight: 400, 
                      fontSize: '16px', 
                      lineHeight: '100%', 
                      letterSpacing: '0%', 
                      textAlign: 'center' 
                    }}
                  >
                    Buscar Servidores
                  </a>
                </li>
                <li>
                  <a 
                    href="#como-funciona" 
                    className="hover:opacity-80 transition-opacity" 
                    style={{ 
                      fontFamily: 'Maitree, serif', 
                      fontWeight: 400, 
                      fontSize: '16px', 
                      lineHeight: '100%', 
                      letterSpacing: '0%', 
                      textAlign: 'center' 
                    }}
                  >
                    ¿Cómo Funciona?
                  </a>
                </li>
                <li>
                  <a 
                    href="/seguridad-confianza" 
                    className="hover:opacity-80 transition-opacity" 
                    style={{ 
                      fontFamily: 'Maitree, serif', 
                      fontWeight: 400, 
                      fontSize: '16px', 
                      lineHeight: '100%', 
                      letterSpacing: '0%', 
                      textAlign: 'center' 
                    }}
                  >
                    Seguridad y Confianza
                  </a>
                </li>
                <li>
                  <a 
                    href="/ayuda" 
                    className="hover:opacity-80 transition-opacity" 
                    style={{ 
                      fontFamily: 'Maitree, serif', 
                      fontWeight: 400, 
                      fontSize: '16px', 
                      lineHeight: '100%', 
                      letterSpacing: '0%', 
                      textAlign: 'center' 
                    }}
                  >
                    Ayuda
                  </a>
                </li>
              </ul>
            </div>

            {/* Para Proveedores */}
            <div>
              <h3 
                className="mb-6" 
                style={{ 
                  fontFamily: 'Maitree, serif', 
                  fontWeight: 400, 
                  fontSize: '24px', 
                  lineHeight: '100%', 
                  letterSpacing: '0%', 
                  textAlign: 'center' 
                }}
              >
                Para Proveedores
              </h3>
              <ul className="space-y-3">
                <li>
                  <a 
                    href="/provider-signup" 
                    className="hover:opacity-80 transition-opacity" 
                    style={{ 
                      fontFamily: 'Maitree, serif', 
                      fontWeight: 400, 
                      fontSize: '16px', 
                      lineHeight: '100%', 
                      letterSpacing: '0%', 
                      textAlign: 'center' 
                    }}
                  >
                    Sumate como proveedor
                  </a>
                </li>
                <li>
                  <a 
                    href="/experiencias" 
                    className="hover:opacity-80 transition-opacity" 
                    style={{ 
                      fontFamily: 'Maitree, serif', 
                      fontWeight: 400, 
                      fontSize: '16px', 
                      lineHeight: '100%', 
                      letterSpacing: '0%', 
                      textAlign: 'center' 
                    }}
                  >
                    Experiencias
                  </a>
                </li>
                <li>
                  <a 
                    href="/recursos" 
                    className="hover:opacity-80 transition-opacity" 
                    style={{ 
                      fontFamily: 'Maitree, serif', 
                      fontWeight: 400, 
                      fontSize: '16px', 
                      lineHeight: '100%', 
                      letterSpacing: '0%', 
                      textAlign: 'center' 
                    }}
                  >
                    Recursos útiles
                  </a>
                </li>
                <li>
                  <a 
                    href="/soporte-proveedores" 
                    className="hover:opacity-80 transition-opacity" 
                    style={{ 
                      fontFamily: 'Maitree, serif', 
                      fontWeight: 400, 
                      fontSize: '16px', 
                      lineHeight: '100%', 
                      letterSpacing: '0%', 
                      textAlign: 'center' 
                    }}
                  >
                    Soporte Proveedores
                  </a>
                </li>
              </ul>
            </div>

            {/* Empresa */}
            <div>
              <h3 
                className="mb-6" 
                style={{ 
                  fontFamily: 'Maitree, serif', 
                  fontWeight: 400, 
                  fontSize: '24px', 
                  lineHeight: '100%', 
                  letterSpacing: '0%', 
                  textAlign: 'center' 
                }}
              >
                Empresa
              </h3>
              <ul className="space-y-3">
                <li>
                  <button 
                    onClick={() => router.push('/sobre-nosotros')} 
                    className="hover:opacity-80 transition-opacity" 
                    style={{ 
                      fontFamily: 'Maitree, serif', 
                      fontWeight: 400, 
                      fontSize: '16px', 
                      lineHeight: '100%', 
                      letterSpacing: '0%', 
                      textAlign: 'center', 
                      background: 'none', 
                      border: 'none', 
                      cursor: 'pointer', 
                      color: 'inherit' 
                    }}
                  >
                    Sobre nosotros
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => router.push('/trabaja-con-nosotros')} 
                    className="hover:opacity-80 transition-opacity" 
                    style={{ 
                      fontFamily: 'Maitree, serif', 
                      fontWeight: 400, 
                      fontSize: '16px', 
                      lineHeight: '100%', 
                      letterSpacing: '0%', 
                      textAlign: 'center', 
                      background: 'none', 
                      border: 'none', 
                      cursor: 'pointer', 
                      color: 'inherit' 
                    }}
                  >
                    Trabaja con nosotros
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => router.push('/contacto')} 
                    className="hover:opacity-80 transition-opacity" 
                    style={{ 
                      fontFamily: 'Maitree, serif', 
                      fontWeight: 400, 
                      fontSize: '16px', 
                      lineHeight: '100%', 
                      letterSpacing: '0%', 
                      textAlign: 'center', 
                      background: 'none', 
                      border: 'none', 
                      cursor: 'pointer', 
                      color: 'inherit' 
                    }}
                  >
                    Contacto
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => router.push('/prensa')} 
                    className="hover:opacity-80 transition-opacity" 
                    style={{ 
                      fontFamily: 'Maitree, serif', 
                      fontWeight: 400, 
                      fontSize: '16px', 
                      lineHeight: '100%', 
                      letterSpacing: '0%', 
                      textAlign: 'center', 
                      background: 'none', 
                      border: 'none', 
                      cursor: 'pointer', 
                      color: 'inherit' 
                    }}
                  >
                    Prensa
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Separador */}
          <div className="border-t border-white/30 mb-8"></div>

          {/* Texto final */}
          <div className="text-center">
            <p 
              style={{ 
                fontFamily: 'Maitree, serif', 
                fontStyle: 'italic', 
                fontSize: '16px', 
                lineHeight: '100%', 
                letterSpacing: '0%', 
                textAlign: 'center' 
              }}
            >
              Creado por Bren y Manu
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
