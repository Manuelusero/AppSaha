'use client';

import { useState, useCallback, ChangeEvent } from 'react';

type FormValues = Record<string, any>;
type FormErrors = Record<string, string>;
type ValidationRules<T> = Partial<Record<keyof T, (value: any, allValues: T) => string | undefined>>;

interface UseFormOptions<T extends FormValues> {
  initialValues: T;
  validate?: ValidationRules<T>;
  onSubmit: (values: T) => void | Promise<void>;
}

interface UseFormReturn<T extends FormValues> {
  values: T;
  errors: FormErrors;
  loading: boolean;
  touched: Record<keyof T, boolean>;
  handleChange: (name: keyof T) => (value: any) => void;
  handleChangeEvent: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleBlur: (name: keyof T) => () => void;
  handleSubmit: (e?: React.FormEvent) => Promise<void>;
  setFieldValue: (name: keyof T, value: any) => void;
  setFieldError: (name: keyof T, error: string) => void;
  resetForm: () => void;
  isValid: boolean;
}

/**
 * Hook personalizado para manejo de formularios con validación
 * 
 * @param options - Opciones de configuración
 * @param options.initialValues - Valores iniciales del formulario
 * @param options.validate - Funciones de validación por campo
 * @param options.onSubmit - Función a ejecutar al enviar el formulario
 * 
 * @example
 * ```tsx
 * const { values, errors, handleChange, handleSubmit } = useForm({
 *   initialValues: { email: '', password: '' },
 *   validate: {
 *     email: (value) => !value ? 'Email requerido' : undefined,
 *     password: (value) => value.length < 6 ? 'Mínimo 6 caracteres' : undefined
 *   },
 *   onSubmit: async (values) => {
 *     await login(values);
 *   }
 * });
 * 
 * // En el JSX:
 * <input value={values.email} onChange={handleChangeEvent} name="email" />
 * {errors.email && <span>{errors.email}</span>}
 * <button onClick={handleSubmit}>Enviar</button>
 * ```
 */
export function useForm<T extends FormValues>(
  options: UseFormOptions<T>
): UseFormReturn<T> {
  const { initialValues, validate, onSubmit } = options;

  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<keyof T, boolean>>({} as Record<keyof T, boolean>);
  const [loading, setLoading] = useState(false);

  // Validar un campo específico
  const validateField = useCallback(
    (name: keyof T, value: any): string | undefined => {
      if (!validate || !validate[name]) return undefined;
      return validate[name]!(value, values);
    },
    [validate, values]
  );

  // Validar todos los campos
  const validateAllFields = useCallback((): boolean => {
    if (!validate) return true;

    const newErrors: FormErrors = {};
    let isValid = true;

    Object.keys(validate).forEach((key) => {
      const error = validateField(key as keyof T, values[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [validate, validateField, values]);

  // Manejar cambio de campo (para componentes controlados)
  const handleChange = useCallback(
    (name: keyof T) => (value: any) => {
      setValues((prev) => ({ ...prev, [name]: value }));

      // Validar el campo si ya fue tocado
      if (touched[name]) {
        const error = validateField(name, value);
        setErrors((prev) => ({
          ...prev,
          [name]: error || '',
        }));
      }
    },
    [touched, validateField]
  );

  // Manejar cambio de evento (para inputs nativos)
  const handleChangeEvent = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
      
      handleChange(name as keyof T)(finalValue);
    },
    [handleChange]
  );

  // Manejar blur (marcar campo como tocado)
  const handleBlur = useCallback(
    (name: keyof T) => () => {
      setTouched((prev) => ({ ...prev, [name]: true }));

      // Validar el campo al perder el foco
      const error = validateField(name, values[name]);
      if (error) {
        setErrors((prev) => ({ ...prev, [name]: error }));
      }
    },
    [validateField, values]
  );

  // Establecer valor de campo manualmente
  const setFieldValue = useCallback(
    (name: keyof T, value: any) => {
      handleChange(name)(value);
    },
    [handleChange]
  );

  // Establecer error de campo manualmente
  const setFieldError = useCallback((name: keyof T, error: string) => {
    setErrors((prev) => ({ ...prev, [name]: error }));
  }, []);

  // Resetear formulario
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({} as Record<keyof T, boolean>);
    setLoading(false);
  }, [initialValues]);

  // Manejar submit
  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) {
        e.preventDefault();
      }

      // Marcar todos los campos como tocados
      const allTouched = Object.keys(initialValues).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {} as Record<keyof T, boolean>
      );
      setTouched(allTouched);

      // Validar formulario
      const isValid = validateAllFields();
      if (!isValid) {
        return;
      }

      // Ejecutar onSubmit
      try {
        setLoading(true);
        await onSubmit(values);
      } catch (error) {
        console.error('Error al enviar formulario:', error);
      } finally {
        setLoading(false);
      }
    },
    [initialValues, validateAllFields, onSubmit, values]
  );

  // Verificar si el formulario es válido
  const isValid = Object.keys(errors).length === 0;

  return {
    values,
    errors,
    loading,
    touched,
    handleChange,
    handleChangeEvent,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    resetForm,
    isValid,
  };
}
