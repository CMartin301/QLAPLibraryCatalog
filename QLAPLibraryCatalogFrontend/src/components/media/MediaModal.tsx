// MediaModal.tsx
import { MediaDto, MediaCopyDto } from '../../types/media';
import { Modal } from '../shared/Modal';
import { Users } from 'lucide-react';
import { CopyDisplay } from '../shared/displays/CopyDisplay';
import { MediaDisplay } from '../shared/displays/MediaDisplay';

interface MediaModalProps {
  media: MediaDto | undefined;
  copies?: MediaCopyDto[];
  isOpen: boolean;
  onClose: () => void;
  showCopies?: boolean;
}

export function MediaModal({ 
  media, 
  copies = [], 
  isOpen, 
  onClose, 
  showCopies = true 
}: MediaModalProps) {
  if (!media) return null;

  const availableCount = copies.filter(copy => copy.isAvailable).length;
  const totalCount = copies.length;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title={media.title}
      size="lg" 
    >
      <div className="space-y-6">
        {/* Media Information - Using MediaDisplay with modal variant */}
        <MediaDisplay 
          media={media} 
          variant="modal"
        />
        
        {/* Copies Section - Using your existing CopyDisplay components */}
        {showCopies && copies && copies.length > 0 && (
          <div className="pt-6 border-t">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-lavender-500 flex-shrink-0" />
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                Available Copies
              </h3>
              <span className="text-sm text-gray-600">
                ({availableCount}/{totalCount})
              </span>
            </div>
            
            {/* Copy cards using your existing CopyDisplay component */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {copies.map(copy => (
                <CopyDisplay
                  key={copy.copyId}
                  copy={copy}
                  variant="emphasis" // Use your new emphasis variant for modal display
                  className="transition-all hover:shadow-sm"
                />
              ))}
            </div>
            
            {/* Summary for screen readers */}
            <div className="sr-only">
              {availableCount} of {totalCount} copies are currently available for borrowing.
            </div>
          </div>
        )}

        {/* Empty state for copies */}
        {showCopies && (!copies || copies.length === 0) && (
          <div className="pt-6 border-t">
            <div className="text-center py-8 text-gray-500">
              <Users className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p>No copies available for this media item.</p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}