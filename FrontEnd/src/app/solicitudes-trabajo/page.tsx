'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { colors, typography } from '@/styles/tokens';

export default function SolicitudesTrabajo() {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  // TODO: Obtener el providerId del usuario actual
  const providerId = typeof window !== 'undefined' ? localStorage.getItem('providerId') || '123' : '123';
  const profileLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/recomendacion/${providerId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(profileLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ backgroundColor: colors.neutral.beige, minHeight: '100vh' }}>
      {/* Header sticky con degradado */}
      <header 
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between"
        style={{
          height: '6rem',
          background: 'linear-gradient(180deg, rgba(36, 76, 135, 0.8) 0%, rgba(255, 252, 249, 0.8) 100%)',
          paddingLeft: '24px',
          paddingRight: '24px'
        }}
      >
        {/* Flecha para volver atrás */}
        <button 
          onClick={() => router.back()}
          style={{ cursor: 'pointer', padding: '8px' }}
        >
          <svg width="24" height="24" fill="none" stroke={colors.neutral.black} strokeWidth="2" viewBox="0 0 24 24">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>

        {/* Menú hamburguesa */}
        <button 
          onClick={() => setShowMenu(true)}
          style={{ cursor: 'pointer', padding: '8px' }}
        >
          <svg width="24" height="24" fill="none" stroke={colors.neutral.black} strokeWidth="2" viewBox="0 0 24 24">
            <path d="M3 12h18M3 6h18M3 18h18"/>
          </svg>
        </button>
      </header>

      {/* Menú lateral */}
      {showMenu && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowMenu(false)}
          />
          <div 
            className="fixed top-0 left-0 h-full bg-white shadow-lg z-50"
            style={{ width: '280px' }}
          >
            <div className="p-6">
              <button
                onClick={() => setShowMenu(false)}
                className="mb-6"
                style={{ cursor: 'pointer' }}
              >
                <svg width="24" height="24" fill="none" stroke={colors.neutral.black} strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
              
              <nav className="space-y-4">
                <button
                  onClick={() => {
                    setShowMenu(false);
                    router.push('/dashboard-provider');
                  }}
                  className="w-full text-left p-3 hover:bg-gray-100 rounded-lg transition-colors"
                  style={{ 
                    fontFamily: typography.fontFamily.primary, 
                    fontSize: typography.fontSize.base,
                    color: colors.neutral.black,
                    cursor: 'pointer'
                  }}
                >
                  Mi Perfil
                </button>
                
                <button
                  onClick={() => {
                    setShowMenu(false);
                    router.push('/');
                  }}
                  className="w-full text-left p-3 hover:bg-gray-100 rounded-lg transition-colors"
                  style={{ 
                    fontFamily: typography.fontFamily.primary, 
                    fontSize: typography.fontSize.base,
                    color: colors.neutral.black,
                    cursor: 'pointer'
                  }}
                >
                  Inicio
                </button>
                
                <button
                  onClick={() => {
                    localStorage.clear();
                    router.push('/login');
                  }}
                  className="w-full text-left p-3 hover:bg-gray-100 rounded-lg transition-colors"
                  style={{ 
                    fontFamily: typography.fontFamily.primary, 
                    fontSize: typography.fontSize.base,
                    color: colors.neutral.black,
                    cursor: 'pointer'
                  }}
                >
                  Cerrar Sesión
                </button>
              </nav>
            </div>
          </div>
        </>
      )}

      {/* Contenido principal */}
      <main style={{ paddingTop: 'calc(6rem + 48px)', paddingLeft: '24px', paddingRight: '24px', paddingBottom: '48px' }}>
        <div className="max-w-2xl mx-auto">
          {/* Título */}
          <h1 style={{
            fontFamily: 'Maitree, serif',
            fontSize: '32px',
            fontWeight: 600,
            color: colors.neutral.black,
            textAlign: 'center',
            marginBottom: '32px'
          }}>
            ¿Recién empezas?
          </h1>

          <p style={{
            fontFamily: typography.fontFamily.primary,
            fontSize: typography.fontSize.base,
            color: colors.neutral.black,
            marginBottom: '32px',
            lineHeight: '1.6'
          }}>
            Seguí estos consejos para conseguir trabajos más rápido
          </p>

          {/* Lista de consejos */}
          <ul style={{ 
            listStyle: 'disc',
            paddingLeft: '24px',
            marginBottom: '48px'
          }}>
            <li style={{
              fontFamily: typography.fontFamily.primary,
              fontSize: typography.fontSize.base,
              color: colors.neutral.black,
              marginBottom: '16px',
              lineHeight: '1.6'
            }}>
              <strong>Completá tu perfil:</strong> asegurate de sumar fotos de trabajos anteriores y también referencias laborales.
            </li>
            
            <li style={{
              fontFamily: typography.fontFamily.primary,
              fontSize: typography.fontSize.base,
              color: colors.neutral.black,
              marginBottom: '16px',
              lineHeight: '1.6'
            }}>
              <strong>Cargá tus certificados:</strong> mostrá en tu perfil todo lo que sabes. Incluí muestras de cursos o certificaciones que ayuden a dar confianza a nuevos clientes.
            </li>
            
            <li style={{
              fontFamily: typography.fontFamily.primary,
              fontSize: typography.fontSize.base,
              color: colors.neutral.black,
              marginBottom: '16px',
              lineHeight: '1.6'
            }}>
              <strong>Pedí a tus clientes habituales que te contacten por el sitio:</strong> Si! esto es posible, podes compartir tu perfil directamente para que nuevos clientes te contacten por la app y aumentar tu visibilidad.
            </li>
            
            <li style={{
              fontFamily: typography.fontFamily.primary,
              fontSize: typography.fontSize.base,
              color: colors.neutral.black,
              marginBottom: '16px',
              lineHeight: '1.6'
            }}>
              <strong>Y por último no olvides pedir una Recomendación a tus antiguos clientes:</strong> puedes compartir con ellos el link que tendrás a continuación para que dejen sus comentarios sobre tu trabajo. Esto será visible en tu perfil para que lo vean los nuevos posibles clientes.
            </li>
          </ul>

          {/* Input con link y botón copiar */}
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={profileLink}
              readOnly
              className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-300 bg-white"
              style={{
                fontFamily: typography.fontFamily.primary,
                fontSize: typography.fontSize.sm,
                color: colors.neutral[600]
              }}
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
            
            <button
              onClick={handleCopyLink}
              className="px-6 py-3 rounded-lg transition-colors"
              style={{
                fontFamily: typography.fontFamily.primary,
                fontSize: typography.fontSize.base,
                color: '#FFFFFF',
                backgroundColor: colors.neutral.black,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {copied ? '¡Copiado!' : 'Copiar'}
            </button>
          </div>

          {/* Nota informativa */}
          <p style={{
            fontFamily: typography.fontFamily.primary,
            fontSize: typography.fontSize.sm,
            color: colors.neutral[500],
            marginTop: '16px',
            textAlign: 'center',
            fontStyle: 'italic'
          }}>
            Comparte este link con tus clientes para que dejen sus recomendaciones
          </p>
        </div>
      </main>
    </div>
  );
}
