'use client';

import { useState, useEffect } from 'react';
import { colors, typography } from '@/styles/tokens';
import { ProviderHeader } from '@/components/layout';

interface Recomendacion {
  id: string;
  clienteNombre: string;
  calificacion: number; // 1–5
  mensaje: string;
  fecha: string; // ISO date string
}

// TODO: Reemplazar con datos reales de la API
const MOCK_RECOMENDACIONES: Recomendacion[] = [
  {
    id: '1',
    clienteNombre: 'María García',
    calificacion: 5,
    mensaje: 'Excelente trabajo. Llegó puntual, fue muy profesional y dejó todo limpio. Lo recomiendo sin dudarlo.',
    fecha: '2025-06-10',
  },
  {
    id: '2',
    clienteNombre: 'Carlos López',
    calificacion: 4,
    mensaje: 'Muy buen servicio. Solucionó el problema rápido y explicó bien lo que había pasado. Volvería a contratarlo.',
    fecha: '2025-05-28',
  },
  {
    id: '3',
    clienteNombre: 'Ana Torres',
    calificacion: 5,
    mensaje: 'Súper recomendado. Trabajó con mucho cuidado y el resultado fue perfecto. Muy amable y responsable.',
    fecha: '2025-05-14',
  },
  {
    id: '4',
    clienteNombre: 'Javier Ruiz',
    calificacion: 3,
    mensaje: 'Buen trabajo en general, aunque tardó un poco más de lo estimado. El resultado final fue satisfactorio.',
    fecha: '2025-04-30',
  },
];

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
  const [recomendaciones] = useState<Recomendacion[]>(MOCK_RECOMENDACIONES);

  useEffect(() => {
    const id = localStorage.getItem('providerId') || 'mi-perfil';
    setProviderId(id);
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
      <style>{`
        .main-content {
          padding: 24px;
          padding-top: calc(4rem + 32px);
        }
        .reco-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          margin-top: 24px;
        }
        .reco-card {
          flex: 0 0 100%;
          background: #fff;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.08);
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .link-card {
          background: #fff;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.08);
          margin-top: 24px;
        }
        .link-input-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 10px;
        }
        .link-input {
          flex: 1;
          padding: 10px 12px;
          border: 1.5px solid #E5E7EB;
          border-radius: 8px;
          font-size: 13px;
          font-family: 'Maitree', serif;
          color: #6B7280;
          background: #F9FAFB;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          cursor: default;
          outline: none;
        }
        .copy-btn {
          padding: 10px 16px;
          border-radius: 8px;
          border: none;
          background: #244C87;
          color: #fff;
          font-size: 13px;
          font-family: 'Maitree', serif;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          transition: background 0.15s;
        }
        .copy-btn:hover {
          background: #1A3A65;
        }
        .copy-btn.copied {
          background: #10B981;
        }
        .stats-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 24px;
        }
        .empty-state {
          text-align: center;
          padding: 64px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        @media (min-width: 768px) {
          .main-content {
            padding: 68px;
            padding-top: calc(4rem + 40px);
          }
          .reco-card {
            flex: 0 0 calc(50% - 8px);
          }
        }
        @media (min-width: 1200px) {
          .reco-card {
            flex: 0 0 calc(33.333% - 11px);
          }
        }
      `}</style>

      <ProviderHeader activePage="recomendaciones" />

      <main className="main-content">
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
        <div className="link-card">
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
          <div className="link-input-row">
            <input
              className="link-input"
              type="text"
              readOnly
              value={linkRecomendacion}
              title={linkRecomendacion}
            />
            <button
              className={`copy-btn${copied ? ' copied' : ''}`}
              onClick={handleCopyLink}
            >
              {copied ? '✓ Copiado' : 'Copiar'}
            </button>
          </div>
        </div>

        {/* Stats */}
        {recomendaciones.length > 0 && (
          <div className="stats-row">
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
        {recomendaciones.length === 0 ? (
          <div className="empty-state">
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
          <div className="reco-grid">
            {recomendaciones.map((reco) => (
              <div className="reco-card" key={reco.id}>
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
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
