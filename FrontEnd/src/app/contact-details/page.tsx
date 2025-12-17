'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';

export default function ContactDetails() {
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
          const response = await fetch(`http://localhost:8000/api/providers/${professionalIds[0]}`);
          if (response.ok) {
            const data = await response.json();
            setProviderName(data.name);
          }
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

        const response = await fetch('http://localhost:8000/api/bookings/guest', {
          method: 'POST',
          body: formData // Enviar FormData en lugar de JSON
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Error al enviar solicitud');
        }

        return response.json();
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
      {/* Header */}
      <header className="px-6 py-4 flex items-center">
        <button 
          onClick={() => window.history.back()}
          className="p-2"
          style={{ cursor: 'pointer' }}
        >
          <svg width="24" height="24" fill="none" stroke="#000" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
      </header>

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
            <div>
              <label className="block mb-2" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000000', fontWeight: 400 }}>
                Nombre
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Andrea"
                className="w-full px-5 py-4 rounded-full border-2 border-gray-300 focus:border-[#244C87] focus:outline-none bg-white"
                style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000000' }}
              />
            </div>

            {/* Apellido */}
            <div>
              <label className="block mb-2" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000000', fontWeight: 400 }}>
                Apellido
              </label>
              <input
                type="text"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                placeholder="González"
                className="w-full px-5 py-4 rounded-full border-2 border-gray-300 focus:border-[#244C87] focus:outline-none bg-white"
                style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000000' }}
              />
            </div>

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

      {/* Footer */}
      <footer className="w-full text-white mt-20">
        <div className="w-full bg-[#244C87]" style={{ height: '60px' }}></div>
        
        <div className="w-full bg-white py-8">
          <div className="flex justify-center">
            <Image 
              src="/Logo.png" 
              alt="SaHa Logo" 
              width={484} 
              height={134}
              className="w-auto"
              style={{ maxWidth: '484px', height: 'auto' }}
            />
          </div>
        </div>

        <div className="w-full bg-[#244C87] py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-center mb-16" style={{ gap: '86px', paddingLeft: '49.05px', paddingRight: '49.05px' }}>
              <a href="#" className="hover:opacity-80 transition-opacity">
                <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a href="#" className="hover:opacity-80 transition-opacity">
                <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                </svg>
              </a>
              <a href="#" className="hover:opacity-80 transition-opacity">
                <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                </svg>
              </a>
              <a href="#" className="hover:opacity-80 transition-opacity">
                <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16 text-center">
              <div>
                <h3 className="mb-6" style={{ fontFamily: 'Maitree, serif', fontWeight: 400, fontSize: '24px' }}>Para Clientes</h3>
                <ul className="space-y-3">
                  <li><a href="#" className="hover:opacity-80" style={{ fontFamily: 'Maitree, serif', fontSize: '16px' }}>Buscar Servidores</a></li>
                  <li><a href="#" className="hover:opacity-80" style={{ fontFamily: 'Maitree, serif', fontSize: '16px' }}>¿Cómo Funciona?</a></li>
                  <li><a href="#" className="hover:opacity-80" style={{ fontFamily: 'Maitree, serif', fontSize: '16px' }}>Seguridad y Confianza</a></li>
                  <li><a href="#" className="hover:opacity-80" style={{ fontFamily: 'Maitree, serif', fontSize: '16px' }}>Ayuda</a></li>
                </ul>
              </div>

              <div>
                <h3 className="mb-6" style={{ fontFamily: 'Maitree, serif', fontWeight: 400, fontSize: '24px' }}>Para Proveedores</h3>
                <ul className="space-y-3">
                  <li><a href="#" className="hover:opacity-80" style={{ fontFamily: 'Maitree, serif', fontSize: '16px' }}>Sumate como proveedor</a></li>
                  <li><a href="#" className="hover:opacity-80" style={{ fontFamily: 'Maitree, serif', fontSize: '16px' }}>Experiencias</a></li>
                  <li><a href="#" className="hover:opacity-80" style={{ fontFamily: 'Maitree, serif', fontSize: '16px' }}>Recursos útiles</a></li>
                  <li><a href="#" className="hover:opacity-80" style={{ fontFamily: 'Maitree, serif', fontSize: '16px' }}>Soporte Proveedores</a></li>
                </ul>
              </div>

              <div>
                <h3 className="mb-6" style={{ fontFamily: 'Maitree, serif', fontWeight: 400, fontSize: '24px' }}>Empresa</h3>
                <ul className="space-y-3">
                  <li><a href="#" className="hover:opacity-80" style={{ fontFamily: 'Maitree, serif', fontSize: '16px' }}>Sobre nosotros</a></li>
                  <li><a href="#" className="hover:opacity-80" style={{ fontFamily: 'Maitree, serif', fontSize: '16px' }}>Trabaja con nosotros</a></li>
                  <li><a href="#" className="hover:opacity-80" style={{ fontFamily: 'Maitree, serif', fontSize: '16px' }}>Contacto</a></li>
                  <li><a href="#" className="hover:opacity-80" style={{ fontFamily: 'Maitree, serif', fontSize: '16px' }}>Prensa</a></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-white/30 mb-8"></div>

            <div className="text-center">
              <p style={{ fontFamily: 'Maitree, serif', fontStyle: 'italic', fontSize: '16px' }}>Creado por Bren y Manu</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Modal de confirmación */}
      {showModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={handleCloseModal}
        >
          <div 
            className="relative mx-6"
            style={{
              width: '432px',
              maxWidth: '90%',
              backgroundColor: '#A0724E',
              borderRadius: '24px',
              padding: '48px 32px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón cerrar */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4"
              style={{ cursor: 'pointer', background: 'none', border: 'none', padding: '8px' }}
            >
              <svg width="24" height="24" fill="none" stroke="#FFFFFF" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>

            {/* Contenido del modal */}
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
          </div>
        </div>
      )}
    </div>
  );
}
