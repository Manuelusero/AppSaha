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
  const [metodoContacto, setMetodoContacto] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
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
    // Validaciones básicas - Solo nombre y método de contacto
    if (!nombre) {
      alert('Por favor completá tu nombre');
      return;
    }
    
    if (!metodoContacto) {
      alert('Por favor seleccioná cómo preferís que te contactemos');
      return;
    }
    
    // Validar que tenga el dato de contacto correspondiente
    if (metodoContacto === 'Mail' && !email) {
      alert('Por favor ingresá tu email');
      return;
    }
    
    if ((metodoContacto === 'Whatsapp' || metodoContacto === 'Mensaje de texto') && !telefono) {
      alert('Por favor ingresá tu teléfono');
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
        formData.append('clientName', nombre);
        formData.append('serviceDate', new Date().toISOString());
        formData.append('description', descripcion);
        formData.append('urgency', urgencia);
        formData.append('location', ubicacion);
        formData.append('contactMethod', metodoContacto);
        
        // Agregar el dato de contacto correspondiente
        if (metodoContacto === 'Mail') {
          formData.append('clientEmail', email);
        } else {
          formData.append('clientPhone', telefono);
        }

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

      // Siempre mostrar el mismo mensaje de éxito
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
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FFFCF9' }}>
      {/* Header con degradado */}
      <header 
        className="w-full px-6 flex items-center relative"
        style={{ 
          background: 'linear-gradient(180deg, #3A5FA0 0%, #FFFCF9 100%)',
          height: '124px'
        }}
      >
        {/* Flecha de regreso */}
        <button
          onClick={() => router.back()}
          className="absolute left-6 top-6"
          style={{ cursor: 'pointer' }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2">
            <path d="M19 12H5M5 12l7 7M5 12l7-7" />
          </svg>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center px-6" style={{ paddingTop: '24px' }}>
        <div className="w-full max-w-md">
          {/* Título y subtítulo */}
          <div className="text-center" style={{ marginBottom: '48px' }}>
            <h1 style={{ 
              fontFamily: 'Maitree, serif', 
              fontSize: '32px', 
              lineHeight: '100%', 
              color: '#244C87', 
              fontWeight: 400,
              marginBottom: '8px'
            }}>
              Datos de contacto
            </h1>
            <p style={{ 
              fontFamily: 'Maitree, serif', 
              fontSize: '12px', 
              lineHeight: '100%', 
              color: '#000000', 
              fontWeight: 400,
              opacity: 0.6
            }}>
              Tus datos serán protejidos por el equipo de Serco,<br />en ningún momento se enviarán al profesional.
            </p>
          </div>

          {/* Campo de nombre */}
          <div style={{ marginBottom: '48px' }}>
            <label className="block" style={{ 
              fontFamily: 'Maitree, serif', 
              fontSize: '20px', 
              color: '#000000', 
              fontWeight: 400, 
              lineHeight: '100%', 
              letterSpacing: '0%', 
              opacity: 0.6,
              marginBottom: '8px'
            }}>
              Nombre
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Andrea"
              className="w-full px-4 py-3 rounded-full border-2 border-gray-300 focus:border-[#244C87] focus:outline-none bg-white"
              style={{ 
                fontFamily: 'Maitree, serif', 
                fontSize: '16px', 
                color: '#000000'
              }}
            />
          </div>

          {/* Método de contacto */}
          <div style={{ marginBottom: '48px' }}>
            <label className="block" style={{ 
              fontFamily: 'Maitree, serif', 
              fontSize: '20px', 
              color: '#000000', 
              fontWeight: 400, 
              lineHeight: '100%', 
              letterSpacing: '0%', 
              opacity: 0.6,
              marginBottom: '24px'
            }}>
              ¿Cómo preferís que te contactemos?
            </label>
            
            <div className="space-y-4">
              {/* Radio Mail */}
              <label className="flex items-center cursor-pointer">
                <div className="relative flex items-center justify-center w-6 h-6">
                  <input
                    type="radio"
                    name="contacto"
                    value="Mail"
                    checked={metodoContacto === 'Mail'}
                    onChange={(e) => setMetodoContacto(e.target.value)}
                    className="appearance-none w-6 h-6 rounded-full border-2 border-black cursor-pointer checked:bg-black"
                  />
                </div>
                <span style={{ 
                  fontFamily: 'Maitree, serif', 
                  fontSize: '16px', 
                  color: '#000000',
                  marginLeft: '12px'
                }}>
                  Mail
                </span>
              </label>

              {/* Radio Whatsapp */}
              <label className="flex items-center cursor-pointer">
                <div className="relative flex items-center justify-center w-6 h-6">
                  <input
                    type="radio"
                    name="contacto"
                    value="Whatsapp"
                    checked={metodoContacto === 'Whatsapp'}
                    onChange={(e) => setMetodoContacto(e.target.value)}
                    className="appearance-none w-6 h-6 rounded-full border-2 border-black cursor-pointer checked:bg-black"
                  />
                </div>
                <span style={{ 
                  fontFamily: 'Maitree, serif', 
                  fontSize: '16px', 
                  color: '#000000',
                  marginLeft: '12px'
                }}>
                  Whatsapp
                </span>
              </label>

              {/* Radio Mensaje de texto */}
              <label className="flex items-center cursor-pointer">
                <div className="relative flex items-center justify-center w-6 h-6">
                  <input
                    type="radio"
                    name="contacto"
                    value="Mensaje de texto"
                    checked={metodoContacto === 'Mensaje de texto'}
                    onChange={(e) => setMetodoContacto(e.target.value)}
                    className="appearance-none w-6 h-6 rounded-full border-2 border-black cursor-pointer checked:bg-black"
                  />
                </div>
                <span style={{ 
                  fontFamily: 'Maitree, serif', 
                  fontSize: '16px', 
                  color: '#000000',
                  marginLeft: '12px'
                }}>
                  Mensaje de texto
                </span>
              </label>
            </div>

            {/* Campo condicional según método seleccionado */}
            {metodoContacto === 'Mail' && (
              <div style={{ marginTop: '32px' }}>
                <label className="block" style={{ 
                  fontFamily: 'Maitree, serif', 
                  fontSize: '20px', 
                  color: '#000000', 
                  fontWeight: 400, 
                  lineHeight: '100%', 
                  letterSpacing: '0%', 
                  opacity: 0.6,
                  marginBottom: '8px'
                }}>
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tucorreo@ejemplo.com"
                  className="w-full px-4 py-3 rounded-full border-2 border-gray-300 focus:border-[#244C87] focus:outline-none bg-white"
                  style={{ 
                    fontFamily: 'Maitree, serif', 
                    fontSize: '16px', 
                    color: '#000000'
                  }}
                />
              </div>
            )}

            {(metodoContacto === 'Whatsapp' || metodoContacto === 'Mensaje de texto') && (
              <div style={{ marginTop: '32px' }}>
                <label className="block" style={{ 
                  fontFamily: 'Maitree, serif', 
                  fontSize: '20px', 
                  color: '#000000', 
                  fontWeight: 400, 
                  lineHeight: '100%', 
                  letterSpacing: '0%', 
                  opacity: 0.6,
                  marginBottom: '8px'
                }}>
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="+54 1234558690"
                  className="w-full px-4 py-3 rounded-full border-2 border-gray-300 focus:border-[#244C87] focus:outline-none bg-white"
                  style={{ 
                    fontFamily: 'Maitree, serif', 
                    fontSize: '16px', 
                    color: '#000000'
                  }}
                />
              </div>
            )}
          </div>

          {/* Botón Enviar */}
          <div className="flex justify-start">
            <button
              onClick={handleSubmit}
              className="px-8 py-3 rounded-full transition-colors shadow-md"
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
      </main>

      <Footer />

      {/* Modal de confirmación */}
      {showModal && (
        <>
          {/* Overlay con opacidad */}
          <div 
            className="fixed inset-0 z-40"
            style={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(2px)'
            }}
            onClick={handleCloseModal}
          />
          
          {/* Modal centrado */}
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center px-6"
            onClick={handleCloseModal}
          >
            <div 
              className="relative rounded-3xl p-8 max-w-md w-full"
              style={{ 
                backgroundColor: '#B45B39',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Botón cerrar */}
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 text-white hover:opacity-80 transition-opacity"
                style={{ cursor: 'pointer' }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>

              <div className="text-center">
                <h2 
                  className="mb-4"
                  style={{ 
                    fontFamily: 'Maitree, serif', 
                    fontSize: '32px', 
                    fontWeight: 400,
                    color: '#FFFFFF',
                    lineHeight: '120%'
                  }}
                >
                  Presupuesto pedido!
                </h2>
                <p 
                  style={{ 
                    fontFamily: 'Maitree, serif', 
                    fontSize: '16px', 
                    fontWeight: 400,
                    color: '#FFFFFF',
                    lineHeight: '140%'
                  }}
                >
                  En las próximas 48hs recibirás<br />un correo/mensaje con el<br />presupuesto detallado.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
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
