// Types for Loan objects

export interface Loan {
  loanId: number;
  requestId: number;
  startDate: string | null;
  dueDate: string | null;
  returnedDate: string | null;
  status: "active" | "returned" | "overdue";
  returnNotes: string | null;
  lateFeeAmount: number;
  lateFeePaid: boolean;
}


// Detailed loan interface with all related data (matches LoanWithDetailsDto)
export interface LoanWithDetails {
  // Basic loan information
  loanId: number;
  requestId: number;
  startDate: string | null;
  dueDate: string | null;
  returnedDate: string | null;
  status: "active" | "returned" | "overdue";
  returnNotes: string | null;
  lateFeeAmount: number | null;
  lateFeePaid: boolean | null;
  
  // Media information
  mediaTitle: string;
  mediaType: string;
  mediaAuthor?: string | null;
  mediaGenre?: string | null;
  
  // User information
  borrowerId: number;
  borrowerUsername: string;
  ownerId: number;
  ownerUsername: string;
  
  // Copy-specific information
  copyId: number;
  copyCondition?: string | null;
  copyNotes?: string | null;
  
  // Calculated fields for display
  daysOverdue?: number | null;
  isOverdue: boolean;
  loanPeriodDisplay: string;
}
// Update a loan when returning an item
export interface ReturnLoanRequest {
  returnedDate: string;
  returnNotes?: string | null;
  lateFeeAmount?: number;
  lateFeePaid?: boolean;
}
