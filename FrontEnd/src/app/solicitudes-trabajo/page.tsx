'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { colors, typography } from '@/styles/tokens';

// Tipo para las solicitudes
interface Solicitud {
  id: string;
  clienteNombre: string;
  ubicacion: string;
  especialidades: string[];
  estado: 'pendiente' | 'aceptado' | 'completado';
  fotos?: string[];
  urgencia?: string;
  descripcion?: string;
}

export default function SolicitudesTrabajo() {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showPresupuestoForm, setShowPresupuestoForm] = useState(false);
  const [presupuestoData, setPresupuestoData] = useState({
    valorTrabajo: '',
    tiempoEstimado: '',
    descripcionTrabajo: '',
    materialesAproximados: ''
  });

  // TODO: Obtener el providerId del usuario actual
  const providerId = typeof window !== 'undefined' ? localStorage.getItem('providerId') || '123' : '123';
  const profileLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/recomendacion/${providerId}`;

  // TODO: Obtener solicitudes desde el backend
  const [solicitudes] = useState<Solicitud[]>([
    {
      id: '1',
      clienteNombre: 'Pepito Perez',
      ubicacion: 'Vicente Lopez, Buenos Aires',
      especialidades: ['Pintura de exteriores', 'Restauración y lijado'],
      estado: 'pendiente',
      urgencia: 'MEDIA',
      descripcion: 'Tengo la pared echa mierda y necesito que le hagan el service completo',
      fotos: ['https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400']
    },
    {
      id: '2',
      clienteNombre: 'Vicente Lopez',
      ubicacion: 'Buenos Aires',
      especialidades: ['Pintura de exteriores', 'Restauración y lijado'],
      estado: 'aceptado'
    },
    {
      id: '3',
      clienteNombre: 'Vicente Lopez',
      ubicacion: 'Buenos Aires',
      especialidades: ['Pintura de exteriores', 'Restauración y lijado'],
      estado: 'completado'
    }
  ]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(profileLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getEstadoStyles = (estado: string) => {
    switch(estado) {
      case 'pendiente':
        return { 
          backgroundColor: '#E8D4C8', 
          color: '#6B4E3D',
          text: 'Pendiente'
        };
      case 'aceptado':
        return { 
          backgroundColor: '#C8E8D4', 
          color: '#3D6B4E',
          text: 'Aceptado'
        };
      case 'completado':
        return { 
          backgroundColor: '#E8D4C8', 
          color: '#6B4E3D',
          text: '✓'
        };
      default:
        return { 
          backgroundColor: '#E8D4C8', 
          color: '#6B4E3D',
          text: estado
        };
    }
  };

  const tieneSolicitudes = solicitudes.length > 0;

  const handleEnviarPresupuesto = () => {
    // TODO: Enviar presupuesto al backend
    console.log('Presupuesto enviado:', presupuestoData);
    setShowPresupuestoForm(false);
    setPresupuestoData({
      valorTrabajo: '',
      tiempoEstimado: '',
      descripcionTrabajo: '',
      materialesAproximados: ''
    });
  };

  return (
    <div style={{ backgroundColor: '#FFFCF9', minHeight: '100vh' }}>
      {/* Header sticky con degradado */}
      <header 
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between"
        style={{
          height: '6rem',
          background: 'linear-gradient(180deg, rgba(36, 76, 135, 0.8) 0%, rgba(255, 252, 249, 0.8) 100%)',
          paddingLeft: '24px',
          paddingRight: '24px'
        }}
      >
        {/* Flecha para volver atrás */}
        <button 
          onClick={() => router.back()}
          style={{ cursor: 'pointer', padding: '8px' }}
        >
          <svg width="24" height="24" fill="none" stroke={colors.neutral.black} strokeWidth="2" viewBox="0 0 24 24">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>

        {/* Menú hamburguesa */}
        <button 
          onClick={() => setShowMenu(true)}
          style={{ cursor: 'pointer', padding: '8px' }}
        >
          <svg width="24" height="24" fill="none" stroke={colors.neutral.black} strokeWidth="2" viewBox="0 0 24 24">
            <path d="M3 12h18M3 6h18M3 18h18"/>
          </svg>
        </button>
      </header>

      {/* Menú lateral */}
      {showMenu && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowMenu(false)}
          />
          <div 
            className="fixed top-0 left-0 h-full bg-white shadow-lg z-50"
            style={{ width: '280px' }}
          >
            <div className="p-6">
              <button
                onClick={() => setShowMenu(false)}
                className="mb-6"
                style={{ cursor: 'pointer' }}
              >
                <svg width="24" height="24" fill="none" stroke={colors.neutral.black} strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
              
              <nav className="space-y-4">
                <button
                  onClick={() => {
                    setShowMenu(false);
                    router.push('/dashboard-provider');
                  }}
                  className="w-full text-left p-3 hover:bg-gray-100 rounded-lg transition-colors"
                  style={{ 
                    fontFamily: typography.fontFamily.primary, 
                    fontSize: typography.fontSize.base,
                    color: colors.neutral.black,
                    cursor: 'pointer'
                  }}
                >
                  Mi Perfil
                </button>
                
                <button
                  onClick={() => {
                    setShowMenu(false);
                    router.push('/');
                  }}
                  className="w-full text-left p-3 hover:bg-gray-100 rounded-lg transition-colors"
                  style={{ 
                    fontFamily: typography.fontFamily.primary, 
                    fontSize: typography.fontSize.base,
                    color: colors.neutral.black,
                    cursor: 'pointer'
                  }}
                >
                  Inicio
                </button>
                
                <button
                  onClick={() => {
                    localStorage.clear();
                    router.push('/login');
                  }}
                  className="w-full text-left p-3 hover:bg-gray-100 rounded-lg transition-colors"
                  style={{ 
                    fontFamily: typography.fontFamily.primary, 
                    fontSize: typography.fontSize.base,
                    color: colors.neutral.black,
                    cursor: 'pointer'
                  }}
                >
                  Cerrar Sesión
                </button>
              </nav>
            </div>
          </div>
        </>
      )}

      {/* Contenido principal */}
      <main style={{ paddingTop: 'calc(6rem + 48px)', paddingLeft: '24px', paddingRight: '24px', paddingBottom: '48px' }}>
        <div className="max-w-2xl mx-auto">
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

              {/* Lista de solicitudes */}
              <div className="space-y-4">
                {solicitudes.map((solicitud) => {
                  const estadoStyles = getEstadoStyles(solicitud.estado);
                  const isExpanded = expandedId === solicitud.id;
                  
                  return (
                    <div key={solicitud.id}>
                      <div
                        onClick={() => setExpandedId(isExpanded ? null : solicitud.id)}
                        style={{
                          width: '100%',
                          maxWidth: '433px',
                          minHeight: '103px',
                          backgroundColor: '#FFFFFF',
                          borderRadius: '24px',
                          padding: '16px 20px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                          cursor: 'pointer',
                          transition: 'transform 0.2s, box-shadow 0.2s',
                          margin: '0 auto 16px auto'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.12)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
                        }}
                      >
                        {/* Fila superior: ubicación y estado */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <p style={{
                              fontFamily: 'Maitree, serif',
                              fontWeight: 500,
                              fontSize: '16px',
                              lineHeight: '100%',
                              letterSpacing: '0%',
                              color: colors.neutral.black,
                              margin: 0
                            }}>
                              {solicitud.clienteNombre}, {solicitud.ubicacion}
                            </p>
                          </div>
                          
                          <div style={{
                            backgroundColor: estadoStyles.backgroundColor,
                            color: estadoStyles.color,
                            padding: '6px 12px',
                            borderRadius: '12px',
                            fontFamily: 'Maitree, serif',
                            fontWeight: 400,
                            fontSize: '12px',
                            lineHeight: '100%',
                            letterSpacing: '0%',
                            whiteSpace: 'nowrap'
                          }}>
                            {estadoStyles.text}
                          </div>
                        </div>

                        {/* Fila inferior: especialidades */}
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
                          {solicitud.especialidades.map((esp, idx) => (
                            <div
                              key={idx}
                              style={{
                                padding: '6px 16px',
                                border: `1px solid ${colors.neutral[300]}`,
                                borderRadius: '20px',
                                fontFamily: 'Maitree, serif',
                                fontWeight: 400,
                                fontSize: '14px',
                                lineHeight: '100%',
                                color: colors.neutral[600]
                              }}
                            >
                              {esp}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Contenido expandido */}
                      {isExpanded && solicitud.estado === 'pendiente' && (
                        <div
                          style={{
                            width: '100%',
                            maxWidth: '433px',
                            backgroundColor: '#FFFFFF',
                            borderRadius: '24px',
                            padding: '24px',
                            margin: '0 auto 16px auto',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                            border: '2px solid #E8D4C8'
                          }}
                        >
                          <h2 style={{
                            fontFamily: 'Maitree, serif',
                            fontSize: '20px',
                            fontWeight: 600,
                            color: colors.neutral.black,
                            marginBottom: '16px'
                          }}>
                            Servicio Solicitado
                          </h2>

                          {/* Cliente */}
                          <p style={{
                            fontFamily: 'Maitree, serif',
                            fontSize: '14px',
                            fontWeight: 600,
                            color: colors.neutral.black,
                            marginBottom: '4px'
                          }}>
                            Cliente: <span style={{ fontWeight: 400 }}>{solicitud.clienteNombre}</span>
                          </p>

                          {/* Ubicación */}
                          <p style={{
                            fontFamily: 'Maitree, serif',
                            fontSize: '14px',
                            fontWeight: 600,
                            color: colors.neutral.black,
                            marginBottom: '4px'
                          }}>
                            Ubicación: <span style={{ fontWeight: 400 }}>{solicitud.ubicacion}</span>
                          </p>

                          {/* Urgencia */}
                          <p style={{
                            fontFamily: 'Maitree, serif',
                            fontSize: '14px',
                            fontWeight: 600,
                            color: colors.neutral.black,
                            marginBottom: '4px'
                          }}>
                            Urgencia: <span style={{ fontWeight: 400 }}>{solicitud.urgencia}</span>
                          </p>

                          {/* Descripción */}
                          <p style={{
                            fontFamily: 'Maitree, serif',
                            fontSize: '14px',
                            fontWeight: 600,
                            color: colors.neutral.black,
                            marginBottom: '4px'
                          }}>
                            Descripción: <span style={{ fontWeight: 400 }}>{solicitud.descripcion}</span>
                          </p>

                          {/* Foto del problema */}
                          {solicitud.fotos && solicitud.fotos.length > 0 && (
                            <>
                              <p style={{
                                fontFamily: 'Maitree, serif',
                                fontSize: '14px',
                                fontWeight: 600,
                                color: colors.neutral.black,
                                marginTop: '16px',
                                marginBottom: '8px'
                              }}>
                                Foto del problema:
                              </p>
                              <img
                                src={solicitud.fotos[0]}
                                alt="Foto del problema"
                                style={{
                                  width: '100%',
                                  height: '200px',
                                  objectFit: 'cover',
                                  borderRadius: '12px',
                                  marginBottom: '16px'
                                }}
                              />
                            </>
                          )}

                          {/* Botón Enviar Presupuesto o Formulario */}
                          {!showPresupuestoForm ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowPresupuestoForm(true);
                              }}
                              style={{
                                width: '100%',
                                padding: '12px',
                                backgroundColor: '#E8D4C8',
                                color: '#6B4E3D',
                                border: 'none',
                                borderRadius: '12px',
                                fontFamily: 'Maitree, serif',
                                fontSize: '16px',
                                fontWeight: 500,
                                cursor: 'pointer',
                                marginTop: '8px'
                              }}
                            >
                              Enviar Presupuesto
                            </button>
                          ) : (
                            <div style={{ marginTop: '16px' }}>
                              <h3 style={{
                                fontFamily: 'Maitree, serif',
                                fontSize: '18px',
                                fontWeight: 600,
                                color: colors.neutral.black,
                                marginBottom: '16px'
                              }}>
                                Completá tu presupuesto
                              </h3>

                              {/* Valor del trabajo */}
                              <div style={{ marginBottom: '12px' }}>
                                <label style={{
                                  fontFamily: 'Maitree, serif',
                                  fontSize: '14px',
                                  fontWeight: 500,
                                  color: colors.neutral.black,
                                  display: 'block',
                                  marginBottom: '4px'
                                }}>
                                  Valor del trabajo
                                </label>
                                <input
                                  type="text"
                                  value={presupuestoData.valorTrabajo}
                                  onChange={(e) => setPresupuestoData({...presupuestoData, valorTrabajo: e.target.value})}
                                  placeholder="$0.00"
                                  style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #D1D5DB',
                                    borderRadius: '8px',
                                    fontFamily: 'Maitree, serif',
                                    fontSize: '14px'
                                  }}
                                />
                              </div>

                              {/* Tiempo estimado */}
                              <div style={{ marginBottom: '12px' }}>
                                <label style={{
                                  fontFamily: 'Maitree, serif',
                                  fontSize: '14px',
                                  fontWeight: 500,
                                  color: colors.neutral.black,
                                  display: 'block',
                                  marginBottom: '4px'
                                }}>
                                  Tiempo estimado
                                </label>
                                <input
                                  type="text"
                                  value={presupuestoData.tiempoEstimado}
                                  onChange={(e) => setPresupuestoData({...presupuestoData, tiempoEstimado: e.target.value})}
                                  placeholder="Ej: 2 días"
                                  style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #D1D5DB',
                                    borderRadius: '8px',
                                    fontFamily: 'Maitree, serif',
                                    fontSize: '14px'
                                  }}
                                />
                              </div>

                              {/* Cómo sería el trabajo */}
                              <div style={{ marginBottom: '12px' }}>
                                <label style={{
                                  fontFamily: 'Maitree, serif',
                                  fontSize: '14px',
                                  fontWeight: 500,
                                  color: colors.neutral.black,
                                  display: 'block',
                                  marginBottom: '4px'
                                }}>
                                  Cómo sería el trabajo
                                </label>
                                <textarea
                                  value={presupuestoData.descripcionTrabajo}
                                  onChange={(e) => setPresupuestoData({...presupuestoData, descripcionTrabajo: e.target.value})}
                                  placeholder="Describe cómo realizarías el trabajo..."
                                  rows={3}
                                  style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #D1D5DB',
                                    borderRadius: '8px',
                                    fontFamily: 'Maitree, serif',
                                    fontSize: '14px',
                                    resize: 'vertical'
                                  }}
                                />
                              </div>

                              {/* Materiales aproximados */}
                              <div style={{ marginBottom: '16px' }}>
                                <label style={{
                                  fontFamily: 'Maitree, serif',
                                  fontSize: '14px',
                                  fontWeight: 500,
                                  color: colors.neutral.black,
                                  display: 'block',
                                  marginBottom: '4px'
                                }}>
                                  Materiales aproximados
                                </label>
                                <textarea
                                  value={presupuestoData.materialesAproximados}
                                  onChange={(e) => setPresupuestoData({...presupuestoData, materialesAproximados: e.target.value})}
                                  placeholder="Lista de materiales necesarios..."
                                  rows={3}
                                  style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #D1D5DB',
                                    borderRadius: '8px',
                                    fontFamily: 'Maitree, serif',
                                    fontSize: '14px',
                                    resize: 'vertical'
                                  }}
                                />
                              </div>

                              {/* Botones */}
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowPresupuestoForm(false);
                                  }}
                                  style={{
                                    flex: 1,
                                    padding: '12px',
                                    backgroundColor: '#F3F4F6',
                                    color: colors.neutral.black,
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontFamily: 'Maitree, serif',
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    cursor: 'pointer'
                                  }}
                                >
                                  Cancelar
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEnviarPresupuesto();
                                  }}
                                  style={{
                                    flex: 1,
                                    padding: '12px',
                                    backgroundColor: '#B45B39',
                                    color: '#FFFFFF',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontFamily: 'Maitree, serif',
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    cursor: 'pointer'
                                  }}
                                >
                                  Enviar
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
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
        </div>
      </main>
    </div>
  );
}
