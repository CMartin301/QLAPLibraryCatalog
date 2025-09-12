import { useState } from 'react';
import { Media, CreateMediaRequest, MediaFormData, CreateMediaCopyRequest, MediaCopyDto, MediaDto } from '../../../types/media';
import { TableContainer } from '../../shared/TableContainer';
import { Modal } from '../../shared/Modal';
import { AddMediaForm } from '../AddMediaForm';
import { AddMediaCopyForm } from '../AddMediaCopyForm';
import { AddBorrowRequestForm } from '../../borrowing/borrowRequests/AddBorrowRequestForm';
import { MediaModal } from '../MediaModal';
import { mediaService } from '../../../services/mediaService';
import useAuth from '../../../hooks/useAuth';
import { useTableActions } from '../../../hooks/useTableActions';
import { useNetworkMediaColumns } from './networkMediaColumns';

interface NetworkMediaTableProps {
  media: MediaDto[];
  loading?: boolean;
  error?: string | null;
  onRefresh: () => void;
  mode?: 'catalog' | 'addToCollection';
}

export function NetworkMediaTable({
  media,
  loading,
  error,
  onRefresh,
  mode = 'catalog'
}: NetworkMediaTableProps) {
  const { userID } = useAuth();
  const { executeAction, isLoading: actionLoading } = useTableActions();
  
  // Modal states
  const [selectedMedia, setSelectedMedia] = useState<MediaDto | undefined>(undefined);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [isAddMediaModalOpen, setIsAddMediaModalOpen] = useState(false);
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  const [selectedMediaForCopy, setSelectedMediaForCopy] = useState<MediaDto | null>(null);

  const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);
  const [selectedCopyForBorrow, setSelectedCopyForBorrow] = useState<number | undefined>(undefined);
    const [mediaCopies, setMediaCopies] = useState<MediaCopyDto[]>([]);
  // const [requestModalData, setRequestModalData] = useState<number | undefined>(undefined);

  const [addingToCopyMediaId, setAddingToCopyMediaId] = useState<number | null>(null);

  const handleRowClick = (media: MediaDto) => {
    setSelectedMedia(media);
    setIsMediaModalOpen(true);
  };

  const handleAddToCollection = (mediaItem: MediaDto) => {
    setAddingToCopyMediaId(mediaItem.mediaId);
    setSelectedMediaForCopy(mediaItem);
    setIsCopyModalOpen(true);
  };

const handleRequestItem = async (mediaItem: MediaDto) => {
  
  if (mediaItem.availableCopiesCount === 0) {
    executeAction(
      () => Promise.reject(new Error('No available copies for this item')),
      { errorMessage: 'No available copies for this item' }
    );
    return;
  }

    try {
    const enrichedCopies = await mediaService.getMediaCopiesByMediaID(mediaItem.mediaId);
    const availableEnrichedCopies = enrichedCopies.filter(copy => copy.isAvailable) //only available copies
                                                  .filter(copy => copy.ownerUserId != userID); //exclude copies owned byuser

    setMediaCopies(availableEnrichedCopies);
    setSelectedMedia(mediaItem);
    setSelectedCopyForBorrow(undefined);
    setIsBorrowModalOpen(true);
  } catch (error) {
    console.error('Error loading enriched copies:', error);
  }
  
  // setSelectedMedia(mediaItem);
  // setSelectedCopyForBorrow(undefined);
  // setIsBorrowModalOpen(true);
};

  const handleAddMedia = async (data: MediaFormData) => {
  const apiPayload: CreateMediaRequest = {
    mediaTypeId: data.mediaTypeId,
    title: data.title,
    creator: data.creator,
    subtitle: data.subtitle || null,
    publisher: data.publisher || null,
    publicationDate: data.publicationDate || null,
    language: data.language || null,
    genre: data.genre || null,
    description: data.description || null,
    coverImageUrl: data.coverImageUrl || null,
    isbn10: data.isbn10 || null,
    isbn13: data.isbn13 || null,
    pageCount: data.pageCount || null,
    issueNumber: data.issueNumber ? data.issueNumber.toString() : null,
    volume: data.volume ? data.volume.toString() : null,
  };

  return executeAction(
    () => mediaService.createNewMedia(apiPayload),
    {
      onSuccess: () => {
        setIsAddMediaModalOpen(false);
        onRefresh();
      },
      successMessage: 'Media added successfully!',
      errorMessage: 'Failed to create media'
    }
  );
};
const handleAddMediaCopy = async (data: CreateMediaCopyRequest) => {
  const copyData = selectedMediaForCopy 
    ? { ...data, mediaId: selectedMediaForCopy.mediaId }
    : data;

  const title = selectedMediaForCopy?.title || 'Media';
  
  return executeAction(
    () => mediaService.createNewMediaCopy(copyData),
    {
      onSuccess: () => {
        setIsCopyModalOpen(false);
        setSelectedMediaForCopy(null);
        setAddingToCopyMediaId(null);
        onRefresh();
      },
      successMessage: `"${title}" added to your collection!`,
      errorMessage: 'Failed to add media copy'
    }
  );
};

