'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { colors, typography } from '@/styles/tokens';
import { useAuth } from '@/contexts';
import { apiPost } from '@/utils/api';

export default function Welcome() {
  const router = useRouter();
  const [mostrarModalCuenta, setMostrarModalCuenta] = useState(false);
  const [mostrarLogin, setMostrarLogin] = useState(false);

  const handleAccederTrabajador = () => {
    setMostrarModalCuenta(true);
  };

  const handleBuscarTrabajadores = () => {
    router.push('/buscar');
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

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-between p-6 relative overflow-hidden"
      style={{ 
        background: 'linear-gradient(180deg, #FFFFFF 0%, #3A5FA0 100%)',
      }}
    >
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
            fontFamily: 'Maitree, serif',
            fontSize: '45px',
            fontWeight: 700,
            color: colors.primary.main,
            lineHeight: '100%',
            letterSpacing: '0%',
            marginBottom: '53px'
          }}
        >
          Servicios Confiables
        </h2>

        {/* Botones */}
        <div className="w-full space-y-4 px-4">
          <button
            onClick={handleAccederTrabajador}
            className="w-full py-4 rounded-full transition-all backdrop-blur-sm border hover:bg-white/40 cursor-pointer"
            style={{
              fontFamily: typography.fontFamily.primary,
              fontSize: typography.fontSize.base,
              fontWeight: typography.fontWeight.medium,
              color: '#F9F5ED',
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              borderColor: 'rgba(36, 76, 135, 0.3)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            }}
          >
            Acceder Como Trabajador
          </button>

          <button
            onClick={handleBuscarTrabajadores}
            className="w-full py-4 rounded-full transition-all backdrop-blur-sm border hover:bg-white/40 cursor-pointer"
            style={{
              fontFamily: typography.fontFamily.primary,
              fontSize: typography.fontSize.base,
              fontWeight: typography.fontWeight.medium,
              color: '#F9F5ED',
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              borderColor: 'rgba(36, 76, 135, 0.3)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
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
              backgroundColor: '#244C87',
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
                  className="w-full py-3 rounded-full transition-all hover:bg-opacity-70 cursor-pointer"
                  style={{ 
                    fontFamily: typography.fontFamily.primary, 
                    fontSize: typography.fontSize.base,
                    fontWeight: typography.fontWeight.medium,
                    color: colors.neutral.white,
                    backgroundColor: 'rgba(58, 95, 160, 0.5)',
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
                  className="w-full py-3 rounded-full transition-all hover:bg-opacity-70 cursor-pointer"
                  style={{ 
                    fontFamily: typography.fontFamily.primary, 
                    fontSize: typography.fontSize.base,
                    fontWeight: typography.fontWeight.medium,
                    color: colors.neutral.white,
                    backgroundColor: 'rgba(58, 95, 160, 0.5)',
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

      {/* Login Modal - Slide from bottom */}
      {mostrarLogin && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40 transition-opacity duration-300"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            onClick={cerrarModales}
          />
          
          {/* Login Card - Embedding login content */}
          <div 
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
            onClick={cerrarModales}
          >
            <div
              className="w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl p-8 sm:p-10 animate-slide-up overflow-y-auto"
              style={{ 
                backgroundColor: colors.primary.main,
                boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.3)',
                maxHeight: '90vh',
                animation: 'slideUp 0.3s ease-out'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <LoginContent onClose={cerrarModales} />
            </div>
          </div>
        </>
      )}

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

// Componente de Login integrado
function LoginContent({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await apiPost<{ token: string; user: any }>('/auth/login', { email, password });
      const providerId = data.user.role === 'PROVIDER' ? data.user.id : undefined;
      login(data.token, data.user, providerId);
      onClose();
      if (data.user.role === 'PROVIDER') {
        router.push('/dashboard-provider');
      } else {
        router.push('/buscar');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: 'google' | 'facebook' | 'apple') => {
    console.log(`Iniciando login con ${provider}`);
    alert(`Login con ${provider.charAt(0).toUpperCase() + provider.slice(1)} será implementado próximamente.`);
  };

  return (
    <>
      {/* Título de bienvenida */}
      <h1 
        className="text-white mb-8" 
        style={{ 
          fontFamily: typography.fontFamily.primary,
          fontSize: typography.fontSize['3xl'],
          fontWeight: typography.fontWeight.normal
        }}
      >
        ¡Que bueno volver a verte!
      </h1>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-red-500 bg-opacity-20 border border-red-300 rounded-lg">
          <p className="text-white text-sm">
            ❌ {error}
          </p>
        </div>
      )}

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-white text-sm mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-full bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
            placeholder=""
            disabled={loading}
          />
        </div>

        {/* Contraseña */}
        <div>
          <label htmlFor="password" className="block text-white text-sm mb-2">
            Contraseña
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-full bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
              placeholder=""
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              tabIndex={-1}
            >
              {showPassword ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="1" y1="1" x2="23" y2="23" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="12" r="3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Link olvidaste contraseña */}
        <div className="text-right">
          <button 
            type="button"
            onClick={() => router.push('/forgot-password')}
            className="text-white text-sm hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        {/* Botón entrar - Glass effect */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-full text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-md border border-white/20 shadow-lg hover:border-white/40 hover:shadow-xl"
          style={{ 
            backgroundColor: 'rgba(26, 58, 101, 0.3)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)'
          }}
        >
          {loading ? 'Iniciando sesión...' : 'Entrar a mi cuenta'}
        </button>
      </form>

      {/* Separador */}
      <div className="flex items-center gap-4 my-8">
        <div className="flex-1 h-px bg-white opacity-30"></div>
        <span className="text-white text-sm">o ingresa con</span>
        <div className="flex-1 h-px bg-white opacity-30"></div>
      </div>

      {/* Botones sociales */}
      <div className="flex justify-center" style={{ gap: '76px' }}>
        {/* Facebook */}
        <button
          type="button"
          className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center hover:bg-gray-100 transition-colors shadow-md hover:shadow-lg cursor-pointer"
          onClick={() => handleSocialLogin('facebook')}
          aria-label="Iniciar sesión con Facebook"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#1877F2">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </button>

        {/* Google */}
        <button
          type="button"
          className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center hover:bg-gray-100 transition-colors shadow-md hover:shadow-lg cursor-pointer"
          onClick={() => handleSocialLogin('google')}
          aria-label="Iniciar sesión con Google"
        >
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        </button>

        {/* Apple */}
        <button
          type="button"
          className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center hover:bg-gray-100 transition-colors shadow-md hover:shadow-lg cursor-pointer"
          onClick={() => handleSocialLogin('apple')}
          aria-label="Iniciar sesión con Apple"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="black">
            <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
          </svg>
        </button>
      </div>
    </>
  );
}
