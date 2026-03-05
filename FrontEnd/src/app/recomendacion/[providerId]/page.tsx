'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { colors, typography } from '@/styles/tokens';

export default function RecomendacionPage({ params }: { params: Promise<{ providerId: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [nombre, setNombre] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [calificacion, setCalificacion] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  // TODO: Cargar datos del proveedor desde la API usando resolvedParams.providerId
  const providerData = {
    nombre: 'Ricardo',
    apellido: 'Rodriguez',
    profileImage: '/placeholder-profile.jpg' // TODO: Obtener imagen real
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nombre.trim() || !mensaje.trim() || calificacion === 0) {
      alert('Por favor completa todos los campos y selecciona una calificación');
      return;
    }

    if (mensaje.split(' ').length < 5) {
      alert('El mensaje debe tener al menos 5 palabras');
      return;
    }

    // TODO: Enviar recomendación a la API
    console.log({
      providerId: resolvedParams.providerId,
      nombre,
      mensaje,
      calificacion
    });

    alert('¡Gracias por tu recomendación!');
    router.push('/');
  };

  return (
    <div style={{ backgroundColor: '#FFFCF9', minHeight: '100vh' }}>
      {/* Header con flecha para volver */}
      <header 
        className="fixed top-0 left-0 right-0 z-50 flex items-center"
        style={{
          height: '4rem',
          background: 'linear-gradient(180deg, rgba(36, 76, 135, 0.8) 0%, rgba(255, 252, 249, 0.8) 100%)',
          paddingLeft: '24px',
          paddingRight: '24px'
        }}
      >
        <button 
          onClick={() => router.push('/')}
          style={{ cursor: 'pointer', padding: '8px' }}
        >
          <svg width="24" height="24" fill="none" stroke={colors.neutral.black} strokeWidth="2" viewBox="0 0 24 24">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
      </header>

      {/* Contenido principal */}
      <main style={{ paddingTop: 'calc(4rem + 48px)', paddingLeft: '24px', paddingRight: '24px', paddingBottom: '48px' }}>
        <div className="max-w-md mx-auto">
          {/* Perfil del proveedor */}
          <div className="flex items-center gap-4 mb-8">
            <div style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '50%', 
              overflow: 'hidden',
              backgroundColor: '#E5E7EB',
              position: 'relative'
            }}>
              {/* TODO: Reemplazar con imagen real del proveedor */}
              <div style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#9CA3AF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                color: '#FFFFFF',
                fontFamily: typography.fontFamily.primary
              }}>
                {providerData.nombre.charAt(0)}
              </div>
            </div>
            
            <div>
              <h1 style={{
                fontFamily: 'Maitree, serif',
                fontSize: '24px',
                fontWeight: 600,
                color: colors.neutral.black,
                marginBottom: '8px'
              }}>
                Recomendación
              </h1>
              <p style={{
                fontFamily: typography.fontFamily.primary,
                fontSize: typography.fontSize.sm,
                color: colors.neutral[600]
              }}>
                Escribe una recomendación para {providerData.nombre} así ayudas a inspirar confianza a nuevos clientes.
              </p>
            </div>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombre */}
            <div>
              <label style={{
                fontFamily: typography.fontFamily.primary,
                fontSize: typography.fontSize.base,
                color: colors.neutral.black,
                display: 'block',
                marginBottom: '8px'
              }}>
                Nombre
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Andrea"
                className="w-full px-4 py-3 rounded-full border-2 border-gray-300 focus:border-[#244C87] focus:outline-none"
                style={{
                  fontFamily: typography.fontFamily.primary,
                  fontSize: typography.fontSize.base
                }}
                required
              />
            </div>

            {/* Mensaje */}
            <div>
              <label style={{
                fontFamily: typography.fontFamily.primary,
                fontSize: typography.fontSize.base,
                color: colors.neutral.black,
                display: 'block',
                marginBottom: '8px'
              }}>
                Mensaje
              </label>
              <textarea
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                placeholder="Mínimo 5 palabras"
                rows={6}
                className="w-full px-4 py-3 rounded-3xl border-2 border-gray-300 focus:border-[#244C87] focus:outline-none resize-none"
                style={{
                  fontFamily: typography.fontFamily.primary,
                  fontSize: typography.fontSize.base,
                  lineHeight: '1.6'
                }}
                required
              />
            </div>

            {/* Calificación con estrellas */}
            <div>
              <label style={{
                fontFamily: typography.fontFamily.primary,
                fontSize: typography.fontSize.base,
                color: colors.neutral.black,
                display: 'block',
                marginBottom: '12px'
              }}>
                Califica a {providerData.nombre}
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setCalificacion(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    style={{ cursor: 'pointer', fontSize: '32px', transition: 'transform 0.2s' }}
                    className="hover:scale-110"
                  >
                    {(hoverRating || calificacion) >= star ? (
                      <span style={{ color: '#FFA500' }}>★</span>
                    ) : (
                      <span style={{ color: '#D1D5DB' }}>☆</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Botón enviar */}
            <button
              type="submit"
              className="w-full py-3 rounded-full hover:opacity-90 transition-opacity"
              style={{
                fontFamily: typography.fontFamily.primary,
                fontSize: typography.fontSize.base,
                color: '#FFFFFF',
                backgroundColor: '#B45B39',
                cursor: 'pointer',
                border: 'none'
              }}
            >
              Enviar
            </button>
          </form>
        </div>
      </main>

      {/* Footer con redes sociales */}
      <footer style={{
        background: 'linear-gradient(180deg, #244C87 0%, #1A3661 100%)',
        padding: '48px 24px',
        marginTop: '64px'
      }}>
        <div className="max-w-4xl mx-auto">
          {/* Iconos de redes sociales */}
          <div className="flex justify-center gap-8 mb-8">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={{ cursor: 'pointer' }}>
              <svg width="32" height="32" fill="#FFFFFF" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" style={{ cursor: 'pointer' }}>
              <svg width="32" height="32" fill="#FFFFFF" viewBox="0 0 24 24">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
              </svg>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{ cursor: 'pointer' }}>
              <svg width="32" height="32" fill="#FFFFFF" viewBox="0 0 24 24">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
              </svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ cursor: 'pointer' }}>
              <svg width="32" height="32" fill="#FFFFFF" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
          </div>

          {/* Enlaces del footer */}
          <div className="text-center mb-8">
            <p style={{
              fontFamily: typography.fontFamily.primary,
              fontSize: typography.fontSize.base,
              color: '#FFFFFF',
              fontWeight: 600,
              marginBottom: '12px'
            }}>
              Para Clientes
            </p>
            <div className="space-y-2">
              <Link href="/buscar" style={{
                fontFamily: typography.fontFamily.primary,
                fontSize: typography.fontSize.sm,
                color: '#FFFFFF',
                display: 'block',
                cursor: 'pointer'
              }}>
                Buscar Trabajadores
              </Link>
              <Link href="/como-funciona" style={{
                fontFamily: typography.fontFamily.primary,
                fontSize: typography.fontSize.sm,
                color: '#FFFFFF',
                display: 'block',
                cursor: 'pointer'
              }}>
                ¿Cómo Funciona?
              </Link>
            </div>
          </div>

          <div className="text-center mb-8">
            <p style={{
              fontFamily: typography.fontFamily.primary,
              fontSize: typography.fontSize.base,
              color: '#FFFFFF',
              fontWeight: 600,
              marginBottom: '12px'
            }}>
              Para Trabajadores
            </p>
            <div className="space-y-2">
              <Link href="/provider-signup" style={{
                fontFamily: typography.fontFamily.primary,
                fontSize: typography.fontSize.sm,
                color: '#FFFFFF',
                display: 'block',
                cursor: 'pointer'
              }}>
                Sumate como Trabajador
              </Link>
              <Link href="/soporte" style={{
                fontFamily: typography.fontFamily.primary,
                fontSize: typography.fontSize.sm,
                color: '#FFFFFF',
                display: 'block',
                cursor: 'pointer'
              }}>
                Soporte Proveedores
              </Link>
            </div>
          </div>

          <div className="text-center mb-8">
            <p style={{
              fontFamily: typography.fontFamily.primary,
              fontSize: typography.fontSize.base,
              color: '#FFFFFF',
              fontWeight: 600,
              marginBottom: '12px'
            }}>
              SERCO
            </p>
            <div className="space-y-2">
              <Link href="/sobre-nosotros" style={{
                fontFamily: typography.fontFamily.primary,
                fontSize: typography.fontSize.sm,
                color: '#FFFFFF',
                display: 'block',
                cursor: 'pointer'
              }}>
                Sobre nosotros
              </Link>
              <Link href="/contacto" style={{
                fontFamily: typography.fontFamily.primary,
                fontSize: typography.fontSize.sm,
                color: '#FFFFFF',
                display: 'block',
                cursor: 'pointer'
              }}>
                Contacto
              </Link>
            </div>
          </div>

          <div className="border-t border-white/20 pt-6 text-center">
            <p style={{
              fontFamily: typography.fontFamily.primary,
              fontSize: typography.fontSize.sm,
              color: '#FFFFFF'
            }}>
              Creado por Aquario
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
