import { useContext } from 'react';
import { AuthContext, AuthContextType } from '../contexts/AuthContext';

/**
 * Custom hook to access the authentication context
 * 
 * This hook provides a clean way for components to access auth state and methods.
 * It's similar to dependency injection in Angular - components use this hook
 * instead of directly accessing the context.
 * 
 * @throws {Error} If used outside of AuthProvider
 * @returns {AuthContextType} The auth context value
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

export default useAuth;