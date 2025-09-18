import { useState } from "react";
import { useTableActions } from "../../../../hooks/useTableActions";
import { borrowRequestService } from "../../../../services/borrowRequestService";
import { BorrowRequestDto } from "../../../../types/borrowRequests";
import { TableContainer } from "../../../shared/TableContainer";
import BorrowRequestModal from "../BorrowRequestModal";
import { useReceivedBorrowRequestsColumns } from "./receivedBorrowRequestsColumns";

interface ReceivedBorrowRequestsTableProps {
  requests: BorrowRequestDto[];
  onRefresh: () => void;
  error?: string | null;
  loading?: boolean;
} 

export function ReceivedBorrowRequestsTable({ 
  requests, 
  onRefresh, 
  error, 
  loading 
}: ReceivedBorrowRequestsTableProps) {
  const { executeAction, isLoading } = useTableActions();
  
  const [selectedRequest, setSelectedRequest] = useState<BorrowRequestDto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleApprove = async (requestId: number): Promise<void> => {
    return executeAction(
      () => borrowRequestService.approveBorrowRequest(requestId),
      {
        onSuccess: onRefresh,
        successMessage: "Request approved successfully",
        errorMessage: "Failed to approve request",
      }
    );
  };

  const handleDeny = async (requestId: number): Promise<void> => {
    return executeAction(
      () => borrowRequestService.denyBorrowRequest(requestId, 'Request denied'),
      {
        onSuccess: onRefresh,
        successMessage: "Request denied",
        errorMessage: "Failed to deny request",
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

  const columns = useReceivedBorrowRequestsColumns({
    handlers: {
      handleApprove: handleApprove,
      handleDeny: handleDeny
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
        emptyMessage="No received requests found"
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

export default ReceivedBorrowRequestsTable;