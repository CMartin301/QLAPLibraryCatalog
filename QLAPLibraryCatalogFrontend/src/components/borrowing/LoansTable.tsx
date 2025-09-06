import React, { useMemo, useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  SortingState,
} from "@tanstack/react-table";
import {
  Search,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Calendar,
  DollarSign,
} from "lucide-react";
import { loanService } from "../../services/loanService";
import { Loan } from "../../types/loans";
import { DataTable } from "../shared/DataTable";

interface LoansTableProps {
  loans: Loan[];
  onRefresh: () => void;
  error?: string | null;
  loading?: boolean;
}

type LoanStatus = "active" | "returned" | "overdue";

export function LoansTable({ loans, onRefresh, error, loading }: LoansTableProps) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [isLoading, setIsLoading] = useState(false);

  const columnHelper = createColumnHelper<Loan>();

  const columns = useMemo(
    () => [
      // Loan ID
      columnHelper.accessor("loanId", {
        header: "Loan ID",
        cell: (info) => <span className="font-medium">{info.getValue()}</span>,
        enableSorting: true,
      }),

      // Request ID
      columnHelper.accessor("requestId", {
        header: "Request ID",
        enableSorting: true,
      }),

      // Loan Dates
      columnHelper.accessor(
        (row) => {
          if (row.startDate && row.dueDate) {
            const start = new Date(row.startDate).toLocaleDateString();
            const due = new Date(row.dueDate).toLocaleDateString();
            return `${start} → ${due}`;
          }
          return "—";
        },
        {
          id: "dates",
          header: "Loan Period",
          cell: (info) => (
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-900">{info.getValue()}</span>
            </div>
          ),
          enableSorting: false,
        }
      ),

      // Returned Date
      columnHelper.accessor("returnedDate", {
        header: "Returned",
        cell: (info) =>
          info.getValue() ? (
            <span>{new Date(info.getValue()!).toLocaleDateString()}</span>
          ) : (
            <span className="text-gray-400">Not returned</span>
          ),
        enableSorting: true,
      }),

      // Status
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => {
          const status = info.getValue() as LoanStatus;
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
              label: "Overdue",
            },
          };

          const config = statusConfig[status] || statusConfig.active;

          return (
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
            >
              {config.label}
            </span>
          );
        },
        enableSorting: true,
      }),

      // Late Fees
      columnHelper.accessor("lateFeeAmount", {
        header: "Late Fee",
        cell: (info) => {
          const amount = info.getValue();
          return amount > 0 ? (
            <div className="flex items-center space-x-1 text-red-600">
              <DollarSign className="w-4 h-4" />
              <span>{amount.toFixed(2)}</span>
            </div>
          ) : (
            <span className="text-gray-400">—</span>
          );
        },
        enableSorting: true,
      }),

      // Late Fee Paid
      columnHelper.accessor("lateFeePaid", {
        header: "Fee Paid",
        cell: (info) =>
          info.getValue() ? (
            <span className="text-green-600 font-medium">Yes</span>
          ) : (
            <span className="text-gray-400">No</span>
          ),
        enableSorting: true,
      }),

      // Return Notes
      columnHelper.accessor("returnNotes", {
        header: "Notes",
        cell: (info) =>
          info.getValue() ? (
            <span className="text-sm text-gray-600 truncate max-w-xs">
              {info.getValue()}
            </span>
          ) : (
            <span className="text-sm text-gray-400">—</span>
          ),
        enableSorting: false,
      }),

      // Actions
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => {
          const loan = info.row.original;

          if (loan.status === "active") {
            return (
            <button
              onClick={() => handleReturn(loan.loanId)}
              disabled={isLoading}
              aria-label={`Mark loan ${loan.loanId} as returned`}
              className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-lavender-600 hover:bg-lavender-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lavender-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Processing...' : 'Mark Returned'}
            </button>
            );
          }

          return <span className="text-xs text-gray-400">No actions</span>;
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
    //   await loanService.returnLoan(loanId, {
    //     returnedDate: new Date().toISOString(),
    //   });
      onRefresh();
    } catch (error) {
      console.error("Failed to mark loan returned:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[var(--color-card)] rounded-lg shadow-sm border border-[var(--color-border)]">
      {/* Search Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search loans..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              aria-label="Search loans"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-lavender-500 focus:border-lavender-500"
            />
          </div>
          <div className="ml-4 text-sm text-gray-500">
            Showing {table.getFilteredRowModel().rows.length} loan
            {table.getFilteredRowModel().rows.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

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
