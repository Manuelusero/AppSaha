'use client';

import { useState, useEffect } from 'react';
import { colors, typography } from '@/styles/tokens';
import { ProviderHeader } from '@/components/layout';
import { useBookingsStore } from '@/store/bookingsStore';
import { apiPost, apiPatch } from '@/utils/api';

// Tipo para las solicitudes
type EstadoSolicitud = 'pendiente' | 'rechazado' | 'aceptado' | 'completado';
type TabFiltro = 'todas' | EstadoSolicitud;

interface Solicitud {
  id: string;
  clienteNombre: string;
  ubicacion: string;
  especialidades: string[];
  estado: EstadoSolicitud;
  fotos?: string[];
  urgencia?: string;
  descripcion?: string;
}

export default function SolicitudesTrabajo() {
  const [copied, setCopied] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [tabActiva, setTabActiva] = useState<TabFiltro>('todas');
  const [presupuestoSolicitud, setPresupuestoSolicitud] = useState<Solicitud | null>(null);
  const [presupuestoEnviado, setPresupuestoEnviado] = useState<string | null>(null);
  const [presupuestoData, setPresupuestoData] = useState({
    valorTrabajo: '',
    tiempoEstimado: '',
    descripcionTrabajo: '',
    materialesAproximados: ''
  });

  // TODO: Obtener el providerId del usuario actual
  const providerId = typeof window !== 'undefined' ? localStorage.getItem('providerId') || '' : '';
  const profileLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/recomendacion/${providerId}`;

  const { bookings, isLoading, fetchBookings } = useBookingsStore();
  const [sendingBudget, setSendingBudget] = useState(false);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectModalSolicitud, setRejectModalSolicitud] = useState<Solicitud | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const pendingCount = bookings.filter(b => b.status === 'pending').length;

  const mapStatusToEstado = (status: string): EstadoSolicitud => {
    switch (status) {
      case 'pending': return 'pendiente';
      case 'accepted':
      case 'confirmed':
      case 'in_progress': return 'aceptado';
      case 'completed': return 'completado';
      case 'rejected': return 'rechazado';
      case 'cancelled': return 'rechazado';
      default: return 'rechazado';
    }
  };

  const solicitudes: Solicitud[] = bookings.map((b) => ({
    id: b.id,
    clienteNombre: b.clientName,
    ubicacion: b.location,
    especialidades: b.service ? [b.service] : [],
    estado: mapStatusToEstado(b.status),
    urgencia: b.urgency && b.urgency !== 'No especificada' ? b.urgency : undefined,
    descripcion: b.description || undefined,
    fotos: b.problemPhoto ? [b.problemPhoto] : undefined,
  }));

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(profileLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getEstadoStyles = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return { backgroundColor: '#E8D4C8', color: '#6B4E3D', text: 'Pendiente' };
      case 'rechazado':
        return { backgroundColor: '#F3E8E8', color: '#9B2C2C', text: 'Rechazado' };
      case 'aceptado':
        return { backgroundColor: '#C8E8D4', color: '#3D6B4E', text: 'Aceptado' };
      case 'completado':
        return { backgroundColor: '#E8E8E8', color: '#4B5563', text: '✓ Completado' };
      default:
        return { backgroundColor: '#E8D4C8', color: '#6B4E3D', text: estado };
    }
  };

  // Tabs de filtro
  const tabs: { key: TabFiltro; label: string }[] = [
    { key: 'todas',      label: 'Todas' },
    { key: 'pendiente',  label: 'Pendientes' },
    { key: 'rechazado',  label: 'Rechazadas' },
    { key: 'aceptado',   label: 'Aceptadas' },
    { key: 'completado', label: 'Completadas' },
  ];

  const contarPor = (estado: EstadoSolicitud) =>
    solicitudes.filter((s) => s.estado === estado).length;

  const solicitudesFiltradas =
    tabActiva === 'todas'
      ? solicitudes
      : solicitudes.filter((s) => s.estado === tabActiva);

  const tieneSolicitudes = solicitudes.length > 0;

  const handleEnviarPresupuesto = async () => {
    if (!presupuestoSolicitud) return;
    setSendingBudget(true);
    try {
      await apiPost(`/bookings/${presupuestoSolicitud.id}/send-budget`, {
        budgetPrice: presupuestoData.valorTrabajo.replace(/\./g, '').replace(/,/g, '.'),  // strip thousand dots
        budgetDetails: presupuestoData.descripcionTrabajo,
        budgetMaterials: presupuestoData.materialesAproximados || null,
        budgetTime: presupuestoData.tiempoEstimado || null,
      });
      setPresupuestoEnviado(presupuestoSolicitud.clienteNombre);
      setPresupuestoData({ valorTrabajo: '', tiempoEstimado: '', descripcionTrabajo: '', materialesAproximados: '' });
      fetchBookings();
    } catch (err: any) {
      alert(err.message || 'Error al enviar el presupuesto');
    } finally {
      setSendingBudget(false);
    }
  };

  const handleCerrarModal = () => {
    setPresupuestoSolicitud(null);
    setPresupuestoEnviado(null);
  };

  const handleRechazar = (solicitud: Solicitud) => {
    setRejectReason('');
    setRejectModalSolicitud(solicitud);
  };

  const confirmRechazar = async () => {
    if (!rejectModalSolicitud) return;
    setRejectingId(rejectModalSolicitud.id);
    try {
      await apiPatch(`/bookings/${rejectModalSolicitud.id}/status`, {
        status: 'REJECTED',
        cancellationReason: rejectReason.trim() || null,
      });
      setRejectModalSolicitud(null);
      fetchBookings();
    } catch (err: any) {
      alert(err.message || 'Error al rechazar la solicitud');
    } finally {
      setRejectingId(null);
    }
  };

  // Contenido del detalle expandido — accordion en mobile, siempre visible en desktop
  const detalleContent = (solicitud: Solicitud) => (
    <>
      <p style={{ fontFamily: 'Maitree, serif', fontSize: '12px', fontWeight: 600, color: colors.neutral.black, marginBottom: '3px' }}>
        Cliente: <span style={{ fontWeight: 400 }}>{solicitud.clienteNombre}</span>
      </p>

      <p style={{ fontFamily: 'Maitree, serif', fontSize: '12px', fontWeight: 600, color: colors.neutral.black, marginBottom: '3px' }}>
        Ubicación: <span style={{ fontWeight: 400 }}>{solicitud.ubicacion}</span>
      </p>

      {solicitud.urgencia && (
        <p style={{ fontFamily: 'Maitree, serif', fontSize: '12px', fontWeight: 600, color: colors.neutral.black, marginBottom: '3px' }}>
          Urgencia: <span style={{ fontWeight: 400 }}>{solicitud.urgencia}</span>
        </p>
      )}

      {solicitud.descripcion && (
        <p style={{ fontFamily: 'Maitree, serif', fontSize: '12px', fontWeight: 600, color: colors.neutral.black, marginBottom: '3px' }}>
          Descripción: <span style={{ fontWeight: 400 }}>{solicitud.descripcion}</span>
        </p>
      )}

      {solicitud.fotos && solicitud.fotos.length > 0 && (
        <>
          <p style={{ fontFamily: 'Maitree, serif', fontSize: '12px', fontWeight: 600, color: colors.neutral.black, marginTop: '10px', marginBottom: '6px' }}>
            Foto del problema:
          </p>
          <img
            src={solicitud.fotos[0]}
            alt="Foto del problema"
            style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '10px', marginBottom: '10px' }}
          />
        </>
      )}

      {solicitud.estado === 'pendiente' && (
        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
          <button
            onClick={(e) => { e.stopPropagation(); setPresupuestoSolicitud(solicitud); }}
            style={{ flex: 1, padding: '9px', backgroundColor: '#E8D4C8', color: '#6B4E3D', border: 'none', borderRadius: '10px', fontFamily: 'Maitree, serif', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}
          >
            Enviar Presupuesto
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleRechazar(solicitud); }}
            disabled={rejectingId === solicitud.id}
            style={{ flex: 1, padding: '9px', backgroundColor: rejectingId === solicitud.id ? '#F9FAFB' : '#FEE2E2', color: '#B91C1C', border: 'none', borderRadius: '10px', fontFamily: 'Maitree, serif', fontSize: '13px', fontWeight: 500, cursor: rejectingId === solicitud.id ? 'wait' : 'pointer', opacity: rejectingId === solicitud.id ? 0.7 : 1 }}
          >
            {rejectingId === solicitud.id ? 'Rechazando...' : 'Rechazar'}
          </button>
        </div>
      )}
    </>
  );

  return (
    <div style={{ backgroundColor: '#FFFCF9', minHeight: '100vh' }}>
      {/* Header del proveedor */}
      <ProviderHeader activePage="solicitudes" pendingCount={pendingCount} />

      {/* Contenido principal */}
      <style>{`
        .main-content {
          padding-top: calc(80px + 48px);
          padding-left: 24px;
          padding-right: 24px;
          padding-bottom: 48px;
        }
        @media (min-width: 768px) {
          .main-content {
            padding-left: 68px;
            padding-right: 68px;
          }
        }
      `}</style>
      <main className="main-content">
        {isLoading && (
          <div style={{ textAlign: 'center', padding: '80px 0', fontFamily: 'Maitree, serif', color: '#9CA3AF' }}>
            Cargando solicitudes...
          </div>
        )}
        {!isLoading && (
          <>
            {tieneSolicitudes ? (
            <>
              {/* Vista con solicitudes */}
              <h1 style={{
                fontFamily: 'Maitree, serif',
                fontSize: '32px',
                fontWeight: 600,
                color: colors.neutral.black,
                textAlign: 'center',
                marginBottom: '48px'
              }}>
                Mis Solicitudes
              </h1>

              {/* Barra de chips / tabs */}
              <style>{`
                .chips-wrapper {
                  overflow-x: auto;
                  -webkit-overflow-scrolling: touch;
                  margin-bottom: 28px;
                  /* Rompe el padding del padre para ir de borde a borde */
                  margin-left: -24px;
                  margin-right: -24px;
                }
                .chips-inner {
                  display: inline-flex;
                  gap: 8px;
                  flex-wrap: nowrap;
                  padding: 4px 24px;
                  /* El padding-right en el inner resuelve el bug de trailing padding en scroll */
                }
                @media (min-width: 768px) {
                  .chips-wrapper {
                    margin-left: 0;
                    margin-right: 0;
                    overflow-x: visible;
                  }
                  .chips-inner {
                    flex-wrap: wrap;
                    padding: 4px 0;
                  }
                }
              `}</style>
              <div className="chips-wrapper">
                <div className="chips-inner">
                  {tabs.map(({ key, label }) => {
                    const isActive = tabActiva === key;
                    const count = key === 'todas' ? solicitudes.length : contarPor(key as EstadoSolicitud);
                    const isPendienteTab = key === 'pendiente';
                    return (
                      <button
                        key={key}
                        onClick={() => { setTabActiva(key); setExpandedId(null); }}
                        style={{
                          position: 'relative',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '8px 16px',
                          borderRadius: '999px',
                          border: isActive ? 'none' : '1.5px solid #E5E7EB',
                          backgroundColor: isActive ? '#244C87' : '#FFFFFF',
                          color: isActive ? '#FFFFFF' : colors.neutral[600],
                          fontFamily: 'Maitree, serif',
                          fontSize: '14px',
                          fontWeight: isActive ? 600 : 400,
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {label}
                        {count > 0 && (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minWidth: '20px',
                            height: '20px',
                            padding: '0 5px',
                            borderRadius: '999px',
                            fontSize: '11px',
                            fontWeight: 700,
                            backgroundColor: isActive
                              ? 'rgba(255,255,255,0.25)'
                              : isPendienteTab
                              ? '#B45B39'
                              : '#F3F4F6',
                            color: isActive
                              ? '#FFFFFF'
                              : isPendienteTab
                              ? '#FFFFFF'
                              : colors.neutral[500],
                          }}>
                            {count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Lista de solicitudes — mobile: 1 col / desktop: flex-wrap */}
              <style>{`
                .solicitudes-grid {
                  display: flex;
                  flex-direction: column;
                  gap: 16px;
                  align-items: stretch;
                }
                @media (min-width: 768px) {
                  .solicitudes-grid {
                    flex-direction: row;
                    flex-wrap: wrap;
                    gap: 20px;
                    align-items: flex-start;
                  }
                  .solicitud-card {
                    flex: 0 0 220px;
                    width: 220px;
                  }
                }
              `}</style>
              <div className="solicitudes-grid">
                {solicitudesFiltradas.map((solicitud) => {
                  const estadoStyles = getEstadoStyles(solicitud.estado);
                  const isExpanded = expandedId === solicitud.id;
                  const isPendiente = solicitud.estado === 'pendiente';

                  return (
                    <div
                      key={solicitud.id}
                      onClick={() => setExpandedId(isExpanded ? null : solicitud.id)}
                      className="solicitud-card"
                      style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '20px',
                        padding: '14px 16px',
                        boxShadow: isExpanded
                          ? '0 4px 16px rgba(0,0,0,0.12)'
                          : '0 2px 8px rgba(0,0,0,0.08)',
                        cursor: 'pointer',
                        transition: 'box-shadow 0.2s',
                        border: isExpanded ? '2px solid #E8D4C8' : '2px solid transparent',
                        minWidth: 0,
                      }}
                    >
                      {/* ── Cabecera de la card (siempre visible) ── */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        {/* Mobile: 'Servicio Solicitado' cuando está expandida */}
                        <p className="md:hidden" style={{
                          fontFamily: 'Maitree, serif',
                          fontWeight: 600,
                          fontSize: '13px',
                          color: colors.neutral.black,
                          margin: 0,
                          flex: 1,
                          paddingRight: '8px'
                        }}>
                          {isExpanded ? 'Servicio Solicitado' : solicitud.ubicacion}
                        </p>
                        {/* Desktop: 'Servicio Solicitado' siempre para pendientes (detalle siempre visible) */}
                        <p className="hidden md:block" style={{
                          fontFamily: 'Maitree, serif',
                          fontWeight: 600,
                          fontSize: '13px',
                          color: colors.neutral.black,
                          margin: 0,
                          flex: 1,
                          paddingRight: '8px'
                        }}>
                          {isPendiente ? 'Servicio Solicitado' : (isExpanded ? 'Servicio Solicitado' : solicitud.ubicacion)}
                        </p>
                        <div style={{
                          backgroundColor: estadoStyles.backgroundColor,
                          color: estadoStyles.color,
                          padding: '4px 8px',
                          borderRadius: '10px',
                          fontFamily: 'Maitree, serif',
                          fontWeight: 400,
                          fontSize: '11px',
                          whiteSpace: 'nowrap',
                          flexShrink: 0,
                        }}>
                          {estadoStyles.text}
                        </div>
                      </div>

                      {/* Especialidades */}
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '10px' }}>
                        {solicitud.especialidades.map((esp) => (
                          <div
                            key={`${solicitud.id}-${esp}`}
                            style={{
                              padding: '4px 10px',
                              border: `1px solid ${colors.neutral[300]}`,
                              borderRadius: '20px',
                              fontFamily: 'Maitree, serif',
                              fontWeight: 400,
                              fontSize: '11px',
                              color: colors.neutral[600],
                            }}
                          >
                            {esp}
                          </div>
                        ))}
                      </div>

                      {/* ── Detalle expandido (mobile: accordion; desktop: siempre visible si pendiente, accordion para el resto) ── */}
                      {isExpanded && (
                        <div
                          className="md:hidden"
                          onClick={(e) => e.stopPropagation()}
                          style={{ marginTop: '20px', borderTop: '1px solid #F0E8E0', paddingTop: '16px' }}
                        >
                          {detalleContent(solicitud)}
                        </div>
                      )}

                      {/* Desktop: siempre visible si pendiente, accordion para el resto */}
                      <div
                        className="hidden md:block"
                        onClick={(e) => e.stopPropagation()}
                        style={{ display: (isPendiente || isExpanded) ? undefined : 'none', marginTop: '20px', borderTop: '1px solid #F0E8E0', paddingTop: '16px' }}
                      >
                        {(isPendiente || isExpanded) && detalleContent(solicitud)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              {/* Vista sin solicitudes (contenido original) */}
              {/* Título */}
              <h1 style={{
                fontFamily: 'Maitree, serif',
                fontSize: '32px',
                fontWeight: 600,
                color: colors.neutral.black,
                textAlign: 'center',
                marginBottom: '32px'
              }}>
                ¿Recién empezas?
              </h1>

          <p style={{
            fontFamily: typography.fontFamily.primary,
            fontSize: typography.fontSize.base,
            color: colors.neutral.black,
            marginBottom: '32px',
            lineHeight: '1.6',
            paddingLeft: '24px'
          }}>
            Seguí estos consejos para conseguir trabajos más rápido
          </p>

          {/* Lista de consejos */}
          <ul style={{ 
            listStyle: 'disc',
            paddingLeft: '24px',
            marginBottom: '48px'
          }}>
            <li style={{
              fontFamily: typography.fontFamily.primary,
              fontSize: typography.fontSize.base,
              color: colors.neutral.black,
              marginBottom: '16px',
              lineHeight: '1.6'
            }}>
              <strong>Completá tu perfil:</strong> asegurate de sumar fotos de trabajos anteriores y también referencias laborales.
            </li>
            
            <li style={{
              fontFamily: typography.fontFamily.primary,
              fontSize: typography.fontSize.base,
              color: colors.neutral.black,
              marginBottom: '16px',
              lineHeight: '1.6'
            }}>
              <strong>Cargá tus certificados:</strong> mostrá en tu perfil todo lo que sabes. Incluí muestras de cursos o certificaciones que ayuden a dar confianza a nuevos clientes.
            </li>
            
            <li style={{
              fontFamily: typography.fontFamily.primary,
              fontSize: typography.fontSize.base,
              color: colors.neutral.black,
              marginBottom: '16px',
              lineHeight: '1.6'
            }}>
              <strong>Pedí a tus clientes nuevos que te contacten por el sitio:</strong> Si! esto es posible, podes compartir tu perfil directamente para que nuevos clientes te contacten por la app y aumentar tu visibilidad.
            </li>
            
            <li style={{
              fontFamily: typography.fontFamily.primary,
              fontSize: typography.fontSize.base,
              color: colors.neutral.black,
              marginBottom: '16px',
              lineHeight: '1.6'
            }}>
              <strong>Y por último no olvides pedir una Recomendación a tus antiguos clientes:</strong> puedes compartir con ellos el link que tendrás a continuación para que dejen sus comentarios sobre tu trabajo. Esto será visible en tu perfil para que lo vean los nuevos posibles clientes.
            </li>
          </ul>

          {/* Input con link y botón copiar */}
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={profileLink}
              readOnly
              className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-300 bg-white"
              style={{
                fontFamily: typography.fontFamily.primary,
                fontSize: typography.fontSize.sm,
                color: colors.neutral[600]
              }}
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
            
            <button
              onClick={handleCopyLink}
              className="px-6 py-3 rounded-lg transition-colors"
              style={{
                fontFamily: typography.fontFamily.primary,
                fontSize: typography.fontSize.base,
                color: '#FFFFFF',
                backgroundColor: colors.neutral.black,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {copied ? '¡Copiado!' : 'Copiar'}
            </button>
          </div>

          {/* Nota informativa */}
          <p style={{
            fontFamily: typography.fontFamily.primary,
            fontSize: typography.fontSize.sm,
            color: colors.neutral[500],
            marginTop: '16px',
            textAlign: 'center',
            fontStyle: 'italic'
          }}>
            Comparte este link con tus clientes para que dejen sus recomendaciones
          </p>
            </>
          )}
          </>
        )}
      </main>

      {/* ── Modal Rechazar Solicitud ── */}
      {rejectModalSolicitud && (
        <div
          onClick={() => setRejectModalSolicitud(null)}
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ backgroundColor: '#FFF8F0', borderRadius: '24px', padding: '32px 28px', width: '100%', maxWidth: '400px', boxShadow: '0 8px 32px rgba(0,0,0,0.16)' }}
          >
            {/* X cerrar */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
              <button onClick={() => setRejectModalSolicitud(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                <svg width="20" height="20" fill="none" stroke="#374151" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>

            <h2 style={{ fontFamily: 'Maitree, serif', fontSize: '20px', fontWeight: 600, color: '#B91C1C', textAlign: 'center', marginBottom: '8px' }}>
              Rechazar solicitud
            </h2>
            <p style={{ fontFamily: 'Maitree, serif', fontSize: '14px', color: '#6B7280', textAlign: 'center', marginBottom: '24px' }}>
              {rejectModalSolicitud.clienteNombre}
            </p>

            <label style={{ fontFamily: 'Maitree, serif', fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '8px' }}>
              Motivo (opcional)
            </label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Ej: No puedo tomar trabajo en esa zona, estoy sin disponibilidad este mes..."
              rows={4}
              style={{ width: '100%', padding: '12px 14px', borderRadius: '14px', border: '2px solid #E5E7EB', fontFamily: 'Maitree, serif', fontSize: '14px', color: '#374151', resize: 'none', outline: 'none', boxSizing: 'border-box' }}
            />

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button
                onClick={() => setRejectModalSolicitud(null)}
                style={{ flex: 1, padding: '11px', borderRadius: '999px', border: '2px solid #E5E7EB', background: 'white', fontFamily: 'Maitree, serif', fontSize: '14px', color: '#374151', cursor: 'pointer' }}
              >
                Cancelar
              </button>
              <button
                onClick={confirmRechazar}
                disabled={!!rejectingId}
                style={{ flex: 1, padding: '11px', borderRadius: '999px', border: 'none', background: rejectingId ? '#F9FAFB' : '#B91C1C', color: rejectingId ? '#9CA3AF' : 'white', fontFamily: 'Maitree, serif', fontSize: '14px', fontWeight: 600, cursor: rejectingId ? 'wait' : 'pointer' }}
              >
                {rejectingId ? 'Rechazando...' : 'Confirmar rechazo'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Enviar Presupuesto ── */}
      {presupuestoSolicitud && (
        <div
          onClick={presupuestoEnviado ? undefined : handleCerrarModal}
          style={{
            position: 'fixed', inset: 0,
            backgroundColor: 'rgba(0,0,0,0.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000,
            padding: '24px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              padding: '32px',
              width: '100%',
              maxWidth: '480px',
              boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            {presupuestoEnviado ? (
              /* ── Pantalla de éxito ── */
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>✓</div>
                <h2 style={{ fontFamily: 'Maitree, serif', fontSize: '22px', fontWeight: 700, color: '#B45B39', marginBottom: '16px' }}>
                  ¡Presupuesto enviado!
                </h2>
                <p style={{
                  fontFamily: 'Maitree, serif',
                  fontSize: '15px',
                  color: colors.neutral[600],
                  lineHeight: '1.6',
                  marginBottom: '28px',
                }}>
                  Tu presupuesto fue enviado a <strong style={{ color: '#B45B39' }}>{presupuestoEnviado}</strong>.
                  Nos pondremos en contacto contigo cuando tengamos una respuesta.
                </p>
                <button
                  onClick={handleCerrarModal}
                  style={{ padding: '12px 40px', backgroundColor: '#B45B39', color: '#FFFFFF', border: 'none', borderRadius: '12px', fontFamily: 'Maitree, serif', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Entendido
                </button>
              </div>
            ) : (
              <>
            {/* Header del modal */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontFamily: 'Maitree, serif', fontSize: '20px', fontWeight: 700, color: colors.neutral.black, margin: 0 }}>
                  Enviar Presupuesto
                </h2>
                <p style={{ fontFamily: 'Maitree, serif', fontSize: '13px', color: colors.neutral[500], margin: '4px 0 0' }}>
                  {presupuestoSolicitud.clienteNombre} — {presupuestoSolicitud.ubicacion}
                </p>
              </div>
              <button
                onClick={handleCerrarModal}
                style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: colors.neutral[400], lineHeight: 1, padding: '0 0 0 12px' }}
              >
                ×
              </button>
            </div>

            {/* Valor del trabajo */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontFamily: 'Maitree, serif', fontSize: '14px', fontWeight: 500, color: colors.neutral.black, display: 'block', marginBottom: '6px' }}>
                Valor del trabajo
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={presupuestoData.valorTrabajo}
                onChange={(e) => {
                  // Strip everything except digits
                  const digits = e.target.value.replace(/\D/g, '');
                  // Format with dots as thousand separators
                  const formatted = digits === '' ? '' : Number(digits).toLocaleString('es-AR');
                  setPresupuestoData({ ...presupuestoData, valorTrabajo: formatted });
                }}
                placeholder="0"
                style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #E5E7EB', borderRadius: '10px', fontFamily: 'Maitree, serif', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>

            {/* Tiempo estimado */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontFamily: 'Maitree, serif', fontSize: '14px', fontWeight: 500, color: colors.neutral.black, display: 'block', marginBottom: '6px' }}>
                Tiempo estimado
              </label>
              <input
                type="text"
                value={presupuestoData.tiempoEstimado}
                onChange={(e) => setPresupuestoData({ ...presupuestoData, tiempoEstimado: e.target.value })}
                placeholder="Ej: 2 días"
                style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #E5E7EB', borderRadius: '10px', fontFamily: 'Maitree, serif', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>

            {/* Cómo sería el trabajo */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontFamily: 'Maitree, serif', fontSize: '14px', fontWeight: 500, color: colors.neutral.black, display: 'block', marginBottom: '6px' }}>
                Cómo sería el trabajo
              </label>
              <textarea
                value={presupuestoData.descripcionTrabajo}
                onChange={(e) => setPresupuestoData({ ...presupuestoData, descripcionTrabajo: e.target.value })}
                placeholder="Describe cómo realizarías el trabajo..."
                rows={3}
                style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #E5E7EB', borderRadius: '10px', fontFamily: 'Maitree, serif', fontSize: '14px', resize: 'vertical', boxSizing: 'border-box' }}
              />
            </div>

            {/* Materiales aproximados */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontFamily: 'Maitree, serif', fontSize: '14px', fontWeight: 500, color: colors.neutral.black, display: 'block', marginBottom: '6px' }}>
                Materiales aproximados
              </label>
              <textarea
                value={presupuestoData.materialesAproximados}
                onChange={(e) => setPresupuestoData({ ...presupuestoData, materialesAproximados: e.target.value })}
                placeholder="Lista de materiales necesarios..."
                rows={3}
                style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #E5E7EB', borderRadius: '10px', fontFamily: 'Maitree, serif', fontSize: '14px', resize: 'vertical', boxSizing: 'border-box' }}
              />
            </div>

            {/* Botones */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleCerrarModal}
                style={{ flex: 1, padding: '12px', backgroundColor: '#F3F4F6', color: colors.neutral.black, border: 'none', borderRadius: '12px', fontFamily: 'Maitree, serif', fontSize: '15px', fontWeight: 500, cursor: 'pointer' }}
              >
                Cancelar
              </button>
              <button
                onClick={handleEnviarPresupuesto}
                disabled={sendingBudget}
                style={{ flex: 1, padding: '12px', backgroundColor: sendingBudget ? '#D9A08A' : '#B45B39', color: '#FFFFFF', border: 'none', borderRadius: '12px', fontFamily: 'Maitree, serif', fontSize: '15px', fontWeight: 600, cursor: sendingBudget ? 'not-allowed' : 'pointer' }}
              >
                {sendingBudget ? 'Enviando...' : 'Enviar'}
              </button>
            </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
