'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Header, Footer } from '@/components/layout';
import { Input, Button, Modal, LoadingSpinner } from '@/components/ui';
import { apiGet, apiUpload } from '@/utils';

function ContactDetailsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [providerName, setProviderName] = useState('');

  // Obtener el nombre del profesional si es solo uno
  useEffect(() => {
    const fetchProviderName = async () => {
      const professionalsParam = searchParams.get('professionals');
      if (!professionalsParam) return;

      const professionalIds = professionalsParam.split(',');
      
      // Si es solo un profesional, obtener su nombre
      if (professionalIds.length === 1) {
        try {
          const data = await apiGet<{ name: string }>(`/providers/${professionalIds[0]}`);
          setProviderName(data.name);
        } catch (error) {
          console.error('Error fetching provider:', error);
        }
      }
    };

    fetchProviderName();
  }, [searchParams]);

  const handleSubmit = async () => {
    // Validaciones básicas - Solo nombre y apellido
    if (!nombre || !apellido) {
      alert('Por favor completá tu nombre y apellido');
      return;
    }

    const professionalsParam = searchParams.get('professionals') || '';
    const professionalIds = professionalsParam.split(',').filter(id => id.trim());
    const descripcion = searchParams.get('descripcion') || '';
    const urgencia = searchParams.get('urgencia') || 'Medio';
    const ubicacion = searchParams.get('ubicacion') || '';

    // Obtener la foto del localStorage si existe
    const photoBase64 = localStorage.getItem('jobRequestPhoto');

    try {
      const bookingPromises = professionalIds.map(async (providerId) => {
        // Crear FormData para enviar la foto como archivo
        const formData = new FormData();
        formData.append('providerId', providerId.trim());
        formData.append('clientName', `${nombre} ${apellido}`);
        formData.append('serviceDate', new Date().toISOString());
        formData.append('description', descripcion);
        formData.append('urgency', urgencia);
        formData.append('location', ubicacion);

        // Convertir base64 a archivo si existe
        if (photoBase64) {
          try {
            // Convertir base64 a Blob
            const base64Response = await fetch(photoBase64);
            const blob = await base64Response.blob();
            const file = new File([blob], 'problem-photo.jpg', { type: 'image/jpeg' });
            formData.append('problemPhoto', file);
          } catch (error) {
            console.error('Error al convertir imagen:', error);
          }
        }

        return await apiUpload('/bookings/guest', formData);
      });

      await Promise.all(bookingPromises);

      // Limpiar localStorage después de enviar
      localStorage.removeItem('jobRequestPhoto');
      localStorage.removeItem('jobRequestPhotoName');

      // Determinar el mensaje según la cantidad de profesionales
      if (professionalIds.length === 1 && providerName) {
        setModalMessage(`Listo! ${providerName} recibió tu mensaje`);
      } else {
        setModalMessage('Listo! Tus mensajes fueron enviados');
      }

      setShowModal(true);
    } catch (error) {
      console.error('Error al enviar solicitud:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      alert(`Error al enviar la solicitud: ${errorMessage}`);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    router.push('/');
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(to bottom, #a8c5e8 0%, #f5f5f5 30%, #ffffff 100%)' }}>
      <Header />

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Título */}
          <h1 className="text-center mb-12" style={{ fontFamily: 'Maitree, serif', fontSize: '40px', lineHeight: '100%', color: '#244C87', fontWeight: 400 }}>
            ¿Quién solicita el servicio?
          </h1>

          {/* Formulario */}
          <div className="space-y-6">
            {/* Nombre */}
            <Input
              label="Nombre"
              placeholder="Andrea"
              value={nombre}
              onChange={setNombre}
              className="px-5 py-4"
            />

            {/* Apellido */}
            <Input
              label="Apellido"
              placeholder="González"
              value={apellido}
              onChange={setApellido}
              className="px-5 py-4"
            />

            {/* Botón Enviar */}
            <div className="flex justify-end pt-6">
              <button
                onClick={handleSubmit}
                className="px-12 py-3 rounded-full transition-all duration-300 shadow-md"
                style={{ 
                  fontFamily: 'Maitree, serif', 
                  fontSize: '18px', 
                  color: '#244C87', 
                  fontWeight: 500, 
                  backgroundColor: '#E8EAF6',
                  cursor: 'pointer'
                }}
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Modal de confirmación */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        variant="brown"
        maxWidth="sm"
      >
        <div className="text-center">
          <h2 
            className="mb-6"
            style={{ 
              fontFamily: 'Maitree, serif', 
              fontSize: '28px', 
              fontWeight: 400,
              color: '#FFFFFF',
              lineHeight: '1.3'
            }}
          >
            {modalMessage}
          </h2>
          <p 
            style={{ 
              fontFamily: 'Maitree, serif', 
              fontSize: '16px', 
              fontWeight: 400,
              color: '#FFFFFF',
              opacity: 0.9
            }}
          >
            El profesional te contactará en breve
          </p>
        </div>
      </Modal>
    </div>
  );
}

export default function ContactDetails() {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen message="Cargando..." />}>
      <ContactDetailsContent />
    </Suspense>
  );
}
