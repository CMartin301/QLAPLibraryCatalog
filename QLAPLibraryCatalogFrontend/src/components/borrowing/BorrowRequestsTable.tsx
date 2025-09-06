// src/components/borrowing/BorrowRequestsTable.tsx
import { useMemo, useState } from 'react';
import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  SortingState,
} from '@tanstack/react-table';
import { 
  Search
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { borrowRequestService } from '../../services/borrowRequestService';
import { BorrowRequestDto } from '../../types/borrowRequests';
import { DataTable } from '../shared/DataTable';

interface BorrowRequestsTableProps {
  requests: BorrowRequestDto[];
  userRole: 'borrower' | 'lender';
  onRefresh: () => void;
  error?: string | null;
  loading?: boolean;
}

type BorrowStatus = 'pending' | 'approved' | 'denied' | 'cancelled';

export function BorrowRequestsTable({ requests, userRole, onRefresh, error, loading }: BorrowRequestsTableProps) {
  const { userID } = useAuth();
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [isLoading, setIsLoading] = useState(false);

  const columnHelper = createColumnHelper<BorrowRequestDto>();

 const columns = useMemo(
  () => [
    // Media Title & Author (wide text column)
    columnHelper.accessor(row => row.mediaTitle ?? "—", {
      id: "media",
      header: "Book",
      cell: info => {
        const row = info.row.original;
        return (
          <div className="flex items-start space-x-3">
            <div className="min-w-0 flex-1">
              <p className="font-medium text-gray-900 truncate">
                {row.mediaTitle || "—"}
              </p>
              <p className="text-sm text-gray-500 truncate">
                {row.mediaCreator || "Unknown author"}
              </p>
            </div>
          </div>
        );
      },
      enableSorting: true,
      size: 260,       // wider for long titles
      minSize: 200,
      maxSize: 400,
    }),

    // Borrower Username (short text)
    columnHelper.accessor("borrowerUsername", {
      header: "Borrower",
      cell: info => (
        <div className="flex items-center space-x-2">
          <span className="font-medium text-gray-900">{info.getValue()}</span>
        </div>
      ),
      enableSorting: true,
      size: 160,
    }),

    // Status (badge column)
    columnHelper.accessor("status", {
      header: "Status",
      cell: info => {
        const status = info.getValue() as BorrowStatus;
        const statusConfig = {
          pending: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Pending" },
          approved: { bg: "bg-green-100", text: "text-green-800", label: "Approved" },
          denied: { bg: "bg-red-100", text: "text-red-800", label: "Denied" },
          cancelled: { bg: "bg-gray-100", text: "text-gray-800", label: "Cancelled" },
        };
        const config = statusConfig[status] || statusConfig.pending;

        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
          >
            {config.label}
          </span>
        );
      },
      enableSorting: true,
      size: 140, // compact width for badge
    }),

    // Requested Dates (short text, dates always narrow)
    columnHelper.accessor(
      row => {
        if (row.requestedStartDate && row.requestedEndDate) {
          const start = new Date(row.requestedStartDate).toLocaleDateString();
          const end = new Date(row.requestedEndDate).toLocaleDateString();
          return `${start} → ${end}`;
        }
        return "—";
      },
      {
        id: "dates",
        header: "Requested Dates",
        cell: info => (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-900">{info.getValue()}</span>
          </div>
        ),
        enableSorting: false,
        size: 180,
      }
    ),

    // Message/Notes (may be longer text, truncate)
    columnHelper.accessor(row => row.message || "—", {
      id: "message",
      header: "Message",
      cell: info => (
        <div className="max-w-xs">
          {info.getValue() !== "—" ? (
            <div className="flex items-start space-x-2">
              <span
                className="text-sm text-gray-600 truncate"
                title={info.getValue()}
              >
                {info.getValue()}
              </span>
            </div>
          ) : (
            <span className="text-sm text-gray-400">No message</span>
          )}
        </div>
      ),
      enableSorting: false,
      size: 220,
    }),

    // Actions (fixed width for buttons)
    columnHelper.display({
      id: "actions",
      header: "Actions",
      size: 220,
      cell: info => {
        const request = info.row.original;

        if (userRole === "lender" && request.status === "pending") {
          return (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleApprove(request.requestId)}
                disabled={isLoading}
                aria-label={`Approve borrow request ${request.requestId}`}
                className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Processing..." : "Approve"}
              </button>
              <button
                onClick={() => handleDeny(request.requestId)}
                disabled={isLoading}
                aria-label={`Deny borrow request ${request.requestId}`}
                className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Deny
              </button>
            </div>
          );
        }

        if (userRole === "borrower" && request.status === "pending") {
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
            {request.status === "approved" && userRole === "borrower"
              ? "Ready to pickup"
              : "No actions"}
          </span>
        );
      },
    }),
  ],
  [userRole, isLoading]
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

      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-400">
          <p className="text-red-700">Error: {error}</p>
          <button 
            onClick={onRefresh}
            className="mt-2 text-red-600 underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="p-8 text-center text-gray-500">
          Loading requests...
        </div>
      ) : (
        <DataTable
          data={requests}
          columns={columns}
          emptyMessage="No borrow requests found"
        />
      )}
    </div>
  );
}

export default BorrowRequestsTable;