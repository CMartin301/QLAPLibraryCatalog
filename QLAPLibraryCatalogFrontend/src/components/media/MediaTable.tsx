// MediaTable.tsx
import React, { useEffect, useMemo, useState } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
  getPaginationRowModel,
  PaginationState,
} from '@tanstack/react-table';
import { ChevronUp, ChevronDown, Search, Plus, Filter, X, ChevronRight, ChevronLeft } from 'lucide-react';
import { Media, MediaFormData, CreateMediaRequest, CreateMediaCopyRequest } from '../../types/media';
import { AddMediaForm } from './AddMediaForm';
import { Modal } from '../shared/Modal';
import { mediaService } from '../../services/mediaService';
import { useModalScrollLock } from '../../hooks/useModalScrollLock';
import { AddMediaCopyForm } from './AddMediaCopyForm';
import useAuth from '../../hooks/useAuth';
import { AddBorrowRequestForm } from '../borrowing/AddBorrowRequestForm';
import { DataTable } from '../shared/DataTable';


interface MediaTableProps {
  media?: Media[];
  onRefresh?: () => void; 
  onSaveNewMedia?: (message: string) => void; 
  onSwitchToAddTab?: () => void;
  mode?: 'allMedia' | 'myLibrary' | 'addToCollection';
}

export function MediaTable({ media = [], onRefresh, onSaveNewMedia, onSwitchToAddTab, mode = 'allMedia'}: MediaTableProps) {
  const { userID } = useAuth();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [showGenreFilter, setShowGenreFilter] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  const [selectedMediaForCopy, setSelectedMediaForCopy] = useState<Media | null>(null);
  const [addingToCopyMediaId, setAddingToCopyMediaId] = useState<number | null>(null);

  const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);
const [selectedMediaForBorrow, setSelectedMediaForBorrow] = useState<Media | null>(null);
const [selectedCopyForBorrow, setSelectedCopyForBorrow] = useState<number | null>(null);

