import { useState, useEffect, useCallback } from 'react';
import { Media, MediaDto } from '../types/media';
import { mediaService } from '../services/mediaService';

export const useMedia = (userId?: number | null, includeCopies: boolean = false) => {
  const [media, setMedia] = useState<MediaDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    setError(undefined);
    
    try {
      const data = userId 
        ? await mediaService.getUserMedia(userId)
        : await mediaService.getMedia();
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