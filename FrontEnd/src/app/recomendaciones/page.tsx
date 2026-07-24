'use client';

import { useState, useEffect } from 'react';
import { colors, typography } from '@/styles/tokens';
import { ProviderHeader } from '@/components/layout';
import { apiGet } from '@/utils/api';

interface Recomendacion {
  id: string;
  clienteNombre: string;
  calificacion: number; // 1–5
  mensaje: string;
  fecha: string; // ISO date string
}

// MOCK data removed — now fetched from API

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={star <= rating ? '#F59E0B' : 'none'}
          stroke={star <= rating ? '#F59E0B' : '#D1D5DB'}
          strokeWidth="1.5"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

function formatFecha(isoDate: string): string {
  const date = new Date(isoDate + 'T00:00:00');
  return date.toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function RecomendacionesPage() {
  const [copied, setCopied] = useState(false);
  const [providerId, setProviderId] = useState<string>('');
  const [recomendaciones, setRecomendaciones] = useState<Recomendacion[]>([]);
  const [fetchLoading, setFetchLoading] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem('providerId') || '';
    setProviderId(id);
    if (!id) return;

    setFetchLoading(true);
    apiGet<{ reviews: any[] }>(`/reviews/provider/${id}`)
      .then((data) => {
        const mapped: Recomendacion[] = (data.reviews || []).map((r: any) => ({
          id: r.id,
          clienteNombre: r.client?.name || 'Cliente',
          calificacion: r.rating,
          mensaje: r.comment || '',
          fecha: r.createdAt ? r.createdAt.split('T')[0] : '',
        }));
        setRecomendaciones(mapped);
      })
      .catch(() => setRecomendaciones([]))
      .finally(() => setFetchLoading(false));
  }, []);

  const linkRecomendacion = providerId
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/recomendacion/${providerId}`
    : '';

  const handleCopyLink = () => {
    if (linkRecomendacion) {
      navigator.clipboard.writeText(linkRecomendacion).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const promedioCalificacion =
    recomendaciones.length > 0
      ? recomendaciones.reduce((sum, r) => sum + r.calificacion, 0) / recomendaciones.length
      : 0;

  return (
    <div style={{ backgroundColor: '#FFFCF9', minHeight: '100vh', fontFamily: "'Maitree', serif" }}>
      <ProviderHeader activePage="recomendaciones" />

      <main className="px-6 py-6 pt-[calc(4rem+32px)] md:px-16 md:py-16 md:pt-[calc(4rem+40px)]">
        {/* Título */}
        <h1
          style={{
            fontSize: typography.fontSize['2xl'],
            fontWeight: typography.fontWeight.bold,
            color: colors.primary.main,
            marginBottom: '4px',
          }}
        >
          Mis Recomendaciones
        </h1>
        <p style={{ fontSize: typography.fontSize.sm, color: '#6B7280', marginBottom: '0' }}>
          Las opiniones que tus clientes dejaron sobre tu trabajo
        </p>

        {/* Link compartible */}
        <div className="rounded-lg bg-white shadow-sm mt-6 p-5">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: '#EFF2FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#244C87" strokeWidth="2">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            </div>
            <div>
              <p
                style={{
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.semibold,
                  color: '#1F2937',
                  marginBottom: '2px',
                }}
              >
                Tu enlace para recibir recomendaciones
              </p>
              <p style={{ fontSize: typography.fontSize.xs, color: '#6B7280' }}>
                Compártelo con clientes anteriores para que dejen su opinión
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <input
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-xs font-family-serif text-gray-500 bg-gray-50 overflow-hidden text-ellipsis whitespace-nowrap"
              type="text"
              readOnly
              value={linkRecomendacion}
              title={linkRecomendacion}
            />
            <button
              className={`px-4 py-2 rounded-lg text-xs font-semibold text-white transition-colors ${
                copied 
                  ? 'bg-green-500 hover:bg-green-600' 
                  : 'bg-primary-main hover:bg-primary-dark'
              }`}
              style={{
                backgroundColor: copied ? colors.success.main : colors.primary.main,
                fontFamily: typography.fontFamily.primary,
              }}
              onClick={handleCopyLink}
            >
              {copied ? '✓ Copiado' : 'Copiar'}
            </button>
          </div>
        </div>

        {/* Stats */}
        {recomendaciones.length > 0 && (
          <div className="flex items-center gap-3 mt-6">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: '#fff',
                borderRadius: '10px',
                padding: '10px 16px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" strokeWidth="1.5">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span
                style={{
                  fontSize: typography.fontSize.xl,
                  fontWeight: typography.fontWeight.bold,
                  color: '#1F2937',
                }}
              >
                {promedioCalificacion.toFixed(1)}
              </span>
              <span style={{ fontSize: typography.fontSize.sm, color: '#6B7280' }}>promedio</span>
            </div>
            <div
              style={{
                background: '#fff',
                borderRadius: '10px',
                padding: '10px 16px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#244C87" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span
                style={{
                  fontSize: typography.fontSize.xl,
                  fontWeight: typography.fontWeight.bold,
                  color: '#1F2937',
                }}
              >
                {recomendaciones.length}
              </span>
              <span style={{ fontSize: typography.fontSize.sm, color: '#6B7280' }}>
                {recomendaciones.length === 1 ? 'recomendación' : 'recomendaciones'}
              </span>
            </div>
          </div>
        )}

        {/* Cards de recomendaciones */}
        {fetchLoading ? (
          <div style={{ textAlign: 'center', padding: '48px 0', color: '#9CA3AF', fontFamily: "'Maitree', serif" }}>
            Cargando recomendaciones...
          </div>
        ) : recomendaciones.length === 0 ? (
          <div className="text-center py-16 px-6 flex flex-col items-center gap-3">
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: '#EFF2FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#244C87" strokeWidth="1.5">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <p
              style={{
                fontSize: typography.fontSize.lg,
                fontWeight: typography.fontWeight.semibold,
                color: '#1F2937',
              }}
            >
              Aún no tienes recomendaciones
            </p>
            <p style={{ fontSize: typography.fontSize.sm, color: '#6B7280', maxWidth: '320px' }}>
              Comparte tu enlace con clientes anteriores para que puedan dejar su opinión sobre tu trabajo.
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-4 mt-6 md:grid md:grid-cols-2 lg:grid-cols-3">
            {recomendaciones.map((reco) => {
              const [isHovered, setIsHovered] = useState(false);
              
              return (
                <div
                  key={reco.id}
                  className="w-full bg-white rounded-lg p-5 shadow-sm flex flex-col gap-2"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  style={{
                    transition: 'all 0.2s ease-out',
                    boxShadow: isHovered ? '0 8px 24px rgba(36, 76, 135, 0.12)' : undefined,
                    transform: isHovered ? 'translateY(-4px)' : undefined,
                  }}
                >
                  {/* Top: estrellas + fecha */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <StarDisplay rating={reco.calificacion} />
                    <span style={{ fontSize: typography.fontSize.xs, color: '#9CA3AF', marginTop: '1px' }}>
                      {formatFecha(reco.fecha)}
                    </span>
                  </div>

                  {/* Nombre del cliente */}
                  <p
                  style={{
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.semibold,
                    color: '#1F2937',
                    marginBottom: '0',
                  }}
                >
                  {reco.clienteNombre}
                </p>

                {/* Mensaje */}
                <p
                  style={{
                    fontSize: typography.fontSize.sm,
                    color: '#4B5563',
                    lineHeight: '1.6',
                    flexGrow: 1,
                  }}
                >
                  &ldquo;{reco.mensaje}&rdquo;
                </p>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
