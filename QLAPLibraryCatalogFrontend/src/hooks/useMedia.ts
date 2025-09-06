import { useState, useEffect, useCallback } from 'react';
import { Media } from '../types/media';
import { mediaService } from '../services/mediaService';

export const useMedia = (userId?: number | null, includeCopies: boolean = false) => {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = userId 
        ? await mediaService.getUserMedia(userId, includeCopies)
        : await mediaService.getMedia(includeCopies);
      setMedia(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load media');
      console.error('Error loading media:', err);
    } finally {
      setLoading(false);
    }
  }, [userId, includeCopies]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  return {
    media,
    loading,
    error,
    refetch: fetchMedia
  };
};