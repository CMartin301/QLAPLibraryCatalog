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
import { Media, MediaFormData, CreateMediaRequest } from '../../types/media';
import { AddMediaForm } from './AddMediaForm';
import { Modal } from '../shared/Modal';
import { mediaService } from '../../services/mediaService';
import { useModalScrollLock } from '../../hooks/useModalScrollLock';

interface MediaTableProps {
  media?: Media[];
  onRefresh?: () => void; 
  onSaveNewMedia?: (message: string) => void; 
}

export function MediaTable({ media = [], onRefresh, onSaveNewMedia: onSaveNewMedia }: MediaTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [showGenreFilter, setShowGenreFilter] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  // Lock the background scroll when the modal is open
  useModalScrollLock(isModalOpen);

  const columnHelper = createColumnHelper<Media>();

  const columns = useMemo(
    () => [
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
    ],
    [columnHelper]
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
    if (onRefresh) {
      onRefresh();
    }
    // Add this success callback
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

//TODO: API Call instead
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
  
  // Apply filter to table
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
  
  {/* Add Book Button */}
  <button
    type="button"
    onClick={() => setIsModalOpen(true)}
    className="py-2 pl-4 pr-5 bg-lavender-400 hover:bg-lavender-500
               text-white text-sm font-medium rounded-lg shadow
               transition-all duration-200 transform hover:scale-[1.01]
               flex items-center gap-2 justify-center whitespace-nowrap"
  >
    <Plus size={16} className="text-white" />
    Add Book
  </button>
</div>

      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[var(--color-border)]">
          <thead className="bg-[var(--color-bg)]">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-[var(--color-muted)] uppercase tracking-wider"
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={`flex items-center space-x-1 ${
                          header.column.getCanSort() ? 'cursor-pointer select-none' : ''
                        }`}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <span>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </span>
                        {header.column.getCanSort() && (
                          <span className="flex flex-col">
                            <ChevronUp
                              size={12}
                              className={`${
                                header.column.getIsSorted() === 'asc'
                                  ? 'text-[var(--color-primary)]'
                                  : 'text-[var(--color-muted)]'
                              }`}
                            />
                            <ChevronDown
                              size={12}
                              className={`-mt-1 ${
                                header.column.getIsSorted() === 'desc'
                                  ? 'text-[var(--color-primary)]'
                                  : 'text-[var(--color-muted)]'
                              }`}
                            />
                          </span>
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-[var(--color-card)] divide-y divide-[var(--color-border)]">
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="hover:bg-[var(--color-bg)] transition-colors">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {table.getRowModel().rows.length === 0 && (
        <div className="text-center py-8">
          <p className="text-[var(--color-muted)]">No books found</p>
        </div>
      )}

<div className="px-4 py-3 border-t border-[var(--color-border)] flex items-center justify-between">
  <div className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
    <span>Show</span>
    <select
      value={table.getState().pagination.pageSize}
      onChange={e => table.setPageSize(Number(e.target.value))}
      className="border border-[var(--color-border)] rounded px-2 py-1"
    >
      {[10, 20, 30, 50].map(pageSize => (
        <option key={pageSize} value={pageSize}>
          {pageSize}
        </option>
      ))}
    </select>
    <span>of {table.getFilteredRowModel().rows.length} entries</span>
  </div>
  
  <div className="flex items-center gap-2">
    <button
      onClick={() => table.previousPage()}
      disabled={!table.getCanPreviousPage()}
      className="p-2 border border-[var(--color-border)] rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--color-bg)]"
    >
      <ChevronLeft size={16} />
    </button>
      
    <div className="flex items-center gap-1">
      {/* Page numbers */}
      {Array.from({ length: Math.min(5, table.getPageCount()) }, (_, i) => {
        const currentPage = table.getState().pagination.pageIndex;
        const totalPages = table.getPageCount();
        
        // Calculate which page to show for this button
        let pageIndex;
        if (totalPages <= 5) {
          pageIndex = i;
        } else if (currentPage <= 2) {
          pageIndex = i;
        } else if (currentPage >= totalPages - 3) {
          pageIndex = totalPages - 5 + i;
        } else {
          pageIndex = currentPage - 2 + i;
        }
        
        if (pageIndex >= totalPages || pageIndex < 0) return null;
        
        return (
          <button
            key={pageIndex}
            onClick={() => table.setPageIndex(pageIndex)}
            className={`px-3 py-1 text-sm border rounded ${
              pageIndex === currentPage
                ? 'bg-lavender-500 text-white border-lavender-500'
                : 'border-[var(--color-border)] hover:bg-[var(--color-bg)]'
            }`}
          >
            {pageIndex + 1}
          </button>
        );
      })}
    </div>
    
    <button
      onClick={() => table.nextPage()}
      disabled={!table.getCanNextPage()}
      className="p-2 border border-[var(--color-border)] rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--color-bg)]"
    >
      <ChevronRight size={16} />
    </button>
  </div>
</div>
      {/* The modal is now used as a reusable wrapper */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Media"
      >
        <AddMediaForm onSubmit={handleAddMedia}
          isSubmitting={isSubmitting}
          submitError={submitError}
        />
      </Modal>
    </div>
  );
}

export default MediaTable;