useModalScrollLock(isModalOpen || isCopyModalOpen || isBorrowModalOpen);

  const columnHelper = createColumnHelper<Media>();

  const columns = useMemo(
    () => {
      const baseColumns = [
        columnHelper.accessor('title', {
          header: 'Title',
          cell: info => (
            <div className="font-medium text-[var(--color-text)]">
              {info.getValue()}
            </div>
          ),
        }),
        columnHelper.accessor('creator', {
          header: 'Author',
          cell: info => (
            <div className="text-[var(--color-text)]">
              {info.getValue()}
            </div>
          ),
        }),
        columnHelper.accessor('genre', {
          header: 'Genre',
          cell: info => (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-lavender-100 bg-opacity-40 text-lavender-500">
              {info.getValue()}
            </span>
          ),
        }),
        columnHelper.display({
          id: 'copies',
          header: 'Copies',
          cell: info => {
            const copies = info.row.original.copies ?? [];
            if (copies.length === 0) {
              return <span className="text-gray-400 text-sm">—</span>;
            }

            const availableCount = copies.filter(c => c.isAvailable).length;
            return (
              <div className="text-sm text-[var(--color-text)]">
                {copies.length} total{" "}
                <span className="text-green-600">({availableCount} available)</span>
              </div>
            );
          },
        }),
      ];

      // Add action column for 'addToCollection' mode
      if (mode === 'addToCollection') {
        baseColumns.push(
          columnHelper.display({
            id: 'actions',
            header: 'Actions',
            cell: info => {
              const mediaItem = info.row.original;
              const isAdding = addingToCopyMediaId === mediaItem.mediaId;
              
              return (
                <button
                  onClick={() => handleAddToCollection(mediaItem)}
                  disabled={isAdding}
                  className="px-3 py-1.5 bg-lavender-400 hover:bg-lavender-500 disabled:bg-gray-300
                           text-white text-xs font-medium rounded-md shadow-sm
                           transition-colors duration-200 flex items-center gap-1.5"
                >
                  <Plus size={14} />
                  {isAdding ? 'Adding...' : 'Add to Collection'}
                </button>
              );
            },
          })
        );
      }

      if (mode === 'allMedia') {
        baseColumns.push(
          columnHelper.display({
            id: 'actions',
            header: 'Actions',
            cell: info => (
              <button
                onClick={() => handleRequestItem(info.row.original)}
                className="px-3 py-1.5 bg-lavender-400 hover:bg-lavender-500 disabled:bg-gray-300
                           text-white text-xs font-medium rounded-md shadow-sm
                           transition-colors duration-200 flex items-center gap-1.5"
              >
                Request Item
              </button>
            ),
          })
        );
      }

      return baseColumns;
    },
    [columnHelper, mode, addingToCopyMediaId]
  );

  const table = useReactTable({
    data: media,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination, 
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleAddToCollection = async (mediaItem: Media) => {
    if (!userID) return;
    
    setAddingToCopyMediaId(mediaItem.mediaId);
    setSelectedMediaForCopy(mediaItem);
    setIsCopyModalOpen(true);
  };
const handleAddMedia = async (data: MediaFormData) => {
  setIsSubmitting(true);
  setSubmitError(null);
  
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

  try {
    await mediaService.createNewMedia(apiPayload);
    setIsModalOpen(false);
    
    setGlobalFilter('');
    clearGenreFilter();

    if (onRefresh) {
      onRefresh();
    }    

    if (onSaveNewMedia) {
      onSaveNewMedia('Media added successfully!');
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create media';
    setSubmitError(errorMessage);
  } finally {
    setIsSubmitting(false);
  }
};
  const handleAddMediaCopy = async (data: CreateMediaCopyRequest) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // If we have a selected media for copy, use its mediaId
      const copyData = selectedMediaForCopy 
        ? { ...data, mediaId: selectedMediaForCopy.mediaId }
        : data;

      await mediaService.createNewMediaCopy(copyData);
      setIsCopyModalOpen(false);
      setSelectedMediaForCopy(null);
      setAddingToCopyMediaId(null);
      
      if (onRefresh) {
        onRefresh();
      }
      if (onSaveNewMedia) {
        const title = selectedMediaForCopy?.title || 'Media';
        onSaveNewMedia(`"${title}" added to your collection!`);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to add media copy';
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseCopyModal = () => {
    setIsCopyModalOpen(false);
    setSelectedMediaForCopy(null);
    setAddingToCopyMediaId(null);
  };

  const availableGenres = useMemo(() => {
    const genres = media
      .map(item => item.genre)
      .filter((genre, index, arr) => genre && arr.indexOf(genre) === index)
      .sort();
    return genres;
  }, [media]);

  const handleGenreFilter = (genre: string) => {
    const newGenres = selectedGenres.includes(genre)
      ? selectedGenres.filter(g => g !== genre)
      : [...selectedGenres, genre];
    
    setSelectedGenres(newGenres);
    table.getColumn('genre')?.setFilterValue(newGenres.length > 0 ? newGenres : undefined);
  };

  const clearGenreFilter = () => {
    setSelectedGenres([]);
    table.getColumn('genre')?.setFilterValue(undefined);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.relative')) {
        setShowGenreFilter(false);
      }
    };

    if (showGenreFilter) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showGenreFilter]);

  const getActionButtonConfig = () => {
    switch (mode) {
      case 'allMedia':
        return {
          text: 'Add Book',
          onClick: () => setIsModalOpen(true)
        };
      case 'myLibrary':
        return {
          text: 'Add to My Collection',
          onClick: () => onSwitchToAddTab?.()
        };
      case 'addToCollection':
        return null;
      default:
        return null;
    }
  };

  const actionButton = getActionButtonConfig();
// Replace your handleRequestItem function with this:
const handleRequestItem = (mediaItem: Media) => {
  // Find available copies
  const availableCopies = mediaItem.copies?.filter(copy => copy.isAvailable) || [];
  
  if (availableCopies.length === 0) {
    // Show error message - no available copies
    if (onSaveNewMedia) {
      onSaveNewMedia('No available copies for this item.');
    }
    return;
  }
  
  // For now, select the first available copy
  // You could enhance this to show a copy selection modal if multiple copies
  setSelectedMediaForBorrow(mediaItem);
  setSelectedCopyForBorrow(availableCopies[0].copyId);
  setIsBorrowModalOpen(true);
};

// Add this function to handle borrow request submission:
const handleBorrowRequestSubmit = async (data: any) => {
  setIsSubmitting(true);
  setSubmitError(null);

  try {
    // The AddBorrowRequestForm will handle the API call
    // This is just for any additional logic you need
    setIsBorrowModalOpen(false);
    setSelectedMediaForBorrow(null);
    setSelectedCopyForBorrow(null);
    
    if (onSaveNewMedia) {
      onSaveNewMedia('Borrow request submitted successfully!');
    }
    
    if (onRefresh) {
      onRefresh();
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to submit borrow request';
    setSubmitError(errorMessage);
  } finally {
    setIsSubmitting(false);
  }
};

const handleCloseBorrowModal = () => {
  setIsBorrowModalOpen(false);
  setSelectedMediaForBorrow(null);
  setSelectedCopyForBorrow(null);
};

  return (
    <div className="bg-[var(--color-card)] rounded-lg shadow-sm border border-[var(--color-border)]">
      <div className="p-4 border-b border-[var(--color-border)]">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" size={18} />
              <input
                type="text"
                placeholder="Search books..."
                value={globalFilter ?? ''}
                onChange={e => setGlobalFilter(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-[var(--color-border)] rounded-lg text-sm
                           focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
              />
            </div>
            
            {/* Genre Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowGenreFilter(!showGenreFilter)}
                className={`flex items-center gap-2 px-3 py-2 border rounded-lg text-sm transition-colors ${
                  selectedGenres.length > 0
                    ? 'bg-lavender-50 border-lavender-200 text-lavender-700'
                    : 'border-[var(--color-border)] text-[var(--color-text)]'
                }`}
              >
                <Filter size={16} />
                Genre {selectedGenres.length > 0 && `(${selectedGenres.length})`}
              </button>
              
              {showGenreFilter && (
                <div className="absolute top-full mt-1 left-0 z-10 bg-white border border-[var(--color-border)] rounded-lg shadow-lg min-w-48">
                  <div className="p-2">
                    {selectedGenres.length > 0 && (
                      <button
                        onClick={clearGenreFilter}
                        className="flex items-center gap-2 w-full px-2 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                      >
                        <X size={14} />
                        Clear filters
                      </button>
                    )}
                    {availableGenres.map(genre => (
                      <label key={genre} className="flex items-center gap-2 px-2 py-1 hover:bg-gray-50 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedGenres.includes(genre)}
                          onChange={() => handleGenreFilter(genre)}
                          className="rounded border-gray-300 text-lavender-500 focus:ring-lavender-500"
                        />
                        <span className="text-sm">{genre}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Button (if applicable) */}
          {actionButton && (
            <button
              type="button"
              onClick={actionButton.onClick}
              className="py-2 pl-4 pr-5 bg-lavender-400 hover:bg-lavender-500
                        text-white text-sm font-medium rounded-lg shadow
                        transition-all duration-200 transform hover:scale-[1.01]
                        flex items-center gap-2 justify-center whitespace-nowrap"
            >
              <Plus size={16} className="text-white" />
              {actionButton.text}
            </button>
          )}
        </div>
      </div>

      <DataTable
        data={media}
        columns={columns}
        emptyMessage="No books found matching your search"
      />

     
      {/* Modals */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Media"
      >
        <AddMediaForm 
          onSubmit={handleAddMedia}
          isSubmitting={isSubmitting}
          submitError={submitError}
        />
      </Modal>

      <Modal
        isOpen={isCopyModalOpen}
        onClose={handleCloseCopyModal}
        title={selectedMediaForCopy ? `Add "${selectedMediaForCopy.title}" to Collection` : 'Add to Collection'}
      >
        {/* <AddMediaCopyForm
          onSubmit={handleAddMediaCopy}
          isSubmitting={isSubmitting}
          submitError={submitError}
          preselectedMediaId={selectedMediaForCopy?.mediaId}
          hideMediaSelection={!!selectedMediaForCopy}
        /> */}
        <AddMediaCopyForm
          onSubmit={handleAddMediaCopy}
          isSubmitting={isSubmitting}
          submitError={submitError}
          preselectedMedia={selectedMediaForCopy || undefined}
        />
      </Modal>
      <Modal
  isOpen={isBorrowModalOpen}
  onClose={handleCloseBorrowModal}
  title={selectedMediaForBorrow ? `Request "${selectedMediaForBorrow.title}"` : 'Request Item'}
>
  {selectedCopyForBorrow && userID && (
    <AddBorrowRequestForm
      copyId={selectedCopyForBorrow}
      borrowerId={userID}
      onSubmit={handleBorrowRequestSubmit}
      isSubmitting={isSubmitting}
      submitError={submitError}
    />
  )}
</Modal>
    </div>
  );
}

export default MediaTable;