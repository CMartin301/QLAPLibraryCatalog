import { useMemo } from 'react';
import { createColumnHelper, ColumnDef } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import { BorrowRequestDto } from '../../../../types/borrowRequests';
import Button from '../../../shared/Button';
import { StatusBadge } from '../../../shared/StatusBadge';
import { getBorrowRequestStatusDisplay } from '../../../../utilities/statusDisplayHelpers';

  const columnHelper = createColumnHelper<BorrowRequestDto>();

interface UseReceivedBorrowRequestsColumnsProps {
  handlers: {
    handleApprove: (requestId: number) => void;
    handleDeny: (requestId: number) => void;
  };
  isLoading: boolean | undefined;
}

export function useReceivedBorrowRequestsColumns({ 
  handlers, 
  isLoading 
}: UseReceivedBorrowRequestsColumnsProps) {
  const { handleApprove, handleDeny } = handlers;

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

      columnHelper.accessor("borrowerUsername", {
        header: "Borrower",
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
        size: 220,
        cell: (info) => {
          const request = info.row.original;

          if (request.status === "pending") {
            return (
              <div className="flex items-center space-x-2">
                <Button
                  variant="success"
                  size="sm"
                  onClick={(e) => {
                                    e.stopPropagation(); // Prevent row click
                                    handleApprove(request.requestId);
                                  }}
                  loading={isLoading}
                >
                  {isLoading ? "Processing..." : "Approve"}
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent row click
                    handleDeny(request.requestId);
                  }}
                  loading={isLoading}
                >
                  Deny
                </Button>
              </div>
            );
          }

          return (
            <span className="text-xs text-gray-400">
              No actions
            </span>
          );
        },
      }),
  ], [isLoading, handleApprove, handleDeny]);
}