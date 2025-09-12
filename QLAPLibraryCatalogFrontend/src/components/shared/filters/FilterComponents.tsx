import React from 'react';
import { Check, ChevronDown, X } from 'lucide-react';
import { Listbox, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { Filter, SelectFilter, MultiSelectFilter, BooleanFilter, RangeFilter } from '../../../types/filters';

interface FilterComponentProps {
  filter: Filter;
  onChange: (updatedFilter: Filter) => void;
}

// Select Filter Component using Headless UI Listbox
export function SelectFilterComponent({ filter, onChange }: { filter: SelectFilter; onChange: (filter: SelectFilter) => void }) {
  const handleChange = (value: string | null) => {
    onChange({
      ...filter,
      value,
      active: value !== null
    });
  };

  // Add "All" option to the beginning
  const allOptions = [
    { value: null, label: `All ${filter.label}`, count: undefined },
    ...filter.options.map(opt => ({ ...opt, value: opt.value as string | null }))
  ];

  const selectedOption = allOptions.find(opt => opt.value === filter.value) || allOptions[0];

  return (
    <div className="space-y-2">
      <Listbox value={filter.value} onChange={handleChange}>
        <div className="relative">
          <Listbox.Label className="block text-sm font-medium text-gray-700">
            {filter.label}
          </Listbox.Label>
          <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left border border-gray-300 focus:outline-none focus:ring-2 focus:ring-lavender-500 focus:border-lavender-500 sm:text-sm">
            <span className="block truncate">
              {selectedOption.label} {selectedOption.count && `(${selectedOption.count})`}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronDown className="h-4 w-4 text-gray-400" aria-hidden="true" />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {allOptions.map((option, optionIdx) => (
                <Listbox.Option
                  key={option.value || 'all'}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-lavender-100 text-lavender-900' : 'text-gray-900'
                    }`
                  }
                  value={option.value}
                >
                  {({ selected }) => (
                    <>
                      <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                        {option.label} {option.count && `(${option.count})`}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-lavender-600">
                          <Check className="h-4 w-4" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}

// Multi-Select Filter Component using Headless UI Listbox with multiple selection
export function MultiSelectFilterComponent({ filter, onChange }: { filter: MultiSelectFilter; onChange: (filter: MultiSelectFilter) => void }) {
  const handleChange = (values: string[]) => {
    onChange({
      ...filter,
      value: values,
      active: values.length > 0
    });
  };

  const handleClear = () => {
    onChange({
      ...filter,
      value: [],
      active: false
    });
  };

  const getDisplayText = () => {
    if (filter.value.length === 0) return `All ${filter.label}`;
    if (filter.value.length === 1) {
      const option = filter.options.find(o => o.value === filter.value[0]);
      return option?.label || filter.value[0];
    }
    return `${filter.value.length} selected`;
  };

  return (
    <div className="space-y-2">
      <Listbox value={filter.value} onChange={handleChange} multiple>
        <div className="relative">
          <Listbox.Label className="block text-sm font-medium text-gray-700">
            {filter.label}
          </Listbox.Label>
          <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left border border-gray-300 focus:outline-none focus:ring-2 focus:ring-lavender-500 focus:border-lavender-500 sm:text-sm">
            <span className="block truncate">{getDisplayText()}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronDown className="h-4 w-4 text-gray-400" aria-hidden="true" />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {filter.value.length > 0 && (
                <div className="border-b border-gray-100 pb-1 mb-1">
                  <button
                    type="button"
                    onClick={handleClear}
                    className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50 flex items-center justify-between text-red-600"
                  >
                    Clear all
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              {filter.options.map((option) => (
                <Listbox.Option
                  key={option.value}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-lavender-100 text-lavender-900' : 'text-gray-900'
                    }`
                  }
                  value={option.value}
                >
                  {({ selected }) => (
                    <>
                      <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                        {option.label} {option.count && `(${option.count})`}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-lavender-600">
                          <Check className="h-4 w-4" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
      
      {/* Show selected values as chips */}
      {filter.value.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {filter.value.map(value => {
            const option = filter.options.find(o => o.value === value);
            return (
              <span
                key={value}
                className="inline-flex items-center px-2 py-1 text-xs bg-lavender-100 text-lavender-700 rounded-full"
              >
                {option?.label || value}
                <button
                  type="button"
                  onClick={() => {
                    const newValues = filter.value.filter(v => v !== value);
                    handleChange(newValues);
                  }}
                  className="ml-1 hover:text-lavender-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Boolean Filter Component with Radio Group behavior
export function BooleanFilterComponent({ filter, onChange }: { filter: BooleanFilter; onChange: (filter: BooleanFilter) => void }) {
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
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
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

// Range Filter Component (kept simple since Headless UI doesn't have a range component)
export function RangeFilterComponent({ filter, onChange }: { filter: RangeFilter; onChange: (filter: RangeFilter) => void }) {
  const handleMinChange = (min: number | null) => {
    const newValue = { ...filter.value, min };
    onChange({
      ...filter,
      value: newValue,
      active: newValue.min !== null || newValue.max !== null
    });
  };

  const handleMaxChange = (max: number | null) => {
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
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          {filter.label}
        </label>
        {(filter.value.min !== null || filter.value.max !== null) && (
          <button
            type="button"
            onClick={handleClear}
            className="text-xs text-red-600 hover:text-red-700 focus:outline-none focus:underline"
          >
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
            onChange={(e) => handleMinChange(e.target.value ? parseInt(e.target.value) : null)}
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
            onChange={(e) => handleMaxChange(e.target.value ? parseInt(e.target.value) : null)}
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