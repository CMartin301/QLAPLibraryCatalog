import { useMemo } from 'react';
import { createColumnHelper, ColumnDef } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import { BorrowRequestDto } from '../../../../types/borrowRequests';
import Button from '../../../shared/Button';
import { StatusBadge } from '../../../shared/StatusBadge';
import { getBorrowRequestStatusDisplay } from '../../../../utilities/statusDisplayHelpers';

  const columnHelper = createColumnHelper<BorrowRequestDto>();

interface UseSentBorrowRequestsColumnsProps {
  handlers: {
    handleCancel: (requestId: number) => void;
  };
  isLoading: boolean | undefined;
}

export function useSentBorrowRequestsColumns({ 
  handlers, 
  isLoading 
}: UseSentBorrowRequestsColumnsProps) {
  const { handleCancel } = handlers;

  return useMemo<ColumnDef<BorrowRequestDto, any>[]>(() => [
      columnHelper.accessor(row => row.mediaTitle ?? "—", {
        id: "media",
        header: "Book",
        cell: (info) => {
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
        size: 260,
      }),

      columnHelper.accessor("ownerUsername", {
        header: "Owner",
        cell: (info) => (
          <span className="text-sm text-gray-900">{info.getValue()}</span>
        ),
        enableSorting: true,
        size: 150,
      }),
      columnHelper.accessor("requestedStartDate", {
        header: "Start Date",
        cell: (info) => <span className="text-sm text-gray-900">{info.getValue()}</span>,
        enableSorting: true,
        size: 120,
      }),
      columnHelper.accessor("requestedEndDate", {
        header: "Due Date",
        cell: (info) => <span className="text-sm text-gray-900">{info.getValue()}</span>,
        enableSorting: true,
        size: 120,
      }),

      columnHelper.accessor("status", {
        header: "Status",
        size: 140,
        cell: (info) => {
          const status = info.getValue() ?? "pending";
          const config = getBorrowRequestStatusDisplay(status);
          return <StatusBadge config={config} />;
        },
        enableSorting: true,
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        size: 180,
        cell: (info) => {
          const request = info.row.original;

          if (request.status === "pending") {
            return (
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent row click
                  handleCancel(request.requestId);
                }}
                disabled={isLoading}
                className="px-3 py-1 text-sm border border-gray-300 text-gray-700 bg-white rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lavender-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Processing..." : "Cancel"}
              </button>
            );
          }

          return (
            <span className="text-xs text-gray-400">
              {request.status === "approved" 
                ? "Ready to pickup" 
                : "No actions"}
            </span>
          );
        },
      }),
  ], [isLoading, handleCancel]);
}