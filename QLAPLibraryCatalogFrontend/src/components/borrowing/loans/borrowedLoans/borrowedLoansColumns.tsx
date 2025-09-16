import { useMemo } from 'react';
import { createColumnHelper, ColumnDef } from '@tanstack/react-table';
import Button from '../../../shared/Button';
import { StatusBadge } from '../../../shared/StatusBadge';
import { getLoanStatusDisplay } from '../../../../utilities/statusDisplayHelpers';
import { LoanWithDetails } from '../../../../types/loans';

  const columnHelper = createColumnHelper<LoanWithDetails>();

interface UseBorrowedLoansColumnsProps {
  handlers: {
    handleReturn: (loanId: number) => void;
  };
  isLoading: boolean | undefined;
}

export function useBorrowedLoansColumns({ 
  handlers, 
  isLoading 
}: UseBorrowedLoansColumnsProps) {
  const { handleReturn } = handlers;

  return useMemo<ColumnDef<LoanWithDetails, any>[]>(() => [
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
        header: "",
        size: 180,
        cell: (info) => {
          const loan = info.row.original;

          // Borrower can only mark returned if they haven't already
          if (loan.borrowerReturnedAt === null) {
            return (
              <Button
                variant="primary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation(); 
                  handleReturn(loan.loanId);
                }} 
                disabled={isLoading}
                loading={isLoading}
                aria-label={`Mark loan as returned`}
              >
                {isLoading ? "Processing..." : "Mark Returned"}
              </Button>
            );
          }

          return (
            <span className="text-xs text-gray-400">
              No Actions
            </span>
          );
        },
      }),
  ], [isLoading, handleReturn]);
}