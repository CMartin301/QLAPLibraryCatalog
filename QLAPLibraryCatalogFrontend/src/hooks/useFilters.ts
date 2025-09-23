import { useState, useMemo, useEffect } from 'react';
import { BooleanFilter, Filter, FilterConfig, MultiSelectFilter, RangeFilter, SelectFilter } from '../types/filters';

interface UseFiltersProps<T> {
  data: T[];
  createFilterConfig: (data: T[]) => FilterConfig<T>;
  searchTerm?: string;
  searchFields?: (keyof T)[]; // This is fine as is
}

interface UseFiltersReturn<T> {
  filteredData: T[];
  filters: Filter[];
  updateFilters: (filters: Filter[]) => void;
  clearFilters: () => void;
  activeFilterCount: number;
}

export function useFilters<T>({ 
  data, 
  createFilterConfig,
  searchTerm = '',
  searchFields = [] 
}: UseFiltersProps<T>): UseFiltersReturn<T> {
  
  // Generate initial filter configuration based on data
  const filterConfig = useMemo(() => createFilterConfig(data), [data, createFilterConfig]);
  
  // State for current filter values
  const [filters, setFilters] = useState<Filter[]>(filterConfig.filters);

  // Update filters when data changes (e.g., new data loaded)
  // Update filters when data changes (e.g., new data loaded)
useEffect(() => {
  const newConfig = createFilterConfig(data);
  
  // Preserve existing filter values where possible
  const updatedFilters = newConfig.filters.map(newFilter => {
    const existingFilter = filters.find(f => f.id === newFilter.id);
    
    if (!existingFilter || existingFilter.type !== newFilter.type) {
      return newFilter;
    }
    
    // Type-safe preservation based on filter type
    switch (newFilter.type) {
      case 'select': {
        const existing = existingFilter as SelectFilter;
        const valueStillExists = newFilter.options.some(opt => opt.value === existing.value);
        return {
          ...newFilter,
          value: valueStillExists ? existing.value : null,
          active: valueStillExists ? existing.active : false
        } as SelectFilter;
      }
      
      case 'multiselect': {
        const existing = existingFilter as MultiSelectFilter;
        const validValues = existing.value.filter(val => 
          newFilter.options.some(opt => opt.value === val)
        );
        return {
          ...newFilter,
          value: validValues,
          active: validValues.length > 0
        } as MultiSelectFilter;
      }
      
      case 'boolean': {
        const existing = existingFilter as BooleanFilter;
        return {
          ...newFilter,
          value: existing.value,
          active: existing.active
        } as BooleanFilter;
      }
      
      case 'range': {
        const existing = existingFilter as RangeFilter;
        return {
          ...newFilter,
          value: existing.value,
          active: existing.active
        } as RangeFilter;
      }
      
      default:
        return newFilter;
    }
  });
  
  setFilters(updatedFilters);
}, [data, createFilterConfig]);
  // Apply filters to data
  // Apply filters AND search to data
const filteredData = useMemo(() => {
  let filtered = data; // Changed from 'result' to 'filtered'
  
  // Apply search first
  if (searchTerm.trim() && searchFields.length > 0) {
    const searchLower = searchTerm.toLowerCase().trim();
    filtered = filtered.filter((item: T) => // Added explicit type annotation
      searchFields.some(field => {
        const value = item[field];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(searchLower);
        }
        if (typeof value === 'number') {
          return value.toString().includes(searchLower);
        }
        return false;
      })
    );
  }
  
  // Then apply filters
  const activeFilters = filters.filter(f => f.active);
  if (activeFilters.length === 0) return filtered; // Changed from 'result' to 'filtered'
  
  return filterConfig.applyFilters(filtered, activeFilters); // Changed from 'result' to 'filtered'
}, [data, filters, filterConfig, searchTerm, searchFields]);

  // Count active filters
  const activeFilterCount = useMemo(() => 
    filters.filter(f => f.active).length, 
    [filters]
  );

  // Update filters function
  const updateFilters = (newFilters: Filter[]) => {
    setFilters(newFilters);
  };

  // Clear all filters
  const clearFilters = () => {
    const clearedFilters = filters.map(filter => {
      switch (filter.type) {
        case 'select':
          return { ...filter, value: null, active: false };
        case 'multiselect':
          return { ...filter, value: [], active: false };
        case 'boolean':
          return { ...filter, value: null, active: false };
        case 'range':
          return { ...filter, value: { min: null, max: null }, active: false };
        default:
          return { ...filter, active: false };
      }
    });
    setFilters(clearedFilters);
  };

  return {
    filteredData,
    filters,
    updateFilters,
    clearFilters,
    activeFilterCount
  };
}