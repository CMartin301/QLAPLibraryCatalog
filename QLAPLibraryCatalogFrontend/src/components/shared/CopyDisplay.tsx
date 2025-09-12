import React from 'react';
import { MediaCopyDto } from '../../types/media';
import { User, Book, Check, MapPin, Home } from 'lucide-react';

interface CopyDisplayProps {
  copy: MediaCopyDto;
  variant?: 'card' | 'selection' | 'compact' | 'list';
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
    list: 'p-2 border-b border-gray-100 last:border-b-0'
  };

  const layoutStyles = {
    card: 'space-y-3',
    selection: 'space-y-3',
    compact: 'space-y-2',
    list: 'flex flex-col space-y-2'
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
          {/* Right: Availability and Owner stacked */}
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            {/* Availability badge */}
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                copy.isAvailable
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {copy.isAvailable ? 'Available' : 'On Loan'}
            </span>

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
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 gap-1">
        <MapPin className="w-3 h-3" aria-hidden="true" />
        <span className="hidden sm:inline">Current:</span>
        <span>{copy.currentLocationZoneName}</span>
      </span>
    )}
    {copy.homeLocationZoneName && copy.homeLocationZoneName !== copy.currentLocationZoneName && (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 gap-1">
        <Home className="w-3 h-3" aria-hidden="true" />
        <span className="hidden sm:inline">Home:</span>
        <span>{copy.homeLocationZoneName}</span>
      </span>
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