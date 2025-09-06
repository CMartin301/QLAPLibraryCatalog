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
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T, any>[];
  emptyMessage?: string;
  pageSizeOptions?: number[];
  isLoading?: boolean;
}

export function DataTable<T>({
  data,
  columns,
  emptyMessage = "No records found",
  pageSizeOptions = [10, 20, 30, 50],
  isLoading = false,
}: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data,
    columns,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
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

      {/* Pagination */}
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
      
    </div>
  );
}
