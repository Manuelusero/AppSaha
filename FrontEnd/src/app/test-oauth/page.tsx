'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { OAuthButtons } from '@/components/auth';
import { colors, typography } from '@/styles/tokens';

/**
 * Página de prueba para OAuth
 * URL: http://localhost:3000/test-oauth
 * 
 * Testear:
 * 1. Click en "Continuar con Google"
 * 2. Seleccionar cuenta de Google
 * 3. Ver datos de sesión
 */
export default function TestOAuthPage() {
  const { data: session, status } = useSession();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <h1 
          className="text-3xl font-bold text-center mb-2"
          style={{ 
            fontFamily: typography.fontFamily.primary,
            color: colors.primary.main 
          }}
        >
          Test OAuth
        </h1>
        <p 
          className="text-center text-gray-600 mb-8"
          style={{ fontFamily: typography.fontFamily.primary }}
        >
          Página de prueba para login social
        </p>

        {/* Loading State */}
        {status === 'loading' && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando...</p>
          </div>
        )}

        {/* Not Authenticated */}
        {status === 'unauthenticated' && (
          <div>
            <p 
              className="text-center mb-6 text-gray-700"
              style={{ fontFamily: typography.fontFamily.primary }}
            >
              No estás autenticado. Prueba el login con Google:
            </p>
            <OAuthButtons callbackUrl="/test-oauth" showDivider={false} />
          </div>
        )}

        {/* Authenticated */}
        {status === 'authenticated' && session && (
          <div>
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 
                className="text-2xl font-bold"
                style={{ 
                  fontFamily: typography.fontFamily.primary,
                  color: colors.success.main 
                }}
              >
                ¡Login Exitoso! ✅
              </h2>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 
                className="font-semibold mb-3"
                style={{ fontFamily: typography.fontFamily.primary }}
              >
                Datos de Sesión:
              </h3>
              <div className="space-y-2 text-sm">
                <p><strong>Nombre:</strong> {session.user?.name || 'N/A'}</p>
                <p><strong>Email:</strong> {session.user?.email || 'N/A'}</p>
                <p><strong>Provider:</strong> {session.user?.provider || 'N/A'}</p>
                {session.user?.image && (
                  <div className="mt-3">
                    <strong>Avatar:</strong>
                    <img 
                      src={session.user.image} 
                      alt="Avatar" 
                      className="w-16 h-16 rounded-full mt-2"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold mb-2 text-blue-800">Session Object (Debug):</h3>
              <pre className="text-xs bg-white p-3 rounded overflow-x-auto">
                {JSON.stringify(session, null, 2)}
              </pre>
            </div>

            <button
              onClick={() => signOut({ callbackUrl: '/test-oauth' })}
              className="w-full py-3 px-4 rounded-full font-semibold transition-colors"
              style={{
                backgroundColor: colors.error.main,
                color: 'white',
                fontFamily: typography.fontFamily.primary
              }}
            >
              Cerrar Sesión
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Esta es una página de prueba. Para producción, integrar OAuth en /login
          </p>
        </div>
      </div>
    </div>
  );
}
