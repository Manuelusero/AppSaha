'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Header, Footer } from '@/components/layout';
import { useForm } from '@/hooks';
import { apiPost } from '@/utils/api';

export default function Contacto() {
  const router = useRouter();
  const { values, handleChangeEvent, resetForm } = useForm({
    initialValues: {
      nombre: '',
      email: '',
      empresa: '',
      asunto: '',
      mensaje: ''
    },
    onSubmit: () => {} // Se maneja con handleSubmit personalizado
  });
  
  const [enviando, setEnviando] = useState(false);
  const [mensajeEnviado, setMensajeEnviado] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);

    try {
      await apiPost('/support/contact', {
        ...values,
        tipo: 'empresa'
      });

      setMensajeEnviado(true);
      resetForm();

      setTimeout(() => {
        setMensajeEnviado(false);
      }, 5000);
    } catch (err) {
      console.error('Error:', err);
      alert('Hubo un error al enviar el mensaje. Por favor, intentá nuevamente.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-16">
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
          Contacto
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
          ¿Tenés alguna consulta, sugerencia o propuesta? Escribinos y nos pondremos en contacto a la brevedad.
        </p>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-blue-50 rounded-2xl p-6 text-center">
            <div 
              className="flex items-center justify-center rounded-full mx-auto mb-4"
              style={{ 
                width: '60px', 
                height: '60px', 
                backgroundColor: '#244C87'
              }}
            >
              <span style={{ fontSize: '28px' }}>📧</span>
            </div>
            <h3 
              style={{ 
                fontFamily: 'Maitree, serif', 
                fontSize: '18px', 
                fontWeight: 600, 
                color: '#244C87',
                marginBottom: '8px'
              }}
            >
              Email
            </h3>
            <p 
              style={{ 
                fontFamily: 'Maitree, serif', 
                fontSize: '16px', 
                color: '#666'
              }}
            >
              contacto@serco.com
            </p>
          </div>

          <div className="bg-blue-50 rounded-2xl p-6 text-center">
            <div 
              className="flex items-center justify-center rounded-full mx-auto mb-4"
              style={{ 
                width: '60px', 
                height: '60px', 
                backgroundColor: '#244C87'
              }}
            >
              <span style={{ fontSize: '28px' }}>📱</span>
            </div>
            <h3 
              style={{ 
                fontFamily: 'Maitree, serif', 
                fontSize: '18px', 
                fontWeight: 600, 
                color: '#244C87',
                marginBottom: '8px'
              }}
            >
              Teléfono
            </h3>
            <p 
              style={{ 
                fontFamily: 'Maitree, serif', 
                fontSize: '16px', 
                color: '#666'
              }}
            >
              +54 9 11 1234-5678
            </p>
          </div>

          <div className="bg-blue-50 rounded-2xl p-6 text-center">
            <div 
              className="flex items-center justify-center rounded-full mx-auto mb-4"
              style={{ 
                width: '60px', 
                height: '60px', 
                backgroundColor: '#244C87'
              }}
            >
              <span style={{ fontSize: '28px' }}>🕐</span>
            </div>
            <h3 
              style={{ 
                fontFamily: 'Maitree, serif', 
                fontSize: '18px', 
                fontWeight: 600, 
                color: '#244C87',
                marginBottom: '8px'
              }}
            >
              Horario
            </h3>
            <p 
              style={{ 
                fontFamily: 'Maitree, serif', 
                fontSize: '16px', 
                color: '#666'
              }}
            >
              Lun - Vie: 9:00 - 18:00
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-3xl border-2 border-gray-200 p-8 shadow-lg">
          <h2 
            className="mb-6 text-center"
            style={{ 
              fontFamily: 'Maitree, serif', 
              fontSize: '28px', 
              fontWeight: 600, 
              color: '#244C87'
            }}
          >
            Envianos un Mensaje
          </h2>

          {mensajeEnviado ? (
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
                  style={{ 
                    fontFamily: 'Maitree, serif', 
                    fontSize: '16px', 
                    fontWeight: 600, 
                    color: '#244C87',
                    display: 'block',
                    marginBottom: '8px'
                  }}
                >
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  required
                  value={values.nombre}
                  onChange={handleChangeEvent}
                  className="w-full rounded-2xl border-2 outline-none"
                  style={{ 
                    padding: '12px 16px',
                    fontFamily: 'Maitree, serif',
                    fontSize: '16px',
                    borderColor: '#E5E7EB',
                    color: '#000000',
                    backgroundColor: '#FFFFFF'
                  }}
                  placeholder="Juan Pérez"
                />
              </div>

              <div>
                <label 
                  htmlFor="email"
                  style={{ 
                    fontFamily: 'Maitree, serif', 
                    fontSize: '16px', 
                    fontWeight: 600, 
                    color: '#244C87',
                    display: 'block',
                    marginBottom: '8px'
                  }}
                >
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={values.email}
                  onChange={handleChangeEvent}
                  className="w-full rounded-2xl border-2 outline-none"
                  style={{ 
                    padding: '12px 16px',
                    fontFamily: 'Maitree, serif',
                    fontSize: '16px',
                    borderColor: '#E5E7EB',
                    color: '#000000',
                    backgroundColor: '#FFFFFF'
                  }}
                  placeholder="juan.perez@example.com"
                />
              </div>

              <div>
                <label 
                  htmlFor="empresa"
                  style={{ 
                    fontFamily: 'Maitree, serif', 
                    fontSize: '16px', 
                    fontWeight: 600, 
                    color: '#244C87',
                    display: 'block',
                    marginBottom: '8px'
                  }}
                >
                  Empresa / Organización
                </label>
                <input
                  type="text"
                  id="empresa"
                  name="empresa"
                  value={values.empresa}
                  onChange={handleChangeEvent}
                  className="w-full rounded-2xl border-2 outline-none"
                  style={{ 
                    padding: '12px 16px',
                    fontFamily: 'Maitree, serif',
                    fontSize: '16px',
                    borderColor: '#E5E7EB',
                    color: '#000000',
                    backgroundColor: '#FFFFFF'
                  }}
                  placeholder="Nombre de tu empresa (opcional)"
                />
              </div>

              <div>
                <label 
                  htmlFor="asunto"
                  style={{ 
                    fontFamily: 'Maitree, serif', 
                    fontSize: '16px', 
                    fontWeight: 600, 
                    color: '#244C87',
                    display: 'block',
                    marginBottom: '8px'
                  }}
                >
                  Asunto *
                </label>
                <input
                  type="text"
                  id="asunto"
                  name="asunto"
                  required
                  value={values.asunto}
                  onChange={handleChangeEvent}
                  className="w-full rounded-2xl border-2 outline-none"
                  style={{ 
                    padding: '12px 16px',
                    fontFamily: 'Maitree, serif',
                    fontSize: '16px',
                    borderColor: '#E5E7EB',
                    color: '#000000',
                    backgroundColor: '#FFFFFF'
                  }}
                  placeholder="¿Sobre qué querés consultarnos?"
                />
              </div>

              <div>
                <label 
                  htmlFor="mensaje"
                  style={{ 
                    fontFamily: 'Maitree, serif', 
                    fontSize: '16px', 
                    fontWeight: 600, 
                    color: '#244C87',
                    display: 'block',
                    marginBottom: '8px'
                  }}
                >
                  Mensaje *
                </label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  required
                  rows={6}
                  value={values.mensaje}
                  onChange={handleChangeEvent}
                  className="w-full rounded-2xl border-2 outline-none resize-none"
                  style={{ 
                    padding: '12px 16px',
                    fontFamily: 'Maitree, serif',
                    fontSize: '16px',
                    borderColor: '#E5E7EB',
                    color: '#000000',
                    backgroundColor: '#FFFFFF'
                  }}
                  placeholder="Escribí tu mensaje aquí..."
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
      </main>

      <Footer />
    </div>
  );
}
