import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  SortingState,
  PaginationState,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Search } from "lucide-react";

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T, any>[];
  emptyMessage?: string;
  isLoading?: boolean;
  searchPlaceholder?: string;
  showSearch?: boolean;
  error?: string | null;
  onRefresh?: () => void;
}

export function DataTable<T>({
  data,
  columns,
  emptyMessage = "No records found",
  isLoading = false,
  searchPlaceholder = "Search...",
  showSearch = true,
  error,
  onRefresh,
}: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter, pagination },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div>
      {/* Search Header */}
      {showSearch && (
        <div className="p-4 border-b border-[var(--color-border)]">
          <div className="flex items-center justify-between gap-4">
            <div className="relative max-w-md flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" size={18} />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={globalFilter ?? ''}
                onChange={e => setGlobalFilter(e.target.value)}
                aria-label={searchPlaceholder}
                className="w-full pl-10 pr-3 py-2 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
              />
            </div>
            <div className="text-sm text-[var(--color-muted)]">
              Showing {table.getFilteredRowModel().rows.length} of {data.length} entries
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-400">
          <p className="text-red-700">Error: {error}</p>
          {onRefresh && (
            <button 
              onClick={onRefresh}
              className="mt-2 text-red-600 underline hover:text-red-700"
            >
              Try again
            </button>
          )}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-fixed divide-y divide-[var(--color-border)]">
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
                          header.column.getCanSort() ? "cursor-pointer select-none" : ""
                        }`}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && (
                          <span className="flex flex-col">
                            <ChevronUp
                              size={12}
                              className={
                                header.column.getIsSorted() === "asc"
                                  ? "text-[var(--color-primary)]"
                                  : "text-[var(--color-muted)]"
                              }
                            />
                            <ChevronDown
                              size={12}
                              className={`-mt-1 ${
                                header.column.getIsSorted() === "desc"
                                  ? "text-[var(--color-primary)]"
                                  : "text-[var(--color-muted)]"
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
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-6 text-[var(--color-muted)]">
                  Loading...
                </td>
              </tr>
            ) : table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map(row => (
                <tr key={row.id} className="hover:bg-[var(--color-bg)] transition-colors">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center py-6 text-[var(--color-muted)]">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-4 py-3 border-t border-[var(--color-border)] flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
          <span>Show</span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={e => table.setPageSize(Number(e.target.value))}
            className="border border-[var(--color-border)] rounded px-2 py-1 bg-[var(--color-card)]"
          >
            {[10, 20, 30, 50].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
          <span>per page</span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="p-2 border border-[var(--color-border)] rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--color-bg)] transition-colors"
            aria-label="Previous page"
          >
            <ChevronLeft size={16} />
          </button>
            
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, table.getPageCount()) }, (_, i) => {
              const currentPage = table.getState().pagination.pageIndex;
              const totalPages = table.getPageCount();
              
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
                  className={`px-3 py-1 text-sm border rounded transition-colors ${
                    pageIndex === currentPage
                      ? 'bg-lavender-500 text-white border-lavender-500'
                      : 'border-[var(--color-border)] hover:bg-[var(--color-bg)]'
                  }`}
                  aria-label={`Page ${pageIndex + 1}`}
                >
                  {pageIndex + 1}
                </button>
              );
            })}
          </div>
          
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="p-2 border border-[var(--color-border)] rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--color-bg)] transition-colors"
            aria-label="Next page"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}