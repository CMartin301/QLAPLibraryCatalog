import React, { createContext, useState, ReactNode } from 'react';

// Define the shape of our auth state
export interface AuthState {
  username: string | null;
  userID: number | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
}

// Define the shape of our context value
export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Create the context with a default value
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Props for the AuthProvider component
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  // Initial auth state
  const [authState, setAuthState] = useState<AuthState>({
    username: null,
    userID: null,
    isLoggedIn: false,
    isLoading: false,
    error: null
  });

  // Login function - replace the mock API call with your backend endpoint
  const login = async (email: string, password: string): Promise<void> => {
    // Set loading state
    setAuthState(prev => ({
      ...prev,
      isLoading: true,
      error: null
    }));

    try {
      // TODO: Replace this with your actual backend call
      // const response = await fetch('/api/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password })
      // });
      
      console.log('Attempting login with:', email, password);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful response - replace with actual backend response
      const mockResponse = {
        token: 'mock-jwt-token',
        user: {
          id: 123,
          username: email.split('@')[0]
        }
      };

      // Update state with successful login
      setAuthState({
        username: mockResponse.user.username,
        userID: mockResponse.user.id,
        isLoggedIn: true,
        isLoading: false,
        error: null
      });

      // Store JWT token (commented out for now since we're not using localStorage in artifacts)
      // localStorage.setItem('authToken', mockResponse.token);

    } catch (error) {
      // Handle login failure
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Login failed. Please check your credentials.'
      }));
    }
  };

  // Logout function
  const logout = (): void => {
    setAuthState({
      username: null,
      userID: null,
      isLoggedIn: false,
      isLoading: false,
      error: null
    });
    
    // Remove JWT token (commented out for now)
    // localStorage.removeItem('authToken');
  };

  // Context value that will be provided to children
  const value: AuthContextType = {
    ...authState,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}