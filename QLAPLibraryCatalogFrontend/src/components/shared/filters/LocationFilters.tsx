import Select, { SingleValue } from 'react-select';
import { MapPin, X } from 'lucide-react';
import { LocationZoneDto } from '../../../types/locations';
import Button from '../Button';

export interface LocationParams {
  userLocationZoneId?: number;
  maxDistanceMiles?: number;
}

interface LocationFiltersProps {
  locationZones: LocationZoneDto[];
  currentLocation?: LocationParams;
  onChange: (params: LocationParams) => void;
  className?: string;
}

interface LocationOption {
  value: number;
  label: string;
}

interface DistanceOption {
  value: number;
  label: string;
}

const distanceOptions: DistanceOption[] = [
  { value: 5, label: 'Within 5 miles' },
  { value: 10, label: 'Within 10 miles' },
  { value: 20, label: 'Within 20 miles' },
  { value: 50, label: 'Within 50 miles' },
];

const selectStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    borderColor: state.isFocused ? '#8b5cf6' : '#d1d5db',
    boxShadow: state.isFocused ? '0 0 0 2px rgba(139, 92, 246, 0.2)' : 'none',
    '&:hover': {
      borderColor: state.isFocused ? '#8b5cf6' : '#9ca3af'
    },
    minHeight: '38px',
    fontSize: '14px'
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isSelected 
      ? '#8b5cf6'
      : state.isFocused 
      ? '#f3f4f6'
      : 'white',
    color: state.isSelected ? 'white' : '#374151',
    cursor: 'pointer'
  })
};

export function LocationFilters({ 
  locationZones, 
  currentLocation = {}, 
  onChange, 
  className = '' 
}: LocationFiltersProps) {
  const locationOptions: LocationOption[] = locationZones.map(zone => ({
    value: zone.zoneId,
    label: zone.zoneName
  }));

  const selectedLocation = currentLocation.userLocationZoneId 
    ? locationOptions.find(opt => opt.value === currentLocation.userLocationZoneId)
    : null;

  const selectedDistance = currentLocation.maxDistanceMiles 
    ? distanceOptions.find(opt => opt.value === currentLocation.maxDistanceMiles)
    : null;

  const handleLocationChange = (selectedOption: SingleValue<LocationOption>) => {
    const newParams: LocationParams = {
      ...currentLocation,
      userLocationZoneId: selectedOption?.value
    };
    
    // If no location is selected, clear distance too
    if (!selectedOption) {
      newParams.maxDistanceMiles = undefined;
    }
    
    onChange(newParams);
  };

  const handleDistanceChange = (selectedOption: SingleValue<DistanceOption>) => {
    onChange({
      ...currentLocation,
      maxDistanceMiles: selectedOption?.value
    });
  };

  const handleClear = () => {
    onChange({});
  };

  const hasActiveLocationFilter = currentLocation.userLocationZoneId || currentLocation.maxDistanceMiles;

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-lavender-500" />
          <h3 className="text-sm font-medium text-gray-700">Location Filters</h3>
          {hasActiveLocationFilter && (
            <span className="bg-lavender-100 text-lavender-700 text-xs px-2 py-0.5 rounded-full">
              Active
            </span>
          )}
        </div>
        
        {hasActiveLocationFilter && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            icon={X}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            aria-label="Clear location filters"
          >
            Clear
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Location Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Your Location
          </label>
          <Select<LocationOption, false>
            options={locationOptions}
            value={selectedLocation}
            onChange={handleLocationChange}
            placeholder="Select zip code..."
            isClearable={true}
            isSearchable={true}
            styles={selectStyles}
            className="text-sm"
          />
        </div>

        {/* Distance Selection - only show if location is selected */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search Radius
          </label>
          <Select<DistanceOption, false>
            options={distanceOptions}
            value={selectedDistance}
            onChange={handleDistanceChange}
            placeholder="Select distance..."
            isClearable={true}
            isSearchable={false}
            styles={selectStyles}
            className="text-sm"
            isDisabled={!currentLocation.userLocationZoneId}
          />
        </div>
      </div>

      {/* Status message */}
      {currentLocation.userLocationZoneId && (
        <div className="mt-3 text-sm text-gray-600">
          {currentLocation.maxDistanceMiles ? (
            <>
              Showing results within {currentLocation.maxDistanceMiles} miles of{' '}
              <span className="font-medium">{selectedLocation?.label}</span>
            </>
          ) : (
            <>
              Location selected: <span className="font-medium">{selectedLocation?.label}</span>
              {' '}(select distance to filter results)
            </>
          )}
        </div>
      )}
    </div>
  );
}