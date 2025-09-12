import { useState, useMemo, useEffect } from 'react';
import { BooleanFilter, Filter, FilterConfig, MultiSelectFilter, RangeFilter, SelectFilter } from '../types/filters';

interface UseFiltersProps<T> {
  data: T[];
  createFilterConfig: (data: T[]) => FilterConfig<T>;
}

interface UseFiltersReturn<T> {
  filteredData: T[];
  filters: Filter[];
  updateFilters: (filters: Filter[]) => void;
  clearFilters: () => void;
  activeFilterCount: number;
  isFiltersOpen: boolean;
  toggleFilters: () => void;
}

export function useFilters<T>({ 
  data, 
  createFilterConfig 
}: UseFiltersProps<T>): UseFiltersReturn<T> {
  // State for filter panel visibility
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  
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
  const filteredData = useMemo(() => {
    const activeFilters = filters.filter(f => f.active);
    if (activeFilters.length === 0) return data;
    
    return filterConfig.applyFilters(data, activeFilters);
  }, [data, filters, filterConfig]);

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

  // Toggle filter panel visibility
  const toggleFilters = () => {
    setIsFiltersOpen(!isFiltersOpen);
  };

  return {
    filteredData,
    filters,
    updateFilters,
    clearFilters,
    activeFilterCount,
    isFiltersOpen,
    toggleFilters
  };
}