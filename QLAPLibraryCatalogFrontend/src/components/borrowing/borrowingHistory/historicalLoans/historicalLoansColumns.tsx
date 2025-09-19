import { useMemo } from 'react';
import { createColumnHelper, ColumnDef } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import { BorrowRequestDto } from '../../../../types/borrowRequests';
import Button from '../../../shared/Button';
import { StatusBadge } from '../../../shared/StatusBadge';
import { getBorrowRequestStatusDisplay, getLoanStatusDisplay } from '../../../../utilities/statusDisplayHelpers';
import { LoanWithDetails } from '../../../../types/loans';

  const columnHelper = createColumnHelper<LoanWithDetails>();

interface UseHistoricalLoansColumnsProps {
  handlers: {
    handleReturn: (loanId: number) => void;
    handleExtend: (loan: LoanWithDetails) => void;
  };
  isLoading: boolean | undefined;
}

export function useHistoricalLoansColumns({ 
  handlers, 
  isLoading 
}: UseHistoricalLoansColumnsProps) {
  const { handleReturn, handleExtend } = handlers;

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
                    {row.mediaCreator || "Unknown author"}
                  </p>
                </div>
              </div>
            );
          },
          enableSorting: true,
          size: 260,
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
            const config = getLoanStatusDisplay(info.row.original);
            return <StatusBadge config={config} />;
          },
          enableSorting: true,
        }),
        columnHelper.display({
          id: "actions",
          header: "",
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
                      {isLoading ? "Processing..." : "Confirm Return"}
                    </Button>
                )}
                {canExtend && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation(); 
                        handleExtend(loan);
                      }} 
                      disabled={isLoading}
                      aria-label={`Extend loan`}
                    >
                      Extend Loan
                    </Button>
                )}
              </div>
            );
          },
        }),
  ], [isLoading, handleReturn, handleExtend]);
}