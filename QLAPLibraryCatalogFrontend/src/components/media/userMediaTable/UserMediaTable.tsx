import { useState } from 'react';
import { MediaCopyDto, MediaDto } from '../../../types/media';
import { TableContainer } from '../../shared/TableContainer';
import { Modal } from '../../shared/Modal';
import { AddMediaCopyForm } from '../AddMediaCopyForm';
import { MediaModal } from '../MediaModal';
import { CreateMediaCopyRequest } from '../../../types/media';
import { mediaService } from '../../../services/mediaService';
import { useUserMediaColumns } from './userMediaColumns';
import { useNavigate } from 'react-router-dom';
import { useFilters } from '../../../hooks/useFilters';
import { createMediaFilterConfig } from '../../../config/mediaFilters';
import { createMediaCopiesFilterConfig } from '../../../config/mediaCopyFilters';
import { FilterPanel } from '../../shared/filters/FilterPanel';
import { UserMediaModal } from '../UserMediaModal';

interface UserMediaTableProps {
  media: MediaCopyDto[];
  loading?: boolean;
  error?: string | undefined;
  onRefresh: () => void;
  onSaveMessage: (message: string) => void;
}

export function UserMediaTable({
  media: mediaCopies,
  loading,
  error,
  onRefresh,
  onSaveMessage,
}: UserMediaTableProps) {
  const [selectedMedia, setSelectedMedia] = useState<MediaCopyDto | undefined>(undefined);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  const [selectedMediaForCopy, setSelectedMediaForCopy] = useState<MediaDto | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | undefined>(undefined);
  const navigate = useNavigate();

  const {
    filteredData,
    filters,
    updateFilters,
    activeFilterCount
  } = useFilters({
    data: mediaCopies,
    createFilterConfig: createMediaCopiesFilterConfig
  });

  const handleRowClick = (mediaCopy: MediaCopyDto) => {
    console.log(mediaCopy.media)
    setSelectedMedia(mediaCopy);
    setIsMediaModalOpen(true);
  };

  const handleAddCopy = (mediaCopy: MediaCopyDto) => {
    setSelectedMediaForCopy(mediaCopy.media);
    setIsCopyModalOpen(true);
  };

  const handleAddMediaCopy = async (data: CreateMediaCopyRequest) => {
    setIsSubmitting(true);
    setSubmitError(undefined);

    try {
      const copyData = selectedMediaForCopy 
        ? { ...data, mediaId: selectedMediaForCopy.mediaId }
        : data;

      await mediaService.createNewMediaCopy(copyData);
      setIsCopyModalOpen(false);
      setSelectedMediaForCopy(undefined);
      
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
          <FilterPanel
            filters={filters}
            onFiltersChange={updateFilters}
            className="mb-4"
          />
      <TableContainer
        data={filteredData}
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
      <UserMediaModal
        
        mediaCopy={selectedMedia}
        isOpen={isMediaModalOpen}
        onClose={() => {
          setIsMediaModalOpen(false);
          setSelectedMedia(undefined);
        }}
      />

      {/* Add Copy Modal */}
      <Modal
        isOpen={isCopyModalOpen}
        onClose={() => {
          setIsCopyModalOpen(false);
          setSelectedMediaForCopy(undefined);
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