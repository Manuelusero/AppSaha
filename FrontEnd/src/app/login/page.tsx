'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts';
import { useRedirectIfAuthenticated, useForm } from '@/hooks';
import { apiPost } from '@/utils/api';
import { PasswordInput } from '@/components/ui';

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  
  // Redirigir si ya está autenticado
  useRedirectIfAuthenticated();
  
  const { values, handleChangeEvent } = useForm({
    initialValues: {
      email: '',
      password: ''
    },
    onSubmit: () => {} // Se maneja con handleSubmit personalizado
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('🔐 Intentando login con:', values.email);
    setError('');
    setLoading(true);

    try {
      console.log('📤 Enviando solicitud de login...');
      const data = await apiPost<{
        token: string;
        user: any; // eslint-disable-line @typescript-eslint/no-explicit-any
      }>('/auth/login', values);

      console.log('✅ Login exitoso:', data);

      // Usar el Context API para login
      const providerId = data.user.role === 'PROVIDER' && data.user.providerProfile 
        ? data.user.providerProfile.id 
        : undefined;
      
      login(data.token, data.user, providerId);
      
      console.log('✅ Login exitoso, redirigiendo...');

      // Redirigir al dashboard según el rol
      if (data.user.role === 'PROVIDER') {
        router.push('/dashboard-provider');
      } else {
        // Cliente: por ahora redirigir al inicio
        router.push('/');
        alert('Bienvenido! Por ahora la plataforma está enfocada en proveedores. Pronto tendrás tu dashboard.');
      }
    } catch (err) {
      console.error('❌ Error en login:', err);
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Iniciar Sesión
          </h1>
          <p className="text-gray-600">
            Accede a tu cuenta de proveedor
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm font-medium">
              ❌ {error}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={values.email}
              onChange={handleChangeEvent}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
              placeholder="juan@example.com"
              disabled={loading}
            />
          </div>

          <PasswordInput
            label="Contraseña"
            value={values.password}
            onChange={(val) => handleChangeEvent({ target: { name: 'password', value: val } } as any)}
            placeholder="Tu contraseña"
            disabled={loading}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="mt-6 text-center space-y-3">
          <div className="space-y-2">
            <p className="text-gray-600 text-sm font-medium">
              ¿No tienes una cuenta?
            </p>
            <div className="flex flex-col gap-2">
              <Link 
                href="/signup-client" 
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Regístrate como Cliente
              </Link>
              <Link 
                href="/provider-signup" 
                className="text-green-600 hover:text-green-700 font-medium text-sm"
              >
                Regístrate como Proveedor
              </Link>
            </div>
          </div>
          <Link 
            href="/" 
            className="block text-gray-500 hover:text-gray-700 text-sm"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
