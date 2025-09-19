import React from 'react';
import { User, Book, Check, MapPin, Home } from 'lucide-react';
import { MediaCopyDto } from '../../../types/media';
import { StatusBadge } from '../StatusBadge';

interface CopyDisplayProps {
  copy: MediaCopyDto;
  variant?: 'card' | 'selection' | 'compact' | 'list' | 'emphasis' | 'modal';
  selected?: boolean;
  onClick?: () => void;
  showSelection?: boolean;
  className?: string;
}

export function CopyDisplay({
  copy,
  variant = 'card',
  selected = false,
  onClick,
  showSelection = false,
  className = ''
}: CopyDisplayProps) {
  const variantStyles = {
    card: `p-4 rounded-lg border-2 ${
      copy.isAvailable ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
    }`,
    selection: `p-4 rounded-lg border-2 transition-all cursor-pointer ${
      selected ? 'border-lavender-400 bg-lavender-50' : 'border-gray-200 hover:border-gray-300'
    }`,
    compact: 'p-3 rounded border border-gray-200 bg-white',
    list: 'p-2 border-b border-gray-100 last:border-b-0',
    emphasis: `p-4 rounded-lg border-2 transition-all cursor-pointer ${
      selected ? 'border-lavender-400 bg-lavender-50' : 'border-gray-200 hover:border-gray-300'
    }`
  };

  const layoutStyles = {
    card: 'space-y-3',
    selection: 'space-y-3',
    compact: 'space-y-2',
    list: 'flex flex-col space-y-2',
    emphasis: 'space-y-3'
  };

  const handleClick = () => {
    if (onClick && copy.isAvailable) onClick();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && onClick && copy.isAvailable) {
      e.preventDefault();
      onClick();
    }
  };

  // Emphasis variant with copy-focused layout
  if (variant === 'emphasis') {
    return (
      <div
        className={`${variantStyles[variant]} ${className}`}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={onClick ? 0 : undefined}
        role={onClick ? 'button' : undefined}
        aria-label={onClick ? `Select copy owned by ${copy.ownerUsername}` : undefined}
      >
        <div className="space-y-2">
          {/* Primary row: Owner and Availability (most important for selection) */}
          <div className="flex items-center justify-between gap-4">
            {/* Left: Owner info (emphasized) */}
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-lavender-500 flex-shrink-0" aria-hidden="true" />
              <p className="text-sm font-semibold text-gray-900">{copy.ownerUsername}'s Copy</p>
            </div>

            {/* Right: Availability badge and selection indicator */}
            <div className="flex items-center gap-2">
              <StatusBadge 
                config={{
                  text: copy.isAvailable ? 'Available' : 'On Loan',
                  color: copy.isAvailable ? 'green' : 'red'
                }}
              />

              {showSelection && selected && (
                <div className="w-5 h-5 bg-lavender-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
          </div>

          {/* Secondary row: Location information */}
          <div className="flex flex-wrap items-center gap-2">
            {copy.currentLocationZoneName && (
              <StatusBadge 
                config={{
                  text: `Current: ${copy.currentLocationZoneName}`,
                  color: 'blue',
                  icon: MapPin
                }}
              />
            )}
            {copy.homeLocationZoneName && copy.homeLocationZoneName !== copy.currentLocationZoneName && (
              <StatusBadge 
                config={{
                  text: `Home: ${copy.homeLocationZoneName}`,
                  color: 'gray',
                  icon: Home
                }}
              />
            )}
          </div>

          {/* Tertiary row: Media title (de-emphasized) */}
          <div className="flex items-center gap-2 pt-1 border-t border-gray-100">
            <Book className="w-3 h-3 text-gray-400 flex-shrink-0" aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <p className="text-sm text-gray-600 truncate">{copy.mediaTitle}</p>
              {copy.mediaCreator && (
                <p className="text-xs text-gray-500 truncate">by {copy.mediaCreator}</p>
              )}
            </div>
          </div>

          {/* Notes (if present) */}
          {copy.notes && copy.notes.trim() !== '' && (
            <div className="p-2 bg-gray-50 rounded text-xs text-gray-600">
              <strong>Notes:</strong> {copy.notes}
            </div>
          )}
        </div>
      </div>
    );
  }


// Modal variant - copy-focused for use alongside MediaDisplay
if (variant === 'modal') {
  return (
    <div className={`p-4 rounded-lg border border-gray-200 bg-gray-50 ${className}`}>
      <div className="space-y-4">
        {/* Header: Copy ownership and status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-lavender-500" aria-hidden="true" />
            <span className="font-medium text-gray-900">Your Copy</span>
          </div>
          
          <StatusBadge 
            config={{
              text: copy.isAvailable ? 'Available' : 'On Loan',
              color: copy.isAvailable ? 'green' : 'red'
            }}
          />
        </div>

        {/* Copy Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Condition */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Condition</label>
            <StatusBadge 
              config={{
                text: copy.condition,
                color: copy.condition === 'Good' ? 'green' : 
                       copy.condition === 'Fair' ? 'yellow' : 'red'
              }}
            />
          </div>

          {/* Current Location */}
          {copy.currentLocationZoneName && (
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Current Location</label>
              <StatusBadge 
                config={{
                  text: copy.currentLocationZoneName,
                  color: 'blue',
                  icon: MapPin
                }}
              />
            </div>
          )}

          {/* Home Location */}
          {copy.homeLocationZoneName && (
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Home Location</label>
              <StatusBadge 
                config={{
                  text: copy.homeLocationZoneName,
                  color: 'gray',
                  icon: Home
                }}
              />
            </div>
          )}
        </div>

        {/* Notes Section */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Notes</label>
          {copy.notes && copy.notes.trim() !== '' ? (
            <div className="p-3 bg-white border border-gray-200 rounded text-sm text-gray-900">
              {copy.notes}
            </div>
          ) : (
            <div className="p-3 bg-white border border-gray-200 rounded text-sm text-gray-500 italic">
              No notes added
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

  // Original layout for other variants
  return (
    <div
      className={`${variantStyles[variant]} ${className}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? 'button' : undefined}
      aria-label={onClick ? `Select ${copy.mediaTitle}` : undefined}
    >
      <div className={layoutStyles[variant]}>
        {/* Top row: Media info and selection indicator */}
        <div className="flex items-start justify-between gap-4">
          {/* Left: media info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <Book className="w-4 h-4 text-lavender-500 flex-shrink-0" aria-hidden="true" />
              <span className="truncate">{copy.mediaTitle}</span>
            </h3>
            {copy.mediaCreator && (
              <p className="text-sm text-gray-600 mt-1 truncate">by {copy.mediaCreator}</p>
            )}
          </div>

          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            {/* Availability badge */}

              <StatusBadge 
                config={{
                  text: copy.isAvailable ? 'Available' : 'On Loan',
                  color: copy.isAvailable ? 'green' : 'red'
                }}
              />
            {/* <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                copy.isAvailable
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {copy.isAvailable ? 'Available' : 'On Loan'}
            </span> */}

            {/* Owner info */}
            <div className="flex items-center text-sm text-gray-700 gap-1">
              <User className="w-4 h-4 text-gray-500" aria-hidden="true" />
              <span>{copy.ownerUsername}</span>
            </div>
          </div>

          {/* Right: selection indicator */}
          {showSelection && selected && (
            <div className="ml-2 w-6 h-6 bg-lavender-400 rounded-full flex items-center justify-center flex-shrink-0">
              <Check className="w-4 h-4 text-white" />
            </div>
          )}
        </div>
{/* Status row: Location badges (left), Availability + Owner (right) */}
<div className="flex items-start justify-between gap-4">
  {/* Left: Location badges */}
  <div className="flex flex-wrap items-center gap-2">
    {copy.currentLocationZoneName && (
              <StatusBadge 
                config={{
                  text: `Current: ${copy.currentLocationZoneName}`,
                  color: 'blue',
                  icon: MapPin
                }}
              />
    )}
    {copy.homeLocationZoneName && copy.homeLocationZoneName !== copy.currentLocationZoneName && (
      <StatusBadge 
                config={{
                  text: `Home: ${copy.homeLocationZoneName}`,
                  color: 'gray',
                  icon: Home
                }}
              />
    )}
  </div>

</div>

        {/* Notes row (if present) */}
        {copy.notes && copy.notes.trim() !== '' && (
          <div
            className={`p-2 bg-gray-50 rounded text-xs text-gray-600 ${
              variant === 'list' ? 'mt-1' : 'mt-2'
            }`}
          >
            <strong>Notes:</strong> {copy.notes}
          </div>
        )}
      </div>
    </div>
  );
}