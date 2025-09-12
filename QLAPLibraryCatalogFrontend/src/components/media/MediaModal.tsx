// MediaModal.tsx
import React from 'react';
import { Media, MediaCopy } from '../../types/media';
import { Modal } from '../shared/Modal';
import { Calendar, User, Building, Globe, BookOpen, Hash, Users } from 'lucide-react';

interface MediaModalProps {
  media: Media | undefined;
  isOpen: boolean;
  onClose: () => void;
  showCopies?: boolean;
}

export function MediaModal({ media, isOpen, onClose, showCopies = true }: MediaModalProps) {
  if (!media) return null;

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
      <div className="flex items-start gap-3 py-2">
        <Icon size={16} className="text-lavender-500 mt-0.5 flex-shrink-0" />
        <div className="min-w-0 flex-1">
          <span className="text-sm font-medium text-gray-700">{label}:</span>
          <span className="ml-2 text-sm text-gray-900">{value}</span>
        </div>
      </div>
    );
  };

  const CopyCard = ({ copy }: { copy: MediaCopy }) => (
    <div className={`p-4 rounded-lg border-2 transition-colors ${
      copy.isAvailable 
        ? 'border-green-200 bg-green-50' 
        : 'border-gray-200 bg-gray-50'
    }`}>
      <div className="flex justify-between items-start mb-2">
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          copy.isAvailable 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {copy.isAvailable ? 'Available' : 'On Loan'}
        </span>
        <span className="text-xs text-gray-500">Copy #{copy.copyId}</span>
      </div>
      
      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Condition:</span>
          <span className="font-medium">{copy.condition}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Max loan:</span>
          <span className="font-medium">{copy.maxLoanDays} days</span>
        </div>
        {copy.requiresApproval && (
          <div className="text-xs text-amber-600 mt-2">
            📋 Requires approval
          </div>
        )}
        {copy.notes && (
          <div className="text-xs text-gray-600 mt-2 p-2 bg-white rounded border">
            <strong>Notes:</strong> {copy.notes}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title={media.title}
        size="lg" 
    >
      <div className="space-y-6">
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
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 break-words">
                {media.title}
              </h2>
              {media.subtitle && (
                <p className="text-base sm:text-lg text-gray-600 break-words">{media.subtitle}</p>
              )}
            </div>

            {/* Genre Badge */}
            {media.genre && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-lavender-100 text-lavender-700">
                {media.genre}
              </span>
            )}

            {/* Media Type */}
            <div className="text-sm text-gray-600">
              <strong>Type:</strong> {media.mediaType?.displayName || 'Unknown'}
            </div>
          </div>
        </div>

        {/* Detailed Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
          <div className="space-y-1">
            <InfoRow icon={User} label="Creator" value={media.creator} />
            <InfoRow icon={Building} label="Publisher" value={media.publisher} />
            <InfoRow icon={Calendar} label="Published" value={media.publicationDate ? formatDate(media.publicationDate) : null} />
            <InfoRow icon={Globe} label="Language" value={media.language} />
          </div>
          
          <div className="space-y-1">
            <InfoRow icon={BookOpen} label="Pages" value={media.pageCount} />
            <InfoRow icon={Hash} label="ISBN-10" value={media.isbn10} />
            <InfoRow icon={Hash} label="ISBN-13" value={media.isbn13} />
            {media.volume && <InfoRow icon={Hash} label="Volume" value={media.volume} />}
            {media.issueNumber && <InfoRow icon={Hash} label="Issue" value={media.issueNumber} />}
          </div>
        </div>

        {/* Description */}
        {media.description && (
          <div className="pt-4 border-t">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {media.description}
            </p>
          </div>
        )}

        {/* Copies Section */}
        {showCopies && media.copies && media.copies.length > 0 && (
          <div className="pt-4 border-t">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-lavender-500 flex-shrink-0" />
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                Available Copies ({media.copies.filter(c => c.isAvailable).length}/{media.copies.length})
              </h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {media.copies.map(copy => (
                <CopyCard key={copy.copyId} copy={copy} />
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}