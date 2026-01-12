'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts';

interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: string;
  providerProfile?: {
    id: string;
    serviceCategory: string;
    serviceDescription?: string;
    experience?: number;
    pricePerHour?: number;
    location?: string;
    isAvailable: boolean;
    rating: number;
    totalReviews: number;
  };
}

const serviceCategoryLabels: { [key: string]: string } = {
  PLOMERIA: 'Plomería',
  ELECTRICIDAD: 'Electricidad',
  CARPINTERIA: 'Carpintería',
  PINTURA: 'Pintura',
  LIMPIEZA: 'Limpieza',
  JARDINERIA: 'Jardinería',
  MECANICA: 'Mecánica',
  OTRO: 'Otro',
};

export default function Dashboard() {
  const router = useRouter();
  const { user: authUser, token, isAuthenticated, logout: authLogout, isLoading: authLoading } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!isAuthenticated || !token) {
          router.push('/login');
          return;
        }

        const response = await fetch('http://localhost:8000/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Token inválido');
        }

        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar datos');
        authLogout();
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchUserData();
    }
  }, [router, isAuthenticated, token, authLogout, authLoading]);

  const handleLogout = () => {
    authLogout();
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-700 text-lg">Cargando...</span>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header/Navbar */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Proyecto SERCO</h1>
              <p className="text-sm text-gray-600">Panel de Proveedor</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/"
                className="text-gray-600 hover:text-gray-800 font-medium"
              >
                Inicio
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Bienvenida */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            ¡Bienvenido, {user.name}! 👋
          </h2>
          <p className="text-gray-600">
            Este es tu panel de control como proveedor de servicios
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Información Personal */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                👤 Información Personal
              </h3>
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                Editar
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Nombre</label>
                <p className="text-gray-900">{user.name}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-gray-900">{user.email}</p>
              </div>
              
              {user.phone && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Teléfono</label>
                  <p className="text-gray-900">{user.phone}</p>
                </div>
              )}
              
              <div>
                <label className="text-sm font-medium text-gray-500">Rol</label>
                <p className="text-gray-900 capitalize">
                  {user.role === 'PROVIDER' ? 'Proveedor' : user.role}
                </p>
              </div>
            </div>
          </div>

          {/* Información del Servicio */}
          {user.providerProfile && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  🔧 Información del Servicio
                </h3>
                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                  Editar
                </button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Categoría</label>
                  <p className="text-gray-900">
                    {serviceCategoryLabels[user.providerProfile.serviceCategory] || user.providerProfile.serviceCategory}
                  </p>
                </div>
                
                {user.providerProfile.serviceDescription && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Descripción</label>
                    <p className="text-gray-900">{user.providerProfile.serviceDescription}</p>
                  </div>
                )}
                
                {user.providerProfile.location && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Ubicación</label>
                    <p className="text-gray-900">📍 {user.providerProfile.location}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  {user.providerProfile.experience !== null && user.providerProfile.experience !== undefined && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Experiencia</label>
                      <p className="text-gray-900">{user.providerProfile.experience} años</p>
                    </div>
                  )}
                  
                  {user.providerProfile.pricePerHour !== null && user.providerProfile.pricePerHour !== undefined && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Precio/Hora</label>
                      <p className="text-gray-900">${user.providerProfile.pricePerHour}</p>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Estado</label>
                    <p className={`font-medium ${user.providerProfile.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                      {user.providerProfile.isAvailable ? '✓ Disponible' : '✗ No Disponible'}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Calificación</label>
                    <p className="text-gray-900">
                      ⭐ {user.providerProfile.rating.toFixed(1)} ({user.providerProfile.totalReviews} reseñas)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Estadísticas/Próximas funcionalidades */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            📊 Estadísticas (Próximamente)
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-blue-600">0</p>
              <p className="text-sm text-gray-600">Trabajos Completados</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-green-600">0</p>
              <p className="text-sm text-gray-600">Reservas Pendientes</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-purple-600">$0</p>
              <p className="text-sm text-gray-600">Ganancias del Mes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
