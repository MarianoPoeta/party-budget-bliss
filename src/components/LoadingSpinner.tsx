import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  text = 'Loading...', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-600 mb-2`} />
      {text && (
        <p className="text-sm text-slate-600 animate-pulse">{text}</p>
      )}
    </div>
  );
};

export const PageLoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <LoadingSpinner size="lg" text="Loading page..." />
  </div>
);

export const TableLoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center py-8">
    <LoadingSpinner size="md" text="Loading data..." />
  </div>
);

export const ButtonLoadingSpinner: React.FC = () => (
  <Loader2 className="h-4 w-4 animate-spin" />
);
