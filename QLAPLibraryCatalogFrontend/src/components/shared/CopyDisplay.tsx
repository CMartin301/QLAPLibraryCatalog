import React from 'react';
import { MediaCopyDisplay } from '../../types/media';
import { User, Book } from 'lucide-react';

interface CopyDisplayProps {
  copy: MediaCopyDisplay;
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
    card: 'space-y-2',
    selection: 'space-y-2',
    compact: 'space-y-1',
    list: 'flex flex-col'
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
        {/* Row: title/creator (left), availability/owner (middle), selection (right) */}
        <div className="flex items-start justify-between gap-4">
          {/* Left: media info */}
          <div className="flex-1">
            <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <Book className="w-4 h-4 text-lavender-500" aria-hidden="true" />
              {copy.mediaTitle}
            </h3>
            {copy.mediaCreator && (
              <p className="text-sm text-gray-600">by {copy.mediaCreator}</p>
            )}
          </div>

          {/* Middle: availability + owner */}
          <div className="flex flex-col items-start gap-1 flex-shrink-0">
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                copy.isAvailable
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {copy.isAvailable ? 'Available' : 'On Loan'}
            </span>

            <div className="flex items-center text-sm text-gray-700 gap-1">
              <User className="w-4 h-4 text-gray-500" aria-hidden="true" />
              {copy.ownerUsername}
            </div>
          </div>

          {/* Right: selection indicator */}
          {showSelection && selected && (
            <div className="flex-shrink-0 ml-2">
              <div className="w-5 h-5 bg-lavender-400 rounded-full flex items-center justify-center">
                <svg
                  className="w-3 h-3 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Notes (if present) */}
        {copy.notes && (
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
