import { useMemo, useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { LoanWithDetails } from "../../../types/loans";
import { loanService } from "../../../services/loanService";
import { ExtendLoanModal } from "./ExtendLoanModal";
// import { useTableState } from "../../../hooks/useTableState";
import { TableContainer } from "../../shared/TableContainer";
import { useTableActions } from "../../../hooks/useTableActions";

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
        size: 220,
        cell: (info) => (
          <div className="flex gap-2">
            <button
              onClick={() => handleReturn(info.row.original.loanId)}
              disabled={isLoading || info.row.original.status !== "active"}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Processing..." : "Mark Returned"}
            </button>
            <button
              onClick={() => handleExtend(info.row.original)}
              disabled={isLoading || info.row.original.status !== "active"}
              className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Extend Loan
            </button>
          </div>
        ),
      }),
      columnHelper.display({
        id: "actions2",
        header: "Actions2",
        size: 180,
        cell: (info) => {
        const loan = info.row.original;

        if (loan.status !== "returned" && loan.lenderConfirmedReturnAt === null && loan.borrowerReturnedAt === null) {
          return (
            <div className="flex gap-2">
            <button
              onClick={() => handleReturn(info.row.original.loanId)}
              // disabled={isLoading || info.row.original.status !== "active"}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Processing..." : "Mark Returned"}
            </button>
            <button
              onClick={() => handleExtend(info.row.original)}
              // disabled={isLoading || info.row.original.status !== "active"}
              className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Extend Loan
            </button>
          </div>
          );
        }
        if (loan.status !== "returned" && loan.lenderConfirmedReturnAt === null) {
          return (
          <button
            onClick={() => handleReturn(info.row.original.loanId)}
            // disabled={isLoading || info.row.original.borrowerReturnedAt !== null}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Processing..." : "Mark Returned"}
          </button>
          );
        }
        if (loan.status !== "returned" && loan.borrowerReturnedAt === null) {
          return (
          <span className="text-xs text-gray-400">
            Awaiting Borrower Return Confirmation
          </span>
          );
        }
        // if (loan.status === "returned") {
        //   return (
        //   <span className="text-xs text-gray-400">
        //     No Actions
        //   </span>
        //   );
        // }

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
