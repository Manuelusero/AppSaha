'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

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
      setError('Hubo un problema al enviar tu mensaje. Por favor, intentá nuevamente o escribinos directamente a support@saha.com');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header 
        className="px-6 py-4 flex items-center justify-between"
        style={{ 
          background: 'linear-gradient(180deg, rgba(36, 76, 135, 0.8) 0%, rgba(255, 252, 249, 0.8) 100%)',
          height: '150px'
        }}
      >
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
          <Image 
            src="/Logo.png" 
            alt="SaHa Logo" 
            width={120} 
            height={40}
            className="h-10 w-auto"
            priority
          />
        </div>
        <button
          onClick={() => router.push('/provider-signup')}
          className="px-6 py-2 rounded-full border-2 transition-colors"
          style={{ 
            fontFamily: 'Maitree, serif',
            fontSize: '16px',
            borderColor: '#244C87',
            color: '#244C87',
            backgroundColor: 'transparent',
            cursor: 'pointer'
          }}
        >
          Espacio del trabajador
        </button>
      </header>

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
              support@saha.com
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
            {/* Iconos de redes sociales */}
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

            {/* Navegación en 3 columnas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16 text-center">
              {/* Para Clientes */}
              <div>
                <h3 className="mb-6" style={{ fontFamily: 'Maitree, serif', fontWeight: 400, fontSize: '24px', lineHeight: '100%', letterSpacing: '0%', textAlign: 'center' }}>Para Clientes</h3>
                <ul className="space-y-3">
                  <li><button onClick={() => router.push('/#buscar-servicios')} className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontWeight: 400, fontSize: '16px', lineHeight: '100%', letterSpacing: '0%', textAlign: 'center', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>Buscar Servidores</button></li>
                  <li><button onClick={() => router.push('/#como-funciona')} className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontWeight: 400, fontSize: '16px', lineHeight: '100%', letterSpacing: '0%', textAlign: 'center', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>¿Cómo Funciona?</button></li>
                  <li><button onClick={() => router.push('/seguridad-confianza')} className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontWeight: 400, fontSize: '16px', lineHeight: '100%', letterSpacing: '0%', textAlign: 'center', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>Seguridad y Confianza</button></li>
                  <li><button onClick={() => router.push('/ayuda')} className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontWeight: 400, fontSize: '16px', lineHeight: '100%', letterSpacing: '0%', textAlign: 'center', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>Ayuda</button></li>
                </ul>
              </div>

              {/* Para Proveedores */}
              <div>
                <h3 className="mb-6" style={{ fontFamily: 'Maitree, serif', fontWeight: 400, fontSize: '24px', lineHeight: '100%', letterSpacing: '0%', textAlign: 'center' }}>Para Proveedores</h3>
                <ul className="space-y-3">
                  <li><button onClick={() => router.push('/provider-signup')} className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontWeight: 400, fontSize: '16px', lineHeight: '100%', letterSpacing: '0%', textAlign: 'center', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>Sumate como proveedor</button></li>
                  <li><button onClick={() => router.push('/experiencias')} className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontWeight: 400, fontSize: '16px', lineHeight: '100%', letterSpacing: '0%', textAlign: 'center', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>Experiencias</button></li>
                  <li><button onClick={() => router.push('/recursos')} className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontWeight: 400, fontSize: '16px', lineHeight: '100%', letterSpacing: '0%', textAlign: 'center', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>Recursos útiles</button></li>
                  <li><button onClick={() => router.push('/soporte-proveedores')} className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontWeight: 400, fontSize: '16px', lineHeight: '100%', letterSpacing: '0%', textAlign: 'center', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>Soporte Proveedores</button></li>
                </ul>
              </div>

              {/* Empresa */}
              <div>
                <h3 className="mb-6" style={{ fontFamily: 'Maitree, serif', fontWeight: 400, fontSize: '24px', lineHeight: '100%', letterSpacing: '0%', textAlign: 'center' }}>Empresa</h3>
                <ul className="space-y-3">
                  <li><a href="#" className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontWeight: 400, fontSize: '16px', lineHeight: '100%', letterSpacing: '0%', textAlign: 'center' }}>Sobre nosotros</a></li>
                  <li><a href="#" className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontWeight: 400, fontSize: '16px', lineHeight: '100%', letterSpacing: '0%', textAlign: 'center' }}>Trabaja con nosotros</a></li>
                  <li><a href="#" className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontWeight: 400, fontSize: '16px', lineHeight: '100%', letterSpacing: '0%', textAlign: 'center' }}>Contacto</a></li>
                  <li><a href="#" className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontWeight: 400, fontSize: '16px', lineHeight: '100%', letterSpacing: '0%', textAlign: 'center' }}>Prensa</a></li>
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
    </div>
  );
}
