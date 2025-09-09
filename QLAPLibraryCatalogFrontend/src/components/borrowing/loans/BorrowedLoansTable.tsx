import { useMemo, useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { LoanWithDetails } from "../../../types/loans";
import { loanService } from "../../../services/loanService";
import { TableContainer } from "../../shared/TableContainer";
import { useTableActions } from "../../../hooks/useTableActions";
import { LoanDetailModal } from "./LoanDetailModal";
import { StatusBadge } from "../../shared/StatusBadge";
import { getLoanStatusDisplay } from "../../../utilities/statusDisplayHelpers";

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
  const { executeAction, isLoading } = useTableActions();
  const [detailModal, setDetailModal] = useState<{
    isOpen: boolean;
    loan: LoanWithDetails | null;
  }>({ isOpen: false, loan: null });

  const handleRowClick = (loan: LoanWithDetails) => {
  setDetailModal({ isOpen: true, loan });
};

  const columnHelper = createColumnHelper<LoanWithDetails>();

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
                  {row.mediaAuthor || "Unknown author"}
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
          const config = getLoanStatusDisplay(info.row.original);
          return <StatusBadge config={config} />;
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
                onClick={(e) => {
                  e.stopPropagation(); // Prevent row click
                  handleReturn(loan.loanId);
                }}
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
        onRowClick={handleRowClick}
        rowClassName="cursor-pointer"
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
