import { useMemo, useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { BorrowRequestDto } from "../../../types/borrowRequests";
import { borrowRequestService } from "../../../services/borrowRequestService";
import { TableContainer } from "../../shared/TableContainer";
import { useTableActions } from "../../../hooks/useTableActions";
import { getBorrowRequestStatusDisplay } from "../../../utilities/statusDisplayHelpers";
import { StatusBadge } from "../../shared/StatusBadge";
import BorrowRequestModal from "./BorrowRequestModal";

interface ReceivedBorrowRequestsTableProps {
  requests: BorrowRequestDto[];
  onRefresh: () => void;
  error?: string | null;
  loading?: boolean;
} 

export function ReceivedBorrowRequestsTable({ 
  requests, 
  onRefresh, 
  error, 
  loading 
}: ReceivedBorrowRequestsTableProps) {
  const { executeAction, isLoading } = useTableActions();
  
  // Modal state
  const [selectedRequest, setSelectedRequest] = useState<BorrowRequestDto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleRowClick = (request: BorrowRequestDto) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
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
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent row click
                    handleApprove(request.requestId);
                  }}
                  disabled={isLoading}
                  className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Processing..." : "Approve"}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent row click
                    handleDeny(request.requestId);
                  }}
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
    <>
      <TableContainer
        data={requests}
        columns={columns}
        loading={loading || isLoading}
        error={error}
        onRefresh={onRefresh}
        emptyMessage="No received requests found"
        onRowClick={handleRowClick}
        rowClassName="cursor-pointer"
      />

      <BorrowRequestModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        borrowRequest={selectedRequest}
      />
    </>
  );
}

export default ReceivedBorrowRequestsTable;