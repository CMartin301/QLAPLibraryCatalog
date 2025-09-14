import React from 'react';
import Select, { SingleValue, MultiValue, StylesConfig, components } from 'react-select';
import { X } from 'lucide-react';
import { Filter, SelectFilter, MultiSelectFilter, BooleanFilter, RangeFilter } from '../../../types/filters';

interface FilterComponentProps {
  filter: Filter;
  onChange: (updatedFilter: Filter) => void;
}

// Option type for React Select - needs to be defined for both single and multi
interface SelectOption {
  value: string;
  label: string;
  count?: number;
}

interface MultiSelectOption {
  value: string;
  label: string;
  count?: number;
}

// Custom styles for React Select to match your design system
const getSelectStyles = (isMulti: boolean): StylesConfig<SelectOption | MultiSelectOption, boolean> => ({
  control: (provided, state) => ({
    ...provided,
    borderColor: state.isFocused ? '#a855f7' : '#d1d5db',
    boxShadow: state.isFocused ? '0 0 0 2px rgba(168, 85, 247, 0.2)' : 'none',
    '&:hover': {
      borderColor: state.isFocused ? '#a855f7' : '#9ca3af'
    },
    minHeight: '38px',
    fontSize: '14px'
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected 
      ? '#f3e8ff' 
      : state.isFocused 
      ? '#faf5ff' 
      : 'white',
    color: state.isSelected ? '#7c3aed' : '#374151',
    cursor: 'pointer',
    padding: 0, // Remove default padding since we're using custom components
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: '#f3e8ff',
    borderRadius: '6px'
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: '#7c3aed',
    fontSize: '12px'
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: '#7c3aed',
    '&:hover': {
      backgroundColor: '#e9d5ff',
      color: '#6b21a8'
    }
  }),
  placeholder: (provided) => ({
    ...provided,
    color: '#9ca3af',
    fontSize: '14px'
  })
});

// Custom option component factory
const createOptionComponent = (isMulti: boolean) => {
  return (props: any) => {
    const { isSelected, data, innerRef, innerProps } = props;
    
    return (
      <div 
        ref={innerRef} 
        {...innerProps} 
        className="flex items-center px-3 py-2 cursor-pointer hover:bg-purple-50"
      >
        {isMulti ? (
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => {}} // Controlled by React Select
            className="h-4 w-4 text-lavender-600 border-gray-300 rounded focus:ring-lavender-500 mr-3 pointer-events-none"
          />
        ) : (
          <input
            type="radio"
            checked={isSelected}
            onChange={() => {}} // Controlled by React Select
            className="h-4 w-4 text-lavender-600 border-gray-300 focus:ring-lavender-500 mr-3 pointer-events-none"
          />
        )}
        <span className={`${isSelected ? 'font-medium text-purple-700' : 'text-gray-900'}`}>
          {data.label} {data.count && `(${data.count})`}
        </span>
      </div>
    );
  };
};

// React Select Filter Component (Single Select)
export function SelectFilterComponent({ 
  filter, 
  onChange 
}: { 
  filter: SelectFilter; 
  onChange: (filter: SelectFilter) => void 
}) {
  const handleChange = (selectedOption: SingleValue<SelectOption>) => {
    onChange({
      ...filter,
      value: selectedOption?.value || null,
      active: selectedOption?.value !== null
    });
  };

  // Create options without the "All" option since we want null to represent "no selection"
  const options: SelectOption[] = filter.options.map(opt => ({
    value: opt.value,
    label: opt.label,
    count: opt.count
  }));

  const selectedOption = filter.value ? options.find(opt => opt.value === filter.value) : null;

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {filter.label}
      </label>
      <Select<SelectOption, false>
        options={options}
        value={selectedOption}
        onChange={handleChange}
        placeholder={`Select ${filter.label.toLowerCase()}...`}
        isClearable={true}
        isSearchable={true}
        styles={getSelectStyles(false)}
        components={{
          Option: createOptionComponent(false)
        }}
        formatOptionLabel={(option) => (
          <span>
            {option.label} {option.count && `(${option.count})`}
          </span>
        )}
      />
    </div>
  );
}

