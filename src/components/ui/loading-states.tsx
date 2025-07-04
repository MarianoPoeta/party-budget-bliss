import React from 'react';
import { Skeleton } from './skeleton';
import { cn } from '../../lib/utils';

// Enhanced Loading Spinner with different sizes and colors
export const LoadingSpinner: React.FC<{
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'white';
  className?: string;
}> = ({ size = 'md', color = 'primary', className }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  const colorClasses = {
    primary: 'text-primary',
    secondary: 'text-muted-foreground',
    white: 'text-white'
  };

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-current border-t-transparent',
        sizeClasses[size],
        colorClasses[color],
        className
      )}
    />
  );
};

// Card Skeleton for loading states
export const CardSkeleton: React.FC<{
  className?: string;
  showHeader?: boolean;
  showFooter?: boolean;
}> = ({ className, showHeader = true, showFooter = false }) => (
  <div className={cn('rounded-lg border bg-card p-6', className)}>
    {showHeader && (
      <div className="space-y-2 mb-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    )}
    <div className="space-y-3">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-4/6" />
    </div>
    {showFooter && (
      <div className="mt-4 pt-4 border-t">
        <Skeleton className="h-3 w-1/3" />
      </div>
    )}
  </div>
);

// Table Skeleton for data tables
export const TableSkeleton: React.FC<{
  rows?: number;
  columns?: number;
  className?: string;
}> = ({ rows = 5, columns = 4, className }) => (
  <div className={cn('space-y-3', className)}>
    {/* Header */}
    <div className="flex space-x-4">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} className="h-4 flex-1" />
      ))}
    </div>
    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="flex space-x-4">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <Skeleton key={colIndex} className="h-4 flex-1" />
        ))}
      </div>
    ))}
  </div>
);

// List Skeleton for lists and grids
export const ListSkeleton: React.FC<{
  items?: number;
  className?: string;
  variant?: 'default' | 'card' | 'minimal';
}> = ({ items = 5, className, variant = 'default' }) => {
  const renderItem = () => {
    switch (variant) {
      case 'card':
        return (
          <div className="p-4 border rounded-lg space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        );
      case 'minimal':
        return (
          <div className="flex items-center space-x-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-2 w-1/2" />
            </div>
          </div>
        );
      default:
        return (
          <div className="flex items-center space-x-3">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-4 w-20" />
          </div>
        );
    }
  };

  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i}>{renderItem()}</div>
      ))}
    </div>
  );
};

// Form Skeleton for form loading states
export const FormSkeleton: React.FC<{
  fields?: number;
  className?: string;
}> = ({ fields = 4, className }) => (
  <div className={cn('space-y-6', className)}>
    {Array.from({ length: fields }).map((_, i) => (
      <div key={i} className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full" />
      </div>
    ))}
    <div className="flex space-x-3 pt-4">
      <Skeleton className="h-10 w-24" />
      <Skeleton className="h-10 w-24" />
    </div>
  </div>
);

// Dashboard Stats Skeleton
export const StatsSkeleton: React.FC<{
  cards?: number;
  className?: string;
}> = ({ cards = 4, className }) => (
  <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4', className)}>
    {Array.from({ length: cards }).map((_, i) => (
      <CardSkeleton key={i} showFooter={true} />
    ))}
  </div>
);

// Chart Skeleton for data visualizations
export const ChartSkeleton: React.FC<{
  className?: string;
  height?: number;
}> = ({ className, height = 300 }) => (
  <div className={cn('rounded-lg border bg-card p-6', className)}>
    <div className="space-y-4">
      <Skeleton className="h-4 w-1/3" />
      <div 
        className="bg-muted rounded"
        style={{ height: `${height}px` }}
      >
        <div className="flex items-end justify-between h-full p-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton 
              key={i} 
              className="bg-background rounded-t"
              style={{ 
                height: `${Math.random() * 60 + 20}%`,
                width: '12%'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Page Loading State
export const PageLoading: React.FC<{
  title?: string;
  subtitle?: string;
  className?: string;
}> = ({ title = 'Cargando...', subtitle, className }) => (
  <div className={cn('flex flex-col items-center justify-center min-h-[400px] space-y-4', className)}>
    <LoadingSpinner size="xl" />
    <div className="text-center space-y-2">
      <h3 className="text-lg font-medium">{title}</h3>
      {subtitle && (
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      )}
    </div>
  </div>
);

// Inline Loading State
export const InlineLoading: React.FC<{
  text?: string;
  className?: string;
}> = ({ text = 'Cargando...', className }) => (
  <div className={cn('flex items-center space-x-2', className)}>
    <LoadingSpinner size="sm" />
    <span className="text-sm text-muted-foreground">{text}</span>
  </div>
);

// Button Loading State
export const ButtonLoading: React.FC<{
  text?: string;
  className?: string;
}> = ({ text = 'Cargando...', className }) => (
  <div className={cn('flex items-center space-x-2', className)}>
    <LoadingSpinner size="sm" color="white" />
    <span>{text}</span>
  </div>
);

// Overlay Loading State
export const OverlayLoading: React.FC<{
  isVisible: boolean;
  text?: string;
  className?: string;
}> = ({ isVisible, text = 'Cargando...', className }) => {
  if (!isVisible) return null;

  return (
    <div className={cn(
      'fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center',
      className
    )}>
      <div className="flex flex-col items-center space-y-4">
        <LoadingSpinner size="xl" />
        <p className="text-sm text-muted-foreground">{text}</p>
      </div>
    </div>
  );
};

// Progress Loading State
export const ProgressLoading: React.FC<{
  progress: number;
  text?: string;
  className?: string;
}> = ({ progress, text, className }) => (
  <div className={cn('space-y-2', className)}>
    <div className="flex justify-between text-sm">
      <span>{text || 'Progreso'}</span>
      <span>{Math.round(progress)}%</span>
    </div>
    <div className="w-full bg-muted rounded-full h-2">
      <div 
        className="bg-primary h-2 rounded-full transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  </div>
);

// Pulse Loading Animation
export const PulseLoading: React.FC<{
  className?: string;
}> = ({ className }) => (
  <div className={cn('animate-pulse', className)}>
    <div className="h-4 bg-muted rounded w-3/4" />
  </div>
);

// Shimmer Loading Effect
export const ShimmerLoading: React.FC<{
  className?: string;
  height?: string;
}> = ({ className, height = 'h-4' }) => (
  <div className={cn(
    'animate-pulse bg-gradient-to-r from-muted via-background to-muted bg-[length:200%_100%]',
    height,
    className
  )} />
); 