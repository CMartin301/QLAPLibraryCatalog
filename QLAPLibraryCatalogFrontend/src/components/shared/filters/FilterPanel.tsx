import React, { useState } from 'react';
import { RotateCcw, ChevronDown, ChevronUp, Settings } from 'lucide-react';
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
          <div className="mt-3">
            {/* Advanced Filters Toggle with Clear All Button */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 focus:outline-none focus:text-gray-800 transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span className="font-medium">Advanced Filters</span>
                {activeAdvancedCount > 0 && (
                  <span className="bg-lavender-100 text-lavender-700 text-xs px-2 py-0.5 rounded-full">
                    {activeAdvancedCount} active
                  </span>
                )}
                {showAdvanced ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              {/* Clear All Button */}
              {activeFilterCount > 0 && (
                <button
                  onClick={handleClearAll}
                  className="text-sm text-red-600 hover:text-red-700 focus:outline-none focus:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-4 h-4" />
                  Clear All ({activeFilterCount})
                </button>
              )}
            </div>

            {/* Advanced Filter Grid */}
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
      </div>
    </div>
  );
}