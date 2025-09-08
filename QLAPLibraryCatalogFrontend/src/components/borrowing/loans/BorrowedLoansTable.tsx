import { useMemo } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { LoanWithDetails } from "../../../types/loans";
import { loanService } from "../../../services/loanService";
import { useTableState } from "../../../hooks/useTableState";
import { TableContainer } from "../../shared/TableContainer";
import { useTableActions } from "../../../hooks/useTableActions";

interface BorrowedLoansTableProps {
  loans: LoanWithDetails[];
  onRefresh: () => void;
  error?: string | null;
  loading?: boolean;
}

export function BorrowedLoansTable({
  loans,
  onRefresh,
  error,
  loading,
}: BorrowedLoansTableProps) {
  const tableState = useTableState<LoanWithDetails>();
  const { executeAction, isLoading } = useTableActions();

  const columnHelper = createColumnHelper<LoanWithDetails>();

  // Async handleReturn with proper Promise
  const handleReturn = async (loanId: number): Promise<void> => {
    return executeAction(
      () => loanService.returnLoan(loanId, { isBorrower: true }),
      {
        onSuccess: onRefresh,
        successMessage: "Loan marked as returned",
        errorMessage: "Failed to mark loan as returned",
      }
    );
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor("mediaTitle", {
        header: "Media",
        cell: (info) => (
          <div>
            <div className="font-medium text-gray-900">{info.getValue()}</div>
            <div className="text-sm text-gray-500">{info.row.original.mediaType}</div>
          </div>
        ),
        enableSorting: true,
        size: 250,
      }),
      columnHelper.accessor("ownerUsername", {
        header: "Owner",
        cell: (info) => <span className="text-sm text-gray-900">{info.getValue()}</span>,
        enableSorting: true,
        size: 150,
      }),
      columnHelper.accessor("startDate", {
        header: "Start Date",
        cell: (info) => <span className="text-sm text-gray-900">{info.getValue()}</span>,
        enableSorting: true,
        size: 120,
      }),
      columnHelper.accessor("dueDate", {
        header: "Due Date",
        cell: (info) => <span className="text-sm text-gray-900">{info.getValue()}</span>,
        enableSorting: true,
        size: 120,
      }),
      columnHelper.accessor("status", {
        header: "Status",
        size: 160,
        cell: (info) => {
          const status = info.getValue();
          const statusColors: Record<string, string> = {
            active: "bg-green-100 text-green-800",
            returned: "bg-gray-100 text-gray-800",
            overdue: "bg-red-100 text-red-800",
          };
          return (
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                statusColors[status] || "bg-gray-100 text-gray-800"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          );
        },
        enableSorting: true,
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        size: 180,
        cell: (info) => (
          <button
            onClick={() => handleReturn(info.row.original.loanId)}
            disabled={isLoading || info.row.original.borrowerReturnedAt !== null}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Processing..." : "Mark Returned"}
          </button>
        ),
      }),
    ],
    [isLoading]
  );

  return (
    <TableContainer
      data={loans}
      columns={columns}
      loading={loading || isLoading}
      error={error} // only fetch/load errors
      onRefresh={onRefresh}
      emptyMessage="No borrowed loans found"
    />
  );
}

export default BorrowedLoansTable;
