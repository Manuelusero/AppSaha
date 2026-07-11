'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { colors, typography } from '@/styles/tokens';
import Login from '@/components/Login/Login';
import { Modal, LoadingSpinner } from '@/components/ui';

export default function Welcome() {
  const router = useRouter();
  const [mostrarModalCuenta, setMostrarModalCuenta] = useState(false);
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [pressedWorker, setPressedWorker] = useState(false);
  const [pressedSearch, setPressedSearch] = useState(false);

  const handleAccederTrabajador = () => {
    setMostrarModalCuenta(true);
  };

  const navigateWithLoading = async (path: string) => {
    // show loading modal if navigation takes longer than 150ms
    let timer: ReturnType<typeof setTimeout> | null = null;
    setShowLoadingModal(false);
    try {
      timer = setTimeout(() => setShowLoadingModal(true), 150);
      await router.push(path);
    } finally {
      if (timer) clearTimeout(timer);
      setShowLoadingModal(false);
    }
  };

  const handleBuscarTrabajadores = () => {
    navigateWithLoading('/');
  };

  const handleIniciarSesion = () => {
    setMostrarModalCuenta(false);
    setMostrarLogin(true);
  };

  const handleRegistrarse = () => {
    router.push('/provider-signup');
  };

  const cerrarModales = () => {
    setMostrarModalCuenta(false);
    setMostrarLogin(false);
  };

  // Si la URL tiene ?login=1 abrimos el modal de login (permite enlaces desde otras páginas)
  // Usamos window.location directamente dentro de useEffect para evitar hooks de routing
  // que provocan errores en el prerender en Vercel.
  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      const params = new URLSearchParams(window.location.search);
      if (params.get('login')) {
        setMostrarLogin(true);

        // Limpiar el query param sin hacer navegación completa
        const url = new URL(window.location.href);
        url.searchParams.delete('login');
        window.history.replaceState({}, '', url.toString());
      }
    } catch (e) {
      // no-op
    }
  }, []);

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-between p-6 pb-56 sm:pb-32 relative overflow-hidden"
      style={{ 
        background: 'linear-gradient(180deg, #FFFFFF 0%, #3A5FA0 100%)',
      }}
    >
      {/* Welcome Text */}
      <div className="w-full pt-4">
        <h1 
          className="text-left"
          style={{
            fontFamily: typography.fontFamily.primary,
            fontSize: typography.fontSize['2xl'],
            fontWeight: typography.fontWeight.normal,
            color: colors.neutral[500],
            letterSpacing: '0.05em'
          }}
        >
          Welcome
        </h1>
      </div>

      {/* Contenido Central */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md space-y-8">
        {/* Logo Placeholder */}
        <div 
          className="w-48 h-48 rounded-full flex items-center justify-center"
          style={{
            backgroundColor: colors.neutral[100],
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
          }}
        >
          <span 
            style={{
              fontFamily: typography.fontFamily.primary,
              fontSize: typography.fontSize.sm,
              color: colors.neutral[400],
              textAlign: 'center'
            }}
          >
            [Logo aquí]
          </span>
        </div>

        {/* Título */}
        <h2 
          className="text-center"
          style={{
            fontFamily: typography.fontFamily.primary,
            fontSize: typography.fontSize['4xl'],
            fontWeight: typography.fontWeight.semibold,
            color: colors.primary.main,
            lineHeight: '1.2'
          }}
        >
          Servicios<br />Confiables
        </h2>

        {/* Botones */}
        <div className="w-full space-y-4 px-4">
          <button
            onClick={handleAccederTrabajador}
            onMouseDown={() => setPressedWorker(true)}
            onMouseUp={() => setPressedWorker(false)}
            onMouseLeave={() => setPressedWorker(false)}
            onTouchStart={() => setPressedWorker(true)}
            onTouchEnd={() => setPressedWorker(false)}
            className="w-full py-4 rounded-full transition-all backdrop-blur-sm border cursor-pointer"
            style={{
              fontFamily: typography.fontFamily.primary,
              fontSize: typography.fontSize.base,
              fontWeight: typography.fontWeight.medium,
              color: colors.primary.main,
              backgroundColor: pressedWorker ? 'rgba(255,255,255,0.45)' : 'rgba(255, 255, 255, 0.3)',
              borderColor: 'rgba(36, 76, 135, 0.3)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
              userSelect: 'none'
            }}
          >
            Acceder Como Trabajador
          </button>

          <button
            onClick={handleBuscarTrabajadores}
            onMouseDown={() => setPressedSearch(true)}
            onMouseUp={() => setPressedSearch(false)}
            onMouseLeave={() => setPressedSearch(false)}
            onTouchStart={() => setPressedSearch(true)}
            onTouchEnd={() => setPressedSearch(false)}
            className="w-full py-4 rounded-full transition-all backdrop-blur-sm border cursor-pointer"
            style={{
              fontFamily: typography.fontFamily.primary,
              fontSize: typography.fontSize.base,
              fontWeight: typography.fontWeight.medium,
              color: colors.primary.main,
              backgroundColor: pressedSearch ? 'rgba(255,255,255,0.45)' : 'rgba(255, 255, 255, 0.3)',
              borderColor: 'rgba(36, 76, 135, 0.3)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
              userSelect: 'none'
            }}
          >
            Buscar Trabajadores
          </button>
        </div>
      </div>

      {/* Spacer para el bottom */}
      <div className="h-8"></div>

      {/* Modal: ¿Ya tienes una cuenta? - Slide from bottom */}
      {mostrarModalCuenta && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40 transition-opacity duration-300"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            onClick={cerrarModales}
          />
          
          {/* Modal Card */}
          <div 
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl p-8 pb-12 animate-slide-up"
            style={{
              backgroundColor: colors.accent.brown,
              boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.3)',
              animation: 'slideUp 0.3s ease-out'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center max-w-md mx-auto">
              <h2 
                className="mb-8"
                style={{ 
                  fontFamily: typography.fontFamily.primary, 
                  fontSize: typography.fontSize['3xl'], 
                  fontWeight: typography.fontWeight.normal,
                  color: colors.neutral.white,
                  lineHeight: '1.2'
                }}
              >
                ¿Ya tenes una cuenta?
              </h2>
              
              {/* Botones */}
              <div className="flex flex-col gap-4">
                <button
                  onClick={handleIniciarSesion}
                  className="w-full py-3 rounded-full transition-all hover:bg-opacity-40 cursor-pointer"
                  style={{ 
                    fontFamily: typography.fontFamily.primary, 
                    fontSize: typography.fontSize.base,
                    fontWeight: typography.fontWeight.medium,
                    color: colors.neutral.black,
                    backgroundColor: 'rgba(217, 165, 137, 0.3)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  Si, Iniciar sesión
                </button>
                
                <button
                  onClick={handleRegistrarse}
                  className="w-full py-3 rounded-full transition-all hover:bg-opacity-40 cursor-pointer"
                  style={{ 
                    fontFamily: typography.fontFamily.primary, 
                    fontSize: typography.fontSize.base,
                    fontWeight: typography.fontWeight.medium,
                    color: colors.neutral.black,
                    backgroundColor: 'rgba(217, 165, 137, 0.3)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  No, registrarme
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Loading modal shown when navigation takes longer */}
      <Modal isOpen={showLoadingModal} onClose={() => {}} title={undefined} maxWidth="sm" variant="default" showCloseButton={false} closeOnBackdropClick={false}>
        <div className="flex flex-col items-center justify-center p-6">
          <LoadingSpinner size="md" message="Cargando..." />
        </div>
      </Modal>

      <Login isOpen={mostrarLogin} onClose={cerrarModales} />

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%); 
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

// Login modal component extracted to /src/components/Login/Login.tsx
