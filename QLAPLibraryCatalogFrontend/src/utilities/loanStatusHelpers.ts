import { LoanWithDetails } from '../types/loans';

export interface StatusDisplay {
  text: string;
  class: string;
}

export function getLoanStatusDisplay(loan: LoanWithDetails): StatusDisplay {
  // If officially returned
  if (loan.status === 'returned') {
    return { 
      text: 'Returned', 
      class: 'bg-gray-100 text-gray-800' 
    };
  }

  // If overdue
  if (loan.status === 'overdue') {
    return { 
      text: 'Overdue', 
      class: 'bg-red-100 text-red-800' 
    };
  }

  // Check for pending return states
  if (loan.borrowerReturnedAt && !loan.lenderConfirmedReturnAt) {
    return { 
      text: 'Pending Lender', 
      class: 'bg-yellow-100 text-yellow-800' 
    };
  }

  if (loan.lenderConfirmedReturnAt && !loan.borrowerReturnedAt) {
    return { 
      text: 'Pending Borrower', 
      class: 'bg-yellow-100 text-yellow-800' 
    };
  }

  // Regular active loan
  return { 
    text: 'Active', 
    class: 'bg-green-100 text-green-800' 
  };
}