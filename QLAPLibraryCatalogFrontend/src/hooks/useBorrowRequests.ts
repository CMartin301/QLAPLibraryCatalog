import { useState, useCallback } from 'react';
import { borrowRequestService } from '../services/borrowRequestService';
import { BorrowRequestDto, CreateBorrowRequestDto } from '../types/borrowRequests';

export interface BorrowRequestError {
  type: 'network' | 'validation' | 'server' | 'unknown';
  message: string;
  details?: any;
}

export const useBorrowRequests = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<BorrowRequestError | null>(null);

  const createRequest = useCallback(async (data: CreateBorrowRequestDto): Promise<BorrowRequestDto> => {
    setLoading(true);
    setError(null);

    try {
      const result = await borrowRequestService.createBorrowRequest(data);
      return result;
    } catch (err) {
      const error = createBorrowRequestError(err);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    createRequest,
    loading,
    error,
    clearError
  };
};

function createBorrowRequestError(err: unknown): BorrowRequestError {
  if (err instanceof Error) {
    // Check if it's a network error
    if (err.message.includes('fetch') || err.message.includes('network')) {
      return {
        type: 'network',
        message: 'Network error. Please check your connection.',
        details: err.message
      };
    }
    
    // Check if it's a validation error (400 status)
    if (err.message.includes('400')) {
      return {
        type: 'validation',
        message: 'Invalid request data. Please check your input.',
        details: err.message
      };
    }
    
    // Server error (500+)
    if (err.message.includes('500')) {
      return {
        type: 'server',
        message: 'Server error. Please try again later.',
        details: err.message
      };
    }
    
    return {
      type: 'unknown',
      message: err.message,
      details: err
    };
  }
  
  return {
    type: 'unknown',
    message: 'An unexpected error occurred',
    details: err
  };
}