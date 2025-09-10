import { useState } from 'react';
import { Media } from '../../../types/media';
import { TableContainer } from '../../shared/TableContainer';
import { Modal } from '../../shared/Modal';
import { AddMediaCopyForm } from '../AddMediaCopyForm';
import { MediaModal } from '../MediaModal';
import { CreateMediaCopyRequest } from '../../../types/media';
import { mediaService } from '../../../services/mediaService';
import { useUserMediaColumns } from './userMediaColumns';
import { useNavigate } from 'react-router-dom';

interface UserMediaTableProps {
  media: Media[];
  loading?: boolean;
  error?: string | null;
  onRefresh: () => void;
  onSaveMessage: (message: string) => void;
}

export function UserMediaTable({
  media,
  loading,
  error,
  onRefresh,
  onSaveMessage,
}: UserMediaTableProps) {
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  const [selectedMediaForCopy, setSelectedMediaForCopy] = useState<Media | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRowClick = (media: Media) => {
    setSelectedMedia(media);
    setIsMediaModalOpen(true);
  };

  const handleAddCopy = (media: Media) => {
    setSelectedMediaForCopy(media);
    setIsCopyModalOpen(true);
  };

  const handleAddMediaCopy = async (data: CreateMediaCopyRequest) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const copyData = selectedMediaForCopy 
        ? { ...data, mediaId: selectedMediaForCopy.mediaId }
        : data;

      await mediaService.createNewMediaCopy(copyData);
      setIsCopyModalOpen(false);
      setSelectedMediaForCopy(null);
      
      onRefresh();
      const title = selectedMediaForCopy?.title || 'Media';
      onSaveMessage(`New copy of "${title}" added to your collection!`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add media copy';
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const actionButton = {
    text:'Add to Collection',
    onClick: () => {
      navigate('/network-catalog');
    }
  };

  const columns = useUserMediaColumns({
    onAddCopy: handleAddCopy
  });

  return (
    <>
      <TableContainer
        data={media}
        columns={columns}
        loading={loading}
        error={error}
        onRefresh={onRefresh}
        emptyMessage="No books in your collection"
        searchPlaceholder="Search your collection..."
        actionButton={actionButton}
        onRowClick={handleRowClick}
        rowClassName="cursor-pointer hover:bg-gray-50"
      />

      {/* Media Detail Modal */}
      <MediaModal
        media={selectedMedia}
        isOpen={isMediaModalOpen}
        onClose={() => {
          setIsMediaModalOpen(false);
          setSelectedMedia(null);
        }}
        showCopies={true}
      />

      {/* Add Copy Modal */}
      <Modal
        isOpen={isCopyModalOpen}
        onClose={() => {
          setIsCopyModalOpen(false);
          setSelectedMediaForCopy(null);
        }}
        title={selectedMediaForCopy ? `Add Copy of "${selectedMediaForCopy.title}"` : 'Add Copy'}
      >
        <AddMediaCopyForm
          onSubmit={handleAddMediaCopy}
          isSubmitting={isSubmitting}
          submitError={submitError}
          preselectedMedia={selectedMediaForCopy || undefined}
        />
      </Modal>
    </>
  );
}