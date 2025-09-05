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

interface LoansTableProps {
  loans: Loan[];
  onRefresh: () => void;
}

type LoanStatus = "active" | "returned" | "overdue";

export function LoansTable({ loans, onRefresh }: LoansTableProps) {
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
                className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-lavender-600 hover:bg-lavender-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lavender-500 disabled:opacity-50"
              >
                Mark Returned
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
    <div className="bg-white">
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
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-lavender-500 focus:border-lavender-500"
            />
          </div>
          <div className="ml-4 text-sm text-gray-500">
            Showing {table.getFilteredRowModel().rows.length} loan
            {table.getFilteredRowModel().rows.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed divide-y divide-gray-200">
            <thead className="bg-gray-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={`flex items-center space-x-1 ${
                            header.column.getCanSort()
                              ? "cursor-pointer select-none hover:text-gray-700"
                              : ""
                          }`}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          <span>
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </span>
                          {header.column.getCanSort() && (
                            <span className="flex flex-col">
                              <ChevronUp
                                size={12}
                                className={`${
                                  header.column.getIsSorted() === "asc"
                                    ? "text-lavender-600"
                                    : "text-gray-300"
                                }`}
                              />
                              <ChevronDown
                                size={12}
                                className={`-mt-1 ${
                                  header.column.getIsSorted() === "desc"
                                    ? "text-lavender-600"
                                    : "text-gray-300"
                                }`}
                              />
                            </span>
                          )}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {table.getRowModel().rows.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Show</span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-lavender-500"
            >
              {[5, 10, 20, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
            <span>of {table.getFilteredRowModel().rows.length} entries</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-lavender-500"
            >
              <ChevronLeft size={16} />
            </button>

            <div className="flex items-center gap-1">
              {Array.from(
                { length: Math.min(5, table.getPageCount()) },
                (_, i) => {
                  const currentPage = table.getState().pagination.pageIndex;
                  const totalPages = table.getPageCount();

                  let pageIndex;
                  if (totalPages <= 5) {
                    pageIndex = i;
                  } else if (currentPage <= 2) {
                    pageIndex = i;
                  } else if (currentPage >= totalPages - 3) {
                    pageIndex = totalPages - 5 + i;
                  } else {
                    pageIndex = currentPage - 2 + i;
                  }

                  if (pageIndex >= totalPages || pageIndex < 0) return null;

                  return (
                    <button
                      key={pageIndex}
                      onClick={() => table.setPageIndex(pageIndex)}
                      className={`px-3 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-lavender-500 ${
                        pageIndex === currentPage
                          ? "bg-lavender-500 text-white border-lavender-500"
                          : "border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {pageIndex + 1}
                    </button>
                  );
                }
              )}
            </div>

            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="p-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-lavender-500"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoansTable;
