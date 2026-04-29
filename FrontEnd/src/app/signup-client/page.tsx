'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts';
import { useRedirectIfAuthenticated, useForm } from '@/hooks';
import { apiPost } from '@/utils/api';
import { PasswordInput } from '@/components/ui';

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
    <div className="min-h-screen flex flex-col lg:flex-row">

      {/* ── Panel izquierdo — solo desktop ── */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center px-16 py-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #1a3a6e 0%, #3A5FA0 60%, #5E83AE 100%)' }}
      >
        {/* Círculos decorativos */}
        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '320px', height: '320px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '240px', height: '240px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.07)' }} />

        <div className="relative z-10 text-center">
          <h1 style={{ fontFamily: 'Maitree, serif', fontSize: '52px', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.1, marginBottom: '24px', letterSpacing: '-1px' }}>
            SERCO
          </h1>
          <div style={{ width: '60px', height: '3px', backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: '2px', margin: '0 auto 32px' }} />
          <p style={{ fontFamily: 'Maitree, serif', fontSize: '24px', fontWeight: 400, color: 'rgba(255,255,255,0.95)', lineHeight: 1.4, marginBottom: '16px' }}>
            Tu cuenta para contratar<br />los mejores profesionales<br />cerca de vos
          </p>
          <p style={{ fontFamily: 'Maitree, serif', fontSize: '15px', fontWeight: 400, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
            Recibí presupuestos, comparás opciones<br />y elegís con confianza.
          </p>
        </div>
      </div>

      {/* ── Panel derecho — formulario (mobile + desktop) ── */}
      <div className="flex-1 bg-gradient-to-br from-blue-50 via-white to-green-50 py-12 px-4 sm:px-6 lg:px-8">
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
            <PasswordInput
              label="Contraseña"
              value={values.password}
              onChange={(val) => handleChangeEvent({ target: { name: 'password', value: val } } as any)}
              placeholder="Mínimo 6 caracteres"
              disabled={loading}
              required
            />

            {/* Confirmar Contraseña */}
            <PasswordInput
              label="Confirmar Contraseña"
              value={values.confirmPassword}
              onChange={(val) => handleChangeEvent({ target: { name: 'confirmPassword', value: val } } as any)}
              placeholder="Repite tu contraseña"
              disabled={loading}
              required
            />

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
      </div>{/* fin panel derecho */}
    </div>
  );
}
