'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts';
import { useRedirectIfAuthenticated, useForm, useToggle } from '@/hooks';
import { apiPost } from '@/utils/api';

export default function SignupClient() {
  const router = useRouter();
  const { login } = useAuth();
  
  // Redirigir si ya está autenticado
  useRedirectIfAuthenticated();
  
  const { values, handleChangeEvent } = useForm({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: ''
    },
    onSubmit: () => {} // Se maneja con handleSubmit personalizado
  });
  
  const [showPassword, toggleShowPassword] = useToggle(false);
  const [showConfirmPassword, toggleShowConfirmPassword] = useToggle(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (values.password !== values.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (values.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      const data = await apiPost<{
        token: string;
        user: any; // eslint-disable-line @typescript-eslint/no-explicit-any
      }>('/auth/signup-client', {
        name: values.name,
        email: values.email,
        password: values.password,
        phone: values.phone
      });

      // Usar el Context API para login
      login(data.token, data.user);

      // Redirigir al dashboard de cliente o a donde estaba el usuario
      const redirectTo = localStorage.getItem('redirectAfterLogin') || '/dashboard-client';
      localStorage.removeItem('redirectAfterLogin');
      router.push(redirectTo);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🛠️ SERCO
          </h1>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Registro de Cliente
          </h2>
          <p className="text-gray-600">
            Crea tu cuenta para contratar servicios
          </p>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm font-medium">❌ {error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombre */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre Completo *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={values.name}
                onChange={handleChangeEvent}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                placeholder="Juan Pérez"
                disabled={loading}
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={values.email}
                onChange={handleChangeEvent}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                placeholder="tu@email.com"
                disabled={loading}
              />
            </div>

            {/* Teléfono */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={values.phone}
                onChange={handleChangeEvent}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                placeholder="+34 600 000 000"
                disabled={loading}
              />
            </div>

            {/* Contraseña */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                name="password"
                  required
                  value={values.password}
                  onChange={handleChangeEvent}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="Mínimo 6 caracteres"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Confirmar Contraseña */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar Contraseña *
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  required
                  value={values.confirmPassword}
                  onChange={handleChangeEvent}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="Repite tu contraseña"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={toggleShowConfirmPassword}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Botón Submit */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:bg-gray-400"
              disabled={loading}
            >
              {loading ? 'Registrando...' : 'Crear Cuenta'}
            </button>
          </form>

          {/* Enlaces */}
          <div className="mt-6 space-y-3 text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes cuenta?{' '}
              <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Inicia sesión
              </Link>
            </p>
            <p className="text-sm text-gray-600">
              ¿Quieres ofrecer servicios?{' '}
              <Link href="/signup" className="text-green-600 hover:text-green-700 font-medium">
                Regístrate como proveedor
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
