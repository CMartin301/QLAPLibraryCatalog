// src/components/borrowing/BorrowRequestsTable.tsx
import React, { useMemo, useState } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  SortingState,
} from '@tanstack/react-table';
import { 
  Search, 
  ChevronUp, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight,
  Calendar,
  MessageSquare,
  User,
  Book
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { borrowRequestService } from '../../services/borrowRequestService';
import { BorrowRequestDto } from '../../types/borrowRequests';
import { DataTable } from '../shared/DataTable';

interface BorrowRequestsTableProps {
  requests: BorrowRequestDto[];
  userRole: 'borrower' | 'lender';
  onRefresh: () => void;
}

type BorrowStatus = 'pending' | 'approved' | 'denied' | 'cancelled';

export function BorrowRequestsTable({ requests, userRole, onRefresh }: BorrowRequestsTableProps) {
  const { userID } = useAuth();
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [isLoading, setIsLoading] = useState(false);

  const columnHelper = createColumnHelper<BorrowRequestDto>();

  const columns = useMemo(
    () => [
      // Media Title & Author
      columnHelper.accessor(row => row.media?.title ?? '—', {
        id: 'media',
        header: 'Book',
        cell: info => {
          const media = info.row.original.media;
          return (
            <div className="flex items-start space-x-3">
              {/* <div className="flex-shrink-0">
                <Book className="w-8 h-8 text-lavender-500" />
              </div> */}
              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-900 truncate">
                  {media?.title || '—'}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {media?.creator || 'Unknown author'}
                </p>
              </div>
            </div>
          );
        },
        enableSorting: true,
      }),

      // User (shows opposite role)
    //   columnHelper.accessor(
    //     row => userRole === 'borrower' 
    //       ? (row.lender?.username || 'Unknown') 
    //       : (row.borrower?.username || 'Unknown'), 
    //     {
    //       id: 'user',
    //       header: userRole === 'borrower' ? 'Lender' : 'Borrower',
    //       cell: info => (
    //         <div className="flex items-center space-x-2">
    //           <User className="w-4 h-4 text-gray-400" />
    //           <span className="font-medium text-gray-900">{info.getValue()}</span>
    //         </div>
    //       ),
    //       enableSorting: true,
    //     }
    //   ),

      // Status
      columnHelper.accessor('status', {
        header: 'Status',
        cell: info => {
          const status = info.getValue() as BorrowStatus;
          const statusConfig = {
            pending: { 
              bg: 'bg-yellow-100', 
              text: 'text-yellow-800', 
              label: 'Pending' 
            },
            approved: { 
              bg: 'bg-green-100', 
              text: 'text-green-800', 
              label: 'Approved' 
            },
            denied: { 
              bg: 'bg-red-100', 
              text: 'text-red-800', 
              label: 'Denied' 
            },
            cancelled: { 
              bg: 'bg-gray-100', 
              text: 'text-gray-800', 
              label: 'Cancelled' 
            },
          };
          
          const config = statusConfig[status] || statusConfig.pending;
          
          return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
              {config.label}
            </span>
          );
        },
        enableSorting: true,
      }),

      // Requested Dates
      columnHelper.accessor(
        row => {
          if (row.requestedStartDate && row.requestedEndDate) {
            const start = new Date(row.requestedStartDate).toLocaleDateString();
            const end = new Date(row.requestedEndDate).toLocaleDateString();
            return `${start} → ${end}`;
          }
          return '—';
        },
        {
          id: 'dates',
          header: 'Requested Dates',
          cell: info => (
            <div className="flex items-center space-x-2">
              {/* <Calendar className="w-4 h-4 text-gray-400" /> */}
              <span className="text-sm text-gray-900">{info.getValue()}</span>
            </div>
          ),
          enableSorting: false,
        }
      ),

      // Message/Notes
      columnHelper.accessor(row => row.message || '—', {
        id: 'message',
        header: 'Message',
        cell: info => (
          <div className="max-w-xs">
            {info.getValue() !== '—' ? (
              <div className="flex items-start space-x-2">
                {/* <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" /> */}
                <span className="text-sm text-gray-600 truncate" title={info.getValue()}>
                  {info.getValue()}
                </span>
              </div>
            ) : (
              <span className="text-sm text-gray-400">No message</span>
            )}
          </div>
        ),
        enableSorting: false,
      }),

      // Actions
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: info => {
          const request = info.row.original;
          
          // Lender actions (for requests they received)
          if (userRole === 'lender' && request.status === 'pending') {
            return (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleApprove(request.requestId)}
                  disabled={isLoading}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleDeny(request.requestId)}
                  disabled={isLoading}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                >
                  Deny
                </button>
              </div>
            );
          }

          // Borrower actions (for requests they sent)
          if (userRole === 'borrower' && request.status === 'pending') {
            return (
              <button
                onClick={() => handleCancel(request.requestId)}
                disabled={isLoading}
                className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lavender-500 disabled:opacity-50"
              >
                Cancel
              </button>
            );
          }

          return (
            <span className="text-xs text-gray-400">
              {request.status === 'approved' && userRole === 'borrower' ? 'Ready to pickup' : 'No actions'}
            </span>
          );
        },
      }),
    ],
    [userRole, userID, isLoading]
  );

  const table = useReactTable({
    data: requests,
    columns,
    state: { 
      globalFilter,
      sorting,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  // Action handlers
  const handleApprove = async (requestId: number) => {
    setIsLoading(true);
    try {
      await borrowRequestService.approveBorrowRequest(requestId);
      onRefresh();
    } catch (error) {
      console.error('Failed to approve request:', error);
      // You might want to show a toast notification here
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeny = async (requestId: number) => {
    setIsLoading(true);
    try {
      await borrowRequestService.denyBorrowRequest(requestId, 'Request denied');
      onRefresh();
    } catch (error) {
      console.error('Failed to deny request:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async (requestId: number) => {
    if (!userID) return;
    
    setIsLoading(true);
    try {
      await borrowRequestService.cancelBorrowRequest(requestId, userID);
      onRefresh();
    } catch (error) {
      console.error('Failed to cancel request:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[var(--color-card)] rounded-lg shadow-sm border border-[var(--color-border)]">
      {/* Search Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search requests..."
              value={globalFilter}
              onChange={e => setGlobalFilter(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-lavender-500 focus:border-lavender-500"
            />
          </div>
          <div className="ml-4 text-sm text-gray-500">
            Showing {table.getFilteredRowModel().rows.length} request{table.getFilteredRowModel().rows.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Table */}
      <DataTable
        data={requests}
        columns={columns}
        emptyMessage="No borrow requests found"
      />

    </div>
  );
}

export default BorrowRequestsTable;