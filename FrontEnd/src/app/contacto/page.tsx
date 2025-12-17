'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Contacto() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    empresa: '',
    asunto: '',
    mensaje: ''
  });
  const [enviando, setEnviando] = useState(false);
  const [mensajeEnviado, setMensajeEnviado] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);

    try {
      const response = await fetch('http://localhost:8000/api/support/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          tipo: 'empresa'
        }),
      });

      if (!response.ok) {
        throw new Error('Error al enviar el mensaje');
      }

      setMensajeEnviado(true);
      setFormData({
        nombre: '',
        email: '',
        empresa: '',
        asunto: '',
        mensaje: ''
      });

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
              contacto@saha.com
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
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
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
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
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
                  value={formData.empresa}
                  onChange={(e) => setFormData({...formData, empresa: e.target.value})}
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
                  required
                  value={formData.asunto}
                  onChange={(e) => setFormData({...formData, asunto: e.target.value})}
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
                  required
                  rows={6}
                  value={formData.mensaje}
                  onChange={(e) => setFormData({...formData, mensaje: e.target.value})}
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
            <div className="flex justify-center mb-16" style={{ gap: '86px' }}>
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
                  <li><button onClick={() => router.push('/#buscar-servicios')} className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>Buscar Servidores</button></li>
                  <li><button onClick={() => router.push('/#como-funciona')} className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>¿Cómo Funciona?</button></li>
                  <li><button onClick={() => router.push('/seguridad-confianza')} className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>Seguridad y Confianza</button></li>
                  <li><button onClick={() => router.push('/ayuda')} className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>Ayuda</button></li>
                </ul>
              </div>

              <div>
                <h3 className="mb-6" style={{ fontFamily: 'Maitree, serif', fontWeight: 400, fontSize: '24px' }}>Para Proveedores</h3>
                <ul className="space-y-3">
                  <li><button onClick={() => router.push('/provider-signup')} className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>Sumate como proveedor</button></li>
                  <li><button onClick={() => router.push('/experiencias')} className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>Experiencias</button></li>
                  <li><button onClick={() => router.push('/recursos')} className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>Recursos útiles</button></li>
                  <li><button onClick={() => router.push('/soporte-proveedores')} className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>Soporte Proveedores</button></li>
                </ul>
              </div>

              <div>
                <h3 className="mb-6" style={{ fontFamily: 'Maitree, serif', fontWeight: 400, fontSize: '24px' }}>Empresa</h3>
                <ul className="space-y-3">
                  <li><button onClick={() => router.push('/sobre-nosotros')} className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>Sobre nosotros</button></li>
                  <li><button onClick={() => router.push('/trabaja-con-nosotros')} className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>Trabaja con nosotros</button></li>
                  <li><button onClick={() => router.push('/contacto')} className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>Contacto</button></li>
                  <li><button onClick={() => router.push('/prensa')} className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>Prensa</button></li>
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
