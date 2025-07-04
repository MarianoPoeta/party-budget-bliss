import React, { useRef, useEffect, useState } from 'react';
import { cn } from '../../lib/utils';

// Skip Link for keyboard navigation
export const SkipLink: React.FC<{
  href: string;
  children: React.ReactNode;
  className?: string;
}> = ({ href, children, className }) => (
  <a
    href={href}
    className={cn(
      'absolute left-4 top-4 z-50 -translate-y-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground',
      'transition-transform focus:translate-y-0',
      'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
      className
    )}
  >
    {children}
  </a>
);

// Focus Trap for modals and dialogs
export const FocusTrap: React.FC<{
  children: React.ReactNode;
  isActive?: boolean;
}> = ({ children, isActive = true }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [focusableElements, setFocusableElements] = useState<HTMLElement[]>([]);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const elements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;

    setFocusableElements(Array.from(elements));

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isActive, focusableElements]);

  return <div ref={containerRef}>{children}</div>;
};

// Live Region for screen reader announcements
export const LiveRegion: React.FC<{
  children: React.ReactNode;
  'aria-live'?: 'polite' | 'assertive' | 'off';
  'aria-atomic'?: boolean;
  className?: string;
}> = ({ 
  children, 
  'aria-live': ariaLive = 'polite', 
  'aria-atomic': ariaAtomic = true,
  className 
}) => (
  <div
    aria-live={ariaLive}
    aria-atomic={ariaAtomic}
    className={cn('sr-only', className)}
  >
    {children}
  </div>
);

// Accessible Button with proper ARIA attributes
export const AccessibleButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-expanded'?: boolean;
  'aria-pressed'?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}> = ({
  children,
  onClick,
  disabled,
  loading,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedby,
  'aria-expanded': ariaExpanded,
  'aria-pressed': ariaPressed,
  className,
  type = 'button'
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled || loading}
    aria-label={ariaLabel}
    aria-describedby={ariaDescribedby}
    aria-expanded={ariaExpanded}
    aria-pressed={ariaPressed}
    className={cn(
      'inline-flex items-center justify-center rounded-md text-sm font-medium',
      'transition-colors focus-visible:outline-none focus-visible:ring-2',
      'focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50',
      className
    )}
  >
    {loading ? (
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
        <span>Cargando...</span>
      </div>
    ) : (
      children
    )}
  </button>
);

// Accessible Input with proper labeling
export const AccessibleInput: React.FC<{
  id: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  'aria-describedby'?: string;
  className?: string;
}> = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  error,
  required,
  placeholder,
  'aria-describedby': ariaDescribedby,
  className
}) => {
  const errorId = `${id}-error`;
  const descriptionId = `${id}-description`;

  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        required={required}
        aria-describedby={error ? errorId : ariaDescribedby || descriptionId}
        aria-invalid={!!error}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
          'ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium',
          'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2',
          'focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-destructive',
          className
        )}
      />
      {error && (
        <p id={errorId} className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

// Accessible Select with proper ARIA attributes
export const AccessibleSelect: React.FC<{
  id: string;
  label: string;
  value?: string;
  onChange?: (value: string) => void;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  error?: string;
  required?: boolean;
  placeholder?: string;
  'aria-describedby'?: string;
  className?: string;
}> = ({
  id,
  label,
  value,
  onChange,
  options,
  error,
  required,
  placeholder,
  'aria-describedby': ariaDescribedby,
  className
}) => {
  const errorId = `${id}-error`;

  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        required={required}
        aria-describedby={error ? errorId : ariaDescribedby}
        aria-invalid={!!error}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
          'ring-offset-background focus-visible:outline-none focus-visible:ring-2',
          'focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-destructive',
          className
        )}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={errorId} className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

// Accessible Checkbox with proper labeling
export const AccessibleCheckbox: React.FC<{
  id: string;
  label: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  required?: boolean;
  'aria-describedby'?: string;
  className?: string;
}> = ({
  id,
  label,
  checked,
  onChange,
  disabled,
  required,
  'aria-describedby': ariaDescribedby,
  className
}) => (
  <div className={cn('flex items-center space-x-2', className)}>
    <input
      id={id}
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange?.(e.target.checked)}
      disabled={disabled}
      required={required}
      aria-describedby={ariaDescribedby}
      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
    />
    <label
      htmlFor={id}
      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >
      {label}
      {required && <span className="text-destructive ml-1">*</span>}
    </label>
  </div>
);

// Accessible Radio Group
export const AccessibleRadioGroup: React.FC<{
  name: string;
  label: string;
  value?: string;
  onChange?: (value: string) => void;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  required?: boolean;
  'aria-describedby'?: string;
  className?: string;
}> = ({
  name,
  label,
  value,
  onChange,
  options,
  required,
  'aria-describedby': ariaDescribedby,
  className
}) => (
  <fieldset className={cn('space-y-2', className)}>
    <legend className="text-sm font-medium leading-none">
      {label}
      {required && <span className="text-destructive ml-1">*</span>}
    </legend>
    <div className="space-y-2">
      {options.map((option) => (
        <div key={option.value} className="flex items-center space-x-2">
          <input
            id={`${name}-${option.value}`}
            name={name}
            type="radio"
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange?.(e.target.value)}
            disabled={option.disabled}
            required={required}
            aria-describedby={ariaDescribedby}
            className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
          />
          <label
            htmlFor={`${name}-${option.value}`}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {option.label}
          </label>
        </div>
      ))}
    </div>
  </fieldset>
);

// Accessible Dialog/Modal
export const AccessibleDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  'aria-describedby'?: string;
  className?: string;
}> = ({
  isOpen,
  onClose,
  title,
  children,
  'aria-describedby': ariaDescribedby,
  className
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      aria-describedby={ariaDescribedby}
    >
      <FocusTrap>
        <div
          ref={dialogRef}
          className={cn(
            'relative w-full max-w-md rounded-lg border bg-card p-6 shadow-lg',
            className
          )}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 id="dialog-title" className="text-lg font-semibold">
              {title}
            </h2>
            <AccessibleButton
              onClick={onClose}
              aria-label="Cerrar diálogo"
              className="h-6 w-6 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              ×
            </AccessibleButton>
          </div>
          <div>{children}</div>
        </div>
      </FocusTrap>
    </div>
  );
};

// Accessible Tooltip
export const AccessibleTooltip: React.FC<{
  children: React.ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}> = ({ children, content, position = 'top', className }) => {
  const [isVisible, setIsVisible] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  return (
    <div
      ref={triggerRef}
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          role="tooltip"
          className={cn(
            'absolute z-50 px-2 py-1 text-xs text-white bg-gray-900 rounded shadow-lg',
            'whitespace-nowrap pointer-events-none',
            positionClasses[position],
            className
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
}; 