import { useEffect } from 'react';
import useAuth from '../../hooks/useAuth';

/**
 * AuthInitializer Component
 * 
 * Handles one-time auth initialization at app startup.
 * Industry standard: Initialize auth once at root level.
 */
export function AuthInitializer() {
  const { initializeAuth } = useAuth();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return null; // This component renders nothing
}