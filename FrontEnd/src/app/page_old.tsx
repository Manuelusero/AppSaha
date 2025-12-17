'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ApiResponse {
  message: string;
  timestamp: string;
  environment: string;
}

export default function Home() {
  const [apiData, setApiData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Verificar si hay token en localStorage
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    const fetchBackendData = async () => {
      try {
        const response = await fetch('http://localhost:8000');
        if (!response.ok) {
          throw new Error('Backend no disponible');
        }
        const data = await response.json();
        setApiData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchBackendData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-6 py-12">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            🚀 Proyecto SERCO
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            MVP Full-Stack con Next.js y Express
          </p>
        </header>

        <main className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              📡 Estado del Backend
            </h2>
            
            {loading && (
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="text-gray-600">Conectando con servidor...</span>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <span className="text-red-600 text-xl">❌</span>
                  <span className="text-red-700 font-medium">Error: {error}</span>
                </div>
                <p className="text-red-600 text-sm mt-2">
                  Asegúrate de que el servidor backend esté corriendo en http://localhost:8000
                </p>
              </div>
            )}

            {apiData && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-green-600 text-xl">✅</span>
                  <span className="text-green-700 font-medium">Conectado exitosamente</span>
                </div>
                <div className="space-y-2 text-sm">
                  <p><strong>Mensaje:</strong> {apiData.message}</p>
                  <p><strong>Ambiente:</strong> {apiData.environment}</p>
                  <p><strong>Timestamp:</strong> {new Date(apiData.timestamp).toLocaleString()}</p>
                </div>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                ⚡ Frontend
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Next.js 15 + React 18</li>
                <li>• TypeScript</li>
                <li>• Tailwind CSS</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                🔧 Backend
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Node.js + Express</li>
                <li>• TypeScript</li>
                <li>• CORS + dotenv</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              🎯 Acciones
            </h3>
            {isLoggedIn ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/dashboard"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors"
                >
                  Ir al Dashboard
                </Link>
                <button
                  onClick={() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setIsLoggedIn(false);
                  }}
                  className="inline-block bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-8 rounded-lg transition-colors"
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/signup"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors"
                >
                  Registrarse como Proveedor
                </Link>
                <Link 
                  href="/login"
                  className="inline-block bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-8 rounded-lg transition-colors"
                >
                  Iniciar Sesión
                </Link>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
