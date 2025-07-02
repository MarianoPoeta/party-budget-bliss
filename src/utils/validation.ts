import { ValidationError } from '../types/EnhancedBudget';

export interface ValidationRule<T> {
  field: keyof T;
  validate: (value: unknown, formData: T) => string | null;
  required?: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export class ValidationService {
  static validateRequired(value: unknown, fieldName: string): string | null {
    if (value === null || value === undefined) {
      return `${fieldName} is required`;
    }
    
    if (typeof value === 'string' && !value.trim()) {
      return `${fieldName} cannot be empty`;
    }
    
    if (typeof value === 'number' && value <= 0) {
      return `${fieldName} must be greater than 0`;
    }
    
    return null;
  }

  static validateEmail(email: string): string | null {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return null;
  }

  static validateDate(date: string, allowPast = false): string | null {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return 'Please enter a valid date';
    }
    
    if (!allowPast) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (dateObj < today) {
        return 'Date cannot be in the past';
      }
    }
    
    return null;
  }

  static validateNumber(value: number, min?: number, max?: number): string | null {
    if (typeof value !== 'number' || isNaN(value)) {
      return 'Please enter a valid number';
    }
    
    if (min !== undefined && value < min) {
      return `Value must be at least ${min}`;
    }
    
    if (max !== undefined && value > max) {
      return `Value must be no more than ${max}`;
    }
    
    return null;
  }

  static validateString(value: string, minLength?: number, maxLength?: number): string | null {
    if (typeof value !== 'string') {
      return 'Please enter a valid text';
    }
    
    if (minLength !== undefined && value.length < minLength) {
      return `Text must be at least ${minLength} characters long`;
    }
    
    if (maxLength !== undefined && value.length > maxLength) {
      return `Text must be no more than ${maxLength} characters long`;
    }
    
    return null;
  }

  static validateBudget(budget: {
    clientName: string;
    eventDate: string;
    guestCount: number;
    selectedMeals: unknown[];
    selectedActivities: unknown[];
    selectedTransport: unknown[];
    selectedStay?: unknown;
  }): ValidationResult {
    const errors: ValidationError[] = [];

    // Basic info validation
    const clientNameError = this.validateRequired(budget.clientName, 'Client name');
    if (clientNameError) {
      errors.push({
        section: 'basicInfo',
        message: clientNameError,
        severity: 'error'
      });
    }

    const eventDateError = this.validateDate(budget.eventDate, false);
    if (eventDateError) {
      errors.push({
        section: 'basicInfo',
        message: eventDateError,
        severity: 'error'
      });
    }

    const guestCountError = this.validateNumber(budget.guestCount, 1);
    if (guestCountError) {
      errors.push({
        section: 'basicInfo',
        message: guestCountError,
        severity: 'error'
      });
    }

    // Check if budget has any items
    const hasItems = (budget.selectedMeals?.length || 0) + 
                    (budget.selectedActivities?.length || 0) + 
                    (budget.selectedTransport?.length || 0) + 
                    (budget.selectedStay ? 1 : 0) > 0;

    if (!hasItems) {
      errors.push({
        section: 'items',
        message: 'Budget must include at least one meal, activity, transport, or accommodation',
        severity: 'warning'
      });
    }

    return {
      isValid: errors.filter(e => e.severity === 'error').length === 0,
      errors
    };
  }

  static validateForm<T extends Record<string, unknown>>(
    data: T,
    rules: ValidationRule<T>[]
  ): ValidationResult {
    const errors: ValidationError[] = [];

    rules.forEach(rule => {
      const value = data[rule.field];
      
      // Check required fields
      if (rule.required) {
        const requiredError = this.validateRequired(value, String(rule.field));
        if (requiredError) {
          errors.push({
            section: String(rule.field),
            message: requiredError,
            severity: 'error'
          });
          return; // Skip custom validation if required check fails
        }
      }

      // Run custom validation
      const customError = rule.validate(value, data);
      if (customError) {
        errors.push({
          section: String(rule.field),
          message: customError,
          severity: 'error'
        });
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Common validation rules
export const commonValidationRules = {
  required: (fieldName: string) => ({
    field: fieldName as keyof any,
    required: true,
    validate: (value: unknown) => ValidationService.validateRequired(value, fieldName)
  }),
  
  email: (fieldName: string) => ({
    field: fieldName as keyof any,
    required: true,
    validate: (value: unknown) => {
      const requiredError = ValidationService.validateRequired(value, fieldName);
      if (requiredError) return requiredError;
      return ValidationService.validateEmail(value as string);
    }
  }),
  
  date: (fieldName: string, allowPast = false) => ({
    field: fieldName as keyof any,
    required: true,
    validate: (value: unknown) => {
      const requiredError = ValidationService.validateRequired(value, fieldName);
      if (requiredError) return requiredError;
      return ValidationService.validateDate(value as string, allowPast);
    }
  }),
  
  number: (fieldName: string, min?: number, max?: number) => ({
    field: fieldName as keyof any,
    required: true,
    validate: (value: unknown) => {
      const requiredError = ValidationService.validateRequired(value, fieldName);
      if (requiredError) return requiredError;
      return ValidationService.validateNumber(value as number, min, max);
    }
  }),
  
  string: (fieldName: string, minLength?: number, maxLength?: number) => ({
    field: fieldName as keyof any,
    required: true,
    validate: (value: unknown) => {
      const requiredError = ValidationService.validateRequired(value, fieldName);
      if (requiredError) return requiredError;
      return ValidationService.validateString(value as string, minLength, maxLength);
    }
  })
}; 