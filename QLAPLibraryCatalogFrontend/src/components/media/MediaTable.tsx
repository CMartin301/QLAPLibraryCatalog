// MediaTable.tsx
import React, { useMemo } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table';
import { ChevronUp, ChevronDown, Search, Plus } from 'lucide-react';
import { Media, MediaFormData, CreateMediaRequest } from '../../types/media';
import { AddMediaForm } from './AddMediaForm';
import { Modal } from '../shared/Modal';
import { mediaService } from '../../services/mediaService';
import { useModalScrollLock } from '../../hooks/useModalScrollLock';

interface MediaTableProps {
  media?: Media[];
  onRefresh?: () => void; 
}

export function MediaTable({ media = [], onRefresh }: MediaTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = React.useState('');
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
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
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
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create media';
    setSubmitError(errorMessage);
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="bg-[var(--color-card)] rounded-lg shadow-sm border border-[var(--color-border)]">
      <div className="p-4 border-b border-[var(--color-border)]">
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1">
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
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="py-2 pl-4 pr-5 bg-lavender-400 hover:bg-lavender-500
                        text-white text-sm font-medium rounded-lg shadow
                        transition-all duration-200 transform hover:scale-[1.01]
                        flex items-center gap-2 justify-center"
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