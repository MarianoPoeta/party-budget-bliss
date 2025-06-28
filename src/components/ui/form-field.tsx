
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface FormFieldProps {
  label: string;
  id: string;
  error?: string | null;
  success?: string | null;
  required?: boolean;
  description?: string;
  className?: string;
  children?: React.ReactNode;
}

export const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ label, id, error, success, required, description, className, children }, ref) => {
    const hasError = !!error;
    const hasSuccess = !!success && !hasError;

    return (
      <div ref={ref} className={cn('space-y-2', className)}>
        <Label 
          htmlFor={id}
          className={cn(
            'text-sm font-medium',
            hasError && 'text-red-600',
            hasSuccess && 'text-green-600'
          )}
        >
          {label}
          {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
        </Label>
        
        <div className="relative">
          {children}
          
          {/* Status icon */}
          {(hasError || hasSuccess) && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {hasError && <AlertCircle className="h-4 w-4 text-red-500" aria-hidden="true" />}
              {hasSuccess && <CheckCircle2 className="h-4 w-4 text-green-500" aria-hidden="true" />}
            </div>
          )}
        </div>

        {/* Description */}
        {description && !error && !success && (
          <p className="text-sm text-slate-600" id={`${id}-description`}>
            {description}
          </p>
        )}

        {/* Error message */}
        {error && (
          <p 
            className="text-sm text-red-600 flex items-center gap-1" 
            id={`${id}-error`}
            role="alert"
            aria-live="polite"
          >
            <AlertCircle className="h-3 w-3" aria-hidden="true" />
            {error}
          </p>
        )}

        {/* Success message */}
        {success && !error && (
          <p 
            className="text-sm text-green-600 flex items-center gap-1" 
            id={`${id}-success`}
            role="status"
            aria-live="polite"
          >
            <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
            {success}
          </p>
        )}
      </div>
    );
  }
);
FormField.displayName = 'FormField';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string | null;
  success?: string | null;
  description?: string;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, success, description, required, className, id, ...props }, ref) => {
    const fieldId = id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`;
    
    return (
      <FormField
        label={label}
        id={fieldId}
        error={error}
        success={success}
        required={required}
        description={description}
        className={className}
      >
        <Input
          ref={ref}
          id={fieldId}
          className={cn(
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            success && !error && 'border-green-500 focus:border-green-500 focus:ring-green-500'
          )}
          aria-invalid={!!error}
          aria-describedby={cn(
            description && `${fieldId}-description`,
            error && `${fieldId}-error`,
            success && !error && `${fieldId}-success`
          )}
          {...props}
        />
      </FormField>
    );
  }
);
FormInput.displayName = 'FormInput';

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string | null;
  success?: string | null;
  description?: string;
}

export const FormTextarea = React.forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, error, success, description, required, className, id, ...props }, ref) => {
    const fieldId = id || `textarea-${label.toLowerCase().replace(/\s+/g, '-')}`;
    
    return (
      <FormField
        label={label}
        id={fieldId}
        error={error}
        success={success}
        required={required}
        description={description}
        className={className}
      >
        <Textarea
          ref={ref}
          id={fieldId}
          className={cn(
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            success && !error && 'border-green-500 focus:border-green-500 focus:ring-green-500'
          )}
          aria-invalid={!!error}
          aria-describedby={cn(
            description && `${fieldId}-description`,
            error && `${fieldId}-error`,
            success && !error && `${fieldId}-success`
          )}
          {...props}
        />
      </FormField>
    );
  }
);
FormTextarea.displayName = 'FormTextarea';
