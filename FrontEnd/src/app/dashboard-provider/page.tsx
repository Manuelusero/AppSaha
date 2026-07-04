// Original content from attachment
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { colors, typography } from '@/styles/tokens';
import { apiGet, apiPut, apiUpload, getProfileImageUrl, getPortfolioImageUrl, PROVIDER_ID_KEY, fetchWithAuth, serviceCategoryLabels } from '@/utils';
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

  // Simple list reused from provider-signup for location autocomplete
  const ciudadesArgentina = [
    'Buenos Aires, Buenos Aires',
    'La Plata, Buenos Aires',
    'Mar del Plata, Buenos Aires',
    'Córdoba, Córdoba',
    'Rosario, Santa Fe',
    'Mendoza, Mendoza',
    'San Miguel de Tucumán, Tucumán',
    'Salta, Salta',
    'Santa Fe, Santa Fe',
    'San Juan, San Juan',
    'Resistencia, Chaco',
    'Neuquén, Neuquén',
    'Posadas, Misiones',
    'Bahía Blanca, Buenos Aires',
    'Paraná, Entre Ríos',
    'San Salvador de Jujuy, Jujuy',
    'Corrientes, Corrientes',
    'Santiago del Estero, Santiago del Estero',
    'San Fernando del Valle de Catamarca, Catamarca',
    'Formosa, Formosa',
    'San Luis, San Luis',
    'La Rioja, La Rioja',
    'Río Cuarto, Córdoba',
    'Comodoro Rivadavia, Chubut',
    'Quilmes, Buenos Aires',
    'San Isidro, Buenos Aires',
    'Vicente López, Buenos Aires',
    'Lomas de Zamora, Buenos Aires',
    'Banfield, Buenos Aires',
    'Pergamino, Buenos Aires',
    'Tandil, Buenos Aires',
    'Olavarría, Buenos Aires',
    'Zárate, Buenos Aires',
    'Campana, Buenos Aires',
    'Luján, Buenos Aires',
    'San Nicolás de los Arroyos, Buenos Aires',
    'Junín, Buenos Aires',
    'Necochea, Buenos Aires',
    'Chivilcoy, Buenos Aires',
    'Mercedes, Buenos Aires',
    'Villa María, Córdoba',
    'San Francisco, Córdoba',
    'Villa Carlos Paz, Córdoba',
    'Rafaela, Santa Fe',
    'Venado Tuerto, Santa Fe',
    'Reconquista, Santa Fe',
    'Godoy Cruz, Mendoza',
    'San Rafael, Mendoza',
    'Maipú, Mendoza',
    'Ushuaia, Tierra del Fuego',
    'Río Grande, Tierra del Fuego',
    'San Carlos de Bariloche, Río Negro',
    'Cipolletti, Río Negro',
    'Trelew, Chubut',
    'Puerto Madryn, Chubut',
    'Concordia, Entre Ríos',
    'Gualeguaychú, Entre Ríos',
    'Oberá, Misiones',
    'Eldorado, Misiones',
    'Goya, Corrientes',
    'Paso de los Libres, Corrientes',
    'Tartagal, Salta',
    'Orán, Salta',
    'Yerba Buena, Tucumán',
    'Concepción, Tucumán',
    'La Banda, Santiago del Estero',
    'Termas de Río Hondo, Santiago del Estero'
  ];

  const [mostrarUbicaciones, setMostrarUbicaciones] = useState(false);
  const [ubicacionesFiltradas, setUbicacionesFiltradas] = useState<string[]>([]);

  const handleUbicacionChange = (valor: string) => {
    handleFieldChange('ubicacion', valor);
    if (valor.length > 0) {
      const filtradas = ciudadesArgentina.filter(ciudad => ciudad.toLowerCase().includes(valor.toLowerCase()));
      setUbicacionesFiltradas(filtradas.slice(0, 5));
      setMostrarUbicaciones(true);
    } else {
      setUbicacionesFiltradas([]);
      setMostrarUbicaciones(false);
    }
  };

  const seleccionarUbicacion = (ciudad: string) => {
    handleFieldChange('ubicacion', ciudad);
    setMostrarUbicaciones(false);
  };

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
    setEditedData(prev => prev ? { ...prev, [field]: value } : prev);
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

  const profesionLabel = serviceCategoryLabels[currentData.serviceCategory] || currentData.serviceCategory;

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

      {/* Modal cambios sin guardar */}
      {showUnsavedModal && (
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
      )}

      {editMode && editedData ? (
        /* ═══════════════════════════════════════════
           MODO EDICIÓN
        ═══════════════════════════════════════════ */
        <main className="px-4 sm:px-6" style={{ paddingTop: 'calc(6rem + 48px)', paddingBottom: '6rem' }}>
          <div className="max-w-xl mx-auto space-y-6">

            {/* Foto de perfil */}
            <div style={{ height: '200px', position: 'relative', overflow: 'hidden', borderRadius: '24px' }}>
              {editedData.profileImage ? (
                <Image src={editedData.profileImage} alt="Foto de perfil" fill sizes="(max-width: 768px) 100vw, 400px" style={{ objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', backgroundColor: '#E5E7EB' }} />
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <input ref={profilePhotoInputRef} type="file" accept="image/jpeg,image/jpg,image/png" style={{ display: 'none' }} onChange={e => handleProfilePhotoUpload(e.target.files)} />
                <button onClick={() => !uploadingProfilePhoto && profilePhotoInputRef.current?.click()} className="px-5 py-2 rounded-full hover:opacity-90 transition-opacity flex items-center gap-2" style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.sm, backgroundColor: '#B45B39', color: '#fff', border: 'none', cursor: uploadingProfilePhoto ? 'wait' : 'pointer' }}>
                  {uploadingProfilePhoto ? 'Subiendo...' : 'Cambiar Foto'}
                </button>
              </div>
            </div>

            {/* Nombre (solo lectura en edición) */}
            <h1 style={{ fontFamily: 'Maitree, serif', fontSize: '32px', fontWeight: 600, color: '#244C87', textAlign: 'center' }}>{editedData.nombre} {editedData.apellido}</h1>

            {/* Teléfono */}
            <div>
              <label style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.sm, color: colors.neutral[600], display: 'block', marginBottom: '6px' }}>Teléfono laboral</label>
              <input type="tel" value={editedData.telefono} onChange={e => handleFieldChange('telefono', e.target.value)} className="w-full px-4 py-3 rounded-full border border-gray-300 focus:border-[#244C87] focus:outline-none" style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.base }} />
            </div>

            {/* Email (solo lectura) */}
            <div>
              <label style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.sm, color: colors.neutral[600], display: 'block', marginBottom: '6px' }}>Email</label>
              <input type="email" value={editedData.email} readOnly className="w-full px-4 py-3 rounded-full border border-gray-200 bg-gray-50" style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.base, color: colors.neutral[600] }} />
            </div>

            {/* Oficio principal (dropdown) */}
            <div>
              <label style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.sm, color: colors.neutral[600], display: 'block', marginBottom: '6px' }}>Oficio principal</label>
              <div className="relative">
                <input
                  ref={profesionInputRef}
                  type="text"
                  readOnly
                  value={profesionOpciones.find(o => o.value === editedData.serviceCategory)?.label ?? ''}
                  onMouseDown={() => setShowProfesionDropdown(v => !v)}
                  placeholder="Seleccionar oficio"
                  className="w-full px-4 py-3 rounded-full border border-gray-300 focus:border-[#244C87] focus:outline-none cursor-pointer"
                  style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.base }}
                />
                <svg className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
                {showProfesionDropdown && (
                  <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-2xl shadow-lg max-h-60 overflow-y-auto">
                    {profesionOpciones.map((opcion) => (
                      <div
                        key={opcion.value}
                        onMouseDown={() => {
                          setEditedData(prev => prev ? { ...prev, serviceCategory: opcion.value, specialties: [] } : prev);
                          setShowProfesionDropdown(false);
                        }}
                        className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors"
                        style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.base, color: '#000' }}
                      >
                        {opcion.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Años de experiencia */}
            <div className="flex items-center gap-4">
              <label style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.base, color: colors.neutral.black, whiteSpace: 'nowrap' }}>Años de experiencia</label>
              <input type="number" min={0} value={editedData.experiencia} onChange={e => handleFieldChange('experiencia', Number(e.target.value))} className="w-24 px-3 py-2 rounded-full border border-gray-300 focus:border-[#244C87] focus:outline-none text-center" style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.base }} />
            </div>

            {/* Servicios ofrecidos (especialidades) */}
            {editedData.serviceCategory && getEspecialidades(editedData.serviceCategory).length > 0 && (
              <div>
                <p style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.base, color: colors.neutral.black, marginBottom: '10px' }}>Servicios ofrecidos:</p>
                <SpecialtyChips
                  label=""
                  specialties={getEspecialidades(editedData.serviceCategory)}
                  selectedSpecialties={editedData.specialties || []}
                  onToggle={(specialty) => {
                    setEditedData(prev => {
                      if (!prev) return prev;
                      const current = prev.specialties || [];
                      return { ...prev, specialties: current.includes(specialty) ? current.filter(s => s !== specialty) : [...current, specialty] };
                    });
                  }}
                  required={false}
                />
              </div>
            )}

            {/* Agregar otra profesión (placeholder) */}
            <button type="button" style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.base, color: '#9CA3AF', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              Agregar otra Profesión +
            </button>

            {/* Ubicación */}
            <div style={{ position: 'relative' }}>
              <label style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.sm, color: colors.neutral[600], display: 'block', marginBottom: '6px' }}>Ubicación</label>
              <input
                type="text"
                value={editedData.ubicacion}
                onChange={e => handleUbicacionChange(e.target.value)}
                onFocus={() => { if (editedData.ubicacion) setMostrarUbicaciones(true); }}
                placeholder="Autocompleta"
                className="w-full px-4 py-3 rounded-full border border-gray-300 focus:border-[#244C87] focus:outline-none"
                style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.base }}
              />
              {mostrarUbicaciones && ubicacionesFiltradas.length > 0 && (
                <div className="absolute z-30 w-full mt-1 bg-white border border-gray-300 rounded-2xl shadow-lg max-h-60 overflow-y-auto">
                  {ubicacionesFiltradas.map(u => (
                    <div
                      key={u}
                      onMouseDown={() => seleccionarUbicacion(u)}
                      className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors"
                      style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.base }}
                    >
                      {u}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Radio de trabajo */}
            <div>
              <label style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.sm, color: colors.neutral[600], display: 'block', marginBottom: '6px' }}>Zonas de Trabajo:</label>
              <WorkZoneMap
                location={editedData.ubicacion || ''}
                radiusKm={editedData.alcanceTrabajo ? Number(editedData.alcanceTrabajo) : 10}
              />
            </div>

            {/* Galería */}
            <div>
              <h2 style={{ fontFamily: 'Maitree, serif', fontSize: '20px', fontWeight: 600, color: '#000', marginBottom: '12px' }}>Galería</h2>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {(editedData.portfolioImages ?? []).map((img) => (
                  <div key={img} className="relative flex-shrink-0" style={{ width: '160px', height: '120px', borderRadius: '16px', overflow: 'hidden' }}>
                    <Image src={img} alt="foto trabajo" fill sizes="160px" style={{ objectFit: 'cover' }} />
                    <button onClick={() => handleDeletePhoto(img)} className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center" style={{ cursor: 'pointer', border: 'none' }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    </button>
                  </div>
                ))}
                <div
                  className="flex-shrink-0 flex items-center justify-center border-2 border-dashed border-gray-300 hover:border-[#244C87] transition-colors cursor-pointer"
                  style={{ width: '160px', height: '120px', borderRadius: '16px' }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input ref={fileInputRef} type="file" accept="image/jpeg,image/jpg,image/png" multiple style={{ display: 'none' }} onChange={e => handlePhotoUpload(e.target.files)} />
                  {uploadingPhoto ? (
                    <div style={{ width: '20px', height: '20px', border: '2px solid #D1D5DB', borderTopColor: '#244C87', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  ) : (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
                  )}
                </div>
              </div>
            </div>

            {/* Descripción */}
            <div>
              <label style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.sm, color: colors.neutral[600], display: 'block', marginBottom: '6px' }}>Descripción:</label>
              <textarea value={editedData.descripcion} onChange={e => handleFieldChange('descripcion', e.target.value)} rows={6} className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:border-[#244C87] focus:outline-none resize-none" style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.base }} />
            </div>

          </div>

          {/* Botón Guardar fijo al fondo */}
          <div className="fixed bottom-0 left-0 right-0 px-4 py-4 bg-white border-t border-gray-100 flex justify-end max-w-xl mx-auto" style={{ boxShadow: '0 -2px 8px rgba(0,0,0,0.06)' }}>
            <button onClick={handleSaveEdit} className="px-6 py-3 rounded-full hover:opacity-90 transition-opacity" style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.base, color: '#fff', backgroundColor: '#B45B39', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
              Guardar Cambios
            </button>
          </div>
        </main>

      ) : (
        /* ═══════════════════════════════════════════
           MODO VISTA (igual que providers/[id])
        ═══════════════════════════════════════════ */
        <main className="flex-1" style={{ paddingTop: 'calc(6rem + 29px)' }}>
          <div className="w-full px-0 md:max-w-4xl md:mx-auto md:px-6">

            {/* Botón editar */}
            <div className="flex justify-center mb-4 px-4">
              <button onClick={handleEditClick} className="px-6 py-2 rounded-full bg-white hover:bg-gray-50 transition-colors" style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.base, color: colors.neutral.black, border: '2px solid #000000', cursor: 'pointer' }}>
                Editar Perfil
              </button>
            </div>

            <div className="bg-white md:rounded-3xl overflow-hidden md:border md:shadow-lg mb-8">
              {/* Foto principal */}
              <div className="relative overflow-hidden" style={{ width: '100%', height: '269px', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', backgroundColor: '#E5E7EB' }}>
                {currentData.profileImage ? (
                  <Image src={currentData.profileImage} alt={`${currentData.nombre} ${currentData.apellido}`} fill sizes="(max-width: 768px) 100vw, 480px" style={{ objectFit: 'cover', borderTopLeftRadius: '24px', borderTopRightRadius: '24px' }} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="#9CA3AF"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
                  </div>
                )}
              </div>

              <div className="p-4 md:p-8" style={{ paddingTop: '32px' }}>
                {/* Nombre */}
                <h1 className="text-center" style={{ fontFamily: 'Maitree, serif', fontWeight: 400, fontSize: 'clamp(28px, 5vw, 40px)', color: '#244C87', marginBottom: '32px', textTransform: 'capitalize' }}>
                  {currentData.nombre} {currentData.apellido}
                </h1>

                {/* Categoría y Ubicación */}
                <div style={{ paddingLeft: '10px', paddingRight: '32px' }}>
                  <p style={{ fontFamily: 'Maitree, serif', fontSize: '16px', fontWeight: 400, color: '#000000', marginBottom: '16px' }}>
                    {profesionLabel} profesional - {currentData.ubicacion || 'Ubicación no especificada'}
                  </p>
                </div>

                {/* Estrellas */}
                <div className="flex items-center gap-1" style={{ paddingLeft: '10px', marginBottom: '24px' }}>
                  {[...Array(5)].map((_, i) => (
                    <span key={i} style={{ color: '#DC5F00', fontSize: '24px' }}>★</span>
                  ))}
                </div>

                {/* Botón Pedir Presupuesto */}
                <div className="flex justify-end" style={{ marginBottom: '24px' }}>
                  {(() => {
                    try {
                      const viewerIdRaw = localStorage.getItem(PROVIDER_ID_KEY);
                      const viewerId = viewerIdRaw ? Number(viewerIdRaw) : null;
                      const isOwnerView = viewerId !== null && currentData && viewerId === currentData.id;
                      if (isOwnerView) return null;
                    } catch (e) {
                      // If any error, default to showing the button
                    }
                    return (
                      <button
                        onClick={() => {
                          const p = new URLSearchParams();
                          p.append('servicio', profesionLabel);
                          p.append('ubicacion', currentData.ubicacion || '');
                          p.append('professionals', currentData.id.toString());
                          router.push(`/job-request?${p.toString()}`);
                        }}
                        style={{ fontFamily: 'Maitree, serif', fontSize: '14px', fontWeight: 400, backgroundColor: '#244C87', color: '#FFFFFF', border: 'none', minWidth: '160px', height: '46px', borderRadius: '24px', cursor: 'pointer', padding: '10px 16px' }}
                      >
                        Pedir presupuesto
                      </button>
                    );
                  })()}
                </div>

                <div className="border-t border-gray-300 mb-6"></div>

                {/* Sellos */}
                <div className="flex items-center justify-center gap-6 mb-8">
                  <Image src="/ProfesionalTop.png" alt="Profesional Top" width={80} height={80} className="object-contain" />
                  <div className="relative w-20 h-20 rounded-full border-4 border-gray-300 flex items-center justify-center">
                    <span style={{ fontFamily: 'Maitree, serif', fontSize: '10px', fontWeight: 600, color: '#000', textAlign: 'center' }}>n°{String(currentData.id).padStart(6, '0')}</span>
                  </div>
                </div>

                {/* Experiencia */}
                <div className="mb-6" style={{ paddingLeft: '10px' }}>
                  <h2 style={{ fontFamily: 'Maitree, serif', fontSize: '20px', fontWeight: 600, color: '#000', marginBottom: '12px' }}>Experiencia profesional:</h2>
                  <p style={{ fontFamily: 'Maitree, serif', fontSize: '20px', fontWeight: 400, color: currentData.experiencia ? '#000' : '#999' }}>
                    {currentData.experiencia ? `${currentData.experiencia} años` : 'No agregó información aún'}
                  </p>
                </div>

                {/* Servicios */}
                <div className="mb-6" style={{ paddingLeft: '10px' }}>
                  <h2 style={{ fontFamily: 'Maitree, serif', fontSize: '20px', fontWeight: 600, color: '#000', marginBottom: '12px' }}>Servicios ofrecidos:</h2>
                  {currentData.specialties?.length > 0 ? (
                    <ul className="space-y-2">
                      {currentData.specialties.map(s => (
                        <li key={s} style={{ fontFamily: 'Maitree, serif', fontSize: '20px', fontWeight: 400, color: '#000' }}>• {s}</li>
                      ))}
                    </ul>
                  ) : (
                    <p style={{ fontFamily: 'Maitree, serif', fontSize: '20px', color: '#999' }}>No agregó información aún</p>
                  )}
                </div>

                {/* Zona de trabajo */}
                <div className="mb-6" style={{ paddingLeft: '10px' }}>
                  <h2 style={{ fontFamily: 'Maitree, serif', fontSize: '20px', fontWeight: 600, color: '#000', marginBottom: '12px' }}>Zonas de Trabajo:</h2>
                  {currentData.ubicacion ? (
                    <div>
                      <p style={{ fontFamily: 'Maitree, serif', fontSize: '20px', color: '#000', marginBottom: '12px' }}>
                        • {currentData.ubicacion}{currentData.alcanceTrabajo ? ` (Radio de ${currentData.alcanceTrabajo} km)` : ''}
                      </p>
                      <WorkZoneMap location={currentData.ubicacion || ''} radiusKm={currentData.alcanceTrabajo ? Number(currentData.alcanceTrabajo) : 10} />
                    </div>
                  ) : (
                    <p style={{ fontFamily: 'Maitree, serif', fontSize: '20px', color: '#999' }}>No agregó información aún</p>
                  )}
                </div>

                {/* Galería */}
                <div className="mb-6" style={{ paddingLeft: '10px' }}>
                  <h2 style={{ fontFamily: 'Maitree, serif', fontSize: '20px', fontWeight: 600, color: '#000', marginBottom: '16px' }}>Galería</h2>
                  {(currentData.portfolioImages ?? []).length > 0 ? (
                    <div className="flex gap-4 overflow-x-auto pb-4">
                      {currentData.portfolioImages!.map((photo, i) => (
                        <div key={photo} className="relative flex-shrink-0" style={{ width: '342px', height: '237px', borderRadius: '24px', overflow: 'hidden' }}>
                          <Image src={photo} alt={`Trabajo ${i + 1}`} fill sizes="342px" style={{ objectFit: 'cover', borderRadius: '24px' }} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ fontFamily: 'Maitree, serif', fontSize: '20px', color: '#999' }}>No agregó fotos aún</p>
                  )}
                </div>

                {/* Descripción */}
                {currentData.descripcion && (
                  <div className="mb-6" style={{ paddingLeft: '10px' }}>
                    <h2 style={{ fontFamily: 'Maitree, serif', fontSize: '20px', fontWeight: 600, color: '#000', marginBottom: '12px' }}>Descripción:</h2>
                    <p style={{ fontFamily: 'Maitree, serif', fontSize: '20px', fontWeight: 400, color: '#000', lineHeight: '1.5' }}>{currentData.descripcion}</p>
                  </div>
                )}

              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
