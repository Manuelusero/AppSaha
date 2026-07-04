# 📦 Componentes Reutilizables - Provider Signup

## Componentes Creados

Hemos dividido el formulario de registro de proveedores (antes 1,451 líneas) en **componentes reutilizables** más pequeños y mantenibles.

---

## 1. **PasswordInput**

Input de contraseña con toggle show/hide y validación visual.

### Props

```typescript
interface PasswordInputProps {
  label: string; // Etiqueta del campo
  value: string; // Valor actual
  onChange: (value: string) => void; // Callback al cambiar
  name: string; // Nombre del input (para forms)
  placeholder?: string; // Placeholder (default: "••••••")
  required?: boolean; // ¿Es obligatorio? (default: true)
  showRequirements?: boolean; // ¿Mostrar requisitos? (default: false)
  minLength?: number; // Longitud mínima (default: 6)
}
```

### Uso

```tsx
import { PasswordInput } from "@/components/provider-signup";

<PasswordInput
  label="Contraseña"
  value={password}
  onChange={(val) => setPassword(val)}
  name="password"
  showRequirements={true}
/>;
```

---

## 2. **ProfessionSelector**

Selector de profesión con dropdown personalizado.

### Props

```typescript
interface ProfessionSelectorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[]; // Lista de profesiones
  placeholder?: string;
  required?: boolean;
}
```

### Uso

```tsx
import { ProfessionSelector } from "@/components/provider-signup";

const profesiones = ["Plomeros", "Electricistas", "Carpinteros"];

<ProfessionSelector
  label="Profesión / Oficio"
  value={profesion}
  onChange={(val) => setProfesion(val)}
  options={profesiones}
/>;
```

---

## 3. **SpecialtyChips**

Chips seleccionables para especialidades (multi-selección).

### Props

```typescript
interface SpecialtyChipsProps {
  label: string;
  specialties: string[]; // Lista de especialidades disponibles
  selectedSpecialties: string[]; // Especialidades seleccionadas
  onToggle: (specialty: string) => void; // Callback al seleccionar/deseleccionar
  required?: boolean;
}
```

### Uso

```tsx
import { SpecialtyChips } from "@/components/provider-signup";

const especialidades = ["Instalación", "Reparación", "Mantenimiento"];
const [selected, setSelected] = useState<string[]>([]);

const handleToggle = (esp: string) => {
  if (selected.includes(esp)) {
    setSelected(selected.filter((e) => e !== esp));
  } else {
    setSelected([...selected, esp]);
  }
};

<SpecialtyChips
  label="Especialidades"
  specialties={especialidades}
  selectedSpecialties={selected}
  onToggle={handleToggle}
/>;
```

---

## 4. **LocationAutocomplete**

Input con autocompletado para ubicaciones (ciudades).

### Props

```typescript
interface LocationAutocompleteProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  locations: string[]; // Lista de ubicaciones
  placeholder?: string;
  required?: boolean;
  maxResults?: number; // Máx resultados mostrados (default: 5)
}
```

### Uso

```tsx
import { LocationAutocomplete } from '@/components/provider-signup';

const ciudades = ['Buenos Aires, Buenos Aires', 'Córdoba, Córdoba', ...];

<LocationAutocomplete
  label="Ubicación"
  value={ubicacion}
  onChange={(val) => setUbicacion(val)}
  locations={ciudades}
  maxResults={5}
/>
```

---

## 5. **FileUpload**

Input de archivo con validación de tamaño y preview opcional.

### Props

```typescript
interface FileUploadProps {
  label: string;
  value: File | null;
  onChange: (file: File | null) => void;
  accept?: string; // Tipos aceptados (default: "image/*")
  required?: boolean;
  showPreview?: boolean; // ¿Mostrar preview? (default: false)
  maxSizeMB?: number; // Tamaño máximo en MB (default: 1.5)
}
```

### Uso

```tsx
import { FileUpload } from "@/components/provider-signup";

<FileUpload
  label="Foto de Perfil"
  value={fotoPerfil}
  onChange={(file) => setFotoPerfil(file)}
  accept="image/*"
  showPreview={true}
  maxSizeMB={1.5}
/>;
```

---

## Beneficios de la Refactorización

### ✅ Antes

- **1 archivo monolítico**: 1,451 líneas
- Código duplicado (3 inputs de password, 2 dropdowns personalizados)
- Difícil de testear y mantener

### ✅ Después

- **5 componentes reutilizables**: ~100-150 líneas cada uno
- **DRY**: Sin código duplicado
- **Testeable**: Cada componente se puede testear independientemente
- **Reutilizable**: Se pueden usar en otros formularios (ej: client signup, profile edit)

---

## Próximos Pasos

1. **Integrar en provider-signup/page.tsx**
   - Reemplazar código duplicado con estos componentes
   - Reducir el archivo principal de 1,451 → ~600 líneas

2. **Testing**
   - Crear tests unitarios para cada componente
   - Verificar validaciones y estados

3. **Documentación**
   - Agregar Storybook para visualizar componentes
   - Ejemplos de uso en diferentes contextos

---

## Ejemplo Completo

```tsx
"use client";

import { useState } from "react";
import {
  PasswordInput,
  ProfessionSelector,
  SpecialtyChips,
  LocationAutocomplete,
  FileUpload,
} from "@/components/provider-signup";

export default function MyForm() {
  const [formData, setFormData] = useState({
    password: "",
    profession: "",
    specialties: [] as string[],
    location: "",
    foto: null as File | null,
  });

  return (
    <form>
      <ProfessionSelector
        label="Profesión"
        value={formData.profession}
        onChange={(val) => setFormData({ ...formData, profession: val })}
        options={["Plomeros", "Electricistas"]}
      />

      <SpecialtyChips
        label="Especialidades"
        specialties={["Instalación", "Reparación"]}
        selectedSpecialties={formData.specialties}
        onToggle={(esp) => {
          const updated = formData.specialties.includes(esp)
            ? formData.specialties.filter((e) => e !== esp)
            : [...formData.specialties, esp];
          setFormData({ ...formData, specialties: updated });
        }}
      />

      <LocationAutocomplete
        label="Ubicación"
        value={formData.location}
        onChange={(val) => setFormData({ ...formData, location: val })}
        locations={["Buenos Aires", "Córdoba"]}
      />

      <FileUpload
        label="Foto"
        value={formData.foto}
        onChange={(file) => setFormData({ ...formData, foto: file })}
        showPreview={true}
      />

      <PasswordInput
        label="Contraseña"
        value={formData.password}
        onChange={(val) => setFormData({ ...formData, password: val })}
        name="password"
        showRequirements={true}
      />

      <button type="submit">Registrarse</button>
    </form>
  );
}
```

---

**Última actualización:** 4 de mayo de 2026