const handleBorrowRequestSubmit = async () => {
  return executeAction(
    () => Promise.resolve(),
    {
      onSuccess: () => {
        setIsBorrowModalOpen(false);
        setSelectedMedia(undefined);
        setSelectedCopyForBorrow(undefined);
        onRefresh();
      },
      successMessage: 'Borrow request submitted successfully!'
    }
  );
};

  const actionButton = mode === 'catalog' ? {
    text: 'Add Book',
    onClick: () => setIsAddMediaModalOpen(true)
  } : null;

  const columns = useNetworkMediaColumns({
    handlers: {
      onAddToCollection: handleAddToCollection,
      onRequestItem: handleRequestItem
    },
    addingToCopyMediaId
  });

  return (
    <>
      <TableContainer
        data={media}
        columns={columns}
        loading={loading}
        error={error}
        onRefresh={onRefresh}
        emptyMessage="No books found"
        searchPlaceholder="Search catalog..."
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
          setSelectedMedia(undefined);
          setSelectedCopyForBorrow(undefined);
        }}
        showCopies={true}
      />

      {/* Add Media Modal */}
      <Modal
        isOpen={isAddMediaModalOpen}
        onClose={() => setIsAddMediaModalOpen(false)}
        title="Add New Media"
      >
        <AddMediaForm 
          onSubmit={handleAddMedia}
          isSubmitting={actionLoading}
          submitError={null}
        />
      </Modal>

      {/* Add Copy Modal */}
      <Modal
        isOpen={isCopyModalOpen}
        onClose={() => {
          setIsCopyModalOpen(false);
          setSelectedMediaForCopy(null);
          setAddingToCopyMediaId(null);
        }}
        title={selectedMediaForCopy ? `Add "${selectedMediaForCopy.title}" to Collection` : 'Add to Collection'}
      >
        <AddMediaCopyForm
          onSubmit={handleAddMediaCopy}
          isSubmitting={actionLoading}
          submitError={null}
          preselectedMedia={selectedMediaForCopy || undefined}
        />
      </Modal>

      {/* Borrow Request Modal */}
      <Modal
        isOpen={isBorrowModalOpen}
        onClose={() => {
          setIsBorrowModalOpen(false);
          setSelectedMedia(undefined);
          setSelectedCopyForBorrow(undefined);
        }}
        title={selectedMedia ? `Request "${selectedMedia.title}"` : 'Request Item'}
        description="Choose a copy and set your preferred loan dates" 
        size="lg" 
      >
        { userID && (
          <AddBorrowRequestForm
            copyId={selectedCopyForBorrow}
            borrowerId={userID}
            selectedMedia={selectedMedia}
            availableCopies={mediaCopies}
            onCopySelect={(copyId) => {setSelectedCopyForBorrow(copyId);}}
            onSubmit={handleBorrowRequestSubmit}
            isSubmitting={actionLoading}
            submitError={null}
          />
        )}
      </Modal>
    </>
  );
}