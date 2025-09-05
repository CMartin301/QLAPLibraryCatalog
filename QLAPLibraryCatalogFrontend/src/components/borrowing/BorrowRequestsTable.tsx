// src/borrowing/BorrowRequestsTable.tsx
import React, { useEffect, useMemo, useState } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Search, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { borrowRequestService } from '../../services/borrowRequestService';
import { BorrowRequest } from '../../types/borrowRequests';

type BorrowStatus = 'pending' | 'approved' | 'denied' | 'cancelled';

export function BorrowRequestsTable() {
  const { userID } = useAuth();
  const [requests, setRequests] = useState<BorrowRequest[]>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const columnHelper = createColumnHelper<BorrowRequest>();

  const columns = useMemo(
    () => [
      // Media Title
      columnHelper.accessor(row => row.media?.title ?? '—', {
        id: 'title',
        header: 'Title',
        cell: info => <span className="font-medium text-[var(--color-text)]">{info.getValue()}</span>,
      }),

      // Status
      columnHelper.accessor('status', {
        header: 'Status',
        cell: info => {
          const status = info.getValue() as BorrowStatus;
          const badgeClasses: Record<BorrowStatus, string> = {
            pending: 'bg-yellow-100 text-yellow-700',
            approved: 'bg-green-100 text-green-700',
            denied: 'bg-red-100 text-red-700',
            cancelled: 'bg-gray-100 text-gray-600',
          };
          return (
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${
                badgeClasses[status] ?? 'bg-gray-200 text-gray-700'
              }`}
            >
              {status}
            </span>
          );
        },
      }),

      // Dates
      columnHelper.accessor(row => {
        if (row.requestedStartDate && row.requestedEndDate) {
          return `${row.requestedStartDate} → ${row.requestedEndDate}`;
        }
        return '—';
      }, {
        id: 'dates',
        header: 'Dates',
        cell: info => <span className="text-[var(--color-text)]">{info.getValue()}</span>,
      }),

      // Message
      columnHelper.accessor(row => row.message ?? '—', {
        id: 'message',
        header: 'Message',
        cell: info => (
          <span className="text-sm text-[var(--color-muted)]">{info.getValue()}</span>
        ),
      }),

      // Actions
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: info => {
          const req = info.row.original;
          const isOwner = true;
        //   const isOwner = req.copy?.userId === userID;
          const isBorrower = req.borrowerId === userID;

          if (isOwner && req.status === 'pending') {
            return (
              <div className="flex gap-2">
                <button
                  onClick={() => handleApprove(req.requestId)}
                  className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleDeny(req.requestId)}
                  className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Deny
                </button>
              </div>
            );
          }

          if (isBorrower && req.status === 'pending') {
            return (
              <button
                onClick={() => handleCancel(req.requestId)}
                className="px-2 py-1 text-xs bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            );
          }

          return <span className="text-gray-400 text-xs">No actions</span>;
        },
      }),
    ],
    [userID]
  );

  const table = useReactTable({
    data: requests,
    columns,
    state: { globalFilter },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // Handlers for approve/deny/cancel
  const handleApprove = async (id: number) => {
    // await borrowRequestService.approve(id);
    loadRequests();
  };

  const handleDeny = async (id: number) => {
    // await borrowRequestService.deny(id, 'Not available');
    loadRequests();
  };

  const handleCancel = async (id: number) => {
    // await borrowRequestService.cancel(id);
    loadRequests();
  };

  const loadRequests = async () => {
    if (!userID) return;
    setIsLoading(true);
    try {
    //   const data = await borrowRequestService.getBorrowRequests(userID);
      const data = await borrowRequestService.getBorrowRequestsForLender(userID);
      setRequests(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [userID]);

  return (
    <div className="bg-[var(--color-card)] rounded-lg shadow-sm border border-[var(--color-border)]">
      {/* Header with search */}
      <div className="p-4 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" size={18} />
            <input
              type="text"
              placeholder="Search requests..."
              value={globalFilter}
              onChange={e => setGlobalFilter(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-[var(--color-border)] rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
            />
          </div>
        </div>
      </div>

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
                          header.column.getCanSort() ? 'cursor-pointer select-none' : ''
                        }`}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <span>
                          {flexRender(header.column.columnDef.header, header.getContext())}
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
      {table.getRowModel().rows.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-[var(--color-muted)] mb-4">No borrow requests found</p>
        </div>
      )}

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

export default BorrowRequestsTable;
