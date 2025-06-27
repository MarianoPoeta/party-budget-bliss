
import { useState, useEffect, useCallback } from 'react';

export const useRealTimeUpdates = <T>(initialData: T, updateFn?: (data: T) => T) => {
  const [data, setData] = useState<T>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const updateData = useCallback((newData: T | ((prev: T) => T)) => {
    setIsLoading(true);
    setData(prev => {
      const result = typeof newData === 'function' ? (newData as (prev: T) => T)(prev) : newData;
      setLastUpdated(new Date());
      return updateFn ? updateFn(result) : result;
    });
    setIsLoading(false);
  }, [updateFn]);

  const refreshData = useCallback(() => {
    setLastUpdated(new Date());
  }, []);

  return {
    data,
    updateData,
    refreshData,
    isLoading,
    lastUpdated
  };
};
