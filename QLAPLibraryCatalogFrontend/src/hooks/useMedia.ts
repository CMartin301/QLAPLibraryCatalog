import { useState, useCallback } from 'react';
import { mediaService } from '../services/mediaService';
import { CreateMediaRequest, CreateMediaCopyRequest, Media, MediaCopy } from '../types/media';

export interface MediaError {
  type: 'network' | 'validation' | 'server' | 'unknown';
  message: string;
  details?: any;
}

export const useMedia = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<MediaError | null>(null);

  const createMedia = useCallback(async (data: CreateMediaRequest): Promise<Media> => {
    setLoading(true);
    setError(null);

    try {
      const result = await mediaService.createNewMedia(data);
      return result;
    } catch (err) {
      const error = createMediaError(err);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const createMediaCopy = useCallback(async (data: CreateMediaCopyRequest): Promise<MediaCopy> => {
    setLoading(true);
    setError(null);

    try {
      const result = await mediaService.createNewMediaCopy(data);
      return result;
    } catch (err) {
      const error = createMediaError(err);
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
    createMedia,
    createMediaCopy,
    loading,
    error,
    clearError
  };
};

function createMediaError(err: unknown): MediaError {
  if (err instanceof Error) {
    if (err.message.includes('fetch') || err.message.includes('network')) {
      return {
        type: 'network',
        message: 'Network error. Please check your connection.',
        details: err.message
      };
    }
    
    if (err.message.includes('400')) {
      return {
        type: 'validation',
        message: 'Invalid media data. Please check your input.',
        details: err.message
      };
    }
    
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