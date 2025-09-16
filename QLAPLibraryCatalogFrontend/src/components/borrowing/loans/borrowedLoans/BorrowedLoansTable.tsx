import { useState } from "react";
import { useTableActions } from "../../../../hooks/useTableActions";
import { loanService } from "../../../../services/loanService";
import { LoanWithDetails } from "../../../../types/loans";
import { TableContainer } from "../../../shared/TableContainer";
import { LoanModal } from "../LoanModal";
import { useBorrowedLoansColumns } from "./borrowedLoansColumns";

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

  const columns = useBorrowedLoansColumns({
    handlers: {
      handleReturn: handleReturn
    },
    isLoading
  });
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

      <LoanModal
        isOpen={detailModal.isOpen}
        onClose={() => setDetailModal({ isOpen: false, loan: null })}
        loan={detailModal.loan}
      />
    </>
  );
}

export default BorrowedLoansTable;
