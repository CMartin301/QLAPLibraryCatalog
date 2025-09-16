import { useMemo, useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { BorrowRequestDto } from "../../../../types/borrowRequests";
import { borrowRequestService } from "../../../../services/borrowRequestService";
import { TableContainer } from "../../../shared/TableContainer";
import { useTableActions } from "../../../../hooks/useTableActions";
import useAuth from "../../../../hooks/useAuth";
import { getBorrowRequestStatusDisplay } from "../../../../utilities/statusDisplayHelpers";
import { StatusBadge } from "../../../shared/StatusBadge";
import BorrowRequestModal from "../BorrowRequestModal";
import { useSentBorrowRequestsColumns } from "./sentBorrowRequestsColumns";

interface SentBorrowRequestsTableProps {
  requests: BorrowRequestDto[];
  onRefresh: () => void;
  error?: string | null;
  loading?: boolean;
}

// type BorrowStatus = 'pending' | 'approved' | 'denied' | 'cancelled';

export function SentBorrowRequestsTable({ 
  requests, 
  onRefresh, 
  error, 
  loading 
}: SentBorrowRequestsTableProps) {
  const { userID } = useAuth();
  const { executeAction, isLoading } = useTableActions();
  
  // Modal state
  const [selectedRequest, setSelectedRequest] = useState<BorrowRequestDto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);


  const handleCancel = async (requestId: number): Promise<void> => {
    if (!userID) return;
    
    return executeAction(
      () => borrowRequestService.cancelBorrowRequest(requestId, userID),
      {
        onSuccess: onRefresh,
        successMessage: "Request cancelled successfully",
        errorMessage: "Failed to cancel request",
      }
    );
  };

  const handleRowClick = (request: BorrowRequestDto) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
  };

  const columns = useSentBorrowRequestsColumns({
    handlers: {
      handleCancel: handleCancel
    },
    isLoading
  });

  return (
    <>
      <TableContainer
        data={requests}
        columns={columns}
        loading={loading || isLoading}
        error={error}
        onRefresh={onRefresh}
        emptyMessage="No sent requests found"
        onRowClick={handleRowClick}
        rowClassName="cursor-pointer"
      />

      <BorrowRequestModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        borrowRequest={selectedRequest}
      />
    </>
  );
}

export default SentBorrowRequestsTable;