// React Select Multi-Select Filter Component
export function MultiSelectFilterComponent({ 
  filter, 
  onChange 
}: { 
  filter: MultiSelectFilter; 
  onChange: (filter: MultiSelectFilter) => void 
}) {
  const handleChange = (selectedOptions: MultiValue<MultiSelectOption>) => {
    const values = selectedOptions.map(option => option.value);
    onChange({
      ...filter,
      value: values,
      active: values.length > 0
    });
  };

  const options: MultiSelectOption[] = filter.options.map(opt => ({
    value: opt.value,
    label: opt.label,
    count: opt.count
  }));

  const selectedOptions = options.filter(opt => filter.value.includes(opt.value));

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {filter.label}
      </label>
      <Select<MultiSelectOption, true>
        options={options}
        value={selectedOptions}
        onChange={handleChange}
        placeholder={`Select ${filter.label.toLowerCase()}...`}
        isClearable={true}
        isSearchable={true}
        isMulti={true}
        styles={getSelectStyles(true)}
        components={{
          Option: createOptionComponent(true)
        }}
        formatOptionLabel={(option) => (
          <span>
            {option.label} {option.count && `(${option.count})`}
          </span>
        )}
        closeMenuOnSelect={false}
        hideSelectedOptions={false}
      />
    </div>
  );
}

// Boolean Filter Component with Radio Group behavior
export function BooleanFilterComponent({ 
  filter, 
  onChange 
}: { 
  filter: BooleanFilter; 
  onChange: (filter: BooleanFilter) => void 
}) {
  const handleChange = (value: boolean | null) => {
    onChange({
      ...filter,
      value,
      active: value !== null
    });
  };

  const options = [
    { value: null, label: 'All' },
    { value: true, label: filter.trueLabel },
    { value: false, label: filter.falseLabel }
  ];

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {filter.label}
      </label>
      <div className="flex gap-2">
        {options.map((option) => (
          <button
            key={String(option.value)}
            type="button"
            onClick={() => handleChange(option.value)}
            className={`px-3 py-2 text-sm rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-lavender-500 ${
              filter.value === option.value
                ? option.value === null
                  ? 'bg-lavender-100 border-lavender-300 text-lavender-700'
                  : option.value === true
                  ? 'bg-green-100 border-green-300 text-green-700'
                  : 'bg-red-100 border-red-300 text-red-700'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// Range Filter Component
export function RangeFilterComponent({ 
  filter, 
  onChange 
}: { 
  filter: RangeFilter; 
  onChange: (filter: RangeFilter) => void 
}) {
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const min = value === '' ? null : parseInt(value, 10);
    const newValue = { ...filter.value, min };
    onChange({
      ...filter,
      value: newValue,
      active: newValue.min !== null || newValue.max !== null
    });
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const max = value === '' ? null : parseInt(value, 10);
    const newValue = { ...filter.value, max };
    onChange({
      ...filter,
      value: newValue,
      active: newValue.min !== null || newValue.max !== null
    });
  };

  const handleClear = () => {
    onChange({
      ...filter,
      value: { min: null, max: null },
      active: false
    });
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between mb-1">
        <label className="block text-sm font-medium text-gray-700">
          {filter.label}
        </label>
        {(filter.value.min !== null || filter.value.max !== null) && (
          <button
            type="button"
            onClick={handleClear}
            className="text-xs text-red-600 hover:text-red-700 focus:outline-none focus:underline flex items-center gap-1"
            aria-label={`Clear ${filter.label} filter`}
          >
            <X className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="sr-only">Minimum {filter.label}</label>
          <input
            type="number"
            placeholder={`Min (${filter.min})`}
            value={filter.value.min ?? ''}
            onChange={handleMinChange}
            min={filter.min}
            max={filter.max}
            step={filter.step}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-500 focus:border-lavender-500"
          />
        </div>
        <div>
          <label className="sr-only">Maximum {filter.label}</label>
          <input
            type="number"
            placeholder={`Max (${filter.max})`}
            value={filter.value.max ?? ''}
            onChange={handleMaxChange}
            min={filter.min}
            max={filter.max}
            step={filter.step}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-500 focus:border-lavender-500"
          />
        </div>
      </div>
      {(filter.value.min !== null || filter.value.max !== null) && (
        <div className="text-xs text-gray-600">
          Range: {filter.value.min || filter.min} - {filter.value.max || filter.max}
        </div>
      )}
    </div>
  );
}

// Main Filter Component that routes to appropriate sub-component
export function FilterComponent({ filter, onChange }: FilterComponentProps) {
  switch (filter.type) {
    case 'select':
      return <SelectFilterComponent filter={filter} onChange={onChange} />;
    case 'multiselect':
      return <MultiSelectFilterComponent filter={filter} onChange={onChange} />;
    case 'boolean':
      return <BooleanFilterComponent filter={filter} onChange={onChange} />;
    case 'range':
      return <RangeFilterComponent filter={filter} onChange={onChange} />;
    default:
      return null;
  }
}