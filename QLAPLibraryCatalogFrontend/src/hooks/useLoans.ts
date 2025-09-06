// hooks/useLoans.ts
import { useState, useEffect } from 'react';
import { LoanWithDetails } from '../types/loans';
import { loanService } from '../services/loanService';

type LoanTab = 'borrowed' | 'lent';

export const useLoans = (userID: number | null, loanTab: LoanTab) => {
  const [loans, setLoans] = useState<LoanWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLoans = async () => {
    if (!userID) {
      setLoans([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      let fetchedLoans: LoanWithDetails[];
      
      if (loanTab === 'borrowed') {
        fetchedLoans = await loanService.getLoansBorrowedByUserWithDetails(userID);
      } else {
        fetchedLoans = await loanService.getLoansOfUserMediaWithDetails(userID);
      }
      
      setLoans(fetchedLoans);
    } catch (err) {
      console.error('Failed to fetch loans:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch loans');
      setLoans([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, [userID, loanTab]);

  const refetch = () => {
    fetchLoans();
  };

  return {
    loans,
    loading,
    error,
    refetch
  };
};