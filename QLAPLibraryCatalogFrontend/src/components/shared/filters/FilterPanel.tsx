import React, { useState } from 'react';
import { RotateCcw, ChevronDown, ChevronUp, Settings, X } from 'lucide-react';
import { Filter } from '../../../types/filters';
import { FilterComponent } from './FilterComponents';

interface FilterPanelProps {
  filters: Filter[];
  onFiltersChange: (filters: Filter[]) => void;
  className?: string;
}

export function FilterPanel({ 
  filters, 
  onFiltersChange,
  className = '' 
}: FilterPanelProps) {
  // State for advanced filters visibility
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Separate primary and advanced filters
  const primaryFilters = filters.filter(f => f.priority === 'primary' || !f.priority);
  const advancedFilters = filters.filter(f => f.priority === 'advanced');
  
  // Count active filters
  const activeFilterCount = filters.filter(f => f.active).length;
  const activePrimaryCount = primaryFilters.filter(f => f.active).length;
  const activeAdvancedCount = advancedFilters.filter(f => f.active).length;

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
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
        {/* Primary Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {primaryFilters.map(filter => (
            <div key={filter.id}>
              <FilterComponent 
                filter={filter} 
                onChange={handleFilterChange}
              />
            </div>
          ))}
        </div>

        {/* Advanced Filters Section */}
        {advancedFilters.length > 0 && (
          <div className="mt-2">
            {/* Advanced Filters Toggle - Compact */}
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-800 focus:outline-none focus:text-gray-800 transition-colors mb-1"
            >
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Advanced Filters
                  </span>
                  {activeAdvancedCount > 0 && (
                    <span className="bg-lavender-100 text-lavender-700 text-xs px-2 py-0.5 rounded-full">
                      {activeAdvancedCount} active
                    </span>
                  )}
                </div>
              {showAdvanced ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
            </button>

            {/* Advanced Filter Grid - Seamless continuation */}
            {showAdvanced && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {advancedFilters.map(filter => (
                  <div key={filter.id}>
                    <FilterComponent 
                      filter={filter} 
                      onChange={handleFilterChange}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Active Filters Summary - Compact */}
        {activeFilterCount > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                Active ({activeFilterCount})
              </span>
              <button
                onClick={handleClearAll}
                className="text-xs text-red-600 hover:text-red-700 focus:outline-none focus:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Clear All
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
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
    </div>
  );
}

// Compact active filter chips
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

  // Compact chip styling
  const isAdvanced = filter.priority === 'advanced';
  const chipStyles = isAdvanced 
    ? "bg-blue-50 text-blue-700 border border-blue-200"
    : "bg-lavender-50 text-lavender-700 border border-lavender-200";

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${chipStyles}`}>
      <span className="font-medium">{filter.label}:</span>
      <span>{displayValue}</span>
      <button
        onClick={onRemove}
        className="hover:opacity-70"
        aria-label={`Remove ${filter.label} filter`}
      >
        <X className="w-2.5 h-2.5" />
      </button>
    </span>
  );
}