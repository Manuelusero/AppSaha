'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { colors, typography } from '@/styles/tokens';
import { apiGet, apiPut, apiUpload, getProfileImageUrl, getPortfolioImageUrl, PROVIDER_ID_KEY, fetchWithAuth } from '@/utils';
import { getEspecialidades } from '../data/especialidades';
import { ProviderHeader } from '@/components/layout';
import { useBookingsStore } from '@/store/bookingsStore';

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
  alcanceTrabajo: string;
  profileImage?: string;
  portfolioImages?: string[];
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  referenciaNombre?: string;
  referenciaEmail?: string;
  referenciaTelefono?: string;
}

export default function DashboardProvider() {
  const router = useRouter();
  const [providerData, setProviderData] = useState<ProviderData | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState<ProviderData | null>(null);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingProfilePhoto, setUploadingProfilePhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const profilePhotoInputRef = useRef<HTMLInputElement>(null);
  const [showProfesionDropdown, setShowProfesionDropdown] = useState(false);

  const profesionOpciones = [
    { value: 'PLOMERIA', label: 'Plomeros' },
    { value: 'ELECTRICIDAD', label: 'Electricistas' },
    { value: 'PINTURA', label: 'Pintores' },
    { value: 'ALBANILERIA', label: 'Albañiles' },
    { value: 'CARPINTERIA', label: 'Carpinteros' },
    { value: 'HERRERIA', label: 'Herreros' },
    { value: 'LIMPIEZA', label: 'Limpiadores' },
    { value: 'JARDINERIA', label: 'Jardineros' },
    { value: 'MASAJES', label: 'Masajistas' },
    { value: 'CLASES', label: 'Profesores' },
    { value: 'COSTURA', label: 'Modistas' },
  ];

  const { bookings, fetchBookings } = useBookingsStore();
  const pendingCount = bookings.filter(b => b.status === 'pending').length;

  useEffect(() => { fetchBookings(); }, [fetchBookings]);
  useEffect(() => {
    const providerId = localStorage.getItem(PROVIDER_ID_KEY);
    
    if (!providerId) {
      router.push('/login');
      return;
    }

    // Validar formato del providerId antes de hacer la llamada
    if (!providerId.match(/^[a-z0-9]+$/i)) {
      console.warn('providerId en localStorage tiene formato inválido:', providerId);
      router.push('/login');
      return;
    }

    // Cargar datos del proveedor desde la API
    apiGet<any>(`/providers/${providerId}`)
      .then(data => {
        const profile = data.providerProfile;
        if (!profile) {
          console.warn('No se encontró providerProfile para:', providerId);
          return;
        }

        // Parsear especialidades
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

        const profileImageUrl = getProfileImageUrl(profile.profilePhoto);

        // Limpiar especialidades obsoletas (nombres cortos sin contexto)
        const especialidadesDisponibles = getEspecialidades(profile.serviceCategory || '');
        const especialidadesValidas = specialties.filter((s: string) => 
          especialidadesDisponibles.includes(s)
        );

        setProviderData({
          id: parseInt(providerId),
          nombre: data.name?.split(' ')[0] || '',
          apellido: data.name?.split(' ').slice(1).join(' ') || '',
          email: data.email || '',
          telefono: data.phone || '',
          ubicacion: profile.location || '',
          serviceCategory: profile.serviceCategory || '',
          specialties: especialidadesValidas,
          descripcion: profile.bio || profile.serviceDescription || '',
          experiencia: profile.experience || 0,
          alcanceTrabajo: profile.serviceRadius?.toString() || '',
          profileImage: profileImageUrl,
          portfolioImages: portfolioImages.map((img: string) => 
            getPortfolioImageUrl(img)
          ),
          instagram: profile.instagram || '',
          facebook: profile.facebook || '',
          linkedin: profile.linkedin || '',
          referenciaNombre: '', // TODO: Agregar al schema si es necesario
          referenciaEmail: '',
          referenciaTelefono: ''
        });
      })
      .catch(err => {
        // Usar warn para no disparar el overlay de Next.js
        console.warn('No se pudo cargar desde API, usando datos locales:', err.message);
        
        // Fallback a localStorage
        const registroCompleto = localStorage.getItem('registroCompleto');
        if (registroCompleto) {
          try {
            const datosRegistro = JSON.parse(registroCompleto);
            
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
              experiencia: datosRegistro.experiencia || 0,
              alcanceTrabajo: datosRegistro.alcanceTrabajo || '',
              profileImage: '',
              portfolioImages: [],
              instagram: datosRegistro.instagram || '',
              facebook: datosRegistro.facebook || '',
              linkedin: datosRegistro.linkedin || '',
              referenciaNombre: datosRegistro.referenciaNombre || '',
              referenciaEmail: datosRegistro.referenciaEmail || '',
              referenciaTelefono: datosRegistro.referenciaTelefono || ''
            });
          } catch (error) {
            console.error('Error parseando datos del registro:', error);
          }
        }
      });
  }, [router]);

  if (!providerData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.lg }}>Cargando...</p>
      </div>
    );
  }

  const handleEditClick = () => {
    console.log('=== ENTRANDO EN MODO EDICIÓN ===');
    console.log('providerData:', providerData);
    
    // Limpiar especialidades que no coincidan con las disponibles
    const especialidadesDisponibles = getEspecialidades(providerData.serviceCategory);
    const especialidadesValidas = providerData.specialties?.filter(s => 
      especialidadesDisponibles.includes(s)
    ) || [];
    
    setEditMode(true);
    setEditedData({ 
      ...providerData,
      specialties: especialidadesValidas
    });
    console.log('editMode activado');
    console.log('Especialidades limpiadas:', especialidadesValidas);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditedData(null);
  };

  const handleSaveEdit = async () => {
    if (!editedData) return;
    const providerId = localStorage.getItem(PROVIDER_ID_KEY);
    if (!providerId) return;

    try {
      await apiPut(`/providers/${providerId}`, {
        location: editedData.ubicacion,
        bio: editedData.descripcion,
        serviceDescription: editedData.descripcion,
        serviceCategory: editedData.serviceCategory,
        specialties: editedData.specialties,
        experience: editedData.experiencia,
        serviceRadius: editedData.alcanceTrabajo ? Number(editedData.alcanceTrabajo) : 0,
        instagram: editedData.instagram,
        facebook: editedData.facebook,
        linkedin: editedData.linkedin,
      });

      setProviderData(editedData);
      setEditMode(false);
      setEditedData(null);
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Error al guardar los cambios. Intentá de nuevo.');
    }
  };

  const handleFieldChange = (field: keyof ProviderData, value: any) => {
    if (editedData) {
      setEditedData({ ...editedData, [field]: value });
    }
  };

  const handleProfilePhotoUpload = async (files: FileList | null) => {
    if (!files || files.length === 0 || !editedData) return;
    const providerId = localStorage.getItem(PROVIDER_ID_KEY);
    if (!providerId) return;

    setUploadingProfilePhoto(true);
    try {
      const formData = new FormData();
      formData.append('fotoPerfil', files[0]);

      const result = await apiUpload<{ success: boolean; profilePhoto: string }>(
        `/providers/${providerId}/profile-photo`,
        formData
      );

      if (result.success) {
        const newUrl = getProfileImageUrl(result.profilePhoto);
        handleFieldChange('profileImage', newUrl);
        setProviderData(prev => prev ? { ...prev, profileImage: newUrl } : prev);
      }
    } catch (error) {
      console.error('Error subiendo foto de perfil:', error);
      alert('Error al subir la foto. Intentá de nuevo.');
    } finally {
      setUploadingProfilePhoto(false);
      if (profilePhotoInputRef.current) profilePhotoInputRef.current.value = '';
    }
  };

  const handlePhotoUpload = async (files: FileList | null) => {
    if (!files || files.length === 0 || !editedData) return;
    const providerId = localStorage.getItem(PROVIDER_ID_KEY);
    if (!providerId) return;

    setUploadingPhoto(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach(file => formData.append('fotosTrabajos', file));

      const result = await apiUpload<{ success: boolean; portfolioImages: string[] }>(
        `/providers/${providerId}/portfolio`,
        formData
      );

      if (result.success) {
        // Las URLs que devuelve el backend son los filenames/paths; convertirlas a URLs de display
        const newDisplayUrls = result.portfolioImages.map(img => getPortfolioImageUrl(img));
        handleFieldChange('portfolioImages', newDisplayUrls);
        // Sincronizar providerData también para que no se pierda al cancelar y volver
        setProviderData(prev => prev ? { ...prev, portfolioImages: newDisplayUrls } : prev);
      }
    } catch (error) {
      console.error('Error subiendo fotos:', error);
      alert('Error al subir las fotos. Inténtalo de nuevo.');
    } finally {
      setUploadingPhoto(false);
      // Limpiar el input para poder subir la misma foto otra vez si se quiere
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDeletePhoto = async (imgUrl: string) => {
    if (!editedData) return;
    const providerId = localStorage.getItem(PROVIDER_ID_KEY);
    if (!providerId) return;

    // Optimistic update: quitar del estado inmediatamente
    const newImages = editedData.portfolioImages?.filter(url => url !== imgUrl) || [];
    handleFieldChange('portfolioImages', newImages);

    try {
      const response = await fetchWithAuth(`/providers/${providerId}/portfolio`, {
        method: 'DELETE',
        body: JSON.stringify({ photoUrl: imgUrl }),
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        setProviderData(prev => prev ? { ...prev, portfolioImages: newImages } : prev);
      }
    } catch (error) {
      console.error('Error eliminando foto:', error);
      // Revertir si falla
      handleFieldChange('portfolioImages', editedData.portfolioImages || []);
    }
  };

  const currentData = editMode ? editedData : providerData;
  if (!currentData) return null;

  return (
    <div className="min-h-screen bg-white">
      {/* Header del proveedor */}
      <ProviderHeader
        activePage="perfil"
        pendingCount={pendingCount}
        onBack={() => {
          if (editMode) {
            setShowUnsavedModal(true);
          } else {
            router.back();
          }
        }}
      />

      {/* Modal de confirmación de cambios sin guardar */}
      {showUnsavedModal && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
            onClick={() => setShowUnsavedModal(false)}
          >
            <div 
              className="bg-white rounded-3xl shadow-2xl p-8 mx-4"
              style={{ 
                maxWidth: '400px',
                width: '100%',
                backgroundColor: '#FFF8F0'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Botón X para cerrar */}
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setShowUnsavedModal(false)}
                  style={{ cursor: 'pointer' }}
                >
                  <svg width="24" height="24" fill="none" stroke={colors.neutral.black} strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </button>
              </div>

              {/* Título */}
              <h2 style={{
                fontFamily: 'Maitree, serif',
                fontSize: '24px',
                fontWeight: 600,
                color: '#B45B39',
                textAlign: 'center',
                marginBottom: '32px'
              }}>
                ¿Querés guardar los cambios?
              </h2>

              {/* Botones */}
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setShowUnsavedModal(false);
                    handleSaveEdit();
                    router.back();
                  }}
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
                  Guardar Cambios
                </button>
                
                <button
                  onClick={() => {
                    setShowUnsavedModal(false);
                    setEditMode(false);
                    setEditedData(null);
                    router.back();
                  }}
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
                  No, seguir sin guardar
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Contenido principal - con padding-top para compensar header fixed */}
      <main style={{ paddingTop: 'calc(6rem + 48px)', paddingLeft: '24px', paddingRight: '24px' }}>
        <div className="max-w-xl mx-auto">
          {/* Layout: una columna centrada (mobile y desktop iguales) */}
          <div>
          {/* Perfil: foto + nombre */}
          <div>
          {/* Botón Editar Perfil - Solo mostrar cuando NO está en modo edición */}
          {!editMode && (
            <div className="flex justify-center mb-6">
              <button
                onClick={handleEditClick}
                className="px-6 py-2 rounded-full bg-white hover:bg-gray-50 transition-colors"
                style={{
                  fontFamily: typography.fontFamily.primary,
                  fontSize: typography.fontSize.base,
                  color: colors.neutral.black,
                  border: '2px solid #000000',
                  cursor: 'pointer'
                }}
              >
                Editar Perfil
              </button>
            </div>
          )}
          {/* Card de perfil con imagen */}
          <div 
            className="rounded-3xl overflow-hidden mb-6"
            style={{ 
              backgroundColor: '#FFFFFF',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          >
            {/* Imagen de fondo/header */}
            <div style={{ height: '200px', position: 'relative', overflow: 'hidden' }}>
              {currentData.profileImage ? (
                <Image
                  src={currentData.profileImage}
                  alt="Foto de perfil"
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  style={{ objectFit: 'cover' }}
                />
              ) : (
                <div style={{ width: '100%', height: '100%', backgroundColor: '#E5E7EB' }} />
              )}
              {editMode && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <input
                    ref={profilePhotoInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    style={{ display: 'none' }}
                    onChange={(e) => handleProfilePhotoUpload(e.target.files)}
                  />
                  <button
                    onClick={() => !uploadingProfilePhoto && profilePhotoInputRef.current?.click()}
                    className="px-4 py-2 rounded-full bg-white hover:bg-gray-100 transition-colors flex items-center gap-2"
                    style={{
                      fontFamily: typography.fontFamily.primary,
                      fontSize: typography.fontSize.sm,
                      cursor: uploadingProfilePhoto ? 'wait' : 'pointer',
                      opacity: uploadingProfilePhoto ? 0.8 : 1
                    }}
                  >
                    {uploadingProfilePhoto ? (
                      <>
                        <div style={{
                          width: '14px',
                          height: '14px',
                          border: '2px solid #D1D5DB',
                          borderTopColor: '#244C87',
                          borderRadius: '50%',
                          animation: 'spin 0.8s linear infinite',
                          flexShrink: 0
                        }} />
                        Subiendo...
                      </>
                    ) : (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#244C87" strokeWidth="2">
                          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                          <circle cx="12" cy="13" r="4"/>
                        </svg>
                        Cambiar foto
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Información del perfil */}
            <div className="p-6 text-center">
              {editMode ? (
                <div className="space-y-4">
                  {/* Nombre completo no editable (se valida con DNI) */}
                  <h1 style={{
                    fontFamily: 'Maitree, serif',
                    fontSize: '32px',
                    fontWeight: 600,
                    color: '#244C87',
                    marginBottom: '8px'
                  }}>
                    {currentData.nombre} {currentData.apellido}
                  </h1>
                  
                  <div className="relative w-full">
                    <input
                      type="text"
                      readOnly
                      value={profesionOpciones.find(o => o.value === currentData.serviceCategory)?.label ?? ''}
                      onFocus={() => setShowProfesionDropdown(true)}
                      onBlur={() => setTimeout(() => setShowProfesionDropdown(false), 200)}
                      placeholder="Profesión"
                      className="w-full px-4 py-2 rounded-full border-2 border-gray-200 focus:border-[#244C87] focus:outline-none text-gray-700 placeholder-gray-400 transition-all cursor-pointer"
                      style={{ fontFamily: 'Maitree, serif', fontSize: '16px' }}
                    />
                    {showProfesionDropdown && (
                      <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-2xl shadow-lg max-h-60 overflow-y-auto">
                        {profesionOpciones.map((op) => (
                          <div
                            key={op.value}
                            onMouseDown={() => {
                              handleFieldChange('serviceCategory', op.value);
                              handleFieldChange('specialties', []);
                              setShowProfesionDropdown(false);
                            }}
                            className="px-5 py-3 hover:bg-indigo-50 cursor-pointer text-gray-700 text-base transition-colors"
                            style={{ fontFamily: 'Maitree, serif', backgroundColor: currentData.serviceCategory === op.value ? '#EEF2FF' : undefined }}
                          >
                            {op.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <input
                    type="text"
                    value={currentData.ubicacion}
                    onChange={(e) => handleFieldChange('ubicacion', e.target.value)}
                    placeholder="Ubicación"
                    className="w-full px-4 py-2 rounded-full border-2 border-gray-300 focus:border-[#244C87] focus:outline-none"
                    style={{
                      fontFamily: typography.fontFamily.primary,
                      fontSize: typography.fontSize.sm,
                      color: colors.neutral[600]
                    }}
                  />
                </div>
              ) : (
                <>
                  <h1 style={{
                    fontFamily: 'Maitree, serif',
                    fontSize: '32px',
                    fontWeight: 600,
                    color: '#244C87',
                    marginBottom: '8px'
                  }}>
                    {currentData.nombre} {currentData.apellido}
                  </h1>
                  
                  <p style={{
                    fontFamily: 'Maitree, serif',
                    fontSize: '18px',
                    fontWeight: 400,
                    color: colors.neutral.black,
                    marginBottom: '4px'
                  }}>
                    {currentData.serviceCategory}
                  </p>

                  <div className="flex items-center justify-center gap-2 text-gray-600">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3" fill="white"/>
                    </svg>
                    <span style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.sm }}>
                      {currentData.ubicacion}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          </div>{/* fin col perfil */}

          {/* Detalles: experiencia, servicios, zona, galeria, descripcion */}
          <div>
          {/* Experiencia profesional */}
          {(currentData.experiencia > 0 || editMode) && (
            <div className="mb-6">
              {editMode ? (
                <div className="flex items-center gap-4">
                  <label style={{
                    fontFamily: 'Maitree, serif',
                    fontSize: '18px',
                    fontWeight: 600,
                    color: colors.neutral.black
                  }}>
                    Años de experiencia:
                  </label>
                  <input
                    type="number"
                    value={currentData.experiencia}
                    onChange={(e) => handleFieldChange('experiencia', parseInt(e.target.value) || 0)}
                    className="w-32 px-4 py-2 rounded-full border-2 border-gray-300 focus:border-[#244C87] focus:outline-none"
                    style={{
                      fontFamily: typography.fontFamily.primary,
                      fontSize: typography.fontSize.base
                    }}
                  />
                </div>
              ) : (
                <p style={{
                  fontFamily: 'Maitree, serif',
                  fontSize: '18px',
                  fontWeight: 600,
                  color: colors.neutral.black
                }}>
                  Experiencia profesional: {currentData.experiencia} años
                </p>
              )}
            </div>
          )}

          {/* Servicios ofrecidos */}
          <div className="mb-6">
            <h2 style={{
              fontFamily: 'Maitree, serif',
              fontSize: '20px',
              fontWeight: 600,
              color: colors.neutral.black,
              marginBottom: '12px'
            }}>
              Servicios ofrecidos:
            </h2>
            <div className="flex flex-wrap gap-2">
              {(() => {
                console.log('=== RENDERIZANDO SERVICIOS ===');
                console.log('editMode:', editMode);
                console.log('currentData:', currentData);
                
                if (editMode) {
                  // Modo edición: mostrar especialidades según la profesión
                  const especialidadesDisponibles = getEspecialidades(currentData.serviceCategory);
                  console.log('Especialidades disponibles:', especialidadesDisponibles);
                  console.log('Especialidades seleccionadas:', currentData.specialties);
                  
                  if (especialidadesDisponibles.length === 0) {
                    return (
                      <p style={{
                        fontFamily: typography.fontFamily.primary,
                        fontSize: typography.fontSize.sm,
                        color: colors.neutral[400]
                      }}>
                        No hay especialidades disponibles para esta profesión
                      </p>
                    );
                  }
                  return especialidadesDisponibles.map((specialty) => {
                    const isSelected = currentData.specialties?.includes(specialty);
                    console.log(`${specialty}: ${isSelected ? 'SELECCIONADO' : 'NO seleccionado'}`);
                    return (
                      <button
                        key={specialty}
                        type="button"
                        onClick={() => {
                          const current = currentData.specialties || [];
                          if (isSelected) {
                            handleFieldChange('specialties', current.filter(s => s !== specialty));
                          } else {
                            handleFieldChange('specialties', [...current, specialty]);
                          }
                        }}
                        className="px-4 py-2 rounded-full border-2 transition-colors"
                        style={{
                          fontFamily: typography.fontFamily.primary,
                          fontSize: typography.fontSize.sm,
                          color: isSelected ? '#FFFFFF' : colors.neutral.black,
                          borderColor: isSelected ? '#244C87' : '#000000',
                          backgroundColor: isSelected ? '#244C87' : '#FFFFFF',
                          cursor: 'pointer'
                        }}
                      >
                        {specialty}
                      </button>
                    );
                  });
                } else {
                  // Modo vista: mostrar solo los seleccionados
                  if (currentData.specialties && currentData.specialties.length > 0) {
                    return currentData.specialties.map((specialty) => (
                      <div
                        key={specialty}
                        className="px-4 py-2 rounded-full border-2"
                        style={{
                          fontFamily: typography.fontFamily.primary,
                          fontSize: typography.fontSize.sm,
                          color: colors.neutral.black,
                          borderColor: '#000000',
                          backgroundColor: '#FFFFFF'
                        }}
                      >
                        {specialty}
                      </div>
                    ));
                  } else {
                    return (
                      <p style={{
                        fontFamily: typography.fontFamily.primary,
                        fontSize: typography.fontSize.sm,
                        color: colors.neutral[400]
                      }}>
                        No hay servicios seleccionados
                      </p>
                    );
                  }
                }
              })()}
            </div>
          </div>

          {/* Zona de Trabajo */}
          <div className="mb-6">
            <h2 style={{
              fontFamily: 'Maitree, serif',
              fontSize: '20px',
              fontWeight: 600,
              color: colors.neutral.black,
              marginBottom: '12px'
            }}>
              Zona de Trabajo:
            </h2>
            
            <div 
              className="w-full rounded-3xl border-2 border-gray-300 bg-gray-50 flex items-center justify-center relative overflow-hidden"
              style={{ height: '240px' }}
            >
              {currentData.ubicacion ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* Círculo que representa el radio de alcance */}
                  <div 
                    className="border-2 border-dashed border-gray-400 rounded-full flex items-center justify-center"
                    style={{ 
                      width: `${Math.min(currentData.alcanceTrabajo ? parseInt(currentData.alcanceTrabajo) * 6 : 100, 200)}px`,
                      height: `${Math.min(currentData.alcanceTrabajo ? parseInt(currentData.alcanceTrabajo) * 6 : 100, 200)}px`,
                      transition: 'width 0.3s ease, height 0.3s ease'
                    }}
                  >
                    {/* Ícono de ubicación */}
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="#244C87" stroke="#244C87" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3" fill="white"/>
                    </svg>
                  </div>
                  
                  {/* Etiqueta con el radio actual */}
                  <div 
                    className="absolute bottom-4 bg-white px-4 py-2 rounded-full shadow-md border border-gray-200"
                    style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.sm, color: colors.neutral.black }}
                  >
                    Radio: {currentData.alcanceTrabajo || '0'} km
                  </div>
                </div>
              ) : (
                <p style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.sm, color: '#999999' }}>
                  No especificado
                </p>
              )}
            </div>
            
            {/* Slider para ajustar el radio en modo edición */}
            {editMode && currentData.ubicacion && (
              <div className="mt-4">
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={currentData.alcanceTrabajo || 0}
                  onChange={(e) => handleFieldChange('alcanceTrabajo', e.target.value)}
                  className="w-full"
                  style={{
                    accentColor: '#244C87'
                  }}
                />
                <p className="mt-2 text-xs text-gray-600 text-center" style={{ fontFamily: typography.fontFamily.primary }}>
                  ¿Hasta dónde estarías dispuesto/a a moverte para trabajar desde {currentData.ubicacion}?
                </p>
              </div>
            )}
          </div>

          {/* Galería */}
          {((currentData.portfolioImages && currentData.portfolioImages.length > 0) || editMode) && (
            <div className="mb-6">
              <h2 style={{
                fontFamily: 'Maitree, serif',
                fontSize: '20px',
                fontWeight: 600,
                color: colors.neutral.black,
                marginBottom: '12px'
              }}>
                Galeria
              </h2>
              
              <div 
                className="flex gap-4 pb-4"
                style={{ 
                  overflowX: currentData.portfolioImages && currentData.portfolioImages.length > 0 ? 'auto' : 'visible',
                  flexWrap: currentData.portfolioImages && currentData.portfolioImages.length > 0 ? 'nowrap' : 'wrap',
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#244C87 #E5E7EB'
                }}
              >
                {currentData.portfolioImages && currentData.portfolioImages.length > 0 ? (
                  currentData.portfolioImages.map((img) => (
                    <div 
                      key={img}
                      className="flex-shrink-0 rounded-2xl overflow-hidden"
                      style={{ width: '300px', height: '200px', position: 'relative' }}
                    >
                      <Image
                        src={img}
                        alt={`Trabajo ${currentData.portfolioImages?.indexOf(img)! + 1}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 300px"
                        style={{ objectFit: 'cover' }}
                      />
                      {editMode && (
                        <button
                          onClick={() => handleDeletePhoto(img)}
                          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors"
                          style={{
                            fontSize: '20px',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                          }}
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))
                ) : null}
                
                {/* Botón agregar foto en modo edición */}
                {editMode && (
                  <>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/gif"
                      multiple
                      style={{ display: 'none' }}
                      onChange={(e) => handlePhotoUpload(e.target.files)}
                    />
                    <div 
                      className="flex-shrink-0 rounded-2xl border-2 border-dashed transition-colors flex items-center justify-center"
                      style={{
                        width: currentData.portfolioImages && currentData.portfolioImages.length > 0 ? '300px' : '100%',
                        height: '200px',
                        borderColor: uploadingPhoto ? '#244C87' : '#D1D5DB',
                        backgroundColor: uploadingPhoto ? '#F0F4FF' : 'transparent',
                        cursor: uploadingPhoto ? 'wait' : 'pointer'
                      }}
                      onClick={() => !uploadingPhoto && fileInputRef.current?.click()}
                    >
                      <div className="text-center">
                        {uploadingPhoto ? (
                          <>
                            <div style={{
                              width: '36px',
                              height: '36px',
                              border: '3px solid #E5E7EB',
                              borderTopColor: '#244C87',
                              borderRadius: '50%',
                              animation: 'spin 0.8s linear infinite',
                              margin: '0 auto'
                            }} />
                            <p style={{
                              fontFamily: typography.fontFamily.primary,
                              fontSize: typography.fontSize.sm,
                              color: '#244C87',
                              marginTop: '10px'
                            }}>
                              Subiendo...
                            </p>
                          </>
                        ) : (
                          <>
                            <span style={{
                              fontSize: '40px',
                              color: '#244C87',
                              lineHeight: 1
                            }}>+</span>
                            <p style={{
                              fontFamily: typography.fontFamily.primary,
                              fontSize: typography.fontSize.sm,
                              color: colors.neutral[600],
                              marginTop: '8px'
                            }}>
                              Agregar foto
                            </p>
                            {(!currentData.portfolioImages || currentData.portfolioImages.length === 0) && (
                              <p style={{
                                fontFamily: typography.fontFamily.primary,
                                fontSize: typography.fontSize.xs,
                                color: colors.neutral[400],
                                marginTop: '4px'
                              }}>
                                No hay fotos en la galería
                              </p>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Descripción */}
          <div className="mb-6">
              <h2 style={{
                fontFamily: 'Maitree, serif',
                fontSize: '20px',
                fontWeight: 600,
                color: colors.neutral.black,
                marginBottom: '12px'
              }}>
                Descripción:
              </h2>
              {editMode ? (
                <textarea
                  value={currentData.descripcion}
                  onChange={(e) => handleFieldChange('descripcion', e.target.value)}
                  placeholder="Describe tu experiencia y servicios..."
                  rows={6}
                  className="w-full px-4 py-3 rounded-3xl border-2 border-gray-300 focus:border-[#244C87] focus:outline-none resize-none"
                  style={{
                    fontFamily: typography.fontFamily.primary,
                    fontSize: typography.fontSize.base,
                    color: colors.neutral.black,
                    lineHeight: '1.6'
                  }}
                />
              ) : (
                <p style={{
                  fontFamily: typography.fontFamily.primary,
                  fontSize: typography.fontSize.base,
                  color: currentData.descripcion ? colors.neutral.black : colors.neutral[400],
                  lineHeight: '1.6'
                }}>
                  {currentData.descripcion || 'Aún no hay descripción.'}
                </p>
              )}
            </div>

          {/* Referencias eliminadas por petición del usuario */}

          {/* Botones Cancelar/Guardar Cambios - Mostrar al final en modo edición */}
          {editMode && (
            <div className="flex justify-center gap-4 mt-8 mb-8">
              <button
                onClick={handleCancelEdit}
                className="px-6 py-2 rounded-full bg-white hover:bg-gray-50 transition-colors"
                style={{
                  fontFamily: typography.fontFamily.primary,
                  fontSize: typography.fontSize.base,
                  color: colors.neutral.black,
                  border: '2px solid #000000',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-6 py-2 rounded-full hover:opacity-90 transition-opacity"
                style={{
                  fontFamily: typography.fontFamily.primary,
                  fontSize: typography.fontSize.base,
                  color: '#FFFFFF',
                  backgroundColor: '#244C87',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Guardar Cambios
              </button>
            </div>
          )}
          </div>{/* fin col detalles */}
          </div>{/* fin wrapper */}
        </div>
      </main>
    </div>
  );
}
