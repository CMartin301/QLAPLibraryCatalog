import { useMemo, useState } from 'react';
import { createColumnHelper, ColumnDef } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import { Media, MediaCopy, CreateMediaRequest, MediaFormData, CreateMediaCopyRequest } from '../../types/media';
import { TableContainer } from '../shared/TableContainer';
import { Modal } from '../shared/Modal';
import { AddMediaForm } from './AddMediaForm';
import { AddMediaCopyForm } from './AddMediaCopyForm';
import { AddBorrowRequestForm } from '../borrowing/borrowRequests/AddBorrowRequestForm';
import { MediaModal } from './MediaModal';
import { mediaService } from '../../services/mediaService';
import useAuth from '../../hooks/useAuth';
import { useTableActions } from '../../hooks/useTableActions';
import { StatusBadge } from '../shared/StatusBadge';

interface CatalogMediaTableProps {
  media: Media[];
  loading?: boolean;
  error?: string | null;
  onRefresh: () => void;
  mode?: 'catalog' | 'addToCollection';
}

export function CatalogMediaTable({
  media,
  loading,
  error,
  onRefresh,
  mode = 'catalog'
}: CatalogMediaTableProps) {
  const { userID } = useAuth();
  const { executeAction, isLoading: actionLoading } = useTableActions();
  
  // Modal states
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [isAddMediaModalOpen, setIsAddMediaModalOpen] = useState(false);
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  const [selectedMediaForCopy, setSelectedMediaForCopy] = useState<Media | null>(null);
  const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);
  const [selectedCopyForBorrow, setSelectedCopyForBorrow] = useState<number | null>(null);
  const [addingToCopyMediaId, setAddingToCopyMediaId] = useState<number | null>(null);
  

  const columnHelper = createColumnHelper<Media>();

  const columns = useMemo<ColumnDef<Media, any>[]>(() => [
    // Title & Creator
    columnHelper.accessor(row => row.title ?? "—", {
      id: "title",
      header: "Title",
      cell: info => {
        const row = info.row.original;
        return (
          <div className="flex flex-col min-w-0">
            <p className="font-medium text-gray-900 truncate">
              {row.title}
            </p>
            <p className="text-sm text-gray-500 truncate">
              {row.creator || "Unknown author"}
            </p>
          </div>
        );
      },
      enableSorting: true,
      size: 280,
    }),

    // Media Type
    columnHelper.accessor(row => row.mediaType?.displayName ?? "Unknown", {
      id: "mediaType",
      header: "Type",
      cell: info => (
        <span className="text-sm text-gray-900">{info.getValue()}</span>
      ),
      enableSorting: true,
      size: 120,
    }),
// Genre
columnHelper.accessor(row => row.genre ?? "Unknown", {
  id: "genre",
  header: "Genre",
  cell: info => {
    const config = {
      text: info.getValue(),
      color: 'purple' as const
    };
    return <StatusBadge config={config} />;
  },
  enableSorting: true,
  size: 140,
}),

// Availability
columnHelper.accessor(row => row.copies ?? [], {
  id: "availability",
  header: "Availability",
  cell: info => {
    const copies = info.getValue();
    const hasAvailableCopies = copies.some((c: MediaCopy) => c.isAvailable);
    
    const config = {
      text: hasAvailableCopies ? 'Available' : 'Not Available',
      color: hasAvailableCopies ? 'green' as const : 'red' as const
    };
    return <StatusBadge config={config} />;
  },
  enableSorting: false,
  size: 120,
}),

    // Actions
    columnHelper.display({
      id: "actions",
      header: "Actions",
      size: 180,
      cell: info => {
        const mediaItem = info.row.original;
        const isAdding = addingToCopyMediaId === mediaItem.mediaId;

        if (mode === 'addToCollection') {
          return (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCollection(mediaItem);
              }}
              disabled={isAdding}
              className="inline-flex items-center px-3 py-1 text-xs font-medium rounded bg-lavender-400 text-white hover:bg-lavender-500 disabled:bg-gray-300 transition-colors gap-1"
            >
              <Plus size={14} />
              {isAdding ? "Adding..." : "Add to Collection"}
            </button>
          );
        }

        // Catalog mode - Request Item
        return (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRequestItem(mediaItem);
            }}
            className="inline-flex items-center px-3 py-1 text-xs font-medium rounded bg-lavender-400 text-white hover:bg-lavender-500 transition-colors gap-1"
          >
            Request Item
          </button>
        );
      },
    }),
  ], [mode, addingToCopyMediaId]);

  const handleRowClick = (media: Media) => {
    setSelectedMedia(media);
    setIsMediaModalOpen(true);
  };

  const handleAddToCollection = (mediaItem: Media) => {
    setAddingToCopyMediaId(mediaItem.mediaId);
    setSelectedMediaForCopy(mediaItem);
    setIsCopyModalOpen(true);
  };

const handleRequestItem = (mediaItem: Media) => {
  const availableCopies = mediaItem.copies?.filter(copy => copy.isAvailable) || [];
  
  if (availableCopies.length === 0) {
    executeAction(
      () => Promise.reject(new Error('No available copies for this item')),
      { errorMessage: 'No available copies for this item' }
    );
    return;
  }
  
  setSelectedMedia(mediaItem);
  setSelectedCopyForBorrow(availableCopies[0].copyId);
  setIsBorrowModalOpen(true);
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
        setSelectedMedia(null);
        setSelectedCopyForBorrow(null);
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
          setSelectedMedia(null);
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
          setSelectedMedia(null);
          setSelectedCopyForBorrow(null);
        }}
        title={selectedMedia ? `Request "${selectedMedia.title}"` : 'Request Item'}
      >
        {selectedCopyForBorrow && userID && (
<AddBorrowRequestForm
  copyId={selectedCopyForBorrow}
  borrowerId={userID}
  onSubmit={handleBorrowRequestSubmit}
  isSubmitting={actionLoading}
  submitError={null}
/>
        )}
      </Modal>
    </>
  );
}