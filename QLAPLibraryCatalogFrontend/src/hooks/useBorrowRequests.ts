import { useState, useEffect, useCallback } from 'react';
import { BorrowRequestDto } from '../types/borrowRequests';
import { borrowRequestService } from '../services/borrowRequestService';

export const useBorrowRequests = (userId: number | null, type: 'sent' | 'received') => {
  const [requests, setRequests] = useState<BorrowRequestDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = type === 'sent' 
        ? await borrowRequestService.getBorrowRequestsForBorrower(userId)
        : await borrowRequestService.getBorrowRequestsForLender(userId);
      setRequests(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load requests');
      console.error('Error loading borrow requests:', err);
    } finally {
      setLoading(false);
    }
  }, [userId, type]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return {
    requests,
    loading,
    error,
    refetch: fetchRequests
  };
};