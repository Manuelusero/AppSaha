'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Header, Footer } from '@/components/layout';

export default function Ayuda() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    asunto: '',
    mensaje: ''
  });
  const [enviando, setEnviando] = useState(false);
  const [mensajeEnviado, setMensajeEnviado] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setError('');

    try {
      // TODO: Implementar el envío del formulario al backend
      const response = await fetch('http://localhost:8000/api/support/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Error al enviar el mensaje');
      }

      setMensajeEnviado(true);
      setFormData({
        nombre: '',
        email: '',
        asunto: '',
        mensaje: ''
      });

      // Ocultar el mensaje de éxito después de 5 segundos
      setTimeout(() => {
        setMensajeEnviado(false);
      }, 5000);
    } catch (err) {
      console.error('Error:', err);
      setError('Hubo un problema al enviar tu mensaje. Por favor, intentá nuevamente o escribinos directamente a support@serco.com');
    } finally {
      setEnviando(false);
    }
  };

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
          ¿Cómo podemos ayudarte?
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
          Envianos tu consulta y nuestro equipo de soporte te responderá a la brevedad.
        </p>

        {/* Formulario de contacto */}
        <div className="bg-blue-50 rounded-3xl p-8 md:p-12">
          {mensajeEnviado ? (
            <div className="text-center py-12">
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ backgroundColor: '#4CAF50' }}
              >
                <svg width="40" height="40" fill="white" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h2 
                className="mb-4"
                style={{ 
                  fontFamily: 'Maitree, serif', 
                  fontSize: '28px', 
                  fontWeight: 600, 
                  color: '#244C87'
                }}
              >
                ¡Mensaje enviado con éxito!
              </h2>
              <p 
                style={{ 
                  fontFamily: 'Maitree, serif', 
                  fontSize: '18px', 
                  color: '#333',
                  lineHeight: '1.6'
                }}
              >
                Gracias por contactarnos. Te responderemos a la brevedad a tu correo electrónico.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nombre */}
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
                  Nombre completo *
                </label>
                <input
                  id="nombre"
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Tu nombre"
                  style={{
                    fontFamily: 'Maitree, serif',
                    fontSize: '16px',
                    color: '#000000',
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #E5E7EB',
                    borderRadius: '12px',
                    backgroundColor: 'white',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#244C87'}
                  onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                />
              </div>

              {/* Email */}
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
                  Correo electrónico *
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="tu@email.com"
                  style={{
                    fontFamily: 'Maitree, serif',
                    fontSize: '16px',
                    color: '#000000',
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #E5E7EB',
                    borderRadius: '12px',
                    backgroundColor: 'white',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#244C87'}
                  onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                />
              </div>

              {/* Asunto */}
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
                  id="asunto"
                  type="text"
                  required
                  value={formData.asunto}
                  onChange={(e) => setFormData({ ...formData, asunto: e.target.value })}
                  placeholder="¿En qué podemos ayudarte?"
                  style={{
                    fontFamily: 'Maitree, serif',
                    fontSize: '16px',
                    color: '#000000',
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #E5E7EB',
                    borderRadius: '12px',
                    backgroundColor: 'white',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#244C87'}
                  onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                />
              </div>

              {/* Mensaje */}
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
                  required
                  value={formData.mensaje}
                  onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                  placeholder="Contanos tu consulta con el mayor detalle posible..."
                  rows={6}
                  style={{
                    fontFamily: 'Maitree, serif',
                    fontSize: '16px',
                    color: '#000000',
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #E5E7EB',
                    borderRadius: '12px',
                    backgroundColor: 'white',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#244C87'}
                  onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                />
              </div>

              {/* Error message */}
              {error && (
                <div 
                  className="p-4 rounded-lg"
                  style={{ backgroundColor: '#FEE2E2', border: '1px solid #EF4444' }}
                >
                  <p style={{ fontFamily: 'Maitree, serif', fontSize: '14px', color: '#DC2626' }}>
                    {error}
                  </p>
                </div>
              )}

              {/* Botón de envío */}
              <div className="flex justify-center pt-4">
                <button
                  type="submit"
                  disabled={enviando}
                  className="px-12 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ 
                    fontFamily: 'Maitree, serif', 
                    fontSize: '20px',
                    fontWeight: 500,
                    backgroundColor: enviando ? '#9CA3AF' : '#244C87',
                    color: '#FFFFFF',
                    border: 'none',
                    cursor: enviando ? 'not-allowed' : 'pointer'
                  }}
                >
                  {enviando ? 'Enviando...' : 'Enviar mensaje'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Información adicional */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Email directo */}
          <div className="text-center">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: '#244C87' }}
            >
              <svg width="32" height="32" fill="white" viewBox="0 0 24 24">
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </div>
            <h3 
              className="mb-2"
              style={{ 
                fontFamily: 'Maitree, serif', 
                fontSize: '20px', 
                fontWeight: 600, 
                color: '#244C87'
              }}
            >
              Email directo
            </h3>
            <p style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#666' }}>
              support@serco.com
            </p>
          </div>

          {/* Horarios */}
          <div className="text-center">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: '#244C87' }}
            >
              <svg width="32" height="32" fill="white" viewBox="0 0 24 24">
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h3 
              className="mb-2"
              style={{ 
                fontFamily: 'Maitree, serif', 
                fontSize: '20px', 
                fontWeight: 600, 
                color: '#244C87'
              }}
            >
              Horario de atención
            </h3>
            <p style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#666' }}>
              Lunes a Viernes: 9:00 - 18:00 hs
            </p>
          </div>
        </div>

        {/* Preguntas frecuentes preview */}
        <div className="mt-16 bg-gray-50 rounded-3xl p-8">
          <h2 
            className="text-center mb-6"
            style={{ 
              fontFamily: 'Maitree, serif', 
              fontSize: '28px', 
              fontWeight: 600, 
              color: '#244C87'
            }}
          >
            Preguntas Frecuentes
          </h2>
          <div className="space-y-4">
            <details className="bg-white rounded-xl p-4 cursor-pointer">
              <summary 
                style={{ 
                  fontFamily: 'Maitree, serif', 
                  fontSize: '18px', 
                  fontWeight: 600, 
                  color: '#244C87',
                  cursor: 'pointer'
                }}
              >
                ¿Cómo funciona la plataforma?
              </summary>
              <p 
                className="mt-3"
                style={{ 
                  fontFamily: 'Maitree, serif', 
                  fontSize: '16px', 
                  color: '#666',
                  lineHeight: '1.6'
                }}
              >
                Nuestra plataforma conecta a clientes con profesionales verificados. Simplemente buscás el servicio que necesitás, 
                seleccionás el profesional que más te convenga según sus reseñas y disponibilidad, y coordinás el trabajo directamente 
                con ellos.
              </p>
            </details>

            <details className="bg-white rounded-xl p-4 cursor-pointer">
              <summary 
                style={{ 
                  fontFamily: 'Maitree, serif', 
                  fontSize: '18px', 
                  fontWeight: 600, 
                  color: '#244C87',
                  cursor: 'pointer'
                }}
              >
                ¿Los profesionales están verificados?
              </summary>
              <p 
                className="mt-3"
                style={{ 
                  fontFamily: 'Maitree, serif', 
                  fontSize: '16px', 
                  color: '#666',
                  lineHeight: '1.6'
                }}
              >
                Sí, todos los profesionales pasan por un proceso de verificación que incluye validación de identidad, credenciales 
                profesionales y referencias. Tu seguridad es nuestra prioridad.
              </p>
            </details>

            <details className="bg-white rounded-xl p-4 cursor-pointer">
              <summary 
                style={{ 
                  fontFamily: 'Maitree, serif', 
                  fontSize: '18px', 
                  fontWeight: 600, 
                  color: '#244C87',
                  cursor: 'pointer'
                }}
              >
                ¿Cómo realizo el pago?
              </summary>
              <p 
                className="mt-3"
                style={{ 
                  fontFamily: 'Maitree, serif', 
                  fontSize: '16px', 
                  color: '#666',
                  lineHeight: '1.6'
                }}
              >
                El pago se coordina directamente con el profesional según el presupuesto acordado. Próximamente implementaremos un 
                sistema de pagos integrado en la plataforma para mayor seguridad y comodidad.
              </p>
            </details>

            <details className="bg-white rounded-xl p-4 cursor-pointer">
              <summary 
                style={{ 
                  fontFamily: 'Maitree, serif', 
                  fontSize: '18px', 
                  fontWeight: 600, 
                  color: '#244C87',
                  cursor: 'pointer'
                }}
              >
                ¿Qué hago si no estoy conforme con el servicio?
              </summary>
              <p 
                className="mt-3"
                style={{ 
                  fontFamily: 'Maitree, serif', 
                  fontSize: '16px', 
                  color: '#666',
                  lineHeight: '1.6'
                }}
              >
                Contactanos inmediatamente a través de este formulario o por email. Nuestro equipo mediará para encontrar una solución 
                justa. Contamos con políticas claras de resolución de conflictos para proteger tanto a clientes como a profesionales.
              </p>
            </details>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
