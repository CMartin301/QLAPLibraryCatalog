import React from 'react';
import { Filter as FilterIcon, X, RotateCcw } from 'lucide-react';
import { Filter } from '../../../types/filters';
import { FilterComponent } from './FilterComponents';
import Button from '../Button';

interface FilterPanelProps {
  filters: Filter[];
  onFiltersChange: (filters: Filter[]) => void;
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

export function FilterPanel({ 
  filters, 
  onFiltersChange, 
  isOpen, 
  onToggle,
  className = '' 
}: FilterPanelProps) {
  // Count active filters for the badge
  const activeFilterCount = filters.filter(f => f.active).length;

  // Handle individual filter changes
  const handleFilterChange = (updatedFilter: Filter) => {
    const newFilters = filters.map(f => 
      f.id === updatedFilter.id ? updatedFilter : f
    );
    onFiltersChange(newFilters);
  };

  // Clear all filters
  const handleClearAll = () => {
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
    onFiltersChange(clearedFilters);
  };

  return (
    <div className={className}>
      {/* Filter Toggle Button */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="secondary"
          size="md"
          icon={FilterIcon}
          onClick={onToggle}
          className="relative"
        >
          Filters
          {activeFilterCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-lavender-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </Button>

        {/* Clear all button - only show if filters are active */}
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            icon={RotateCcw}
            onClick={handleClearAll}
            className="text-gray-600"
          >
            Clear All ({activeFilterCount})
          </Button>
        )}
      </div>

      {/* Filter Panel - Collapsible */}
      {isOpen && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Filter Results</h3>
            <button
              onClick={onToggle}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close filters"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Filter Grid - Responsive layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filters.map(filter => (
              <div key={filter.id} className="space-y-2">
                <FilterComponent 
                  filter={filter} 
                  onChange={handleFilterChange}
                />
              </div>
            ))}
          </div>

          {/* Active Filters Summary */}
          {activeFilterCount > 0 && (
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Active Filters ({activeFilterCount})
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {filters
                  .filter(f => f.active)
                  .map(filter => (
                    <ActiveFilterChip
                      key={filter.id}
                      filter={filter}
                      onRemove={() => {
                        const clearedFilter = { ...filter };
                        switch (filter.type) {
                          case 'select':
                            clearedFilter.value = null;
                            break;
                          case 'multiselect':
                            clearedFilter.value = [];
                            break;
                          case 'boolean':
                            clearedFilter.value = null;
                            break;
                          case 'range':
                            clearedFilter.value = { min: null, max: null };
                            break;
                        }
                        clearedFilter.active = false;
                        handleFilterChange(clearedFilter);
                      }}
                    />
                  ))
                }
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Component to show active filter chips
interface ActiveFilterChipProps {
  filter: Filter;
  onRemove: () => void;
}

function ActiveFilterChip({ filter, onRemove }: ActiveFilterChipProps) {
  const getFilterDisplayValue = (filter: Filter): string => {
    switch (filter.type) {
      case 'select':
        return filter.value || '';
      case 'multiselect':
        return filter.value.length === 1 
          ? filter.value[0] 
          : `${filter.value.length} selected`;
      case 'boolean':
        return filter.value === true ? filter.trueLabel : filter.falseLabel;
      case 'range':
        const { min, max } = filter.value;
        if (min !== null && max !== null) return `${min}-${max}`;
        if (min !== null) return `${min}+`;
        if (max !== null) return `<${max}`;
        return '';
      default:
        return '';
    }
  };

  const displayValue = getFilterDisplayValue(filter);
  if (!displayValue) return null;

  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 bg-lavender-100 text-lavender-700 rounded-full text-sm">
      <span className="font-medium">{filter.label}:</span>
      <span>{displayValue}</span>
      <button
        onClick={onRemove}
        className="hover:text-lavender-900 ml-1"
        aria-label={`Remove ${filter.label} filter`}
      >
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}