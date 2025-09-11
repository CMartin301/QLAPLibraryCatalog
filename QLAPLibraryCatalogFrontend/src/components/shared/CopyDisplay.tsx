import React from 'react';
import { MediaCopy } from '../../types/media';

interface CopyDisplayProps {
  copy: MediaCopy;
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
  
  // Condition color mapping for consistency
  const getConditionBadge = (condition: string) => {
    const colorMap = {
      'Excellent': 'bg-green-100 text-green-800',
      'Very Good': 'bg-blue-100 text-blue-800',
      'Good': 'bg-yellow-100 text-yellow-800',
      'Fair': 'bg-orange-100 text-orange-800',
      'Poor': 'bg-red-100 text-red-800'
    };
    
    return colorMap[condition as keyof typeof colorMap] || 'bg-gray-100 text-gray-800';
  };

  // Base styles for different variants
  const variantStyles = {
    card: `p-4 rounded-lg border-2 ${
      copy.isAvailable 
        ? 'border-green-200 bg-green-50' 
        : 'border-gray-200 bg-gray-50'
    }`,
    selection: `p-4 rounded-lg border-2 transition-all cursor-pointer ${
      selected
        ? 'border-lavender-400 bg-lavender-50'
        : 'border-gray-200 hover:border-gray-300'
    }`,
    compact: 'p-3 rounded border border-gray-200 bg-white',
    list: 'p-2 border-b border-gray-100 last:border-b-0'
  };

  // Layout styles for different variants
  const layoutStyles = {
    card: 'space-y-2',
    selection: 'space-y-2',
    compact: 'space-y-1',
    list: 'flex items-center justify-between'
  };

  const handleClick = () => {
    if (onClick && copy.isAvailable) {
      onClick();
    }
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
      aria-label={onClick ? `Select copy ${copy.copyId} in ${copy.condition} condition` : undefined}
    >
      <div className={layoutStyles[variant]}>
        
        {/* Header with copy ID and status */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-gray-900">
              Copy #{copy.copyId}
            </span>
            
            {/* Availability badge */}
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              copy.isAvailable 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {copy.isAvailable ? 'Available' : 'On Loan'}
            </span>
            
            {/* Condition badge */}
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              getConditionBadge(copy.condition)
            }`}>
              {copy.condition}
            </span>
          </div>

          {/* Selection indicator */}
          {showSelection && selected && (
            <div className="flex-shrink-0 ml-2">
              <div className="w-5 h-5 bg-lavender-400 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Copy details */}
        {variant !== 'list' && (
          <div className={`grid gap-2 text-sm text-gray-600 ${
            variant === 'compact' ? 'grid-cols-1' : 'grid-cols-2'
          }`}>
            <div>
              <span className="font-medium">Max loan:</span> {copy.maxLoanDays} days
            </div>
            <div>
              <span className="font-medium">Approval:</span>{' '}
              {copy.requiresApproval ? 'Required' : 'Not required'}
            </div>
          </div>
        )}

        {/* List variant - compact display */}
        {variant === 'list' && (
          <div className="text-sm text-gray-600">
            {copy.maxLoanDays} days • {copy.requiresApproval ? 'Approval required' : 'No approval'}
          </div>
        )}

        {/* Approval indicator for compact/list views */}
        {copy.requiresApproval && (variant === 'compact' || variant === 'list') && (
          <div className="text-xs text-amber-600 flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Requires approval
          </div>
        )}

        {/* Notes */}
        {copy.notes && (
          <div className={`p-2 bg-gray-50 rounded text-xs text-gray-600 ${
            variant === 'list' ? 'mt-1' : 'mt-2'
          }`}>
            <strong>Notes:</strong> {copy.notes}
          </div>
        )}
      </div>
    </div>
  );
}