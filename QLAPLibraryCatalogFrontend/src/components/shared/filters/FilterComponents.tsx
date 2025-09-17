import React from 'react';
import Select, { SingleValue, MultiValue, StylesConfig } from 'react-select';
import { X } from 'lucide-react';
import { Filter, SelectFilter, MultiSelectFilter, BooleanFilter, RangeFilter } from '../../../types/filters';
import Button from '../../shared/Button';
import { colors } from '../../../styles/theme';

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
const getSelectStyles = (isMulti: boolean): StylesConfig<SelectOption | MultiSelectOption, boolean> => ({
  control: (provided, state) => ({
    ...provided,
    borderColor: state.isFocused ? colors.lavender[500] : colors.gray[300],
    boxShadow: state.isFocused ? `0 0 0 2px ${colors.lavender[500]}33` : 'none', // 33 = 20% opacity in hex
    '&:hover': {
      borderColor: state.isFocused ? colors.lavender[500] : colors.gray[400]
    },
    minHeight: '38px',
    fontSize: '14px',
    backgroundColor: colors.white
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected 
      ? colors.lavender[200]
      : state.isFocused 
      ? colors.lavender[100]
      : colors.white,
    color: state.isSelected ? colors.lavender[600] : colors.gray[700],
    cursor: 'pointer',
    padding: 0,
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: colors.lavender[200],
    borderRadius: '6px'
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: colors.lavender[600],
    fontSize: '12px'
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: colors.lavender[600],
    '&:hover': {
      backgroundColor: colors.lavender[300],
      color: colors.lavender[600]
    }
  }),
  placeholder: (provided) => ({
    ...provided,
    color: colors.gray[400],
    fontSize: '14px'
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
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
        className="flex items-center px-3 py-2 cursor-pointer hover:bg-lavender-100"
      >
        {isMulti ? (
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => {}} // Controlled by React Select
            className="h-4 w-4 text-lavender-500 border-gray-300 rounded focus:ring-lavender-500 mr-3 pointer-events-none"
          />
        ) : (
          <input
            type="radio"
            checked={isSelected}
            onChange={() => {}} // Controlled by React Select
            className="h-4 w-4 text-lavender-500 border-gray-300 focus:ring-lavender-500 mr-3 pointer-events-none"
          />
        )}
        <span className={`${isSelected ? 'font-medium text-lavender-600' : 'text-gray-900'}`}>
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
                  ? 'bg-lavender-100 border-lavender-300 text-lavender-600'
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
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            icon={X}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            aria-label={`Clear ${filter.label} filter`}
          >
            Clear
          </Button>
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