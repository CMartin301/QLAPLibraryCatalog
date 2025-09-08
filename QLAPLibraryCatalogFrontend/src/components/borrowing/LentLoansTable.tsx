import { useMemo, useState } from "react";
import {
  createColumnHelper,
  SortingState,
} from "@tanstack/react-table";
import { DataTable } from "../shared/DataTable";
import { LoanWithDetails } from "../../types/loans";
import { loanService } from "../../services/loanService";
import { ExtendLoanModal } from "./ExtendLoanModal";

interface LentLoansTableProps {
  loans: LoanWithDetails[];
  onRefresh: () => void;
  error?: string | null;
  loading?: boolean;
}

export function LentLoansTable({ loans, onRefresh, error, loading }: LentLoansTableProps) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [extendModal, setExtendModal] = useState<{
    isOpen: boolean;
    loan: LoanWithDetails | null;
  }>({ isOpen: false, loan: null });

  const columnHelper = createColumnHelper<LoanWithDetails>();

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
          const statusColors = {
            active: "bg-green-100 text-green-800",
            returned: "bg-gray-100 text-gray-800",
            overdue: "bg-red-100 text-red-800"
          };
          return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[status]}`}>
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
              disabled={isLoading || info.row.original.status !== 'active'}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Processing...' : 'Mark Returned'}
            </button>
            <button
              onClick={() => handleExtend(info.row.original)}
              disabled={isLoading || info.row.original.status !== 'active'}
              className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Extend Loan
            </button>
          </div>
        ),
      }),
    ],
    [isLoading]
  );

  const handleReturn = async (loanId: number) => {
    setIsLoading(true);
    try {
      await loanService.returnLoan(loanId, {
        isBorrower: false // Lender confirming return
      });
      onRefresh();
    } catch (error) {
      console.error("Failed to mark loan returned:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExtend = (loan: LoanWithDetails) => {
    setExtendModal({ isOpen: true, loan });
  };

  const handleExtendSubmit = async (loanId: number, newDueDate: string) => {
    setIsLoading(true);
    try {
      await loanService.extendLoan(loanId, newDueDate);
      onRefresh();
    } catch (error) {
      console.error("Failed to extend loan:", error);
      throw error; // Re-throw so modal can handle it
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

      {loading ? (
        <div className="p-8 text-center text-gray-500">
          Loading loans...
        </div>
      ) : (
        <DataTable
          data={loans}
          columns={columns}
          emptyMessage="No lent loans found"
        />
      )}

      <ExtendLoanModal
        isOpen={extendModal.isOpen}
        onClose={() => setExtendModal({ isOpen: false, loan: null })}
        loan={extendModal.loan}
        onExtend={handleExtendSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}

export default LentLoansTable;