import { useState, useMemo, useCallback } from 'react';

export const useSearch = <T extends Record<string, any>>(
  items: T[] = [],
  searchableFields: (keyof T)[] = []
) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});

  const filteredItems = useMemo(() => {
    if (!Array.isArray(items)) return [];

    return items.filter(item => {
      // Search filter
      const matchesSearch = !searchTerm.trim() || searchableFields.some(field => {
        const value = item[field];
        if (Array.isArray(value)) {
          return value.some(v => 
            String(v).toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        return String(value || '').toLowerCase().includes(searchTerm.toLowerCase());
      });

      // Other filters
      const matchesFilters = Object.entries(filters).every(([key, filterValue]) => {
        if (filterValue === null || filterValue === undefined || filterValue === '') {
          return true;
        }
        return item[key] === filterValue;
      });

      return matchesSearch && matchesFilters;
    });
  }, [items, searchTerm, filters, searchableFields]);

  const updateFilter = useCallback((key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setFilters({});
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    filters,
    updateFilter,
    clearFilters,
    filteredItems
  };
};
