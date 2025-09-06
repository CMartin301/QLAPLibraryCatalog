import { useMemo, useState } from "react";
import {
  createColumnHelper,
  SortingState,
} from "@tanstack/react-table";
import { DataTable } from "../shared/DataTable";
import { LoanWithDetails } from "../../types/loans";
import { loanService } from "../../services/loanService";

interface LoansTableProps {
  loans: LoanWithDetails[];
  onRefresh: () => void;
  error?: string | null;
  loading?: boolean;
}
type LoanStatus = "active" | "returned" | "overdue";

export function LoansTable({ loans, onRefresh, error, loading }: LoansTableProps) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [isLoading, setIsLoading] = useState(false);

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
      size: 250,   // wide for text
    }),

    columnHelper.accessor("borrowerUsername", {
      header: "Borrower",
      cell: (info) => <span className="text-sm text-gray-900">{info.getValue()}</span>,
      enableSorting: true,
      size: 150,   // medium
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
      size: 120,   // narrow date
    }),

    columnHelper.accessor("dueDate", {
      header: "Due Date",
      cell: (info) => <span className="text-sm text-gray-900">{info.getValue()}</span>,
      enableSorting: true,
      size: 120,   // narrow date
    }),

    columnHelper.accessor("status", {
      header: "Status",
      size: 160,   // fit for badge
      cell: (info) => { /* ...status cell... */ },
    }),

    columnHelper.display({
      id: "actions",
      header: "Actions",
      size: 180,   // fixed button width
      cell: (info) => { /* ...actions... */ },
    }),
  ],
  [isLoading]
);




  // Action handler
  const handleReturn = async (loanId: number) => {
    setIsLoading(true);
    try {
      await loanService.returnLoan(loanId, {
        isBorrower: true
      });
      onRefresh();
    } catch (error) {
      console.error("Failed to mark loan returned:", error);
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
      {/* Table */}
      {loading ? (
        <div className="p-8 text-center text-gray-500">
          Loading loans...
        </div>
      ) : (
        <DataTable
          data={loans}
          columns={columns}
          emptyMessage="No loans found"
        />
      )}

    </div>
  );
}

export default LoansTable;
