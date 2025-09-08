import { useMemo, useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { LoanWithDetails } from "../../../types/loans";
import { loanService } from "../../../services/loanService";
// import { useTableState } from "../../../hooks/useTableState";
import { TableContainer } from "../../shared/TableContainer";
import { useTableActions } from "../../../hooks/useTableActions";
import { getLoanStatusDisplay } from "../../../utilities/loanStatusHelpers";
import { LoanDetailModal } from "./LoanDetailModal";

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
  // const tableState = useTableState<LoanWithDetails>();
  const { executeAction, isLoading } = useTableActions();
  const [detailModal, setDetailModal] = useState<{
    isOpen: boolean;
    loan: LoanWithDetails | null;
  }>({ isOpen: false, loan: null });

  const handleRowClick = (loan: LoanWithDetails) => {
  setDetailModal({ isOpen: true, loan });
};

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
          <button
            onClick={() => handleRowClick(info.row.original)}
            className="text-left w-full p-1 hover:bg-gray-50 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-lavender-500 focus:ring-offset-1"
            aria-label={`View details for loan of ${info.getValue()}`}
          >
            <div className="font-medium text-gray-900">{info.getValue()}</div>
            <div className="text-sm text-gray-500">{info.row.original.mediaType}</div>
          </button>
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
          const statusDisplay = getLoanStatusDisplay(info.row.original);
          
          return (
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${statusDisplay.class}`}
            >
              {statusDisplay.text}
            </span>
          );
        },
        enableSorting: true,
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        size: 180,
        cell: (info) => {
          const loan = info.row.original;

          // Borrower can only mark returned if they haven't already
          if (loan.borrowerReturnedAt === null) {
            return (
              <button
                onClick={() => handleReturn(loan.loanId)}
                disabled={isLoading}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Processing..." : "Mark Returned"}
              </button>
            );
          }

          return (
            <span className="text-xs text-gray-400">
              No Actions
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
        data={loans}
        columns={columns}
        loading={loading || isLoading}
        error={error} // only fetch/load errors
        onRefresh={onRefresh}
        emptyMessage="No borrowed loans found"
      />

      <LoanDetailModal
        isOpen={detailModal.isOpen}
        onClose={() => setDetailModal({ isOpen: false, loan: null })}
        loan={detailModal.loan}
      />
    </>
  );
}

export default BorrowedLoansTable;
