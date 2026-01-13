'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiGet, apiPost, TOKEN_KEY } from '@/utils';
import { LoadingSpinner, Modal, StarRating, StatusBadge } from '@/components/ui';

interface Booking {
  id: string;
  serviceDate: string;
  serviceTime: string | null;
  description: string;
  address: string | null;
  status: string;
  totalPrice: number | null;
  estimatedHours: number | null;
  clientNotes: string | null;
  providerNotes: string | null;
  createdAt: string;
  provider: {
    id: string;
    serviceCategory: string;
    user: {
      name: string;
      phone: string | null;
    };
  };
  review: {
    id: string;
    rating: number;
    comment: string | null;
  } | null;
}

const statusLabels: { [key: string]: { label: string; color: string } } = {
  PENDING: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
  ACCEPTED: { label: 'Aceptada', color: 'bg-blue-100 text-blue-800' },
  REJECTED: { label: 'Rechazada', color: 'bg-red-100 text-red-800' },
  CONFIRMED: { label: 'Confirmada', color: 'bg-green-100 text-green-800' },
  IN_PROGRESS: { label: 'En Progreso', color: 'bg-purple-100 text-purple-800' },
  COMPLETED: { label: 'Completada', color: 'bg-green-100 text-green-800' },
  CANCELLED: { label: 'Cancelada', color: 'bg-gray-100 text-gray-800' },
};

export default function ClientDashboard() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: ''
  });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      router.push('/login');
      return;
    }
    fetchBookings();
  }, [router]);

  const fetchBookings = async () => {
    try {
      const data = await apiGet<any[]>('/bookings');
      setBookings(data);
    } catch (error) {
      console.error('Error al cargar bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenReviewModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setReviewData({ rating: 5, comment: '' });
    setShowReviewModal(true);
  };

  const handleSubmitReview = async () => {
    if (!selectedBooking) return;

    setSubmittingReview(true);
    try {
      await apiPost('/reviews', {
        bookingId: selectedBooking.id,
        rating: reviewData.rating,
        comment: reviewData.comment || null
      });
      
      setShowReviewModal(false);
      fetchBookings(); // Recargar para actualizar el estado
      alert('¡Reseña enviada exitosamente!');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al enviar reseña');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-gray-800">
            🛠️ SERCO
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-600 hover:text-gray-800">
              Buscar Servicios
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </nav>

      {/* Contenido */}
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Mis Solicitudes de Servicio
        </h1>
        <p className="text-gray-600 mb-8">
          Aquí puedes ver todas tus solicitudes y calificar los servicios completados
        </p>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <p className="text-4xl mb-4">📋</p>
            <p className="text-xl font-medium text-gray-800 mb-2">
              No tienes solicitudes aún
            </p>
            <p className="text-gray-600 mb-6">
              Busca un proveedor y solicita un servicio
            </p>
            <Link
              href="/"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Buscar Servicios
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Información principal */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-bold text-gray-800">
                        {booking.provider.user.name}
                      </h3>
                      <StatusBadge status={booking.status as any} />
                    </div>

                    <p className="text-gray-700 mb-2">
                      <strong>Servicio:</strong> {booking.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <span>📅 {new Date(booking.serviceDate).toLocaleDateString('es-ES')}</span>
                      {booking.serviceTime && <span>🕐 {booking.serviceTime}</span>}
                      {booking.address && <span>📍 {booking.address}</span>}
                      {booking.totalPrice && <span>💰 ${booking.totalPrice}</span>}
                    </div>

                    {booking.providerNotes && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm font-medium text-blue-900 mb-1">Notas del proveedor:</p>
                        <p className="text-sm text-blue-800">{booking.providerNotes}</p>
                      </div>
                    )}
                  </div>

                  {/* Acciones */}
                  <div className="flex flex-col gap-2">
                    {booking.status === 'COMPLETED' && !booking.review && (
                      <button
                        onClick={() => handleOpenReviewModal(booking)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                      >
                        ⭐ Calificar Servicio
                      </button>
                    )}
                    
                    {booking.review && (
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-sm font-medium text-green-900 mb-1">Ya calificaste</p>
                        <StarRating rating={booking.review.rating} readonly size="sm" />
                      </div>
                    )}

                    <Link
                      href={`/providers/${booking.provider.id}`}
                      className="text-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                      Ver Proveedor
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Reseña */}
      <Modal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        title="Calificar Servicio"
        maxWidth="md"
      >
        {selectedBooking && (
          <>
            <p className="text-gray-600 mb-4">
              ¿Cómo fue tu experiencia con <strong>{selectedBooking.provider.user.name}</strong>?
            </p>

            {/* Rating */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Calificación *
              </label>
              <StarRating
                rating={reviewData.rating}
                onChange={(rating) => setReviewData({ ...reviewData, rating })}
                showLabel
                size="lg"
              />
            </div>

            {/* Comentario */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comentario (opcional)
              </label>
              <textarea
                value={reviewData.comment}
                onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                placeholder="Cuéntanos sobre tu experiencia..."
              />
            </div>

            {/* Botones */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowReviewModal(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 rounded-lg transition-colors"
                disabled={submittingReview}
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmitReview}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors disabled:bg-gray-400"
                disabled={submittingReview}
              >
                {submittingReview ? 'Enviando...' : 'Enviar Reseña'}
              </button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
