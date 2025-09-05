
import { Loan } from "../types/loans";
import api from "./apiService";

export const loanService = {
  // Get all loans
  async getLoans(): Promise<Loan[]> {
    const response = await api.get<Loan[]>("/api/Loan");
    return response.data;
  },

  // Get a single loan by ID
  async getLoanById(loanId: number): Promise<Loan> {
    const response = await api.get<Loan>(`/api/Loan/${loanId}`);
    return response.data;
  },

//   // Create a new loan
//   async createLoan(newLoan: CreateLoanRequest): Promise<Loan> {
//     const response = await api.post<Loan>("/api/Loan", newLoan);
//     return response.data;
//   },

//   // Mark loan as returned
//   async returnLoan(loanId: number, returnRequest: ReturnLoanRequest): Promise<Loan> {
//     const response = await api.put<Loan>(`/api/Loan/${loanId}/Return`, returnRequest);
//     return response.data;
//   },

//   // Optional: get all loans for a given user by requestId → backend may support this
//   async getLoansByUser(userId: number): Promise<Loan[]> {
//     const response = await api.get<Loan[]>(`/api/Loan/User/${userId}`);
//     return response.data;
//   },
};
