// Base filter interface that all filters implement
export interface BaseFilter {
  id: string;
  label: string;
  type: 'select' | 'multiselect' | 'boolean' | 'range' | 'search';
  active: boolean;
}

// Select filter for single selection (like media type)
export interface SelectFilter extends BaseFilter {
  type: 'select';
  value: string | null;
  options: FilterOption[];
}

// Multi-select filter for multiple selections (like genres)
export interface MultiSelectFilter extends BaseFilter {
  type: 'multiselect';
  value: string[];
  options: FilterOption[];
}

// Boolean filter for yes/no options (like availability)
export interface BooleanFilter extends BaseFilter {
  type: 'boolean';
  value: boolean | null;
  trueLabel: string;
  falseLabel: string;
}

// Range filter for numeric values (like publication year)
export interface RangeFilter extends BaseFilter {
  type: 'range';
  value: { min: number | null; max: number | null };
  min: number;
  max: number;
  step?: number;
}

// Search filter for text searching
export interface SearchFilter extends BaseFilter {
  type: 'search';
  value: string;
  placeholder: string;
}

// Union type for all filter types
export type Filter = SelectFilter | MultiSelectFilter | BooleanFilter | RangeFilter | SearchFilter;

// Option for select/multiselect filters
export interface FilterOption {
  value: string;
  label: string;
  count?: number; // Optional count of items matching this option
}

// Filter configuration for a specific data type
export interface FilterConfig<T> {
  filters: Filter[];
  applyFilters: (data: T[], activeFilters: Filter[]) => T[];
}