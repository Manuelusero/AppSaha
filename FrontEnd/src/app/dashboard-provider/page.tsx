'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { colors, typography, spacing } from '@/styles/tokens';
import { useFetch } from '@/hooks';
import { apiGet, apiPost, getProfileImageUrl, getPortfolioImageUrl, getProblemPhotoUrl, PROVIDER_ID_KEY } from '@/utils';

interface ProviderData {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  ubicacion: string;
  serviceCategory: string;
  specialties: string[];
  descripcion: string;
  experiencia: number;
  precioHora?: number;
  profileImage?: string;
  portfolioImages?: string[];
}

interface JobRequest {
  id: string; // Cambiar de number a string para que coincida con los IDs de Prisma
  clientName: string;
  service: string;
  location: string;
  description: string;
  urgency: string;
  contactEmail: string;
  contactPhone: string;
  problemPhoto?: string | null; // Foto del problema cargada por el cliente
  createdAt: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export default function DashboardProvider() {
  const router = useRouter();
  const [providerData, setProviderData] = useState<ProviderData | null>(null);
  const [jobRequests, setJobRequests] = useState<JobRequest[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<JobRequest | null>(null);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'perfil' | 'solicitudes'>('perfil');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Datos adicionales del registro
  const [datosAdicionales, setDatosAdicionales] = useState({
    profesionesAdicionales: [] as Array<{profesion: string, especialidades: string[]}>,
    alcanceTrabajo: '',
    dni: '',
    instagram: '',
    facebook: '',
    linkedin: '',
    certificadosProfesionales: [] as string[]
  });

  // Formulario de presupuesto
  const [budgetForm, setBudgetForm] = useState({
    price: '',
    workDetails: '',
    materials: '',
    estimatedTime: ''
  });

  // Cargar datos del proveedor
  useEffect(() => {
    // TODO: Obtener el ID del proveedor desde el localStorage o contexto de auth
    const providerId = localStorage.getItem(PROVIDER_ID_KEY);
    
    if (!providerId) {
      router.push('/login');
      return;
    }

    // Cargar datos del proveedor desde la API
    console.log('Cargando datos del proveedor desde API:', providerId);
    apiGet<any>(`/providers/${providerId}`)
      .then(data => {
        console.log('Datos del proveedor recibidos:', data);
        
        // El backend devuelve el usuario con providerProfile
        const profile = data.providerProfile;
        if (!profile) {
          console.error('No se encontró providerProfile');
          return;
        }

        // Parsear especialidades (viene como JSON string)
        let specialties = [];
        try {
          specialties = typeof profile.specialties === 'string' 
            ? JSON.parse(profile.specialties) 
            : profile.specialties || [];
        } catch {
          specialties = [];
        }

        // Parsear fotos de trabajos
        let portfolioImages = [];
        try {
          portfolioImages = typeof profile.portfolioImages === 'string'
            ? JSON.parse(profile.portfolioImages)
            : profile.portfolioImages || [];
        } catch {
          portfolioImages = [];
        }

        // Construir URLs completas para las imágenes
        const profileImageUrl = getProfileImageUrl(profile.profilePhoto);

        setProviderData({
          id: parseInt(providerId),
          nombre: data.name?.split(' ')[0] || '',
          apellido: data.name?.split(' ').slice(1).join(' ') || '',
          email: data.email || '',
          telefono: data.phone || '',
          ubicacion: profile.location || '',
          serviceCategory: profile.serviceCategory || '',
          specialties: specialties,
          descripcion: profile.bio || profile.serviceDescription || '',
          experiencia: profile.experience || 0,
          precioHora: profile.pricePerHour || 0,
          profileImage: profileImageUrl,
          portfolioImages: portfolioImages.map((img: string) => 
            getPortfolioImageUrl(img)
          )
        });

        // Cargar datos adicionales del perfil
        setDatosAdicionales({
          profesionesAdicionales: [], // TODO: agregar al schema si se necesita
          alcanceTrabajo: profile.serviceRadius?.toString() || '',
          dni: profile.dniNumber || '',
          instagram: profile.instagram || '',
          facebook: profile.facebook || '',
          linkedin: profile.linkedin || '',
          certificadosProfesionales: profile.certifications 
            ? (typeof profile.certifications === 'string' ? JSON.parse(profile.certifications) : profile.certifications)
            : []
        });
        
        console.log('Provider data establecido correctamente');
      })
      .catch(err => {
        console.error('Error cargando proveedor desde API:', err);
        
        // Fallback: intentar cargar desde localStorage si falla la API
        const registroCompleto = localStorage.getItem('registroCompleto');
        if (registroCompleto) {
          try {
            const datosRegistro = JSON.parse(registroCompleto);
            console.log('Usando datos de localStorage como fallback');
            
            setProviderData({
              id: parseInt(providerId),
              nombre: datosRegistro.nombre || '',
              apellido: datosRegistro.apellido || '',
              email: datosRegistro.email || '',
              telefono: datosRegistro.telefono || '',
              ubicacion: datosRegistro.ubicacion || '',
              serviceCategory: datosRegistro.profesion || '',
              specialties: datosRegistro.especialidades || [],
              descripcion: datosRegistro.descripcion || '',
              experiencia: 0,
              precioHora: 0,
              profileImage: '',
              portfolioImages: []
            });
            
            setDatosAdicionales({
              profesionesAdicionales: datosRegistro.profesionesAdicionales || [],
              alcanceTrabajo: datosRegistro.alcanceTrabajo || '',
              dni: datosRegistro.dni || '',
              instagram: datosRegistro.instagram || '',
              facebook: datosRegistro.facebook || '',
              linkedin: datosRegistro.linkedin || '',
              certificadosProfesionales: datosRegistro.certificadosProfesionales || []
            });
          } catch (error) {
            console.error('Error parseando datos del registro:', error);
          }
        }
      });

    // Cargar solicitudes de trabajo reales desde el backend
    const loadBookings = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const bookings = await apiGet<Array<{
          id: string;
          client: { name: string; email: string; phone?: string };
          location?: string;
          address?: string;
          description: string;
          clientNotes?: string;
          problemPhoto?: string;
          createdAt: string;
          status: string;
        }>>('/bookings');
        
        console.log('📦 Bookings recibidos del backend:', bookings);
        
        // Transformar los datos del backend al formato del frontend
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const transformedBookings = bookings.map((booking: any) => {
          console.log('🔍 Procesando booking:', booking.id, 'problemPhoto:', booking.problemPhoto);
          
          // Construir URL de la foto del problema si existe
          let problemPhotoUrl = null;
          if (booking.problemPhoto) {
            problemPhotoUrl = getProblemPhotoUrl(booking.problemPhoto);
          }
          
          return {
            id: booking.id, // Usar el ID real de la booking
            clientName: booking.client.name,
            service: 'Servicio solicitado', // Puedes agregar esto al schema si es necesario
            location: booking.location || booking.address || 'Ubicación no especificada',
            description: booking.description,
            urgency: booking.clientNotes?.includes('Urgencia:') 
              ? booking.clientNotes.split('Urgencia:')[1].split('.')[0].trim() 
              : 'No especificada',
            contactEmail: booking.client.email,
            contactPhone: booking.client.phone || 'No especificado',
            problemPhoto: problemPhotoUrl, // URL construida de la foto
            createdAt: new Date(booking.createdAt).toLocaleDateString('es-AR'),
            status: booking.status.toLowerCase() as 'pending' | 'accepted' | 'rejected'
          };
        });

        console.log('✅ Bookings transformados:', transformedBookings);
        setJobRequests(transformedBookings);
      } catch (error) {
        console.error('Error al cargar solicitudes:', error);
      }
    };

    loadBookings();
  }, [router]);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showProfileMenu) {
        const target = event.target as HTMLElement;
        if (!target.closest('.profile-menu-container')) {
          setShowProfileMenu(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfileMenu]);

  const handleAcceptRequest = (request: JobRequest) => {
    setSelectedRequest(request);
    setShowBudgetModal(true);
  };

  const handleSubmitBudget = async () => {
    if (!selectedRequest) return;

    // Validaciones
    if (!budgetForm.price || !budgetForm.workDetails) {
      alert('El precio y los detalles del trabajo son requeridos');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Necesitás iniciar sesión');
        router.push('/login');
        return;
      }

      const data = await apiPost<{ clientDataUrl: string }>(
        `/bookings/${selectedRequest.id}/send-budget`,
        {
          budgetPrice: budgetForm.price,
          budgetDetails: budgetForm.workDetails,
          budgetMaterials: budgetForm.materials,
          budgetTime: budgetForm.estimatedTime
        }
      );
      
      console.log('✅ Presupuesto enviado. Link para cliente:', data.clientDataUrl);
      
      alert(`Presupuesto enviado exitosamente!\n\nPor ahora, compartí este link con el cliente:\n${data.clientDataUrl}`);
      
      setShowBudgetModal(false);
      setBudgetForm({ price: '', workDetails: '', materials: '', estimatedTime: '' });
      
      // Actualizar estado de la solicitud
      setJobRequests(prev => 
        prev.map(req => 
          req.id === selectedRequest?.id 
            ? { ...req, status: 'accepted' as const }
            : req
        )
      );
    } catch (error) {
      console.error('Error al enviar presupuesto:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      alert(`Error al enviar presupuesto: ${errorMessage}`);
    }
  };

  const handleRejectRequest = (requestId: string) => {
    setJobRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { ...req, status: 'rejected' as const }
          : req
      )
    );
  };

  if (!providerData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.lg }}>Cargando...</p>
      </div>
    );
  }

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
        <div className="flex items-center gap-2">
          <div style={{ 
            width: '145px', 
            height: '66px',
            background: 'url(/LOGO.svg) no-repeat center center',
            mixBlendMode: 'multiply',
            opacity: 1,
            borderRadius: '25px',
            transform: 'rotate(0deg)',
            cursor: 'pointer'
          }} 
          onClick={() => router.push('/')}
          aria-label="Serco Logo"
          />
        </div>
        <div className="relative profile-menu-container">
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            style={{
              padding: '8px 12px',
              backgroundColor: 'rgba(191, 198, 238, 0.2)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '24px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
          >
            {/* Foto de perfil */}
            <div 
              onClick={(e) => {
                e.stopPropagation();
                setActiveTab('perfil');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2px solid colors.primary.main',
                cursor: 'pointer',
                flexShrink: 0
              }}
            >
              {providerData.profileImage && (providerData.profileImage.startsWith('http') || providerData.profileImage.startsWith('/')) ? (
                <Image
                  src={providerData.profileImage}
                  alt="Foto de perfil"
                  width={48}
                  height={48}
                  style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                />
              ) : (
                <div style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'colors.primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontFamily: typography.fontFamily.primary,
                  fontSize: '20px',
                  fontWeight: 'bold'
                }}>
                  {providerData.nombre ? providerData.nombre.charAt(0).toUpperCase() : 'P'}
                </div>
              )}
            </div>
            
            {/* Nombre */}
            <span style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.base, color: colors.neutral.black, whiteSpace: 'nowrap' }}>
              Hola, {providerData.nombre}
            </span>
            
            {/* Flecha hacia abajo */}
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="colors.primary.main" 
              strokeWidth="2"
              style={{
                transform: showProfileMenu ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease',
                flexShrink: 0
              }}
            >
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </div>

          {/* Menú desplegable */}
          {showProfileMenu && (
            <div
              style={{
                position: 'absolute',
                top: '70px',
                right: '0',
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                overflow: 'hidden',
                minWidth: '220px',
                zIndex: 1000
              }}
            >
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  setActiveTab('perfil');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                style={{
                  width: '100%',
                  padding: '12px 20px',
                  textAlign: 'left',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  fontFamily: typography.fontFamily.primary,
                  fontSize: typography.fontSize.base,
                  color: colors.primary.main,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'colors.neutral[100]'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                Mi Perfil
              </button>

              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  setActiveTab('solicitudes');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                style={{
                  width: '100%',
                  padding: '12px 20px',
                  textAlign: 'left',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  fontFamily: typography.fontFamily.primary,
                  fontSize: typography.fontSize.base,
                  color: colors.primary.main,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'colors.neutral[100]'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
                Ver Solicitudes
              </button>

              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  router.push('/');
                }}
                style={{
                  width: '100%',
                  padding: '12px 20px',
                  textAlign: 'left',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  fontFamily: typography.fontFamily.primary,
                  fontSize: typography.fontSize.base,
                  color: colors.primary.main,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'colors.neutral[100]'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                </svg>
                Volver al Inicio
              </button>

              <div style={{ height: '1px', backgroundColor: '#E5E7EB', margin: '8px 0' }}></div>

              <button
                onClick={() => {
                  localStorage.removeItem('providerId');
                  setShowProfileMenu(false);
                  router.push('/');
                }}
                style={{
                  width: '100%',
                  padding: '12px 20px',
                  textAlign: 'left',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  fontFamily: typography.fontFamily.primary,
                  fontSize: typography.fontSize.base,
                  color: '#DC2626',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FEE2E2'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Navegación de tabs */}
      <div className="flex justify-center gap-8 py-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('perfil')}
          style={{
            fontFamily: typography.fontFamily.primary,
            fontSize: typography.fontSize.lg,
            fontWeight: activeTab === 'perfil' ? 700 : 400,
            color: activeTab === 'perfil' ? 'colors.primary.main' : '#666',
            paddingBottom: '8px',
            cursor: 'pointer',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'perfil' ? '3px solid colors.primary.main' : 'none'
          }}
        >
          Mi Perfil
        </button>
        <button
          onClick={() => setActiveTab('solicitudes')}
          style={{
            fontFamily: typography.fontFamily.primary,
            fontSize: typography.fontSize.lg,
            fontWeight: activeTab === 'solicitudes' ? 700 : 400,
            color: activeTab === 'solicitudes' ? 'colors.primary.main' : '#666',
            paddingBottom: '8px',
            cursor: 'pointer',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'solicitudes' ? '3px solid colors.primary.main' : 'none'
          }}
        >
          Solicitudes de Trabajo
          {jobRequests.filter(r => r.status === 'pending').length > 0 && (
            <span style={{
              marginLeft: '8px',
              backgroundColor: 'colors.primary.main',
              color: 'white',
              borderRadius: '50%',
              padding: '2px 8px',
              fontSize: '14px'
            }}>
              {jobRequests.filter(r => r.status === 'pending').length}
            </span>
          )}
        </button>
      </div>

      {/* Contenido principal */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {activeTab === 'perfil' && (
          <div>
            {/* Sección de perfil */}
            <div className="flex justify-between items-center mb-6">
              <h1 style={{ fontFamily: typography.fontFamily.primary, fontSize: '32px', fontWeight: 700, color: colors.primary.main }}>
                Mi Perfil
              </h1>
              <button
                onClick={() => setEditMode(!editMode)}
                style={{
                  fontFamily: typography.fontFamily.primary,
                  fontSize: typography.fontSize.base,
                  padding: '10px 20px',
                  backgroundColor: editMode ? '#A0724E' : 'colors.primary.main',
                  color: 'white',
                  border: 'none',
                  borderRadius: '24px',
                  cursor: 'pointer'
                }}
              >
                {editMode ? 'Cancelar' : 'Editar Perfil'}
              </button>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Datos personales */}
                <div>
                  <label style={{ fontFamily: typography.fontFamily.primary, fontSize: '14px', fontWeight: 700, color: colors.primary.main }}>
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={providerData.nombre}
                    disabled={!editMode}
                    style={{
                      fontFamily: typography.fontFamily.primary,
                      fontSize: typography.fontSize.base,
                      width: '100%',
                      padding: '10px',
                      marginTop: '4px',
                      border: '1px solid #ccc',
                      borderRadius: '8px',
                      backgroundColor: editMode ? 'white' : '#f9f9f9',
                      color: '#000000'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontFamily: typography.fontFamily.primary, fontSize: '14px', fontWeight: 700, color: colors.primary.main }}>
                    Apellido
                  </label>
                  <input
                    type="text"
                    value={providerData.apellido}
                    disabled={!editMode}
                    style={{
                      fontFamily: typography.fontFamily.primary,
                      fontSize: typography.fontSize.base,
                      width: '100%',
                      padding: '10px',
                      marginTop: '4px',
                      border: '1px solid #ccc',
                      borderRadius: '8px',
                      backgroundColor: editMode ? 'white' : '#f9f9f9',
                      color: '#000000'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontFamily: typography.fontFamily.primary, fontSize: '14px', fontWeight: 700, color: colors.primary.main }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={providerData.email}
                    disabled={!editMode}
                    style={{
                      fontFamily: typography.fontFamily.primary,
                      fontSize: typography.fontSize.base,
                      width: '100%',
                      padding: '10px',
                      marginTop: '4px',
                      border: '1px solid #ccc',
                      borderRadius: '8px',
                      backgroundColor: editMode ? 'white' : '#f9f9f9',
                      color: '#000000'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontFamily: typography.fontFamily.primary, fontSize: '14px', fontWeight: 700, color: colors.primary.main }}>
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={providerData.telefono}
                    disabled={!editMode}
                    style={{
                      fontFamily: typography.fontFamily.primary,
                      fontSize: typography.fontSize.base,
                      width: '100%',
                      padding: '10px',
                      marginTop: '4px',
                      border: '1px solid #ccc',
                      borderRadius: '8px',
                      backgroundColor: editMode ? 'white' : '#f9f9f9',
                      color: '#000000'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontFamily: typography.fontFamily.primary, fontSize: '14px', fontWeight: 700, color: colors.primary.main }}>
                    Ubicación
                  </label>
                  <input
                    type="text"
                    value={providerData.ubicacion}
                    disabled={!editMode}
                    style={{
                      fontFamily: typography.fontFamily.primary,
                      fontSize: typography.fontSize.base,
                      width: '100%',
                      padding: '10px',
                      marginTop: '4px',
                      border: '1px solid #ccc',
                      borderRadius: '8px',
                      backgroundColor: editMode ? 'white' : '#f9f9f9',
                      color: '#000000'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontFamily: typography.fontFamily.primary, fontSize: '14px', fontWeight: 700, color: colors.primary.main }}>
                    Categoría de Servicio
                  </label>
                  <input
                    type="text"
                    value={providerData.serviceCategory}
                    disabled={!editMode}
                    style={{
                      fontFamily: typography.fontFamily.primary,
                      fontSize: typography.fontSize.base,
                      width: '100%',
                      padding: '10px',
                      marginTop: '4px',
                      border: '1px solid #ccc',
                      borderRadius: '8px',
                      backgroundColor: editMode ? 'white' : '#f9f9f9',
                      color: '#000000'
                    }}
                  />
                </div>

                <div className="md:col-span-2">
                  <label style={{ fontFamily: typography.fontFamily.primary, fontSize: '14px', fontWeight: 700, color: colors.primary.main }}>
                    Especialidades
                  </label>
                  <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {providerData.specialties && providerData.specialties.map((specialty, index) => (
                      <span
                        key={index}
                        style={{
                          fontFamily: typography.fontFamily.primary,
                          fontSize: '14px',
                          padding: '6px 12px',
                          backgroundColor: 'colors.primary.main',
                          color: 'white',
                          borderRadius: '16px'
                        }}
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label style={{ fontFamily: typography.fontFamily.primary, fontSize: '14px', fontWeight: 700, color: colors.primary.main }}>
                    Descripción
                  </label>
                  <textarea
                    value={providerData.descripcion}
                    disabled={!editMode}
                    rows={4}
                    style={{
                      fontFamily: typography.fontFamily.primary,
                      fontSize: typography.fontSize.base,
                      width: '100%',
                      padding: '10px',
                      marginTop: '4px',
                      border: '1px solid #ccc',
                      borderRadius: '8px',
                      backgroundColor: editMode ? 'white' : '#f9f9f9',
                      resize: 'vertical',
                      color: '#000000'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontFamily: typography.fontFamily.primary, fontSize: '14px', fontWeight: 700, color: colors.primary.main }}>
                    Años de Experiencia
                  </label>
                  <input
                    type="number"
                    value={providerData.experiencia}
                    disabled={!editMode}
                    style={{
                      fontFamily: typography.fontFamily.primary,
                      fontSize: typography.fontSize.base,
                      width: '100%',
                      padding: '10px',
                      marginTop: '4px',
                      border: '1px solid #ccc',
                      borderRadius: '8px',
                      backgroundColor: editMode ? 'white' : '#f9f9f9',
                      color: '#000000'
                    }}
                  />
                </div>

                {/* Campos adicionales que solo se muestran en modo edición */}
                {editMode && (
                  <>
                    <div className="md:col-span-2">
                      <label style={{ fontFamily: typography.fontFamily.primary, fontSize: '14px', fontWeight: 700, color: colors.primary.main }}>
                        Profesiones Adicionales
                      </label>
                      <input
                        type="text"
                        value={datosAdicionales.profesionesAdicionales.map(p => p.profesion).join(', ')}
                        onChange={(e) => setDatosAdicionales({...datosAdicionales, profesionesAdicionales: e.target.value.split(',').map(p => ({profesion: p.trim(), especialidades: []}))})}
                        placeholder="Ej: Electricista, Carpintero"
                        style={{
                          fontFamily: typography.fontFamily.primary,
                          fontSize: typography.fontSize.base,
                          width: '100%',
                          padding: '10px',
                          marginTop: '4px',
                          border: '1px solid #ccc',
                          borderRadius: '8px',
                          backgroundColor: 'white',
                          color: '#000000'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ fontFamily: typography.fontFamily.primary, fontSize: '14px', fontWeight: 700, color: colors.primary.main }}>
                        Alcance de Trabajo (km)
                      </label>
                      <input
                        type="text"
                        value={datosAdicionales.alcanceTrabajo}
                        onChange={(e) => setDatosAdicionales({...datosAdicionales, alcanceTrabajo: e.target.value})}
                        placeholder="Ej: 10"
                        style={{
                          fontFamily: typography.fontFamily.primary,
                          fontSize: typography.fontSize.base,
                          width: '100%',
                          padding: '10px',
                          marginTop: '4px',
                          border: '1px solid #ccc',
                          borderRadius: '8px',
                          backgroundColor: 'white',
                          color: '#000000'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ fontFamily: typography.fontFamily.primary, fontSize: '14px', fontWeight: 700, color: colors.primary.main }}>
                        DNI
                      </label>
                      <input
                        type="text"
                        value={datosAdicionales.dni}
                        onChange={(e) => setDatosAdicionales({...datosAdicionales, dni: e.target.value})}
                        placeholder="Número de DNI"
                        style={{
                          fontFamily: typography.fontFamily.primary,
                          fontSize: typography.fontSize.base,
                          width: '100%',
                          padding: '10px',
                          marginTop: '4px',
                          border: '1px solid #ccc',
                          borderRadius: '8px',
                          backgroundColor: 'white',
                          color: '#000000'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ fontFamily: typography.fontFamily.primary, fontSize: '14px', fontWeight: 700, color: colors.primary.main }}>
                        Instagram
                      </label>
                      <input
                        type="text"
                        value={datosAdicionales.instagram}
                        onChange={(e) => setDatosAdicionales({...datosAdicionales, instagram: e.target.value})}
                        placeholder="@usuario"
                        style={{
                          fontFamily: typography.fontFamily.primary,
                          fontSize: typography.fontSize.base,
                          width: '100%',
                          padding: '10px',
                          marginTop: '4px',
                          border: '1px solid #ccc',
                          borderRadius: '8px',
                          backgroundColor: 'white',
                          color: '#000000'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ fontFamily: typography.fontFamily.primary, fontSize: '14px', fontWeight: 700, color: colors.primary.main }}>
                        Facebook
                      </label>
                      <input
                        type="text"
                        value={datosAdicionales.facebook}
                        onChange={(e) => setDatosAdicionales({...datosAdicionales, facebook: e.target.value})}
                        placeholder="@usuario"
                        style={{
                          fontFamily: typography.fontFamily.primary,
                          fontSize: typography.fontSize.base,
                          width: '100%',
                          padding: '10px',
                          marginTop: '4px',
                          border: '1px solid #ccc',
                          borderRadius: '8px',
                          backgroundColor: 'white',
                          color: '#000000'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ fontFamily: typography.fontFamily.primary, fontSize: '14px', fontWeight: 700, color: colors.primary.main }}>
                        LinkedIn
                      </label>
                      <input
                        type="text"
                        value={datosAdicionales.linkedin}
                        onChange={(e) => setDatosAdicionales({...datosAdicionales, linkedin: e.target.value})}
                        placeholder="URL del perfil"
                        style={{
                          fontFamily: typography.fontFamily.primary,
                          fontSize: typography.fontSize.base,
                          width: '100%',
                          padding: '10px',
                          marginTop: '4px',
                          border: '1px solid #ccc',
                          borderRadius: '8px',
                          backgroundColor: 'white',
                          color: '#000000'
                        }}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label style={{ fontFamily: typography.fontFamily.primary, fontSize: '14px', fontWeight: 700, color: colors.primary.main }}>
                        Certificados Profesionales
                      </label>
                      <input
                        type="text"
                        value={datosAdicionales.certificadosProfesionales.join(', ')}
                        onChange={(e) => setDatosAdicionales({...datosAdicionales, certificadosProfesionales: e.target.value.split(',').map(c => c.trim())})}
                        placeholder="Ej: Electricista Matriculado, Curso de Seguridad"
                        style={{
                          fontFamily: typography.fontFamily.primary,
                          fontSize: typography.fontSize.base,
                          width: '100%',
                          padding: '10px',
                          marginTop: '4px',
                          border: '1px solid #ccc',
                          borderRadius: '8px',
                          backgroundColor: 'white',
                          color: '#000000'
                        }}
                      />
                    </div>
                  </>
                )}
              </div>

              {editMode && (
                <div className="mt-6 flex justify-end gap-4">
                  <button
                    onClick={() => setEditMode(false)}
                    style={{
                      fontFamily: typography.fontFamily.primary,
                      fontSize: typography.fontSize.base,
                      padding: '10px 24px',
                      backgroundColor: 'white',
                      color: '#666',
                      border: '1px solid #ccc',
                      borderRadius: '24px',
                      cursor: 'pointer'
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => {
                      // TODO: Guardar cambios en el backend
                      console.log('Guardando cambios...');
                      setEditMode(false);
                    }}
                    style={{
                      fontFamily: typography.fontFamily.primary,
                      fontSize: typography.fontSize.base,
                      padding: '10px 24px',
                      backgroundColor: 'colors.primary.main',
                      color: 'white',
                      border: 'none',
                      borderRadius: '24px',
                      cursor: 'pointer'
                    }}
                  >
                    Guardar Cambios
                  </button>
                </div>
              )}
            </div>

            {/* Sección de fotos (placeholder) */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 style={{ fontFamily: typography.fontFamily.primary, fontSize: '24px', fontWeight: 700, color: colors.primary.main, marginBottom: '16px' }}>
                Fotos de Trabajos
              </h2>
              <div style={{ 
                border: '2px dashed #ccc', 
                borderRadius: '8px', 
                padding: '40px', 
                textAlign: 'center',
                cursor: 'pointer'
              }}>
                <p style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.base, color: '#666' }}>
                  Haz click para subir fotos de tus trabajos
                </p>
                <p style={{ fontFamily: typography.fontFamily.primary, fontSize: '14px', color: '#999', marginTop: '8px' }}>
                  JPG, PNG o GIF (max. 5MB)
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'solicitudes' && (
          <div>
            <h1 style={{ fontFamily: typography.fontFamily.primary, fontSize: '32px', fontWeight: 700, color: colors.primary.main, marginBottom: '24px' }}>
              Solicitudes de Trabajo
            </h1>

            {jobRequests.length === 0 ? (
              <div className="text-center py-12">
                <p style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.lg, color: '#666' }}>
                  No tienes solicitudes de trabajo todavía
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {jobRequests.map((request) => (
                  <div 
                    key={request.id}
                    className="bg-gray-50 rounded-lg p-6 border-l-4"
                    style={{
                      borderLeftColor: 
                        request.status === 'pending' ? 'colors.primary.main' :
                        request.status === 'accepted' ? '#4CAF50' : '#F44336'
                    }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 style={{ fontFamily: typography.fontFamily.primary, fontSize: '20px', fontWeight: 700, color: colors.primary.main }}>
                          {request.service}
                        </h3>
                        <p style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.base, color: '#666', marginTop: '4px' }}>
                          Cliente: {request.clientName}
                        </p>
                      </div>
                      <span style={{
                        fontFamily: typography.fontFamily.primary,
                        fontSize: '14px',
                        padding: '6px 12px',
                        backgroundColor: 
                          request.status === 'pending' ? '#FFF3CD' :
                          request.status === 'accepted' ? '#D4EDDA' : '#F8D7DA',
                        color: 
                          request.status === 'pending' ? '#856404' :
                          request.status === 'accepted' ? '#155724' : '#721C24',
                        borderRadius: '16px'
                      }}>
                        {request.status === 'pending' ? 'Pendiente' :
                         request.status === 'accepted' ? 'Aceptado' : 'Rechazado'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p style={{ fontFamily: typography.fontFamily.primary, fontSize: '14px', fontWeight: 700, color: colors.primary.main }}>
                          Ubicación
                        </p>
                        <p style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.base, color: '#333' }}>
                          {request.location}
                        </p>
                      </div>
                      <div>
                        <p style={{ fontFamily: typography.fontFamily.primary, fontSize: '14px', fontWeight: 700, color: colors.primary.main }}>
                          Urgencia
                        </p>
                        <p style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.base, color: '#333' }}>
                          {request.urgency}
                        </p>
                      </div>
                      <div className="md:col-span-2">
                        <p style={{ fontFamily: typography.fontFamily.primary, fontSize: '14px', fontWeight: 700, color: colors.primary.main }}>
                          Descripción del trabajo
                        </p>
                        <p style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.base, color: '#333' }}>
                          {request.description}
                        </p>
                      </div>
                      
                      {/* Foto del problema */}
                      <div className="md:col-span-2">
                        <p style={{ fontFamily: typography.fontFamily.primary, fontSize: '14px', fontWeight: 700, color: colors.primary.main, marginBottom: '8px' }}>
                          Foto del Problema
                        </p>
                        {request.problemPhoto ? (
                          <div 
                            onClick={() => setSelectedImage(request.problemPhoto!)}
                            style={{
                              width: '100%',
                              maxWidth: '400px',
                              borderRadius: '8px',
                              overflow: 'hidden',
                              border: '1px solid #ccc',
                              cursor: 'pointer',
                              transition: 'transform 0.2s, box-shadow 0.2s'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'scale(1.02)';
                              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'scale(1)';
                              e.currentTarget.style.boxShadow = 'none';
                            }}
                          >
                            {/* Usar img normal para base64 en lugar de Next Image */}
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={request.problemPhoto}
                              alt="Foto del problema"
                              style={{ objectFit: 'cover', width: '100%', height: 'auto', display: 'block' }}
                            />
                          </div>
                        ) : (
                          <p style={{ fontFamily: typography.fontFamily.primary, fontSize: '14px', color: '#999', fontStyle: 'italic' }}>
                            El cliente no subió una foto del problema
                          </p>
                        )}
                      </div>
                    </div>

                    {request.status === 'pending' && (
                      <div className="flex gap-4 mt-6">
                        <button
                          onClick={() => handleAcceptRequest(request)}
                          style={{
                            fontFamily: typography.fontFamily.primary,
                            fontSize: typography.fontSize.base,
                            padding: '10px 24px',
                            backgroundColor: 'colors.primary.main',
                            color: 'white',
                            border: 'none',
                            borderRadius: '24px',
                            cursor: 'pointer',
                            flex: 1
                          }}
                        >
                          Aceptar y Enviar Presupuesto
                        </button>
                        <button
                          onClick={() => handleRejectRequest(request.id)}
                          style={{
                            fontFamily: typography.fontFamily.primary,
                            fontSize: typography.fontSize.base,
                            padding: '10px 24px',
                            backgroundColor: 'white',
                            color: '#F44336',
                            border: '1px solid #F44336',
                            borderRadius: '24px',
                            cursor: 'pointer',
                            flex: 1
                          }}
                        >
                          Rechazar
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modal de presupuesto */}
      {showBudgetModal && selectedRequest && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={() => setShowBudgetModal(false)}
        >
          <div 
            className="relative mx-6 max-h-[90vh] overflow-y-auto"
            style={{
              width: '600px',
              maxWidth: '90%',
              backgroundColor: '#B45B39',
              borderRadius: '24px',
              padding: '32px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón cerrar */}
            <button
              onClick={() => setShowBudgetModal(false)}
              className="absolute top-4 right-4"
              style={{ cursor: 'pointer', background: 'none', border: 'none', padding: '8px' }}
            >
              <svg width="24" height="24" fill="none" stroke="#FFFFFF" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>

            <h2 style={{ fontFamily: typography.fontFamily.primary, fontSize: '28px', fontWeight: 700, color: '#FFFFFF', marginBottom: '24px' }}>
              Enviar Presupuesto
            </h2>

            <div className="space-y-4">
              <div>
                <label style={{ fontFamily: typography.fontFamily.primary, fontSize: '14px', fontWeight: 700, color: '#FFFFFF', display: 'block', marginBottom: '8px' }}>
                  Precio del presupuesto ($)
                </label>
                <input
                  type="number"
                  value={budgetForm.price}
                  onChange={(e) => setBudgetForm({ ...budgetForm, price: e.target.value })}
                  placeholder="Ej: 50000"
                  style={{
                    fontFamily: typography.fontFamily.primary,
                    fontSize: typography.fontSize.base,
                    color: '#000000',
                    width: '100%',
                    padding: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)'
                  }}
                />
              </div>

              <div>
                <label style={{ fontFamily: typography.fontFamily.primary, fontSize: '14px', fontWeight: 700, color: '#FFFFFF', display: 'block', marginBottom: '8px' }}>
                  Detalles del trabajo
                </label>
                <textarea
                  value={budgetForm.workDetails}
                  onChange={(e) => setBudgetForm({ ...budgetForm, workDetails: e.target.value })}
                  placeholder="Describe el trabajo a realizar..."
                  rows={4}
                  style={{
                    fontFamily: typography.fontFamily.primary,
                    fontSize: typography.fontSize.base,
                    color: '#000000',
                    width: '100%',
                    padding: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div>
                <label style={{ fontFamily: typography.fontFamily.primary, fontSize: '14px', fontWeight: 700, color: '#FFFFFF', display: 'block', marginBottom: '8px' }}>
                  Materiales necesarios
                </label>
                <textarea
                  value={budgetForm.materials}
                  onChange={(e) => setBudgetForm({ ...budgetForm, materials: e.target.value })}
                  placeholder="Lista de materiales..."
                  rows={3}
                  style={{
                    fontFamily: typography.fontFamily.primary,
                    fontSize: typography.fontSize.base,
                    color: '#000000',
                    width: '100%',
                    padding: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div>
                <label style={{ fontFamily: typography.fontFamily.primary, fontSize: '14px', fontWeight: 700, color: '#FFFFFF', display: 'block', marginBottom: '8px' }}>
                  Tiempo estimado
                </label>
                <input
                  type="text"
                  value={budgetForm.estimatedTime}
                  onChange={(e) => setBudgetForm({ ...budgetForm, estimatedTime: e.target.value })}
                  placeholder="Ej: 2 días, 1 semana..."
                  style={{
                    fontFamily: typography.fontFamily.primary,
                    fontSize: typography.fontSize.base,
                    color: '#000000',
                    width: '100%',
                    padding: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)'
                  }}
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setShowBudgetModal(false)}
                style={{
                  fontFamily: typography.fontFamily.primary,
                  fontSize: typography.fontSize.base,
                  padding: '12px 24px',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  color: '#FFFFFF',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '24px',
                  cursor: 'pointer',
                  flex: 1
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmitBudget}
                style={{
                  fontFamily: typography.fontFamily.primary,
                  fontSize: typography.fontSize.base,
                  padding: '12px 24px',
                  backgroundColor: 'rgba(217, 165, 137, 0.9)',
                  color: '#000000',
                  border: 'none',
                  borderRadius: '24px',
                  cursor: 'pointer',
                  flex: 1
                }}
              >
                Enviar Presupuesto
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de imagen ampliada */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
            cursor: 'pointer'
          }}
        >
          {/* Botón de cerrar */}
          <button
            onClick={() => setSelectedImage(null)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '24px',
              fontWeight: 'bold',
              color: colors.neutral.black,
              zIndex: 10000,
              boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
            }}
          >
            ×
          </button>

          {/* Imagen ampliada */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '90vw',
              maxHeight: '90vh',
              position: 'relative'
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedImage}
              alt="Foto del problema ampliada"
              style={{
                maxWidth: '100%',
                maxHeight: '90vh',
                width: 'auto',
                height: 'auto',
                objectFit: 'contain',
                borderRadius: '8px',
                boxShadow: '0 4px 30px rgba(0,0,0,0.5)'
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
