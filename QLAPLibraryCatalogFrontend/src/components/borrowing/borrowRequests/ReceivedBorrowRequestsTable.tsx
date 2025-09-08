import { useMemo } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { BorrowRequestDto } from "../../../types/borrowRequests";
import { borrowRequestService } from "../../../services/borrowRequestService";
import { TableContainer } from "../../shared/TableContainer";
import { useTableActions } from "../../../hooks/useTableActions";

interface ReceivedBorrowRequestsTableProps {
  requests: BorrowRequestDto[];
  onRefresh: () => void;
  error?: string | null;
  loading?: boolean;
}

type BorrowStatus = 'pending' | 'approved' | 'denied' | 'cancelled';

export function ReceivedBorrowRequestsTable({ 
  requests, 
  onRefresh, 
  error, 
  loading 
}: ReceivedBorrowRequestsTableProps) {
  const { executeAction, isLoading } = useTableActions();

  const columnHelper = createColumnHelper<BorrowRequestDto>();

  const handleApprove = async (requestId: number): Promise<void> => {
    return executeAction(
      () => borrowRequestService.approveBorrowRequest(requestId),
      {
        onSuccess: onRefresh,
        successMessage: "Request approved successfully",
        errorMessage: "Failed to approve request",
      }
    );
  };

  const handleDeny = async (requestId: number): Promise<void> => {
    return executeAction(
      () => borrowRequestService.denyBorrowRequest(requestId, 'Request denied'),
      {
        onSuccess: onRefresh,
        successMessage: "Request denied",
        errorMessage: "Failed to deny request",
      }
    );
  };

  const getStatusDisplay = (status: BorrowStatus) => {
    const statusConfig = {
      pending: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Pending" },
      approved: { bg: "bg-green-100", text: "text-green-800", label: "Approved" },
      denied: { bg: "bg-red-100", text: "text-red-800", label: "Denied" },
      cancelled: { bg: "bg-gray-100", text: "text-gray-800", label: "Cancelled" },
    };
    return statusConfig[status] || statusConfig.pending;
  };

  const columns = useMemo(
    () => [
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

      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => {
          const status = info.getValue() as BorrowStatus;
          const config = getStatusDisplay(status);

          return (
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
            >
              {config.label}
            </span>
          );
        },
        enableSorting: true,
        size: 140,
      }),

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
          cell: (info) => (
            <span className="text-sm text-gray-900">{info.getValue()}</span>
          ),
          enableSorting: false,
          size: 180,
        }
      ),

      columnHelper.accessor(row => row.message || "—", {
        id: "message",
        header: "Message",
        cell: (info) => (
          <div className="max-w-xs">
            {info.getValue() !== "—" ? (
              <span
                className="text-sm text-gray-600 truncate"
                title={info.getValue()}
              >
                {info.getValue()}
              </span>
            ) : (
              <span className="text-sm text-gray-400">No message</span>
            )}
          </div>
        ),
        enableSorting: false,
        size: 220,
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
                <button
                  onClick={() => handleApprove(request.requestId)}
                  disabled={isLoading}
                  className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Processing..." : "Approve"}
                </button>
                <button
                  onClick={() => handleDeny(request.requestId)}
                  disabled={isLoading}
                  className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Deny
                </button>
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
    ],
    [isLoading]
  );

  return (
    <TableContainer
      data={requests}
      columns={columns}
      loading={loading || isLoading}
      error={error}
      onRefresh={onRefresh}
      emptyMessage="No received requests found"
    />
  );
}

export default ReceivedBorrowRequestsTable;