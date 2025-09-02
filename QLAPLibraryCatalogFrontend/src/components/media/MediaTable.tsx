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
import { Media } from '../../types/media';

interface MediaTableProps {
  media?: Media[];
}

export function MediaTable({ media = [] }: MediaTableProps) {
  // State for sorting and filtering
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = React.useState('');

  // Column helper for type safety
  const columnHelper = createColumnHelper<Media>();

  // Define columns
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
      // columnHelper.accessor('status', {
      //   header: 'Status',
      //   cell: info => {
      //     const status = info.getValue();
      //     const statusStyles = {
      //       available: 'bg-green-100 text-green-800',
      //       checked_out: 'bg-yellow-100 text-yellow-800',
      //       reserved: 'bg-blue-100 text-blue-800'
      //     };
          
      //     return (
      //       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status]}`}>
      //         {status.replace('_', ' ').toUpperCase()}
      //       </span>
      //     );
      //   },
      // }),
      // columnHelper.accessor('dateAdded', {
      //   header: 'Date Added',
      //   cell: info => (
      //     <div className="text-[var(--color-muted)] text-sm">
      //       {new Date(info.getValue()).toLocaleDateString()}
      //     </div>
      //   ),
      // }),
    ],
    [columnHelper]
  );

  // Create the table instance
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

  return (
    <div className="bg-[var(--color-card)] rounded-lg shadow-sm border border-[var(--color-border)]">
      {/* Search Bar */}
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

      {/* Table */}
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

      {/* Empty State */}
      {table.getRowModel().rows.length === 0 && (
        <div className="text-center py-8">
          <p className="text-[var(--color-muted)]">No books found</p>
        </div>
      )}
    </div>
  );
}

export default MediaTable;