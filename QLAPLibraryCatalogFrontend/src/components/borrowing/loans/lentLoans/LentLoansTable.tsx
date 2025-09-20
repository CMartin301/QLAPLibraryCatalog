import { useState } from "react";
import { useTableActions } from "../../../../hooks/useTableActions";
import { loanService } from "../../../../services/loanService";
import { LoanWithDetails } from "../../../../types/loans";
import { TableContainer } from "../../../shared/TableContainer";
import { ExtendLoanModal } from "../ExtendLoanModal";
import { LoanModal } from "../LoanModal";
import { useLentLoansColumns } from "./lentLoansColumns";

interface LentLoansTableProps {
  loans: LoanWithDetails[];
  onRefresh: () => void;
  error?: string | null;
  loading?: boolean;
}

export function LentLoansTable({ loans, onRefresh, error, loading }: LentLoansTableProps) {
  // const tableState = useTableState<LoanWithDetails>();
  const { executeAction, isLoading } = useTableActions();
  const [detailModal, setDetailModal] = useState<{
    isOpen: boolean;
    loan: LoanWithDetails | null;
  }>({ isOpen: false, loan: null });

  const [extendModal, setExtendModal] = useState<{
    isOpen: boolean;
    loan: LoanWithDetails | null;
  }>({ isOpen: false, loan: null });

  const handleRowClick = (loan: LoanWithDetails) => {
  setDetailModal({ isOpen: true, loan });
};

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


  const columns = useLentLoansColumns({
    handlers: {
      handleReturn: handleReturn,
      handleExtend: handleExtend
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
        onRowClick={handleRowClick}
        emptyMessage="No lent loans found"
      />

      <ExtendLoanModal
        isOpen={extendModal.isOpen}
        onClose={() => setExtendModal({ isOpen: false, loan: null })}
        loan={extendModal.loan}
        onExtend={handleExtendSubmit}
        isLoading={isLoading}
      />
      
      <LoanModal
        isOpen={detailModal.isOpen}
        onClose={() => setDetailModal({ isOpen: false, loan: null })}
        loan={detailModal.loan}
      />
    </>
  );
}

export default LentLoansTable;
