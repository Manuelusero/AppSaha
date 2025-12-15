'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';

interface ProviderReference {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

interface ProviderProfile {
  id: string;
  serviceCategory: string;
  serviceDescription?: string;
  bio?: string;
  specialties?: string;
  experience?: number;
  pricePerHour?: number;
  location?: string;
  serviceRadius?: number;
  isAvailable: boolean;
  rating: number;
  totalReviews: number;
  profilePhoto?: string;
  workPhotos?: string;
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  website?: string;
  references?: ProviderReference[];
}

interface Provider {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: string;
  createdAt: string;
  providerProfile: ProviderProfile;
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

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  providerResponse: string | null;
  respondedAt: string | null;
  createdAt: string;
  client: {
    id: string;
    name: string;
    avatar: string | null;
  };
  booking: {
    serviceDate: string;
    description: string;
  };
}

interface ReviewsData {
  reviews: Review[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  stats: {
    averageRating: number;
    totalReviews: number;
    ratingDistribution: Array<{
      rating: number;
      _count: { rating: number };
    }>;
  };
}

export default function ProviderDetail() {
  const params = useParams();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [reviews, setReviews] = useState<ReviewsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [error, setError] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Verificar si el usuario está logueado
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    if (params.id) {
      fetchProvider(params.id as string);
      fetchReviews(params.id as string);
    }
  }, [params.id]);

