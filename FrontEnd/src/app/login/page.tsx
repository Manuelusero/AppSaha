'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts';
import { useRedirectIfAuthenticated, useForm } from '@/hooks';
import { apiPost } from '@/utils/api';

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  
  useRedirectIfAuthenticated();
  
  const { values, handleChangeEvent } = useForm({
    initialValues: {
      email: '',
      password: ''
    },
    onSubmit: () => {}
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await apiPost<{
        token: string;
        user: any; // eslint-disable-line @typescript-eslint/no-explicit-any
      }>('/auth/login', values);

      const providerId = data.user.role === 'PROVIDER' 
        ? data.user.id
        : undefined;
      
      login(data.token, data.user, providerId);

      if (data.user.role === 'PROVIDER') {
        router.push('/dashboard-provider');
      } else {
        router.push('/');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: '#3A5FA0' }}
    >
      <div 
        className="w-full max-w-md rounded-3xl p-8 sm:p-10"
        style={{ backgroundColor: '#244C87' }}
      >
        {/* Título de bienvenida */}
        <h1 className="text-white text-3xl sm:text-4xl font-normal mb-8" style={{ fontFamily: 'Maitree, serif' }}>
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
              value={values.email}
              onChange={handleChangeEvent}
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
                value={values.password}
                onChange={handleChangeEvent}
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
            <Link 
              href="/forgot-password"
              className="text-white text-sm hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          {/* Botón entrar */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: 'rgba(26, 58, 101, 0.7)' }}
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
        <div className="flex justify-center gap-4">
          {/* Facebook */}
          <button
            type="button"
            className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center hover:bg-gray-100 transition-colors"
            onClick={() => alert('Login con Facebook - Por implementar')}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#1877F2">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </button>

          {/* Google */}
          <button
            type="button"
            className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center hover:bg-gray-100 transition-colors"
            onClick={() => alert('Login con Google - Por implementar')}
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
            className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center hover:bg-gray-100 transition-colors"
            onClick={() => alert('Login con Apple - Por implementar')}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="black">
              <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
            </svg>
          </button>
        </div>

        {/* Link registro */}
        <div className="mt-8 text-center">
          <p className="text-white text-sm">
            ¿No tienes una cuenta?{' '}
            <Link 
              href="/provider-signup" 
              className="font-medium underline hover:no-underline"
            >
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
