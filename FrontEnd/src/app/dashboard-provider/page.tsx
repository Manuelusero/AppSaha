// Original content from attachment
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { colors, typography } from '@/styles/tokens';
import { apiGet, apiPut, apiUpload, getProfileImageUrl, getPortfolioImageUrl, PROVIDER_ID_KEY, fetchWithAuth } from '@/utils';
import { getEspecialidades } from '../data/especialidades';
import { ProviderHeader } from '@/components/layout';
import { useBookingsStore } from '@/store/bookingsStore';
import ProfessionSelector from '@/components/provider-signup/ProfessionSelector';
import SpecialtyChips from '@/components/provider-signup/SpecialtyChips';

const WorkZoneMap = dynamic(() => import('@/components/ui/WorkZoneMap'), { ssr: false });

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
  const profesionInputRef = useRef<HTMLInputElement>(null);
  const [showProfesionDropdown, setShowProfesionDropdown] = useState(false);
  const [dropdownRect, setDropdownRect] = useState<{ top: number; left: number; width: number } | null>(null);

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
        const newDisplayUrls = result.portfolioImages.map(img => getPortfolioImageUrl(img));
        handleFieldChange('portfolioImages', newDisplayUrls);
        setProviderData(prev => prev ? { ...prev, portfolioImages: newDisplayUrls } : prev);
      }
    } catch (error) {
      console.error('Error subiendo fotos:', error);
      alert('Error al subir las fotos. Inténtalo de nuevo.');
    } finally {
      setUploadingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDeletePhoto = async (imgUrl: string) => {
    if (!editedData) return;
    const providerId = localStorage.getItem(PROVIDER_ID_KEY);
    if (!providerId) return;

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
      handleFieldChange('portfolioImages', editedData.portfolioImages || []);
    }
  };

  const currentData = editMode ? editedData : providerData;
  if (!currentData) return null;

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
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
      {showUnsavedModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={() => setShowUnsavedModal(false)}>
            <div className="bg-white rounded-3xl shadow-2xl p-8 mx-4" style={{ maxWidth: '400px', width: '100%', backgroundColor: '#FFF8F0' }} onClick={e => e.stopPropagation()}>
              <div className="flex justify-end mb-4">
                <button onClick={() => setShowUnsavedModal(false)} style={{ cursor: 'pointer' }}>
                  <svg width="24" height="24" fill="none" stroke={colors.neutral.black} strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              </div>
              <h2 style={{ fontFamily: 'Maitree, serif', fontSize: '24px', fontWeight: 600, color: '#B45B39', textAlign: 'center', marginBottom: '32px' }}>¿Querés guardar los cambios?</h2>
              <div className="space-y-3">
                <button onClick={() => { setShowUnsavedModal(false); handleSaveEdit(); router.back(); }} className="w-full py-3 rounded-full hover:opacity-90 transition-opacity" style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.base, color: '#FFFFFF', backgroundColor: '#B45B39', cursor: 'pointer', border: 'none' }}>Guardar Cambios</button>
                <button onClick={() => { setShowUnsavedModal(false); setEditMode(false); setEditedData(null); router.back(); }} className="w-full py-3 rounded-full hover:opacity-90 transition-opacity" style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.base, color: '#FFFFFF', backgroundColor: '#B45B39', cursor: 'pointer', border: 'none' }}>No, seguir sin guardar</button>
              </div>
            </div>
          </div>
        </>
      )}
      <main className="px-4 sm:px-6" style={{ paddingTop: 'calc(6rem + 48px)', paddingBottom: '2rem' }}>
        <div className="max-w-xl mx-auto space-y-6">

          {/* Botones Editar / Guardar / Cancelar */}
          {!editMode ? (
            <div className="flex justify-center">
              <button onClick={handleEditClick} className="px-6 py-2 rounded-full bg-white hover:bg-gray-50 transition-colors" style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.base, color: colors.neutral.black, border: '2px solid #000000', cursor: 'pointer' }}>Editar Perfil</button>
            </div>
          ) : (
            <div className="flex gap-3 justify-center">
              <button onClick={handleSaveEdit} className="px-6 py-2 rounded-full hover:opacity-90 transition-opacity" style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.base, color: '#FFFFFF', backgroundColor: '#244C87', border: 'none', cursor: 'pointer' }}>Guardar</button>
              <button onClick={handleCancelEdit} className="px-6 py-2 rounded-full bg-white hover:bg-gray-50 transition-colors" style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.base, color: colors.neutral.black, border: '2px solid #000000', cursor: 'pointer' }}>Cancelar</button>
            </div>
          )}

          {/* ── Tarjeta 1: Foto + Nombre + Profesión + Ubicación ── */}
          <div className="rounded-3xl overflow-hidden" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <div style={{ height: '200px', position: 'relative', overflow: 'hidden' }}>
              {currentData.profileImage ? (
                <Image src={currentData.profileImage} alt="Foto de perfil" fill sizes="(max-width: 768px) 100vw, 400px" style={{ objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', backgroundColor: '#E5E7EB' }} />
              )}
              {editMode && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <input ref={profilePhotoInputRef} type="file" accept="image/jpeg,image/jpg,image/png" style={{ display: 'none' }} onChange={e => handleProfilePhotoUpload(e.target.files)} />
                  <button onClick={() => !uploadingProfilePhoto && profilePhotoInputRef.current?.click()} className="px-4 py-2 rounded-full bg-white hover:bg-gray-100 transition-colors flex items-center gap-2" style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.sm, cursor: uploadingProfilePhoto ? 'wait' : 'pointer', opacity: uploadingProfilePhoto ? 0.8 : 1 }}>
                    {uploadingProfilePhoto ? (<><div style={{ width: '14px', height: '14px', border: '2px solid #D1D5DB', borderTopColor: '#244C87', borderRadius: '50%', animation: 'spin 0.8s linear infinite', flexShrink: 0 }} />Subiendo...</>) : (<><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#244C87" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>Cambiar foto</>)}
                  </button>
                </div>
              )}
            </div>
            <div className="p-6 text-center">
              <h1 style={{ fontFamily: 'Maitree, serif', fontSize: '32px', fontWeight: 600, color: '#244C87', marginBottom: '8px' }}>{currentData.nombre} {currentData.apellido}</h1>
              {editMode ? (
                <div className="space-y-4 mt-4">
                  {/* Profesión */}
                  <div className="relative w-full">
                    <input ref={profesionInputRef} type="text" readOnly value={profesionOpciones.find(o => o.value === (editedData?.serviceCategory ?? ''))?.label ?? ''} onFocus={() => { const rect = profesionInputRef.current?.getBoundingClientRect(); if (rect) { setDropdownRect({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX, width: rect.width }); } setShowProfesionDropdown(true); }} onBlur={() => setTimeout(() => setShowProfesionDropdown(false), 150)} placeholder="Profesión" className="w-full px-4 py-2 rounded-full border-2 border-gray-200 focus:border-[#244C87] focus:outline-none text-gray-700 placeholder-gray-400 transition-all cursor-pointer" style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.base }} />
                    {showProfesionDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border-2 border-gray-300 rounded-2xl shadow-lg max-h-60 overflow-y-auto">
                        {profesionOpciones.map((opcion) => (
                          <div key={opcion.value} onMouseDown={() => { handleFieldChange('serviceCategory', opcion.value); handleFieldChange('specialties', []); setShowProfesionDropdown(false); }} className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors" style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.base, color: '#000' }}>{opcion.label}</div>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Especialidades */}
                  {editedData?.serviceCategory && getEspecialidades(editedData.serviceCategory).length > 0 && (
                    <div className="text-left">
                      <SpecialtyChips label="Especialidades" specialties={getEspecialidades(editedData.serviceCategory)} selectedSpecialties={editedData.specialties || []} onToggle={(specialty) => { const current = editedData.specialties || []; handleFieldChange('specialties', current.includes(specialty) ? current.filter(s => s !== specialty) : [...current, specialty]); }} required={false} />
                    </div>
                  )}
                  {/* Ubicación */}
                  <input type="text" value={editedData?.ubicacion ?? ''} onChange={e => handleFieldChange('ubicacion', e.target.value)} placeholder="Ubicación" className="w-full px-4 py-2 rounded-full border-2 border-gray-300 focus:border-[#244C87] focus:outline-none" style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.sm, color: colors.neutral[600] }} />
                  {/* Teléfono */}
                  <input type="tel" value={editedData?.telefono ?? ''} onChange={e => handleFieldChange('telefono', e.target.value)} placeholder="Teléfono" className="w-full px-4 py-2 rounded-full border-2 border-gray-300 focus:border-[#244C87] focus:outline-none" style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.sm, color: colors.neutral[600] }} />
                </div>
              ) : (
                <div className="space-y-2 mt-2">
                  <p style={{ fontFamily: 'Maitree, serif', fontSize: '18px', fontWeight: 400, color: colors.neutral.black }}>{profesionOpciones.find(o => o.value === currentData.serviceCategory)?.label ?? currentData.serviceCategory}</p>
                  {currentData.specialties?.length > 0 && (
                    <div className="flex flex-wrap gap-2 justify-center mt-2">
                      {currentData.specialties.map(s => (
                        <span key={s} className="px-3 py-1 rounded-full text-sm border-2 border-[#244C87] text-[#244C87]" style={{ fontFamily: typography.fontFamily.primary }}>{s}</span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center justify-center gap-2 text-gray-600">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3" fill="white"/></svg>
                    <span style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.sm }}>{currentData.ubicacion}</span>
                  </div>
                  {currentData.telefono && (
                    <div className="flex items-center justify-center gap-2 text-gray-600">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l.77-.77a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                      <span style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.sm }}>{currentData.telefono}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ── Tarjeta 2: Descripción y Experiencia ── */}
          <div className="rounded-3xl p-6" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontFamily: 'Maitree, serif', fontSize: '20px', fontWeight: 600, color: '#244C87', marginBottom: '16px' }}>Sobre mí</h2>
            {editMode ? (
              <div className="space-y-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-600" style={{ fontFamily: typography.fontFamily.primary }}>Descripción</label>
                  <textarea value={editedData?.descripcion ?? ''} onChange={e => handleFieldChange('descripcion', e.target.value)} placeholder="Contá tu experiencia y servicios..." rows={4} className="w-full px-4 py-3 rounded-2xl border-2 border-gray-300 focus:border-[#244C87] focus:outline-none resize-none" style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.sm }} />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block mb-1 text-sm font-medium text-gray-600" style={{ fontFamily: typography.fontFamily.primary }}>Años de experiencia</label>
                    <input type="number" min={0} value={editedData?.experiencia ?? ''} onChange={e => handleFieldChange('experiencia', Number(e.target.value))} placeholder="0" className="w-full px-4 py-2 rounded-full border-2 border-gray-300 focus:border-[#244C87] focus:outline-none" style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.sm }} />
                  </div>
                  <div className="flex-1">
                    <label className="block mb-1 text-sm font-medium text-gray-600" style={{ fontFamily: typography.fontFamily.primary }}>Radio de trabajo (km)</label>
                    <input type="number" min={0} value={editedData?.alcanceTrabajo ?? ''} onChange={e => handleFieldChange('alcanceTrabajo', e.target.value)} placeholder="0" className="w-full px-4 py-2 rounded-full border-2 border-gray-300 focus:border-[#244C87] focus:outline-none" style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.sm }} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {currentData.descripcion ? (
                  <p style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.sm, color: colors.neutral[600], lineHeight: '1.6' }}>{currentData.descripcion}</p>
                ) : (
                  <p style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.sm, color: '#9CA3AF' }}>Sin descripción</p>
                )}
                <div className="flex gap-6 mt-4">
                  {currentData.experiencia > 0 && (
                    <div className="text-center">
                      <p style={{ fontFamily: 'Maitree, serif', fontSize: '28px', fontWeight: 600, color: '#244C87' }}>{currentData.experiencia}</p>
                      <p style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.xs, color: colors.neutral[600] }}>años de exp.</p>
                    </div>
                  )}
                  {currentData.alcanceTrabajo && (
                    <div className="text-center">
                      <p style={{ fontFamily: 'Maitree, serif', fontSize: '28px', fontWeight: 600, color: '#244C87' }}>{currentData.alcanceTrabajo} km</p>
                      <p style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.xs, color: colors.neutral[600] }}>radio de trabajo</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ── Tarjeta 3: Fotos de trabajos ── */}
          <div className="rounded-3xl p-6" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontFamily: 'Maitree, serif', fontSize: '20px', fontWeight: 600, color: '#244C87', marginBottom: '16px' }}>Fotos de trabajos</h2>
            <div className="grid grid-cols-3 gap-2">
              {(currentData.portfolioImages ?? []).map((img, i) => (
                <div key={img} className="relative aspect-square rounded-xl overflow-hidden">
                  <Image src={img} alt={`Trabajo ${i + 1}`} fill sizes="150px" style={{ objectFit: 'cover' }} />
                  {editMode && (
                    <button onClick={() => handleDeletePhoto(img)} className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80 transition-colors" style={{ cursor: 'pointer' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    </button>
                  )}
                </div>
              ))}
              {editMode && (
                <div className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-[#244C87] transition-colors" onClick={() => fileInputRef.current?.click()}>
                  <input ref={fileInputRef} type="file" accept="image/jpeg,image/jpg,image/png" multiple style={{ display: 'none' }} onChange={e => handlePhotoUpload(e.target.files)} />
                  {uploadingPhoto ? (
                    <div style={{ width: '20px', height: '20px', border: '2px solid #D1D5DB', borderTopColor: '#244C87', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
                  )}
                </div>
              )}
            </div>
            {!editMode && (currentData.portfolioImages ?? []).length === 0 && (
              <p style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.sm, color: '#9CA3AF' }}>Sin fotos de trabajos</p>
            )}
          </div>

          {/* ── Tarjeta 4: Redes sociales ── */}
          <div className="rounded-3xl p-6" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontFamily: 'Maitree, serif', fontSize: '20px', fontWeight: 600, color: '#244C87', marginBottom: '16px' }}>Redes sociales</h2>
            {editMode ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#E1306C"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  <input type="text" value={editedData?.instagram ?? ''} onChange={e => handleFieldChange('instagram', e.target.value)} placeholder="Instagram (usuario)" className="flex-1 px-4 py-2 rounded-full border-2 border-gray-300 focus:border-[#244C87] focus:outline-none" style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.sm }} />
                </div>
                <div className="flex items-center gap-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  <input type="text" value={editedData?.facebook ?? ''} onChange={e => handleFieldChange('facebook', e.target.value)} placeholder="Facebook (usuario o URL)" className="flex-1 px-4 py-2 rounded-full border-2 border-gray-300 focus:border-[#244C87] focus:outline-none" style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.sm }} />
                </div>
                <div className="flex items-center gap-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#0A66C2"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  <input type="text" value={editedData?.linkedin ?? ''} onChange={e => handleFieldChange('linkedin', e.target.value)} placeholder="LinkedIn (usuario o URL)" className="flex-1 px-4 py-2 rounded-full border-2 border-gray-300 focus:border-[#244C87] focus:outline-none" style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.sm }} />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {!currentData.instagram && !currentData.facebook && !currentData.linkedin && (
                  <p style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.sm, color: '#9CA3AF' }}>Sin redes sociales</p>
                )}
                {currentData.instagram && (
                  <div className="flex items-center gap-3">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#E1306C"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                    <span style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>{currentData.instagram}</span>
                  </div>
                )}
                {currentData.facebook && (
                  <div className="flex items-center gap-3">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    <span style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>{currentData.facebook}</span>
                  </div>
                )}
                {currentData.linkedin && (
                  <div className="flex items-center gap-3">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#0A66C2"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    <span style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>{currentData.linkedin}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Tarjeta 5: Referencia ── */}
          <div className="rounded-3xl p-6" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontFamily: 'Maitree, serif', fontSize: '20px', fontWeight: 600, color: '#244C87', marginBottom: '16px' }}>Referencia</h2>
            {editMode ? (
              <div className="space-y-3">
                <input type="text" value={editedData?.referenciaNombre ?? ''} onChange={e => handleFieldChange('referenciaNombre', e.target.value)} placeholder="Nombre de la referencia" className="w-full px-4 py-2 rounded-full border-2 border-gray-300 focus:border-[#244C87] focus:outline-none" style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.sm }} />
                <input type="email" value={editedData?.referenciaEmail ?? ''} onChange={e => handleFieldChange('referenciaEmail', e.target.value)} placeholder="Email de la referencia" className="w-full px-4 py-2 rounded-full border-2 border-gray-300 focus:border-[#244C87] focus:outline-none" style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.sm }} />
                <input type="tel" value={editedData?.referenciaTelefono ?? ''} onChange={e => handleFieldChange('referenciaTelefono', e.target.value)} placeholder="Teléfono de la referencia" className="w-full px-4 py-2 rounded-full border-2 border-gray-300 focus:border-[#244C87] focus:outline-none" style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.sm }} />
              </div>
            ) : (
              <div>
                {!currentData.referenciaNombre && !currentData.referenciaEmail && !currentData.referenciaTelefono ? (
                  <p style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.sm, color: '#9CA3AF' }}>Sin referencia cargada</p>
                ) : (
                  <div className="space-y-2">
                    {currentData.referenciaNombre && <p style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.sm, color: colors.neutral[600] }}><strong>Nombre:</strong> {currentData.referenciaNombre}</p>}
                    {currentData.referenciaEmail && <p style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.sm, color: colors.neutral[600] }}><strong>Email:</strong> {currentData.referenciaEmail}</p>}
                    {currentData.referenciaTelefono && <p style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.sm, color: colors.neutral[600] }}><strong>Teléfono:</strong> {currentData.referenciaTelefono}</p>}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Botón guardar al final (modo edición) */}
          {editMode && (
            <div className="flex gap-3 justify-center pb-4">
              <button onClick={handleSaveEdit} className="px-6 py-2 rounded-full hover:opacity-90 transition-opacity" style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.base, color: '#FFFFFF', backgroundColor: '#244C87', border: 'none', cursor: 'pointer' }}>Guardar cambios</button>
              <button onClick={handleCancelEdit} className="px-6 py-2 rounded-full bg-white hover:bg-gray-50 transition-colors" style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.base, color: colors.neutral.black, border: '2px solid #000000', cursor: 'pointer' }}>Cancelar</button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
