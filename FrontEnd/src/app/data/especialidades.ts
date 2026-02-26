// Especialidades por tipo de servicio/oficio

export const especialidadesPorServicio: Record<string, string[]> = {
  'Pintores': [
    'Pintura de interiores',
    'Pintura de exteriores',
    'Pintura de rejas y portones',
    'Pintura de techos',
    'Pintura decorativa',
    'Pintura de piletas',
    'Restauración y lijado',
    'Empapelado'
  ],
  
  'Albañiles': [
    'Reparación de paredes',
    'Construcción de paredes',
    'Colocación de aberturas',
    'Revoques',
    'Contrapisos',
    'Mampostería',
    'Demoliciones',
    'Reparación de techos'
  ],
  
  'Electricistas': [
    'Instalación eléctrica completa',
    'Reparación de instalaciones',
    'Tableros eléctricos',
    'Iluminación',
    'Porteros eléctricos',
    'Termotanques eléctricos',
    'Aires acondicionados',
    'Automatización'
  ],
  
  'Plomeros': [
    'Instalación de cañerías',
    'Reparación de pérdidas',
    'Destapaciones',
    'Instalación de termotanques',
    'Grifería',
    'Calefacción',
    'Gas',
    'Cloacas'
  ],
  
  'Carpinteros': [
    'Muebles a medida',
    'Reparación de muebles',
    'Placares',
    'Puertas',
    'Ventanas',
    'Deck y pérgolas',
    'Pisos de madera',
    'Trabajos de carpintería fina'
  ],
  
  'Herreros': [
    'Rejas de seguridad',
    'Portones',
    'Barandas',
    'Escaleras',
    'Estructuras metálicas',
    'Herrería artística',
    'Soldaduras',
    'Reparaciones'
  ],
  
  'Limpiadores': [
    'Limpieza general',
    'Limpieza profunda',
    'Limpieza post obra',
    'Limpieza de vidrios',
    'Limpieza de alfombras',
    'Limpieza de tapizados',
    'Desinfección',
    'Limpieza de jardines'
  ],
  
  'Jardineros': [
    'Mantenimiento de jardines',
    'Poda de árboles',
    'Corte de césped',
    'Diseño de jardines',
    'Riego automático',
    'Plantación',
    'Fumigación',
    'Paisajismo'
  ],
  
  'Masajistas': [
    'Masajes relajantes',
    'Masajes descontracturantes',
    'Masajes deportivos',
    'Reflexología',
    'Quiropraxia',
    'Masajes con piedras calientes',
    'Drenaje linfático',
    'Masajes terapéuticos'
  ],
  
  'Profesores': [
    'Apoyo escolar primario',
    'Apoyo escolar secundario',
    'Matemáticas',
    'Inglés',
    'Informática',
    'Música',
    'Deportes',
    'Arte'
  ],
  
  'Modistas': [
    'Confección a medida',
    'Arreglos de ropa',
    'Costura de cortinas',
    'Bordados',
    'Vestidos de fiesta',
    'Trajes',
    'Reparaciones',
    'Tapicería'
  ]
};

// Mapeo de nombres de servicios de la base de datos a claves del objeto
const servicioMapping: Record<string, string> = {
  'PLOMERIA': 'Plomeros',
  'ELECTRICIDAD': 'Electricistas',
  'PINTURA': 'Pintores',
  'ALBANILERIA': 'Albañiles',
  'CARPINTERIA': 'Carpinteros',
  'HERRERIA': 'Herreros',
  'LIMPIEZA': 'Limpiadores',
  'JARDINERIA': 'Jardineros',
  'MASAJES': 'Masajistas',
  'CLASES': 'Profesores',
  'COSTURA': 'Modistas',
  // También aceptar las claves directamente
  'Plomeros': 'Plomeros',
  'Electricistas': 'Electricistas',
  'Pintores': 'Pintores',
  'Albañiles': 'Albañiles',
  'Carpinteros': 'Carpinteros',
  'Herreros': 'Herreros',
  'Limpiadores': 'Limpiadores',
  'Jardineros': 'Jardineros',
  'Masajistas': 'Masajistas',
  'Profesores': 'Profesores',
  'Modistas': 'Modistas'
};

// Función helper para obtener especialidades
export const getEspecialidades = (servicio: string): string[] => {
  // Normalizar el nombre del servicio
  const servicioNormalizado = servicioMapping[servicio] || servicio;
  return especialidadesPorServicio[servicioNormalizado] || [];
};
