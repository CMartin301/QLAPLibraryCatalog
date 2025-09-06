import { useMemo, useState } from "react";
import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  SortingState,
} from "@tanstack/react-table";
import {
  Search,
  Calendar
} from "lucide-react";
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
      // Media Title (new)
      columnHelper.accessor("mediaTitle", {
        header: "Media",
        cell: (info) => (
          <div>
            <div className="font-medium text-gray-900">{info.getValue()}</div>
            <div className="text-sm text-gray-500">{info.row.original.mediaType}</div>
          </div>
        ),
        enableSorting: true,
      enableResizing: true,
      }),

      // Borrower Username (new)
      columnHelper.accessor("borrowerUsername", {
        header: "Borrower",
        cell: (info) => (
          <span className="text-sm text-gray-900">{info.getValue()}</span>
        ),
        enableSorting: true,
      enableResizing: true,
      }),

      // Owner Username (new)
      columnHelper.accessor("ownerUsername", {
        header: "Owner",
        cell: (info) => (
          <span className="text-sm text-gray-900">{info.getValue()}</span>
        ),
        enableSorting: true,
      enableResizing: true,
      }),

      // Loan start date
      columnHelper.accessor("startDate", {
        header: "Start Date",
        cell: (info) => (
          <span className="text-sm text-gray-900">{info.getValue()}</span>
        ),
        enableSorting: true,
      enableResizing: true,
      }),

      // Loan end date
      columnHelper.accessor("dueDate", {
        header: "Due Date",
        cell: (info) => (
          <span className="text-sm text-gray-900">{info.getValue()}</span>
        ),
        enableSorting: true,
      enableResizing: true,
      }),
      
      // Status (updated with overdue logic)
      columnHelper.accessor("status", {
        header: "Status",
      //   enableSorting: false,
      // enableResizing: true,
  size: 200,     // starting width
  meta: { grow: 1 },
        cell: (info) => {
          const loan = info.row.original;
          const status = info.getValue() as LoanStatus;
          
          // Override status if overdue
          const displayStatus = loan.isOverdue ? "overdue" : status;
          
          const statusConfig = {
            active: {
              bg: "bg-blue-100",
              text: "text-blue-800",
              label: "Active",
            },
            returned: {
              bg: "bg-green-100",
              text: "text-green-800",
              label: "Returned",
            },
            overdue: {
              bg: "bg-red-100",
              text: "text-red-800",
              label: `Overdue (${loan.daysOverdue} days)`,
            },
          };

          const config = statusConfig[displayStatus] || statusConfig.active;

          return (
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
            >
              {config.label}
            </span>
          );
        },
      }),


      // Actions (keep existing but update loan ID reference)
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => {
          const loan = info.row.original;

          // if (loan.status === "active" && !loan.isOverdue) {
            return (
            <button
              onClick={() => handleReturn(loan.loanId)}
              disabled={isLoading}
              aria-label={`Mark loan ${loan.loanId} as returned`}
                  className="px-3 py-1.5 bg-lavender-400 hover:bg-lavender-500 disabled:bg-gray-300
                           text-white text-xs font-medium rounded-md shadow-sm
                           transition-colors duration-200 flex items-center gap-1.5"
                >
              {isLoading ? 'Processing...' : 'Mark Returned'}
            </button>
            );
          // }

          // return <span className="text-xs text-gray-400">No actions</span>;
        },
      }),
    ],
    [isLoading]
  );

  const table = useReactTable({
    data: loans,
    columns,
    state: {
      globalFilter,
      sorting,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

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
