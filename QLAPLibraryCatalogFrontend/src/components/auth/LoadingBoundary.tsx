import { ReactNode } from 'react';
import useAuth from '../../hooks/useAuth';

interface LoadingBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * LoadingBoundary Component
 * 
 * Centralized loading state management.
 * Shows loading UI while auth state is being determined.
 */
export function LoadingBoundary({ children, fallback }: LoadingBoundaryProps) {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      fallback || (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="loading-spinner mx-auto mb-4"></div>
            <p>Loading...</p>
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
}