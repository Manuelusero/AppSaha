'use client';

import { useState } from 'react';
import { colors, typography } from '@/styles/tokens';

interface FileUploadProps {
  label: string;
  value: File | null;
  onChange: (file: File | null) => void;
  accept?: string;
  required?: boolean;
  showPreview?: boolean;
  maxSizeMB?: number;
}

/**
 * Input de archivo con validación de tamaño y preview opcional
 */
export default function FileUpload({
  label,
  value,
  onChange,
  accept = 'image/*',
  required = false,
  showPreview = false,
  maxSizeMB = 1.5
}: FileUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const validateFileSize = (file: File): boolean => {
    const maxBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      alert(
        `El archivo "${file.name}" es muy pesado. Tamaño máximo: ${maxSizeMB}MB. Tamaño actual: ${(
          file.size /
          1024 /
          1024
        ).toFixed(2)}MB`
      );
      return false;
    }
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (file && !validateFileSize(file)) {
      e.target.value = ''; // Reset input
      return;
    }

    onChange(file);

    // Generate preview for images
    if (file && showPreview && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleRemove = () => {
    onChange(null);
    setPreviewUrl(null);
  };

  return (
    <div>
      <label
        className="block mb-2"
        style={{
          fontFamily: typography.fontFamily.primary,
          fontSize: typography.fontSize.base,
          color: colors.neutral.black
        }}
      >
        {label} {required && '*'}
      </label>

      <div className="flex items-start gap-4">
        <input
          type="file"
          onChange={handleFileChange}
          accept={accept}
          required={required && !value}
          className="w-full px-4 py-3 rounded-full border-2 border-gray-300 focus:border-[#244C87] focus:outline-none"
          style={{
            fontFamily: typography.fontFamily.primary,
            fontSize: typography.fontSize.base
          }}
        />

        {value && (
          <button
            type="button"
            onClick={handleRemove}
            className="px-3 py-2 text-sm text-red-600 hover:text-red-800 border border-red-600 rounded-full"
            style={{ fontFamily: typography.fontFamily.primary }}
          >
            Eliminar
          </button>
        )}
      </div>

      {value && !previewUrl && (
        <p className="mt-2 text-sm text-gray-600" style={{ fontFamily: typography.fontFamily.primary }}>
          Archivo seleccionado: {value.name} ({(value.size / 1024).toFixed(2)} KB)
        </p>
      )}

      {previewUrl && (
        <div className="mt-4">
          <img
            src={previewUrl}
            alt="Preview"
            className="max-w-xs max-h-48 rounded-lg border-2 border-gray-300"
          />
        </div>
      )}

      <p className="mt-1 text-xs text-gray-500" style={{ fontFamily: typography.fontFamily.primary }}>
        Tamaño máximo: {maxSizeMB}MB
      </p>
    </div>
  );
}
