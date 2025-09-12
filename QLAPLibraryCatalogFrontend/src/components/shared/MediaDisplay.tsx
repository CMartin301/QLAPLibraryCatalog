import React from 'react';
import { Media, MediaDto } from '../../types/media';
import { Book, Calendar, Globe, User, Check, Hash } from 'lucide-react';

interface MediaDisplayProps {
  media: MediaDto;
  variant?: 'card' | 'selection' | 'compact' | 'list';
  selected?: boolean;
  onClick?: () => void;
  showSelection?: boolean;
  showCopyCount?: boolean;
  className?: string;
}

export function MediaDisplay({
  media,
  variant = 'card',
  selected = false,
  onClick,
  showSelection = false,
  showCopyCount = true,
  className = ''
}: MediaDisplayProps) {
  const variantStyles = {
    card: 'p-4 rounded-lg border-2 border-gray-200 bg-white hover:border-gray-300 transition-colors',
    selection: `p-4 rounded-lg border-2 transition-all cursor-pointer ${
      selected ? 'border-lavender-400 bg-lavender-50' : 'border-gray-200 hover:border-gray-300'
    }`,
    compact: 'p-3 rounded border border-gray-200 bg-white hover:border-gray-300 transition-colors',
    list: 'p-2 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors'
  };

  const layoutStyles = {
    card: 'space-y-3',
    selection: 'space-y-3',
    compact: 'space-y-2',
    list: 'flex flex-col space-y-2'
  };

  const handleClick = () => {
    if (onClick) onClick();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && onClick) {
      e.preventDefault();
      onClick();
    }
  };

  // // Calculate available copies count
  // const availableCopiesCount = media.copies?.filter(copy => copy.isAvailable).length || 0;
  // const totalCopiesCount = media.copies?.length || 0;

  return (
    <div
      className={`${variantStyles[variant]} ${className}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? 'button' : undefined}
      aria-label={onClick ? `Select ${media.title}` : undefined}
    >
      <div className={layoutStyles[variant]}>
        {/* Top row: Media info and selection indicator */}
        <div className="flex items-start justify-between gap-4">
          {/* Left: media info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <Book className="w-4 h-4 text-lavender-500 flex-shrink-0" aria-hidden="true" />
              <span className="truncate">{media.title}</span>
            </h3>
            
            {/* Subtitle if present */}
            {media.subtitle && (
              <p className="text-sm text-gray-600 mt-1 truncate">{media.subtitle}</p>
            )}
            
            {/* Creator */}
            <p className="text-sm text-gray-700 mt-1 truncate">by {media.creator}</p>
          </div>

          {/* Right: selection indicator */}
          {showSelection && selected && (
            <div className="ml-2 w-6 h-6 bg-lavender-400 rounded-full flex items-center justify-center flex-shrink-0">
              <Check className="w-4 h-4 text-white" />
            </div>
          )}
        </div>

        {/* Status row: Media metadata (left), Copy count (right) */}
        <div className="flex items-start justify-between gap-4">
          {/* Left: Media type and publication info */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Media type badge */}
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-lavender-100 text-lavender-700">
              {media.mediaTypeName}
            </span>
            
            {/* Genre if present */}
            {media.genre && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                {media.genre}
              </span>
            )}
            
            {/* Publication date if present */}
            {media.publicationDate && (
              <span className="inline-flex items-center px-1.5 py-0.5 text-xs text-gray-600 gap-1">
                <Calendar className="w-3 h-3" aria-hidden="true" />
                <span>{new Date(media.publicationDate).getFullYear()}</span>
              </span>
            )}
            
            {/* Language if not English */}
            {media.language && media.language.toLowerCase() !== 'english' && media.language.toLowerCase() !== 'en' && (
              <span className="inline-flex items-center px-1.5 py-0.5 text-xs text-gray-600 gap-1">
                <Globe className="w-3 h-3" aria-hidden="true" />
                <span>{media.language}</span>
              </span>
            )}
          </div>

        </div>

        {/* Additional metadata row for certain variants */}
        {(variant === 'card' || variant === 'selection') && (
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
            {/* Publisher */}
            {media.publisher && (
              <div className="flex items-center gap-1">
                <span className="font-medium">Publisher:</span>
                <span>{media.publisher}</span>
              </div>
            )}
            
            {/* ISBN if present */}
            {(media.isbn13 || media.isbn10) && (
              <div className="flex items-center gap-1">
                <span className="font-medium">ISBN:</span>
                <span>{media.isbn13 || media.isbn10}</span>
              </div>
            )}
            
            {/* Page count if present */}
            {media.pageCount && (
              <div className="flex items-center gap-1">
                <span className="font-medium">Pages:</span>
                <span>{media.pageCount}</span>
              </div>
            )}
            
            {/* Volume/Issue for serials */}
            {(media.volume || media.issueNumber) && (
              <div className="flex items-center gap-1">
                {media.volume && <span>Vol. {media.volume}</span>}
                {media.volume && media.issueNumber && <span>,</span>}
                {media.issueNumber && <span>Issue {media.issueNumber}</span>}
              </div>
            )}
          </div>
        )}

        {/* Description for card variant only */}
        {variant === 'card' && media.description && media.description.trim() !== '' && (
          <div className="p-2 bg-gray-50 rounded text-xs text-gray-600">
            <p className="line-clamp-2">{media.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}