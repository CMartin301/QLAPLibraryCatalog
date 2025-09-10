// utilities/statusDisplayHelpers.ts

import { LoanWithDetails } from "../types/loans";

export interface StatusConfig {
  text: string;
  color: "gray" | "red" | "yellow" | "green" | "blue" | "purple";
}

// Loan statuses
export function getLoanStatusDisplay(loan: LoanWithDetails): StatusConfig {
  if (loan.status === "returned") {
    return { text: "Returned", color: "gray" };
  }

  if (loan.status === "overdue") {
    return { text: "Overdue", color: "red" };
  }

  if (loan.borrowerReturnedAt && !loan.lenderConfirmedReturnAt) {
    return { text: "Pending Lender", color: "yellow" };
  }

  if (loan.lenderConfirmedReturnAt && !loan.borrowerReturnedAt) {
    return { text: "Pending Borrower", color: "yellow" };
  }

  return { text: "Active", color: "green" };
}

// Borrow request statuses
export function getBorrowRequestStatusDisplay(status: string): StatusConfig {
  const map: Record<string, StatusConfig> = {
    pending: { text: "Pending", color: "yellow" },
    approved: { text: "Approved", color: "green" },
    denied: { text: "Denied", color: "red" },
    cancelled: { text: "Cancelled", color: "gray" },
  };

  return map[status] ?? { text: status, color: "gray" };
}
