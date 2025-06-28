
import { useState, useCallback } from 'react';

export interface ValidationRule<T> {
  field: keyof T;
  validate: (value: any, formData: T) => string | null;
  required?: boolean;
}

export interface ValidationError {
  field: string;
  message: string;
  type: 'error' | 'warning';
}

export function useFormValidation<T extends Record<string, any>>(
  initialData: T,
  rules: ValidationRule<T>[]
) {
  const [data, setData] = useState<T>(initialData);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [touched, setTouched] = useState<Set<keyof T>>(new Set());
  const [isValidating, setIsValidating] = useState(false);

  const validateField = useCallback((field: keyof T, value: any, showError = true): string | null => {
    const rule = rules.find(r => r.field === field);
    if (!rule) return null;

    // Check required fields
    if (rule.required && (!value || (typeof value === 'string' && !value.trim()))) {
      const error = `${String(field)} is required`;
      if (showError) {
        setErrors(prev => [
          ...prev.filter(e => e.field !== String(field)),
          { field: String(field), message: error, type: 'error' }
        ]);
      }
      return error;
    }

    // Run custom validation
    const error = rule.validate(value, { ...data, [field]: value });
    if (showError) {
      setErrors(prev => error 
        ? [...prev.filter(e => e.field !== String(field)), { field: String(field), message: error, type: 'error' }]
        : prev.filter(e => e.field !== String(field))
      );
    }
    
    return error;
  }, [rules, data]);

  const validateAll = useCallback((): boolean => {
    setIsValidating(true);
    const newErrors: ValidationError[] = [];

    rules.forEach(rule => {
      const value = data[rule.field];
      const error = validateField(rule.field, value, false);
      if (error) {
        newErrors.push({
          field: String(rule.field),
          message: error,
          type: 'error'
        });
      }
    });

    setErrors(newErrors);
    setIsValidating(false);
    return newErrors.length === 0;
  }, [data, rules, validateField]);

  const updateField = useCallback((field: keyof T, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
    setTouched(prev => new Set(prev).add(field));
    
    // Validate on change if field was already touched
    if (touched.has(field)) {
      setTimeout(() => validateField(field, value), 0);
    }
  }, [touched, validateField]);

  const getFieldError = useCallback((field: keyof T): string | null => {
    const error = errors.find(e => e.field === String(field));
    return error ? error.message : null;
  }, [errors]);

  const hasFieldError = useCallback((field: keyof T): boolean => {
    return errors.some(e => e.field === String(field));
  }, [errors]);

  const reset = useCallback(() => {
    setData(initialData);
    setErrors([]);
    setTouched(new Set());
    setIsValidating(false);
  }, [initialData]);

  return {
    data,
    errors,
    touched,
    isValidating,
    updateField,
    validateField,
    validateAll,
    getFieldError,
    hasFieldError,
    reset,
    isValid: errors.length === 0
  };
}
