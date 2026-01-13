import { create } from 'zustand';
import { apiGet, apiPost, apiPut } from '@/utils/api';

export interface Booking {
  id: string;
  clientName: string;
  service: string;
  location: string;
  description: string;
  urgency: string;
  contactEmail: string;
  contactPhone: string;
  problemPhoto?: string | null;
  createdAt: string;
  status: 'pending' | 'accepted' | 'rejected';
}

interface BookingsState {
  // State
  bookings: Booking[];
  isLoading: boolean;
  error: string | null;
  selectedBooking: Booking | null;

  // Actions
  fetchBookings: () => Promise<void>;
  updateBookingStatus: (bookingId: string, status: string, budgetData?: any) => Promise<void>;
  selectBooking: (booking: Booking | null) => void;
  clearError: () => void;
  
  // Helpers
  getPendingBookings: () => Booking[];
  getAcceptedBookings: () => Booking[];
}

export const useBookingsStore = create<BookingsState>((set, get) => ({
  // Estado inicial
  bookings: [],
  isLoading: false,
  error: null,
  selectedBooking: null,

  // Cargar bookings del backend
  fetchBookings: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const data = await apiGet<Array<{
        id: string;
        client: { name: string; email: string; phone?: string };
        location?: string;
        address?: string;
        description: string;
        clientNotes?: string;
        problemPhoto?: string;
        createdAt: string;
        status: string;
      }>>('/bookings');

      // Transformar datos del backend
      const transformedBookings: Booking[] = data.map((booking) => {
        let problemPhotoUrl = null;
        if (booking.problemPhoto) {
          if (!booking.problemPhoto.startsWith('http') && !booking.problemPhoto.startsWith('data:')) {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            problemPhotoUrl = `${apiUrl}/uploads/problems/${booking.problemPhoto}`;
          } else {
            problemPhotoUrl = booking.problemPhoto;
          }
        }

        return {
          id: booking.id,
          clientName: booking.client.name,
          service: 'Servicio solicitado',
          location: booking.location || booking.address || 'Ubicación no especificada',
          description: booking.description,
          urgency: booking.clientNotes?.includes('Urgencia:')
            ? booking.clientNotes.split('Urgencia:')[1].split('.')[0].trim()
            : 'No especificada',
          contactEmail: booking.client.email,
          contactPhone: booking.client.phone || 'No especificado',
          problemPhoto: problemPhotoUrl,
          createdAt: new Date(booking.createdAt).toLocaleDateString('es-AR'),
          status: booking.status.toLowerCase() as 'pending' | 'accepted' | 'rejected',
        };
      });

      set({ bookings: transformedBookings, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'Error al cargar solicitudes', 
        isLoading: false 
      });
    }
  },

  // Actualizar estado de un booking
  updateBookingStatus: async (bookingId, status, budgetData) => {
    set({ isLoading: true, error: null });

    try {
      await apiPost(`/bookings/${bookingId}/send-budget`, budgetData);

      // Actualizar el booking en el estado local
      const bookings = get().bookings.map((booking) =>
        booking.id === bookingId
          ? { ...booking, status: status as 'pending' | 'accepted' | 'rejected' }
          : booking
      );

      set({ bookings, isLoading: false, selectedBooking: null });
    } catch (error: any) {
      set({ 
        error: error.message || 'Error al actualizar solicitud', 
        isLoading: false 
      });
    }
  },

  // Seleccionar un booking
  selectBooking: (booking) => {
    set({ selectedBooking: booking });
  },

  // Limpiar error
  clearError: () => {
    set({ error: null });
  },

  // Obtener bookings pendientes
  getPendingBookings: () => {
    return get().bookings.filter((b) => b.status === 'pending');
  },

  // Obtener bookings aceptadas
  getAcceptedBookings: () => {
    return get().bookings.filter((b) => b.status === 'accepted');
  },
}));
