// MediaModal.tsx
import { MediaDto, MediaCopyDto } from '../../types/media';
import { Modal } from '../shared/Modal';
import { Users } from 'lucide-react';
import { CopyDisplay } from '../shared/displays/CopyDisplay';
import { MediaDisplay } from '../shared/displays/MediaDisplay';

interface UserMediaModalProps {
  mediaCopy: MediaCopyDto | undefined;
  isOpen: boolean;
  onClose: () => void;
}

export function UserMediaModal({ 
  mediaCopy: mediaCopy, 
  isOpen, 
  onClose
}: UserMediaModalProps) {
  if (!mediaCopy) return null;


  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title={mediaCopy.media?.title}
      size="lg" 
    >
      <div className="space-y-6">
        {/* Media Information - Using MediaDisplay with modal variant */}
        {mediaCopy.media &&(
            <MediaDisplay 
            media={mediaCopy.media} 
            variant="modal"
            />
        )}
         <CopyDisplay
                  key={mediaCopy.copyId}
                  copy={mediaCopy}
                  variant="emphasis" // Use your new emphasis variant for modal display
                  className="transition-all hover:shadow-sm"
                />

      </div>
    </Modal>
  );
}