  const fetchProvider = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/providers/${id}`);
      
      if (!response.ok) {
        throw new Error('Proveedor no encontrado');
      }

      const data = await response.json();
      setProvider(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar proveedor');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async (providerId: string, page: number = 1) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/reviews/provider/${providerId}?page=${page}&limit=5`
      );
      
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    } catch (err) {
      console.error('Error al cargar reseñas:', err);
    } finally {
      setLoadingReviews(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-700 text-lg">Cargando perfil...</span>
        </div>
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <p className="text-red-700 font-medium mb-4">❌ {error || 'Proveedor no encontrado'}</p>
          <Link
            href="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header/Navbar */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
              <span className="text-xl">←</span>
              <span className="font-medium">Volver a la búsqueda</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">Proyecto SAHA</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Card Principal */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
            {/* Header con nombre y estado */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  {provider.name}
                </h2>
                <p className="text-lg text-blue-600 font-medium">
                  {serviceCategoryLabels[provider.providerProfile.serviceCategory]}
                </p>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                provider.providerProfile.isAvailable 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {provider.providerProfile.isAvailable ? '✓ Disponible' : '✗ No Disponible'}
              </span>
            </div>

            {/* Rating Grande */}
            <div className="flex items-center mb-6 pb-6 border-b">
              <div className="flex items-center">
                <span className="text-yellow-500 text-3xl mr-2">⭐</span>
                <div>
                  <p className="text-3xl font-bold text-gray-800">
                    {provider.providerProfile.rating.toFixed(1)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {provider.providerProfile.totalReviews} reseñas
                  </p>
                </div>
              </div>
            </div>

            {/* Descripción */}
            {provider.providerProfile.serviceDescription && (
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3">Sobre el Servicio</h3>
                <p className="text-gray-700 leading-relaxed">
                  {provider.providerProfile.serviceDescription}
                </p>
              </div>
            )}

            {/* Información Detallada */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Columna 1 */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800 mb-3">Información</h3>
                
                {provider.providerProfile.location && (
                  <div className="flex items-start">
                    <span className="text-2xl mr-3">📍</span>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Ubicación</p>
                      <p className="text-gray-800">{provider.providerProfile.location}</p>
                    </div>
                  </div>
                )}

                {provider.providerProfile.experience !== null && provider.providerProfile.experience !== undefined && (
                  <div className="flex items-start">
                    <span className="text-2xl mr-3">💼</span>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Experiencia</p>
                      <p className="text-gray-800">{provider.providerProfile.experience} años</p>
                    </div>
                  </div>
                )}

                {provider.phone && (
                  <div className="flex items-start">
                    <span className="text-2xl mr-3">📞</span>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Teléfono</p>
                      <p className="text-gray-800">{provider.phone}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Columna 2 */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800 mb-3">Precios</h3>
                
                {provider.providerProfile.pricePerHour !== null && provider.providerProfile.pricePerHour !== undefined ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Tarifa por hora</p>
                        <p className="text-3xl font-bold text-green-600">
                          ${provider.providerProfile.pricePerHour}
                        </p>
                      </div>
                      <span className="text-4xl">💰</span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-gray-600 text-center">
                      Precio a consultar con el proveedor
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Mensaje de éxito */}
            {bookingSuccess && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 font-medium">✅ Solicitud enviada exitosamente</p>
                <p className="text-green-600 text-sm mt-1">El proveedor recibirá tu solicitud y te contactará pronto.</p>
              </div>
            )}

            {/* Botones de Acción */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
              <button
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                onClick={() => alert('Funcionalidad de contacto próximamente')}
              >
                Contactar Proveedor
              </button>
              <button
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                onClick={() => {
                  if (!isLoggedIn) {
                    alert('Debes iniciar sesión para solicitar un servicio');
                    window.location.href = '/login';
                    return;
                  }
                  setShowBookingModal(true);
                }}
              >
                Solicitar Servicio
              </button>
            </div>
          </div>

          {/* Sección de Reseñas */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">
                Reseñas y Calificaciones
              </h3>
              {reviews && reviews.stats.totalReviews > 0 && (
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold text-gray-800">
                      {reviews.stats.averageRating.toFixed(1)}
                    </span>
                    <span className="text-yellow-500 text-2xl">⭐</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {reviews.stats.totalReviews} reseña{reviews.stats.totalReviews !== 1 ? 's' : ''}
                  </p>
                </div>
              )}
            </div>

            {loadingReviews ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-3">Cargando reseñas...</p>
              </div>
            ) : reviews && reviews.reviews.length > 0 ? (
              <div className="space-y-6">
                {/* Distribución de calificaciones */}
                {reviews.stats.ratingDistribution.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <p className="text-sm font-medium text-gray-700 mb-3">Distribución de calificaciones:</p>
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map(star => {
                        const dist = reviews.stats.ratingDistribution.find(d => d.rating === star);
                        const count = dist?._count.rating || 0;
                        const percentage = reviews.stats.totalReviews > 0 
                          ? (count / reviews.stats.totalReviews) * 100 
                          : 0;
                        
                        return (
                          <div key={star} className="flex items-center gap-2">
                            <span className="text-sm text-gray-600 w-8">{star}★</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-yellow-500 h-2 rounded-full transition-all"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-600 w-8 text-right">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Lista de reseñas */}
                {reviews.reviews.map(review => (
                  <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        {review.client.avatar ? (
                          <img 
                            src={review.client.avatar} 
                            alt={review.client.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-semibold text-lg">
                              {review.client.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Contenido de la reseña */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-semibold text-gray-800">{review.client.name}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <span 
                                key={i} 
                                className={`text-lg ${i < review.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Servicio contratado */}
                        <p className="text-sm text-gray-600 mb-2">
                          📅 Servicio: {new Date(review.booking.serviceDate).toLocaleDateString('es-ES')}
                        </p>

                        {/* Comentario */}
                        {review.comment && (
                          <p className="text-gray-700 mb-3">{review.comment}</p>
                        )}

                        {/* Respuesta del proveedor */}
                        {review.providerResponse && (
                          <div className="bg-blue-50 border-l-4 border-blue-500 p-3 mt-3">
                            <p className="text-sm font-medium text-blue-900 mb-1">
                              Respuesta del proveedor:
                            </p>
                            <p className="text-sm text-blue-800">{review.providerResponse}</p>
                            <p className="text-xs text-blue-600 mt-1">
                              {new Date(review.respondedAt!).toLocaleDateString('es-ES')}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Paginación */}
                {reviews.pagination.totalPages > 1 && (
                  <div className="flex justify-center gap-2 pt-4">
                    {[...Array(reviews.pagination.totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => fetchReviews(provider.id, i + 1)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          reviews.pagination.page === i + 1
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p className="text-4xl mb-3">💬</p>
                <p className="text-lg font-medium mb-1">Aún no hay reseñas</p>
                <p className="text-sm">Sé el primero en calificar este proveedor</p>
              </div>
            )}
          </div>
        </div>

        {/* Modal de Formulario de Solicitud */}
        {showBookingModal && provider && (
          <BookingForm
            providerId={provider.id}
            providerName={provider.name}
            onClose={() => setShowBookingModal(false)}
            onSuccess={() => {
              setShowBookingModal(false);
              setBookingSuccess(true);
              setTimeout(() => setBookingSuccess(false), 5000);
            }}
          />
        )}
      </div>
    </div>
  );
}
