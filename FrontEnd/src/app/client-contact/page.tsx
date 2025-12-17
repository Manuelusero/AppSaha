'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';

interface BookingInfo {
  id: string;
  providerName: string;
  description: string;
  budgetPrice: number;
  budgetDetails: string;
  budgetMaterials?: string;
  budgetTime?: string;
}

function ClientContactContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(true);
  const [bookingInfo, setBookingInfo] = useState<BookingInfo | null>(null);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [contactMethod, setContactMethod] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      alert('Link inválido');
      router.push('/');
      return;
    }

    // Cargar información del presupuesto
    fetch(`http://localhost:8000/api/bookings/client-data/${token}`)
      .then(res => {
        if (!res.ok) throw new Error('Link inválido o expirado');
        return res.json();
      })
      .then(data => {
        setBookingInfo(data.booking);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error:', err);
        alert(err.message);
        router.push('/');
      });
  }, [token, router]);

  const handleSubmit = async () => {
    // Validaciones
    if (!email || !phone || !contactMethod) {
      alert('Por favor completá todos los campos');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Email inválido');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`http://localhost:8000/api/bookings/client-data/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          clientEmail: email,
          clientPhone: phone,
          clientContactMethod: contactMethod
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al guardar datos');
      }

      alert('¡Listo! Recibirás el presupuesto en tu ' + (contactMethod === 'EMAIL' ? 'email' : 'WhatsApp') + ' pronto.');
      router.push('/');

    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      alert(`Error: ${errorMessage}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#244C87] mx-auto mb-4"></div>
          <p style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#244C87' }}>
            Cargando...
          </p>
        </div>
      </div>
    );
  }

  if (!bookingInfo) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image 
            src="/Logo.png" 
            alt="Serco Logo" 
            width={200} 
            height={60}
            className="h-auto"
            priority
          />
        </div>

        {/* Card del Presupuesto */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
          <h1 style={{ fontFamily: 'Maitree, serif', fontSize: '32px', fontWeight: 600, color: '#244C87', marginBottom: '24px', textAlign: 'center' }}>
            ¡Tenés un presupuesto!
          </h1>

          <div className="space-y-4 mb-8">
            <div>
              <p style={{ fontFamily: 'Maitree, serif', fontSize: '14px', color: '#666', marginBottom: '4px' }}>
                De:
              </p>
              <p style={{ fontFamily: 'Maitree, serif', fontSize: '20px', fontWeight: 600, color: '#000' }}>
                {bookingInfo.providerName}
              </p>
            </div>

            <div>
              <p style={{ fontFamily: 'Maitree, serif', fontSize: '14px', color: '#666', marginBottom: '4px' }}>
                Servicio solicitado:
              </p>
              <p style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000' }}>
                {bookingInfo.description}
              </p>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <p style={{ fontFamily: 'Maitree, serif', fontSize: '14px', color: '#666', marginBottom: '4px' }}>
                Precio:
              </p>
              <p style={{ fontFamily: 'Maitree, serif', fontSize: '28px', fontWeight: 700, color: '#DC5F00' }}>
                ${bookingInfo.budgetPrice.toLocaleString()}
              </p>
            </div>

            <div>
              <p style={{ fontFamily: 'Maitree, serif', fontSize: '14px', color: '#666', marginBottom: '4px' }}>
                Detalles del trabajo:
              </p>
              <p style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000', whiteSpace: 'pre-wrap' }}>
                {bookingInfo.budgetDetails}
              </p>
            </div>

            {bookingInfo.budgetMaterials && (
              <div>
                <p style={{ fontFamily: 'Maitree, serif', fontSize: '14px', color: '#666', marginBottom: '4px' }}>
                  Materiales:
                </p>
                <p style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000', whiteSpace: 'pre-wrap' }}>
                  {bookingInfo.budgetMaterials}
                </p>
              </div>
            )}

            {bookingInfo.budgetTime && (
              <div>
                <p style={{ fontFamily: 'Maitree, serif', fontSize: '14px', color: '#666', marginBottom: '4px' }}>
                  Tiempo estimado:
                </p>
                <p style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000' }}>
                  {bookingInfo.budgetTime}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Formulario de Contacto */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h2 style={{ fontFamily: 'Maitree, serif', fontSize: '24px', fontWeight: 600, color: '#244C87', marginBottom: '16px' }}>
            ¿Cómo querés que te contactemos?
          </h2>

          <p style={{ fontFamily: 'Maitree, serif', fontSize: '14px', color: '#666', marginBottom: '24px' }}>
            Para enviarte el presupuesto completo y coordinar el servicio, necesitamos tus datos de contacto.
          </p>

          <div className="space-y-6">
            {/* Email */}
            <div>
              <label style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000', display: 'block', marginBottom: '8px' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full px-5 py-4 rounded-full border-2 border-gray-300 focus:border-[#244C87] focus:outline-none bg-white"
                style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000' }}
              />
            </div>

            {/* Teléfono */}
            <div>
              <label style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000', display: 'block', marginBottom: '8px' }}>
                Teléfono
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+54 11 1234-5678"
                className="w-full px-5 py-4 rounded-full border-2 border-gray-300 focus:border-[#244C87] focus:outline-none bg-white"
                style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000' }}
              />
            </div>

            {/* Método preferido */}
            <div>
              <label style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000', display: 'block', marginBottom: '12px' }}>
                Método preferido de contacto:
              </label>
              <div className="space-y-3">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="contactMethod"
                    value="EMAIL"
                    checked={contactMethod === 'EMAIL'}
                    onChange={(e) => setContactMethod(e.target.value)}
                    className="w-5 h-5 mr-3"
                    style={{ accentColor: '#244C87' }}
                  />
                  <span style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000' }}>
                    Email
                  </span>
                </label>

                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="contactMethod"
                    value="WHATSAPP"
                    checked={contactMethod === 'WHATSAPP'}
                    onChange={(e) => setContactMethod(e.target.value)}
                    className="w-5 h-5 mr-3"
                    style={{ accentColor: '#244C87' }}
                  />
                  <span style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000' }}>
                    WhatsApp
                  </span>
                </label>
              </div>
            </div>

            {/* Botón */}
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full py-4 rounded-full transition-all duration-300 shadow-md"
              style={{ 
                fontFamily: 'Maitree, serif', 
                fontSize: '18px', 
                fontWeight: 600,
                color: '#FFFFFF', 
                backgroundColor: submitting ? '#999999' : '#244C87',
                cursor: submitting ? 'not-allowed' : 'pointer'
              }}
            >
              {submitting ? 'Enviando...' : 'Recibir presupuesto'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ClientContact() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#244C87] mx-auto mb-4"></div>
          <p style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#244C87' }}>
            Cargando...
          </p>
        </div>
      </div>
    }>
      <ClientContactContent />
    </Suspense>
  );
}
