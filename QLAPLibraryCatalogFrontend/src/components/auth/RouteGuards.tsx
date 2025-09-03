import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

/**
 * ProtectedRoute - Requires authentication
 * Simplified: No loading logic (handled by LoadingBoundary)
 */
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <>{children}</> : <Navigate to="/login" replace />;
}

/**
 * AuthRoute - Redirects if already authenticated
 * Simplified: No initialization logic (handled by AuthInitializer)
 */
export function AuthRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <Navigate to="/dashboard" replace /> : <>{children}</>;
}