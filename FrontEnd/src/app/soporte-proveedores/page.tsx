'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Header, Footer } from '@/components/layout';

export default function SoporteProveedores() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    asunto: '',
    mensaje: ''
  });
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const asuntosOptions = [
    { value: 'cuenta', label: 'Problemas con mi cuenta' },
    { value: 'pagos', label: 'Pagos y facturación' },
    { value: 'solicitudes', label: 'Gestión de solicitudes' },
    { value: 'perfil', label: 'Actualización de perfil' },
    { value: 'verificacion', label: 'Verificación de documentos' },
    { value: 'tecnico', label: 'Soporte técnico' },
    { value: 'otro', label: 'Otro' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/support/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          tipo: 'proveedor'
        }),
      });

      if (response.ok) {
        setEnviado(true);
        setFormData({ nombre: '', email: '', telefono: '', asunto: '', mensaje: '' });
        setTimeout(() => setEnviado(false), 5000);
      }
    } catch (error) {
      console.error('Error al enviar:', error);
      alert('Hubo un error al enviar el mensaje. Por favor, intentá nuevamente.');
    } finally {
      setEnviando(false);
    }
  };

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (dropdownOpen && !target.closest('.dropdown-container')) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-16">
        {/* Título principal */}
        <h1 
          className="text-center mb-6"
          style={{ 
            fontFamily: 'Maitree, serif', 
            fontSize: '48px', 
            fontWeight: 700, 
            color: '#244C87',
            lineHeight: '1.2'
          }}
        >
          Soporte para Proveedores
        </h1>

        <p 
          className="text-center mb-12"
          style={{ 
            fontFamily: 'Maitree, serif', 
            fontSize: '18px', 
            color: '#666',
            lineHeight: '1.6'
          }}
        >
          ¿Tenés alguna consulta sobre tu cuenta, pagos o servicios? Estamos acá para ayudarte.
        </p>

        {/* Contact Form */}
        <div className="bg-white rounded-3xl border-2 border-gray-200 p-8 mb-12 shadow-lg">
          <h2 
            className="mb-6 text-center"
            style={{ 
              fontFamily: 'Maitree, serif', 
              fontSize: '28px', 
              fontWeight: 600, 
              color: '#244C87'
            }}
          >
            Contactanos
          </h2>

          {enviado ? (
            <div 
              className="text-center py-8 rounded-2xl"
              style={{ 
                backgroundColor: '#E8F0FC',
                border: '2px solid #244C87'
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>✓</div>
              <p style={{ 
                fontFamily: 'Maitree, serif', 
                fontSize: '20px', 
                color: '#244C87',
                fontWeight: 600
              }}>
                ¡Mensaje enviado con éxito!
              </p>
              <p style={{ 
                fontFamily: 'Maitree, serif', 
                fontSize: '16px', 
                color: '#666',
                marginTop: '8px'
              }}>
                Te responderemos a la brevedad.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label 
                  htmlFor="nombre"
                  className="block mb-2"
                  style={{ 
                    fontFamily: 'Maitree, serif', 
                    fontSize: '16px', 
                    color: '#244C87',
                    fontWeight: 500
                  }}
                >
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  id="nombre"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  className="w-full px-4 py-3 rounded-2xl border-2 outline-none transition-colors"
                  style={{ 
                    fontFamily: 'Maitree, serif',
                    fontSize: '16px',
                    borderColor: '#D1D5DB',
                    color: '#000000'
                  }}
                  placeholder="Juan Pérez"
                />
              </div>

              <div>
                <label 
                  htmlFor="email"
                  className="block mb-2"
                  style={{ 
                    fontFamily: 'Maitree, serif', 
                    fontSize: '16px', 
                    color: '#244C87',
                    fontWeight: 500
                  }}
                >
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 rounded-2xl border-2 outline-none transition-colors"
                  style={{ 
                    fontFamily: 'Maitree, serif',
                    fontSize: '16px',
                    borderColor: '#D1D5DB',
                    color: '#000000'
                  }}
                  placeholder="juan.perez@example.com"
                />
              </div>

              <div>
                <label 
                  htmlFor="telefono"
                  className="block mb-2"
                  style={{ 
                    fontFamily: 'Maitree, serif', 
                    fontSize: '16px', 
                    color: '#244C87',
                    fontWeight: 500
                  }}
                >
                  Teléfono
                </label>
                <input
                  type="tel"
                  id="telefono"
                  value={formData.telefono}
                  onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                  className="w-full px-4 py-3 rounded-2xl border-2 outline-none transition-colors"
                  style={{ 
                    fontFamily: 'Maitree, serif',
                    fontSize: '16px',
                    borderColor: '#D1D5DB',
                    color: '#000000'
                  }}
                  placeholder="+54 9 11 1234-5678"
                />
              </div>

              <div className="dropdown-container">
                <label 
                  htmlFor="asunto"
                  className="block mb-2"
                  style={{ 
                    fontFamily: 'Maitree, serif', 
                    fontSize: '16px', 
                    color: '#244C87',
                    fontWeight: 500
                  }}
                >
                  Asunto *
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="w-full px-4 py-3 rounded-2xl border-2 outline-none transition-colors text-left flex items-center justify-between"
                    style={{ 
                      fontFamily: 'Maitree, serif',
                      fontSize: '15px',
                      borderColor: dropdownOpen ? '#244C87' : '#D1D5DB',
                      color: formData.asunto ? '#000000' : '#999',
                      backgroundColor: 'white'
                    }}
                  >
                    <span>
                      {formData.asunto 
                        ? asuntosOptions.find(opt => opt.value === formData.asunto)?.label 
                        : 'Seleccioná un tema'}
                    </span>
                    <svg 
                      width="16" 
                      height="16" 
                      viewBox="0 0 16 16" 
                      fill="none"
                      style={{ 
                        transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s'
                      }}
                    >
                      <path d="M4 6L8 10L12 6" stroke="#244C87" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  
                  {dropdownOpen && (
                    <div 
                      className="absolute w-full mt-2 rounded-2xl border-2 overflow-hidden shadow-lg z-10"
                      style={{ 
                        borderColor: '#244C87',
                        backgroundColor: 'white',
                        maxHeight: '280px',
                        overflowY: 'auto'
                      }}
                    >
                      {asuntosOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setFormData({...formData, asunto: option.value});
                            setDropdownOpen(false);
                          }}
                          className="w-full px-4 py-3 text-left transition-colors"
                          style={{ 
                            fontFamily: 'Maitree, serif',
                            fontSize: '15px',
                            color: '#000000',
                            backgroundColor: formData.asunto === option.value ? '#E8F0FC' : 'white',
                            borderBottom: '1px solid #F3F4F6'
                          }}
                          onMouseEnter={(e) => {
                            if (formData.asunto !== option.value) {
                              e.currentTarget.style.backgroundColor = '#F8FAFC';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (formData.asunto !== option.value) {
                              e.currentTarget.style.backgroundColor = 'white';
                            }
                          }}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label 
                  htmlFor="mensaje"
                  className="block mb-2"
                  style={{ 
                    fontFamily: 'Maitree, serif', 
                    fontSize: '16px', 
                    color: '#244C87',
                    fontWeight: 500
                  }}
                >
                  Mensaje *
                </label>
                <textarea
                  id="mensaje"
                  required
                  rows={6}
                  value={formData.mensaje}
                  onChange={(e) => setFormData({...formData, mensaje: e.target.value})}
                  className="w-full px-4 py-3 rounded-2xl border-2 outline-none transition-colors resize-none"
                  style={{ 
                    fontFamily: 'Maitree, serif',
                    fontSize: '16px',
                    borderColor: '#D1D5DB',
                    color: '#000000'
                  }}
                  placeholder="Describí tu consulta o problema con el mayor detalle posible..."
                />
              </div>

              <button
                type="submit"
                disabled={enviando}
                className="w-full py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
                style={{ 
                  fontFamily: 'Maitree, serif', 
                  fontSize: '18px',
                  fontWeight: 500,
                  backgroundColor: enviando ? '#999' : '#244C87',
                  color: '#FFFFFF',
                  border: 'none',
                  cursor: enviando ? 'not-allowed' : 'pointer'
                }}
              >
                {enviando ? 'Enviando...' : 'Enviar Mensaje'}
              </button>
            </form>
          )}
        </div>

        {/* FAQ Section */}
        <div>
          <h2 
            className="mb-8 text-center"
            style={{ 
              fontFamily: 'Maitree, serif', 
              fontSize: '32px', 
              fontWeight: 600, 
              color: '#244C87'
            }}
          >
            Preguntas Frecuentes de Proveedores
          </h2>

          <div className="space-y-4">
            {[
              {
                pregunta: '¿Cómo recibo los pagos de mis servicios?',
                respuesta: 'Los pagos se procesan de forma segura a través de nuestra plataforma. Una vez que el cliente confirma el servicio completado, el pago se transfiere a tu cuenta registrada dentro de 2-3 días hábiles.'
              },
              {
                pregunta: '¿Puedo modificar mis tarifas?',
                respuesta: 'Sí, podés actualizar tus tarifas en cualquier momento desde tu perfil de proveedor. Los cambios se reflejarán inmediatamente para nuevas solicitudes.'
              },
              {
                pregunta: '¿Qué hago si tengo un problema con un cliente?',
                respuesta: 'Si tenés algún conflicto con un cliente, contactanos inmediatamente a través de este formulario. Nuestro equipo mediará la situación para encontrar una solución justa.'
              },
              {
                pregunta: '¿Cómo verifico mi identidad?',
                respuesta: 'La verificación se realiza durante el registro. Necesitás subir una foto de tu DNI y una selfie. El proceso suele completarse en 24-48 horas.'
              },
              {
                pregunta: '¿Hay comisiones por usar la plataforma?',
                respuesta: 'SERCO cobra una comisión del 10% sobre cada servicio completado. Esta comisión cubre el procesamiento de pagos, seguros y soporte.'
              }
            ].map((faq, idx) => (
              <details 
                key={idx}
                className="bg-blue-50 rounded-2xl p-6 cursor-pointer hover:shadow-md transition-shadow"
              >
                <summary 
                  className="font-semibold"
                  style={{ 
                    fontFamily: 'Maitree, serif', 
                    fontSize: '18px', 
                    color: '#244C87',
                    cursor: 'pointer'
                  }}
                >
                  {faq.pregunta}
                </summary>
                <p 
                  className="mt-4"
                  style={{ 
                    fontFamily: 'Maitree, serif', 
                    fontSize: '16px', 
                    color: '#666',
                    lineHeight: '1.6'
                  }}
                >
                  {faq.respuesta}
                </p>
              </details>
            ))}
          </div>
        </div>

        {/* Additional Resources */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div 
            className="bg-blue-50 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push('/recursos')}
          >
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📚</div>
            <h3 
              className="mb-2"
              style={{ 
                fontFamily: 'Maitree, serif', 
                fontSize: '20px', 
                fontWeight: 600, 
                color: '#244C87'
              }}
            >
              Recursos Útiles
            </h3>
            <p 
              style={{ 
                fontFamily: 'Maitree, serif', 
                fontSize: '14px', 
                color: '#666'
              }}
            >
              Guías y artículos para mejorar tu negocio
            </p>
          </div>

          <div className="bg-blue-50 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>💬</div>
            <h3 
              className="mb-2"
              style={{ 
                fontFamily: 'Maitree, serif', 
                fontSize: '20px', 
                fontWeight: 600, 
                color: '#244C87'
              }}
            >
              Chat en Vivo
            </h3>
            <p 
              style={{ 
                fontFamily: 'Maitree, serif', 
                fontSize: '14px', 
                color: '#666'
              }}
            >
              Lunes a Viernes de 9 a 18hs
            </p>
          </div>

          <div className="bg-blue-50 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📧</div>
            <h3 
              className="mb-2"
              style={{ 
                fontFamily: 'Maitree, serif', 
                fontSize: '20px', 
                fontWeight: 600, 
                color: '#244C87'
              }}
            >
              Email Directo
            </h3>
            <p 
              style={{ 
                fontFamily: 'Maitree, serif', 
                fontSize: '14px', 
                color: '#666'
              }}
            >
              proveedores@serco.com
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
