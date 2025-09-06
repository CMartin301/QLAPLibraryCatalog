import { useState, useEffect, useCallback } from 'react';
import { Loan } from '../types/loans';
import { loanService } from '../services/loanService';

export const useLoans = (userId: number | null, type: 'borrowed' | 'lent') => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLoans = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = type === 'borrowed' 
        ? await loanService.getLoansBorrowedByUser(userId)
        : await loanService.getLoansOfUserMedia(userId);
      setLoans(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load loans');
      console.error('Error loading loans:', err);
    } finally {
      setLoading(false);
    }
  }, [userId, type]);

  useEffect(() => {
    fetchLoans();
  }, [fetchLoans]);

  return {
    loans,
    loading,
    error,
    refetch: fetchLoans
  };
};