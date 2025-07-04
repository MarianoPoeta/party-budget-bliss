import React, { memo, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { cn } from '../lib/utils';

// Optimized Card Component with memo
export const OptimizedCard = memo<{
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: { value: number; isPositive: boolean };
  icon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}>(({ title, value, subtitle, trend, icon, className, onClick }) => {
  const formattedValue = useMemo(() => {
    if (typeof value === 'number') {
      return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS'
      }).format(value);
    }
    return value;
  }, [value]);

  const trendColor = useMemo(() => {
    if (!trend) return '';
    return trend.isPositive ? 'text-green-600' : 'text-red-600';
  }, [trend]);

  const handleClick = useCallback(() => {
    onClick?.();
  }, [onClick]);

  return (
    <Card 
      className={cn(
        'transition-all duration-200 hover:shadow-md',
        onClick && 'cursor-pointer hover:scale-[1.02]',
        className
      )}
      onClick={handleClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formattedValue}</div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
        {trend && (
          <div className={cn('flex items-center text-xs mt-1', trendColor)}>
            <span>{trend.isPositive ? '↗' : '↘'}</span>
            <span className="ml-1">{Math.abs(trend.value)}%</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

OptimizedCard.displayName = 'OptimizedCard';

// Optimized Badge Component
export const OptimizedBadge = memo<{
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  children: React.ReactNode;
  className?: string;
}>(({ variant = 'default', children, className }) => {
  return (
    <Badge variant={variant} className={className}>
      {children}
    </Badge>
  );
});

OptimizedBadge.displayName = 'OptimizedBadge';

// Optimized Button Component
export const OptimizedButton = memo<{
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}>(({ 
  variant = 'default', 
  size = 'default', 
  children, 
  onClick, 
  disabled, 
  loading, 
  className,
  type = 'button'
}) => {
  const handleClick = useCallback(() => {
    if (disabled || loading) return;
    onClick?.();
  }, [onClick, disabled, loading]);

  const buttonContent = useMemo(() => {
    if (loading) {
      return (
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
          <span>Cargando...</span>
        </div>
      );
    }
    return children;
  }, [loading, children]);

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={disabled || loading}
      className={className}
      type={type}
    >
      {buttonContent}
    </Button>
  );
});

OptimizedButton.displayName = 'OptimizedButton';

// Optimized Loading Skeleton
export const OptimizedSkeleton = memo<{
  className?: string;
  count?: number;
  height?: string;
}>(({ className, count = 1, height = 'h-4' }) => {
  const skeletons = useMemo(() => {
    return Array.from({ length: count }, (_, i) => (
      <Skeleton 
        key={i} 
        className={cn(height, className)} 
      />
    ));
  }, [count, height, className]);

  return <>{skeletons}</>;
});

OptimizedSkeleton.displayName = 'OptimizedSkeleton';

// Optimized List Item Component
export const OptimizedListItem = memo<{
  id: string;
  title: string;
  subtitle?: string;
  badge?: string;
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline';
  onClick?: (id: string) => void;
  selected?: boolean;
  className?: string;
}>(({ 
  id, 
  title, 
  subtitle, 
  badge, 
  badgeVariant = 'default',
  onClick, 
  selected, 
  className 
}) => {
  const handleClick = useCallback(() => {
    onClick?.(id);
  }, [onClick, id]);

  return (
    <div
      className={cn(
        'flex items-center justify-between p-3 rounded-lg border transition-all duration-200',
        selected ? 'bg-primary/5 border-primary' : 'hover:bg-muted/50',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={handleClick}
    >
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm truncate">{title}</h4>
        {subtitle && (
          <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
        )}
      </div>
      {badge && (
        <OptimizedBadge variant={badgeVariant} className="ml-2 flex-shrink-0">
          {badge}
        </OptimizedBadge>
      )}
    </div>
  );
});

OptimizedListItem.displayName = 'OptimizedListItem';

// Optimized Search Input
export const OptimizedSearchInput = memo<{
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  debounceMs?: number;
}>(({ value, onChange, placeholder = 'Buscar...', className, debounceMs = 300 }) => {
  const [localValue, setLocalValue] = React.useState(value);
  const timeoutRef = React.useRef<NodeJS.Timeout>();

  React.useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      onChange(newValue);
    }, debounceMs);
  }, [onChange, debounceMs]);

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <input
      type="text"
      value={localValue}
      onChange={handleChange}
      placeholder={placeholder}
      className={cn(
        'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
        'file:border-0 file:bg-transparent file:text-sm file:font-medium',
        'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2',
        'focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
    />
  );
});

OptimizedSearchInput.displayName = 'OptimizedSearchInput';

// Optimized Virtual List Container
export const OptimizedVirtualList = memo<{
  items: any[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: any, index: number) => React.ReactNode;
  overscan?: number;
  className?: string;
}>(({ 
  items, 
  itemHeight, 
  containerHeight, 
  renderItem, 
  overscan = 5,
  className 
}) => {
  const [scrollTop, setScrollTop] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const visibleRange = useMemo(() => {
    const start = Math.floor(scrollTop / itemHeight);
    const end = Math.min(
      start + Math.ceil(containerHeight / itemHeight) + overscan,
      items.length
    );
    return { start: Math.max(0, start - overscan), end };
  }, [scrollTop, itemHeight, containerHeight, overscan, items.length]);

  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.start, visibleRange.end);
  }, [items, visibleRange]);

  const totalHeight = items.length * itemHeight;
  const offsetY = visibleRange.start * itemHeight;

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn('overflow-auto', className)}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) => 
            renderItem(item, visibleRange.start + index)
          )}
        </div>
      </div>
    </div>
  );
});

OptimizedVirtualList.displayName = 'OptimizedVirtualList';

// Optimized Image Component with lazy loading
export const OptimizedImage = memo<{
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
  loading?: 'lazy' | 'eager';
}>(({ src, alt, className, fallback, loading = 'lazy' }) => {
  const [imageSrc, setImageSrc] = React.useState(src);
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
  }, []);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
    if (fallback && fallback !== src) {
      setImageSrc(fallback);
    }
  }, [fallback, src]);

  React.useEffect(() => {
    setImageSrc(src);
    setIsLoading(true);
    setHasError(false);
  }, [src]);

  if (hasError && !fallback) {
    return (
      <div className={cn('bg-muted flex items-center justify-center', className)}>
        <span className="text-muted-foreground text-sm">Error</span>
      </div>
    );
  }

  return (
    <div className={cn('relative', className)}>
      {isLoading && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
      <img
        src={imageSrc}
        alt={alt}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'w-full h-full object-cover transition-opacity duration-200',
          isLoading ? 'opacity-0' : 'opacity-100'
        )}
      />
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage'; 