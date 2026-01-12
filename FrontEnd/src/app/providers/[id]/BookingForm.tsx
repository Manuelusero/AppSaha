'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { apiPost, TOKEN_KEY } from '@/utils';

interface BookingFormProps {
  providerId: string;
  providerName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function BookingForm({ providerId, providerName, onClose, onSuccess }: BookingFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    serviceDate: '',
    serviceTime: '',
    description: '',
    address: '',
    estimatedHours: '',
    clientNotes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem(TOKEN_KEY);

      if (!token) {
        // Redirigir al login si no está autenticado
        localStorage.setItem('redirectAfterLogin', window.location.pathname);
        router.push('/login');
        return;
      }

      await apiPost('/bookings', {
        ...formData,
        providerId
      });

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear solicitud');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Solicitar Servicio
              </h2>
              <p className="text-gray-600">
                Proveedor: <strong>{providerName}</strong>
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm font-medium">❌ {error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Fecha y Hora */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="serviceDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha del Servicio *
                </label>
                <input
                  type="date"
                  id="serviceDate"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={formData.serviceDate}
                  onChange={(e) => setFormData({ ...formData, serviceDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="serviceTime" className="block text-sm font-medium text-gray-700 mb-2">
                  Hora Preferida
                </label>
                <input
                  type="time"
                  id="serviceTime"
                  value={formData.serviceTime}
                  onChange={(e) => setFormData({ ...formData, serviceTime: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Descripción */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Descripción del Servicio *
              </label>
              <textarea
                id="description"
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                placeholder="Describe detalladamente qué necesitas..."
                disabled={loading}
              />
            </div>

            {/* Dirección */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Dirección donde se realizará el servicio
              </label>
              <input
                type="text"
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                placeholder="Calle, número, piso, etc."
                disabled={loading}
              />
            </div>

            {/* Horas Estimadas */}
            <div>
              <label htmlFor="estimatedHours" className="block text-sm font-medium text-gray-700 mb-2">
                Horas Estimadas del Trabajo
              </label>
              <input
                type="number"
                id="estimatedHours"
                min="0.5"
                step="0.5"
                value={formData.estimatedHours}
                onChange={(e) => setFormData({ ...formData, estimatedHours: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                placeholder="Ejemplo: 2"
                disabled={loading}
              />
            </div>

            {/* Notas Adicionales */}
            <div>
              <label htmlFor="clientNotes" className="block text-sm font-medium text-gray-700 mb-2">
                Notas Adicionales
              </label>
              <textarea
                id="clientNotes"
                rows={3}
                value={formData.clientNotes}
                onChange={(e) => setFormData({ ...formData, clientNotes: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                placeholder="Cualquier información adicional..."
                disabled={loading}
              />
            </div>

            {/* Botones */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded-lg transition-colors"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:bg-gray-400"
                disabled={loading}
              >
                {loading ? 'Enviando...' : 'Enviar Solicitud'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
