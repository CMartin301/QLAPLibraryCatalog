// components/shared/Select.tsx
import { Listbox, ListboxButton, ListboxOptions, ListboxOption, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { Check, ChevronDown } from 'lucide-react'

interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

interface SelectProps {
  options: SelectOption[]
  value?: string | number
  onChange: (value: string | number) => void
  placeholder?: string
  disabled?: boolean
  error?: string
  className?: string
}

export function Select({ 
  options, 
  value, 
  onChange, 
  placeholder = 'Select option',
  disabled = false,
  error,
  className = ''
}: SelectProps) {
  const selectedOption = options.find(option => option.value === value)

  return (
    <div className={className}>
      <Listbox value={value} onChange={onChange} disabled={disabled}>
        <div className="relative">
          
          <ListboxButton 
            className={`
              relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left 
              border focus:outline-none focus:ring-2 focus:ring-lavender-500 focus:border-lavender-500
              ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'hover:border-gray-400'}
              ${error ? 'border-red-300' : 'border-gray-300'}
            `}
          >
            <span className="block truncate text-gray-900">
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </span>
          </ListboxButton>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <ListboxOptions className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
              {options.map((option) => (
                <ListboxOption
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                  className={({ focus, selected }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      focus ? 'bg-lavender-100 text-lavender-900' : 'text-gray-900'
                    } ${option.disabled ? 'opacity-50 cursor-not-allowed' : ''}`
                  }
                >
                  {({ selected }) => (
                    <>
                      <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                        {option.label}
                      </span>
                      {selected && (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-lavender-600">
                          <Check className="h-5 w-5" aria-hidden="true" />
                        </span>
                      )}
                    </>
                  )}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </Transition>

        </div>
      </Listbox>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}