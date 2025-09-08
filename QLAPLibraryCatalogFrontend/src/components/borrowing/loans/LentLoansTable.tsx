import { useMemo, useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { LoanWithDetails } from "../../../types/loans";
import { loanService } from "../../../services/loanService";
import { ExtendLoanModal } from "./ExtendLoanModal";
// import { useTableState } from "../../../hooks/useTableState";
import { TableContainer } from "../../shared/TableContainer";
import { useTableActions } from "../../../hooks/useTableActions";
import { getLoanStatusDisplay } from "../../../utilities/loanStatusHelpers";

interface LentLoansTableProps {
  loans: LoanWithDetails[];
  onRefresh: () => void;
  error?: string | null;
  loading?: boolean;
}

export function LentLoansTable({ loans, onRefresh, error, loading }: LentLoansTableProps) {
  // const tableState = useTableState<LoanWithDetails>();
  const { executeAction, isLoading } = useTableActions();

  const [extendModal, setExtendModal] = useState<{
    isOpen: boolean;
    loan: LoanWithDetails | null;
  }>({ isOpen: false, loan: null });

  const columnHelper = createColumnHelper<LoanWithDetails>();

  const handleReturn = async (loanId: number): Promise<void> => {
    return executeAction(
      () => loanService.returnLoan(loanId, { isBorrower: false }),
      {
        onSuccess: onRefresh,
        successMessage: "Loan marked as returned",
        errorMessage: "Failed to mark loan as returned",
      }
    );
  };


  const handleExtendSubmit = async (loanId: number, newDueDate: string): Promise<void> => {
    return executeAction(
      () => loanService.extendLoan(loanId, newDueDate),
      {
        onSuccess: onRefresh,
        successMessage: "Loan extended successfully",
        errorMessage: "Failed to extend loan",
      }
    );
  };


  const handleExtend = (loan: LoanWithDetails) => {
    setExtendModal({ isOpen: true, loan });
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
      columnHelper.accessor("borrowerUsername", {
        header: "Borrower",
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
        size: 220,
        cell: (info) => {
          const loan = info.row.original;
          
          // No actions if loan is officially returned
          if (loan.status === 'returned') {
            return (
              <span className="text-xs text-gray-400">
                No Actions
              </span>
            );
          }

          const canMarkReturned = loan.lenderConfirmedReturnAt === null;
          const canExtend = loan.status === 'active' && !loan.borrowerReturnedAt;

          if (!canMarkReturned && !canExtend) {
            return (
              <span className="text-xs text-gray-400">
                No Actions
              </span>
            );
          }

          return (
            <div className="flex gap-2">
              {canMarkReturned && (
                <button
                  onClick={() => handleReturn(loan.loanId)}
                  disabled={isLoading}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Processing..." : "Confirm Return"}
                </button>
              )}
              {canExtend && (
                <button
                  onClick={() => handleExtend(loan)}
                  disabled={isLoading}
                  className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Extend Loan
                </button>
              )}
            </div>
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
        emptyMessage="No lent loans found"
      />

      <ExtendLoanModal
        isOpen={extendModal.isOpen}
        onClose={() => setExtendModal({ isOpen: false, loan: null })}
        loan={extendModal.loan}
        onExtend={handleExtendSubmit}
        isLoading={isLoading}
      />
    </>
  );
}

export default LentLoansTable;
