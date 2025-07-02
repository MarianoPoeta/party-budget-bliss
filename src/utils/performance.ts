import { useCallback, useRef, useEffect, useState } from 'react';

// Debounce utility
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle utility
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Custom hook for debounced values
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Custom hook for throttled values
export function useThrottle<T>(value: T, limit: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastRan = useRef<number>(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= limit) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, limit - (Date.now() - lastRan.current));

    return () => {
      clearTimeout(handler);
    };
  }, [value, limit]);

  return throttledValue;
}

// Memoization utilities
export function memoize<T extends (...args: unknown[]) => unknown>(
  func: T,
  resolver?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, unknown>();
  
  return ((...args: Parameters<T>) => {
    const key = resolver ? resolver(...args) : JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = func(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

// Custom hook for memoized callback with dependencies
export function useMemoizedCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  dependencies: unknown[]
): T {
  return useCallback(callback, dependencies);
}

// Performance monitoring utilities
export class PerformanceMonitor {
  private static marks = new Map<string, number>();
  private static measures = new Map<string, number[]>();

  static mark(name: string): void {
    if (typeof performance !== 'undefined') {
      performance.mark(name);
      this.marks.set(name, performance.now());
    }
  }

  static measure(name: string, startMark: string, endMark: string): void {
    if (typeof performance !== 'undefined') {
      try {
        performance.measure(name, startMark, endMark);
        const measure = performance.getEntriesByName(name)[0];
        if (measure) {
          const durations = this.measures.get(name) || [];
          durations.push(measure.duration);
          this.measures.set(name, durations);
        }
      } catch (error) {
        console.warn(`Failed to measure ${name}:`, error);
      }
    }
  }

  static getAverageDuration(name: string): number {
    const durations = this.measures.get(name);
    if (!durations || durations.length === 0) return 0;
    
    const sum = durations.reduce((acc, duration) => acc + duration, 0);
    return sum / durations.length;
  }

  static clear(): void {
    if (typeof performance !== 'undefined') {
      performance.clearMarks();
      performance.clearMeasures();
    }
    this.marks.clear();
    this.measures.clear();
  }
}

// Custom hook for performance monitoring
export function usePerformanceMonitor(componentName: string) {
  const startTime = useRef<number>(0);

  useEffect(() => {
    startTime.current = performance.now();
    PerformanceMonitor.mark(`${componentName}-mount`);

    return () => {
      const endTime = performance.now();
      PerformanceMonitor.mark(`${componentName}-unmount`);
      PerformanceMonitor.measure(
        `${componentName}-lifetime`,
        `${componentName}-mount`,
        `${componentName}-unmount`
      );
      
      const duration = endTime - startTime.current;
      if (duration > 16) { // Longer than one frame (16ms)
        console.warn(`${componentName} took ${duration.toFixed(2)}ms to render`);
      }
    };
  }, [componentName]);

  return {
    markRender: () => PerformanceMonitor.mark(`${componentName}-render`),
    measureRender: () => {
      PerformanceMonitor.mark(`${componentName}-render-end`);
      PerformanceMonitor.measure(
        `${componentName}-render-time`,
        `${componentName}-render`,
        `${componentName}-render-end`
      );
    }
  };
}

// Lazy loading utilities
export function lazyLoad<T>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: T
): () => Promise<T> {
  let cached: T | null = null;
  let loading: Promise<T> | null = null;

  return async () => {
    if (cached) return cached;
    if (loading) return loading;

    loading = importFunc().then(module => {
      cached = module.default;
      loading = null;
      return cached;
    });

    return loading;
  };
}

// Intersection Observer utility for lazy loading
export function useIntersectionObserver(
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {}
) {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (typeof IntersectionObserver !== 'undefined') {
      observerRef.current = new IntersectionObserver(callback, options);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [callback, options]);

  const observe = useCallback((element: Element | null) => {
    if (observerRef.current && element) {
      observerRef.current.observe(element);
    }
  }, []);

  const unobserve = useCallback((element: Element | null) => {
    if (observerRef.current && element) {
      observerRef.current.unobserve(element);
    }
  }, []);

  return { observe, unobserve };
} 