import React from 'react';
import { Book, Calendar, Globe, User, Check, Hash, BookOpen, Building } from 'lucide-react';
import { MediaDto } from '../../../types/media';
import { TagDto } from '../../../types/tags';
import { StatusBadge } from '../StatusBadge';

interface MediaDisplayProps {
  media: MediaDto;
  variant?: 'card' | 'selection' | 'compact' | 'list' | 'modal';
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
    list: 'p-2 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors',
    modal: '' // Special layout for modal view
  };

  const layoutStyles = {
    card: 'space-y-3',
    selection: 'space-y-3',
    compact: 'space-y-2',
    list: 'flex flex-col space-y-2',
    modal: ''
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const InfoRow = ({ icon: Icon, label, value }: { 
    icon: React.ComponentType<{ size?: number; className?: string }>;
    label: string;
    value: string | number | null | undefined;
  }) => {
    if (!value) return null;
    
    return (
      <div className="flex items-start gap-3 py-1">
        <Icon size={16} className="text-lavender-500 mt-0.5 flex-shrink-0" />
        <div className="min-w-0 flex-1">
          <span className="text-sm font-medium text-gray-700">{label}:</span>
          <span className="ml-2 text-sm text-gray-900">{value}</span>
        </div>
      </div>
    );
  };

  // Modal variant - detailed view
  if (variant === 'modal') {
    return (
      <div className={`${variantStyles[variant]} ${className}`}>
        {/* Header with cover and basic info */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          {/* Cover Image */}
          <div className="flex-shrink-0 mx-auto sm:mx-0">
            {media.coverImageUrl ? (
              <img
                src={media.coverImageUrl}
                alt={`Cover of ${media.title}`}
                className="w-24 h-36 sm:w-32 sm:h-48 object-cover rounded-lg shadow-sm border"
                loading="lazy"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.style.display = 'none';
                  // Show fallback div
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
            ) : null}
            
            {/* Fallback cover */}
            <div 
              className={`w-24 h-36 sm:w-32 sm:h-48 bg-gray-200 rounded-lg shadow-sm border flex items-center justify-center ${
                media.coverImageUrl ? 'hidden' : 'flex'
              }`}
              style={{ display: media.coverImageUrl ? 'none' : 'flex' }}
            >
              <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
            </div>
          </div>

          {/* Basic Info */}
          <div className="flex-1 space-y-3 text-center sm:text-left">
            {/* Title and Subtitle */}
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 break-words flex items-center gap-2">
                <Book className="w-5 h-5 text-lavender-500 flex-shrink-0" aria-hidden="true" />
                <span>{media.title}</span>
              </h2>
              {media.subtitle && (
                <p className="text-base sm:text-lg text-gray-600 break-words">{media.subtitle}</p>
              )}
              {/* Creator - consistent with other variants */}
              <p className="text-sm text-gray-700 mt-1">by {media.creator}</p>
            </div>

            {/* Badge row - consistent with other variants */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Media type badge */}
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-lavender-100 text-lavender-700">
                {media.mediaTypeName}
              </span>
              
              {/* Genre badge */}
              {media.genre && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                  {media.genre}
                </span>
              )}
              
              {/* Publication date */}
              {media.publicationDate && (
                <span className="inline-flex items-center px-1.5 py-0.5 text-xs text-gray-600 gap-1">
                  <Calendar className="w-3 h-3" aria-hidden="true" />
                  <span>{new Date(media.publicationDate).getFullYear()}</span>
                </span>
              )}
              
              {/* Language if not English */}
              {media.language && (
                <span className="inline-flex items-center px-1.5 py-0.5 text-xs text-gray-600 gap-1">
                  <Globe className="w-3 h-3" aria-hidden="true" />
                  <span>{media.language}</span>
                </span>
              )}
            </div>


            {/* Description - consistent styling with other variants */}
            {media.description && media.description.trim() !== '' && (
              <div className="p-2 bg-gray-50 rounded text-xs text-gray-600 mt-4">
                <p className="leading-relaxed whitespace-pre-wrap">{media.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Detailed Information - no border separator */}
        <p className="text-base sm:text-lg text-gray-600 break-words mt-4">Details</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-1">
          <div className="">
            <InfoRow icon={Building} label="Publisher" value={media.publisher} />
            <InfoRow icon={Calendar} label="Publication Date" value={media.publicationDate} />
            <InfoRow icon={BookOpen} label="Pages" value={media.pageCount} />
          </div>
          
          <div className="">
            <InfoRow icon={Hash} label="ISBN-10" value={media.isbn10} />
            <InfoRow icon={Hash} label="ISBN-13" value={media.isbn13} />
            {media.volume && <InfoRow icon={Hash} label="Volume" value={media.volume} />}
            {media.issueNumber && <InfoRow icon={Hash} label="Issue" value={media.issueNumber} />}
          </div>
        </div>
        <p className="text-base sm:text-lg text-gray-600 break-words mt-2">Tags</p>
        <div className="flex flex-wrap gap-1 mt-2">
                    {media.tags && (
                      media.tags.map((tag: TagDto) => {
                      const config = {
                        text: tag.tagName,
                        color: 'purple' as const
                      };
                      return <StatusBadge key={tag.tagId} config={config} />;
                    })
                  )}
                  </div>

      </div>
    );
  }

  // All other variants (existing logic)
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