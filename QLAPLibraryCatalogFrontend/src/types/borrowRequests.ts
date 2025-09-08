
export interface BorrowRequestDto {
  requestId: number;
  borrowerId: number;
  borrowerUsername: string;
  ownerUsername: string;
  copyId: number;
  status?: string;
  message?: string;
  requestedStartDate?: string;
  requestedEndDate?: string;
  approvedAt?: string;
  deniedAt?: string;
  denialReason?: string;
  createdAt?: string;
  updatedAt?: string;
  mediaTitle: string;
  mediaCreator: string;
}

export interface CreateBorrowRequestDto {
  borrowerId: number;
  copyId: number;
  message?: string;
  requestedStartDate?: string; // DateOnly as string (YYYY-MM-DD)
  requestedEndDate?: string;   // DateOnly as string (YYYY-MM-DD)
}