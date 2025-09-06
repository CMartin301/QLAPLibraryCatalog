
import { Loan, LoanWithDetails, ReturnLoanRequest } from "../types/loans";
import api from "./apiService";

export const loanService = {
  // Get all loans
  async getLoans(): Promise<Loan[]> {
    const response = await api.get<Loan[]>("/api/Loan");
    return response.data;
  },

  async getLoansBorrowedByUser(userId: number): Promise<Loan[]> {
    const response = await api.get<Loan[]>(`/api/Loan/User/Borrowed?userId=${userId}`);
    return response.data;
  },

    async getLoansOfUserMedia(userId: number): Promise<Loan[]> {
    const response = await api.get<Loan[]>(`/api/Loan/User/Lent?userId=${userId}`);
    return response.data;
  },


  // Get a single loan by ID
  async getLoanById(loanId: number): Promise<Loan> {
    const response = await api.get<Loan>(`/api/Loan/${loanId}`);
    return response.data;
  },
  
  // Get loans borrowed by user with full details for display
  async getLoansBorrowedByUserWithDetails(userId: number): Promise<LoanWithDetails[]> {
    const response = await api.get<LoanWithDetails[]>(`/api/Loan/User/Borrowed/Details?userId=${userId}`);
    return response.data;
  },

  // Get loans of user's media with full details for display
  async getLoansOfUserMediaWithDetails(userId: number): Promise<LoanWithDetails[]> {
    const response = await api.get<LoanWithDetails[]>(`/api/Loan/User/Lent/Details?userId=${userId}`);
    return response.data;
  },

  // Get a single loan by ID with full details for display
  async getLoanByIdWithDetails(loanId: number): Promise<LoanWithDetails> {
    const response = await api.get<LoanWithDetails>(`/api/Loan/${loanId}/Details`);
    return response.data;
  },


//   // Create a new loan
//   async createLoan(newLoan: CreateLoanRequest): Promise<Loan> {
//     const response = await api.post<Loan>("/api/Loan", newLoan);
//     return response.data;
//   },

  // Mark loan as returned
  async returnLoan(loanId: number, returnRequest: ReturnLoanRequest): Promise<Loan> {
    const response = await api.put<Loan>(`/api/Loan/${loanId}/Return?isBorrower=${returnRequest.isBorrower}`, returnRequest.returnNotes);
    return response.data;
  },

};
