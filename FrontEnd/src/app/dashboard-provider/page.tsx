'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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
  id: number;
  clientName: string;
  service: string;
  location: string;
  description: string;
  urgency: string;
  contactEmail: string;
  contactPhone: string;
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
    const providerId = localStorage.getItem('providerId');
    
    if (!providerId) {
      router.push('/login');
      return;
    }

    // Cargar datos del proveedor desde la API
    console.log('Cargando datos del proveedor desde API:', providerId);
    fetch(`http://localhost:8000/api/providers/${providerId}`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Error al cargar proveedor');
        }
        return res.json();
      })
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
        } catch (e) {
          specialties = [];
        }

        // Parsear fotos de trabajos
        let portfolioImages = [];
        try {
          portfolioImages = typeof profile.portfolioImages === 'string'
            ? JSON.parse(profile.portfolioImages)
            : profile.portfolioImages || [];
        } catch (e) {
          portfolioImages = [];
        }

        // Construir URLs completas para las imágenes
        const profileImageUrl = profile.profilePhoto 
          ? `http://localhost:8000/uploads/profile/${profile.profilePhoto}`
          : '';

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
            `http://localhost:8000/uploads/portfolio/${img}`
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

    // TODO: Cargar solicitudes de trabajo para este proveedor
    // Por ahora simulamos con datos de ejemplo
    setJobRequests([
      {
        id: 1,
        clientName: 'María González',
        service: 'Pintura',
        location: 'Buenos Aires',
        description: 'Necesito pintar 3 habitaciones de mi casa',
        urgency: 'Esta semana',
        contactEmail: 'maria@email.com',
        contactPhone: '+54 11 1234-5678',
        createdAt: '2024-12-03',
        status: 'pending'
      },
      {
        id: 2,
        clientName: 'Juan Pérez',
        service: 'Pintura',
        location: 'Buenos Aires',
        description: 'Pintar fachada exterior',
        urgency: 'No es urgente',
        contactEmail: 'juan@email.com',
        contactPhone: '+54 11 8765-4321',
        createdAt: '2024-12-02',
        status: 'pending'
      }
    ]);
  }, [router]);

  const handleAcceptRequest = (request: JobRequest) => {
    setSelectedRequest(request);
    setShowBudgetModal(true);
  };

  const handleSubmitBudget = () => {
    // TODO: Enviar presupuesto al backend
    console.log('Presupuesto enviado:', {
      requestId: selectedRequest?.id,
      ...budgetForm
    });
    
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
  };

  const handleRejectRequest = (requestId: number) => {
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
        <p style={{ fontFamily: 'Maitree, serif', fontSize: '18px' }}>Cargando...</p>
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
          aria-label="SaHa Logo"
          />
        </div>
        <div className="flex items-center gap-4">
          {/* Foto de perfil */}
          {providerData.profileImage && (providerData.profileImage.startsWith('http') || providerData.profileImage.startsWith('/')) ? (
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '2px solid #244C87',
              backgroundColor: '#f0f0f0'
            }}>
              <Image
                src={providerData.profileImage}
                alt="Foto de perfil"
                width={48}
                height={48}
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              />
            </div>
          ) : (
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: '#244C87',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontFamily: 'Maitree, serif',
              fontSize: '20px',
              fontWeight: 'bold'
            }}>
              {providerData.nombre ? providerData.nombre.charAt(0).toUpperCase() : 'P'}
            </div>
          )}
          <span style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#000' }}>
            Hola, {providerData.nombre}
          </span>
          <button
            onClick={() => {
              localStorage.removeItem('providerId');
              router.push('/');
            }}
            style={{
              fontFamily: 'Maitree, serif',
              fontSize: '14px',
              padding: '8px 16px',
              backgroundColor: 'rgba(191, 198, 238, 0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '24px',
              cursor: 'pointer'
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      {/* Navegación de tabs */}
      <div className="flex justify-center gap-8 py-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('perfil')}
          style={{
            fontFamily: 'Maitree, serif',
            fontSize: '18px',
            fontWeight: activeTab === 'perfil' ? 700 : 400,
            color: activeTab === 'perfil' ? '#244C87' : '#666',
            paddingBottom: '8px',
            cursor: 'pointer',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'perfil' ? '3px solid #244C87' : 'none'
          }}
        >
          Mi Perfil
        </button>
        <button
          onClick={() => setActiveTab('solicitudes')}
          style={{
            fontFamily: 'Maitree, serif',
            fontSize: '18px',
            fontWeight: activeTab === 'solicitudes' ? 700 : 400,
            color: activeTab === 'solicitudes' ? '#244C87' : '#666',
            paddingBottom: '8px',
            cursor: 'pointer',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'solicitudes' ? '3px solid #244C87' : 'none'
          }}
        >
          Solicitudes de Trabajo
          {jobRequests.filter(r => r.status === 'pending').length > 0 && (
            <span style={{
              marginLeft: '8px',
              backgroundColor: '#244C87',
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
              <h1 style={{ fontFamily: 'Maitree, serif', fontSize: '32px', fontWeight: 700, color: '#244C87' }}>
                Mi Perfil
              </h1>
              <button
                onClick={() => setEditMode(!editMode)}
                style={{
                  fontFamily: 'Maitree, serif',
                  fontSize: '16px',
                  padding: '10px 20px',
                  backgroundColor: editMode ? '#A0724E' : '#244C87',
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
                  <label style={{ fontFamily: 'Maitree, serif', fontSize: '14px', fontWeight: 700, color: '#244C87' }}>
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={providerData.nombre}
                    disabled={!editMode}
                    style={{
                      fontFamily: 'Maitree, serif',
                      fontSize: '16px',
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
                  <label style={{ fontFamily: 'Maitree, serif', fontSize: '14px', fontWeight: 700, color: '#244C87' }}>
                    Apellido
                  </label>
                  <input
                    type="text"
                    value={providerData.apellido}
                    disabled={!editMode}
                    style={{
                      fontFamily: 'Maitree, serif',
                      fontSize: '16px',
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
                  <label style={{ fontFamily: 'Maitree, serif', fontSize: '14px', fontWeight: 700, color: '#244C87' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={providerData.email}
                    disabled={!editMode}
                    style={{
                      fontFamily: 'Maitree, serif',
                      fontSize: '16px',
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
                  <label style={{ fontFamily: 'Maitree, serif', fontSize: '14px', fontWeight: 700, color: '#244C87' }}>
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={providerData.telefono}
                    disabled={!editMode}
                    style={{
                      fontFamily: 'Maitree, serif',
                      fontSize: '16px',
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
                  <label style={{ fontFamily: 'Maitree, serif', fontSize: '14px', fontWeight: 700, color: '#244C87' }}>
                    Ubicación
                  </label>
                  <input
                    type="text"
                    value={providerData.ubicacion}
                    disabled={!editMode}
                    style={{
                      fontFamily: 'Maitree, serif',
                      fontSize: '16px',
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
                  <label style={{ fontFamily: 'Maitree, serif', fontSize: '14px', fontWeight: 700, color: '#244C87' }}>
                    Categoría de Servicio
                  </label>
                  <input
                    type="text"
                    value={providerData.serviceCategory}
                    disabled={!editMode}
                    style={{
                      fontFamily: 'Maitree, serif',
                      fontSize: '16px',
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
                  <label style={{ fontFamily: 'Maitree, serif', fontSize: '14px', fontWeight: 700, color: '#244C87' }}>
                    Especialidades
                  </label>
                  <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {providerData.specialties && providerData.specialties.map((specialty, index) => (
                      <span
                        key={index}
                        style={{
                          fontFamily: 'Maitree, serif',
                          fontSize: '14px',
                          padding: '6px 12px',
                          backgroundColor: '#244C87',
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
                  <label style={{ fontFamily: 'Maitree, serif', fontSize: '14px', fontWeight: 700, color: '#244C87' }}>
                    Descripción
                  </label>
                  <textarea
                    value={providerData.descripcion}
                    disabled={!editMode}
                    rows={4}
                    style={{
                      fontFamily: 'Maitree, serif',
                      fontSize: '16px',
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
                  <label style={{ fontFamily: 'Maitree, serif', fontSize: '14px', fontWeight: 700, color: '#244C87' }}>
                    Años de Experiencia
                  </label>
                  <input
                    type="number"
                    value={providerData.experiencia}
                    disabled={!editMode}
                    style={{
                      fontFamily: 'Maitree, serif',
                      fontSize: '16px',
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
                      <label style={{ fontFamily: 'Maitree, serif', fontSize: '14px', fontWeight: 700, color: '#244C87' }}>
                        Profesiones Adicionales
                      </label>
                      <input
                        type="text"
                        value={datosAdicionales.profesionesAdicionales.map(p => p.profesion).join(', ')}
                        onChange={(e) => setDatosAdicionales({...datosAdicionales, profesionesAdicionales: e.target.value.split(',').map(p => ({profesion: p.trim(), especialidades: []}))})}
                        placeholder="Ej: Electricista, Carpintero"
                        style={{
                          fontFamily: 'Maitree, serif',
                          fontSize: '16px',
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
                      <label style={{ fontFamily: 'Maitree, serif', fontSize: '14px', fontWeight: 700, color: '#244C87' }}>
                        Alcance de Trabajo (km)
                      </label>
                      <input
                        type="text"
                        value={datosAdicionales.alcanceTrabajo}
                        onChange={(e) => setDatosAdicionales({...datosAdicionales, alcanceTrabajo: e.target.value})}
                        placeholder="Ej: 10"
                        style={{
                          fontFamily: 'Maitree, serif',
                          fontSize: '16px',
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
                      <label style={{ fontFamily: 'Maitree, serif', fontSize: '14px', fontWeight: 700, color: '#244C87' }}>
                        DNI
                      </label>
                      <input
                        type="text"
                        value={datosAdicionales.dni}
                        onChange={(e) => setDatosAdicionales({...datosAdicionales, dni: e.target.value})}
                        placeholder="Número de DNI"
                        style={{
                          fontFamily: 'Maitree, serif',
                          fontSize: '16px',
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
                      <label style={{ fontFamily: 'Maitree, serif', fontSize: '14px', fontWeight: 700, color: '#244C87' }}>
                        Instagram
                      </label>
                      <input
                        type="text"
                        value={datosAdicionales.instagram}
                        onChange={(e) => setDatosAdicionales({...datosAdicionales, instagram: e.target.value})}
                        placeholder="@usuario"
                        style={{
                          fontFamily: 'Maitree, serif',
                          fontSize: '16px',
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
                      <label style={{ fontFamily: 'Maitree, serif', fontSize: '14px', fontWeight: 700, color: '#244C87' }}>
                        Facebook
                      </label>
                      <input
                        type="text"
                        value={datosAdicionales.facebook}
                        onChange={(e) => setDatosAdicionales({...datosAdicionales, facebook: e.target.value})}
                        placeholder="@usuario"
                        style={{
                          fontFamily: 'Maitree, serif',
                          fontSize: '16px',
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
                      <label style={{ fontFamily: 'Maitree, serif', fontSize: '14px', fontWeight: 700, color: '#244C87' }}>
                        LinkedIn
                      </label>
                      <input
                        type="text"
                        value={datosAdicionales.linkedin}
                        onChange={(e) => setDatosAdicionales({...datosAdicionales, linkedin: e.target.value})}
                        placeholder="URL del perfil"
                        style={{
                          fontFamily: 'Maitree, serif',
                          fontSize: '16px',
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
                      <label style={{ fontFamily: 'Maitree, serif', fontSize: '14px', fontWeight: 700, color: '#244C87' }}>
                        Certificados Profesionales
                      </label>
                      <input
                        type="text"
                        value={datosAdicionales.certificadosProfesionales.join(', ')}
                        onChange={(e) => setDatosAdicionales({...datosAdicionales, certificadosProfesionales: e.target.value.split(',').map(c => c.trim())})}
                        placeholder="Ej: Electricista Matriculado, Curso de Seguridad"
                        style={{
                          fontFamily: 'Maitree, serif',
                          fontSize: '16px',
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
                      fontFamily: 'Maitree, serif',
                      fontSize: '16px',
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
                      fontFamily: 'Maitree, serif',
                      fontSize: '16px',
                      padding: '10px 24px',
                      backgroundColor: '#244C87',
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
              <h2 style={{ fontFamily: 'Maitree, serif', fontSize: '24px', fontWeight: 700, color: '#244C87', marginBottom: '16px' }}>
                Fotos de Trabajos
              </h2>
              <div style={{ 
                border: '2px dashed #ccc', 
                borderRadius: '8px', 
                padding: '40px', 
                textAlign: 'center',
                cursor: 'pointer'
              }}>
                <p style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#666' }}>
                  Haz click para subir fotos de tus trabajos
                </p>
                <p style={{ fontFamily: 'Maitree, serif', fontSize: '14px', color: '#999', marginTop: '8px' }}>
                  JPG, PNG o GIF (max. 5MB)
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'solicitudes' && (
          <div>
            <h1 style={{ fontFamily: 'Maitree, serif', fontSize: '32px', fontWeight: 700, color: '#244C87', marginBottom: '24px' }}>
              Solicitudes de Trabajo
            </h1>

            {jobRequests.length === 0 ? (
              <div className="text-center py-12">
                <p style={{ fontFamily: 'Maitree, serif', fontSize: '18px', color: '#666' }}>
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
                        request.status === 'pending' ? '#244C87' :
                        request.status === 'accepted' ? '#4CAF50' : '#F44336'
                    }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 style={{ fontFamily: 'Maitree, serif', fontSize: '20px', fontWeight: 700, color: '#244C87' }}>
                          {request.service}
                        </h3>
                        <p style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#666', marginTop: '4px' }}>
                          Cliente: {request.clientName}
                        </p>
                      </div>
                      <span style={{
                        fontFamily: 'Maitree, serif',
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
                        <p style={{ fontFamily: 'Maitree, serif', fontSize: '14px', fontWeight: 700, color: '#244C87' }}>
                          Ubicación
                        </p>
                        <p style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#333' }}>
                          {request.location}
                        </p>
                      </div>
                      <div>
                        <p style={{ fontFamily: 'Maitree, serif', fontSize: '14px', fontWeight: 700, color: '#244C87' }}>
                          Urgencia
                        </p>
                        <p style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#333' }}>
                          {request.urgency}
                        </p>
                      </div>
                      <div className="md:col-span-2">
                        <p style={{ fontFamily: 'Maitree, serif', fontSize: '14px', fontWeight: 700, color: '#244C87' }}>
                          Descripción del trabajo
                        </p>
                        <p style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#333' }}>
                          {request.description}
                        </p>
                      </div>
                      <div>
                        <p style={{ fontFamily: 'Maitree, serif', fontSize: '14px', fontWeight: 700, color: '#244C87' }}>
                          Email
                        </p>
                        <p style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#333' }}>
                          {request.contactEmail}
                        </p>
                      </div>
                      <div>
                        <p style={{ fontFamily: 'Maitree, serif', fontSize: '14px', fontWeight: 700, color: '#244C87' }}>
                          Teléfono
                        </p>
                        <p style={{ fontFamily: 'Maitree, serif', fontSize: '16px', color: '#333' }}>
                          {request.contactPhone}
                        </p>
                      </div>
                    </div>

                    {request.status === 'pending' && (
                      <div className="flex gap-4 mt-6">
                        <button
                          onClick={() => handleAcceptRequest(request)}
                          style={{
                            fontFamily: 'Maitree, serif',
                            fontSize: '16px',
                            padding: '10px 24px',
                            backgroundColor: '#244C87',
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
                            fontFamily: 'Maitree, serif',
                            fontSize: '16px',
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

            <h2 style={{ fontFamily: 'Maitree, serif', fontSize: '28px', fontWeight: 700, color: '#FFFFFF', marginBottom: '24px' }}>
              Enviar Presupuesto
            </h2>

            <div className="space-y-4">
              <div>
                <label style={{ fontFamily: 'Maitree, serif', fontSize: '14px', fontWeight: 700, color: '#FFFFFF', display: 'block', marginBottom: '8px' }}>
                  Precio del presupuesto ($)
                </label>
                <input
                  type="number"
                  value={budgetForm.price}
                  onChange={(e) => setBudgetForm({ ...budgetForm, price: e.target.value })}
                  placeholder="Ej: 50000"
                  style={{
                    fontFamily: 'Maitree, serif',
                    fontSize: '16px',
                    width: '100%',
                    padding: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)'
                  }}
                />
              </div>

              <div>
                <label style={{ fontFamily: 'Maitree, serif', fontSize: '14px', fontWeight: 700, color: '#FFFFFF', display: 'block', marginBottom: '8px' }}>
                  Detalles del trabajo
                </label>
                <textarea
                  value={budgetForm.workDetails}
                  onChange={(e) => setBudgetForm({ ...budgetForm, workDetails: e.target.value })}
                  placeholder="Describe el trabajo a realizar..."
                  rows={4}
                  style={{
                    fontFamily: 'Maitree, serif',
                    fontSize: '16px',
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
                <label style={{ fontFamily: 'Maitree, serif', fontSize: '14px', fontWeight: 700, color: '#FFFFFF', display: 'block', marginBottom: '8px' }}>
                  Materiales necesarios
                </label>
                <textarea
                  value={budgetForm.materials}
                  onChange={(e) => setBudgetForm({ ...budgetForm, materials: e.target.value })}
                  placeholder="Lista de materiales..."
                  rows={3}
                  style={{
                    fontFamily: 'Maitree, serif',
                    fontSize: '16px',
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
                <label style={{ fontFamily: 'Maitree, serif', fontSize: '14px', fontWeight: 700, color: '#FFFFFF', display: 'block', marginBottom: '8px' }}>
                  Tiempo estimado
                </label>
                <input
                  type="text"
                  value={budgetForm.estimatedTime}
                  onChange={(e) => setBudgetForm({ ...budgetForm, estimatedTime: e.target.value })}
                  placeholder="Ej: 2 días, 1 semana..."
                  style={{
                    fontFamily: 'Maitree, serif',
                    fontSize: '16px',
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
                  fontFamily: 'Maitree, serif',
                  fontSize: '16px',
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
                  fontFamily: 'Maitree, serif',
                  fontSize: '16px',
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
    </div>
  );
}
