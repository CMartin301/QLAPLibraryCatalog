import { useMemo, useState } from 'react';
import { createColumnHelper, ColumnDef } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import { Media, MediaCopy } from '../../types/media';
import { TableContainer } from '../shared/TableContainer';
import { Modal } from '../shared/Modal';
import { AddMediaCopyForm } from './AddMediaCopyForm';
import { MediaModal } from './MediaModal';
import { CreateMediaCopyRequest } from '../../types/media';
import { mediaService } from '../../services/mediaService';

interface UserMediaTableProps {
  media: Media[];
  loading?: boolean;
  error?: string | null;
  onRefresh: () => void;
  onSaveMessage: (message: string) => void;
  onSwitchToAddTab?: () => void;
}

export function UserMediaTable({
  media,
  loading,
  error,
  onRefresh,
  onSaveMessage,
  onSwitchToAddTab
}: UserMediaTableProps) {
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  const [selectedMediaForCopy, setSelectedMediaForCopy] = useState<Media | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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

    // Number of Copies
    columnHelper.accessor(row => row.copies?.length ?? 0, {
      id: "copiesCount",
      header: "My Copies",
      cell: info => {
        const count = info.getValue();
        const row = info.row.original;
        const availableCount = row.copies?.filter((c: MediaCopy) => c.isAvailable).length ?? 0;
        
        return (
          <div className="text-sm text-gray-900">
            {count} total 
            {count > 0 && (
              <span className="text-green-600 ml-1">
                ({availableCount} available)
              </span>
            )}
          </div>
        );
      },
      enableSorting: true,
      size: 140,
    }),

    // Actions
    columnHelper.display({
      id: "actions",
      header: "Actions",
      size: 160,
      cell: info => {
        const mediaItem = info.row.original;
        return (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAddCopy(mediaItem);
            }}
            className="inline-flex items-center px-3 py-1 text-xs font-medium rounded bg-lavender-400 text-white hover:bg-lavender-500 transition-colors gap-1"
          >
            <Plus size={14} />
            Add Copy
          </button>
        );
      },
    }),
  ], []);

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

  const actionButton = onSwitchToAddTab ? {
    text: 'Add to Collection',
    onClick: onSwitchToAddTab
  } : null;

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