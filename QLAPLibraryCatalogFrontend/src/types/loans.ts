// Types for Loan objects

export interface Loan {
  loanId: number;
  requestId: number;
  startDate: string | null;
  dueDate: string | null;
  returnedDate: string | null;
  status: "active" | "returned" | "overdue"; // You can expand if backend has more
  returnNotes: string | null;
  lateFeeAmount: number;
  lateFeePaid: boolean;
}

// // Create a loan request
// export interface CreateLoanRequest {
//   requestId: number;
//   startDate?: string | null;
//   dueDate?: string | null;
// }

// Update a loan when returning an item
export interface ReturnLoanRequest {
  returnedDate: string;
  returnNotes?: string | null;
  lateFeeAmount?: number;
  lateFeePaid?: boolean;
}
