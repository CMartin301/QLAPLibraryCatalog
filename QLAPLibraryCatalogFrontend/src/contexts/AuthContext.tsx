import React, { createContext, useState, ReactNode } from 'react';

// Define the shape of our auth state
export interface AuthState {
  username: string | null;
  userID: number | null;
  email: string | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
}

// Backend API response types
interface LoginResponse {
  token: string;
  expiresAt: string;
  user: {
    userId: number;
    email: string;
    username: string;
    userPreferences: any;
  };
}

interface ApiError {
  error: string;
}

// Define the shape of our context value
export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  initializeAuth: () => void;
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
    email: null,
    isLoggedIn: false,
    isLoading: false,
    error: null
  });

  // Get API base URL from environment variables
  const API_BASE_URL = import.meta.env.REACT_APP_API_BASE_URL || 'http://localhost:5236';
  const API_TIMEOUT = parseInt(import.meta.env.REACT_APP_API_TIMEOUT || '10000', 10);

  // Login function - now connects to your real backend
  const login = async (email: string, password: string): Promise<void> => {
    // Set loading state
    setAuthState(prev => ({
      ...prev,
      isLoading: true,
      error: null
    }));

    try {
      // Create AbortController for timeout handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

      // Make API call to your backend
      const response = await fetch(`${API_BASE_URL}/api/Users/Login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
        }),
        signal: controller.signal
      });

      // Clear timeout since request completed
      clearTimeout(timeoutId);

      // Handle different response status codes
      if (!response.ok) {
        if (response.status === 401) {
          // Handle unauthorized (invalid credentials)
          const errorData: ApiError = await response.json();
          throw new Error(errorData.error || 'Invalid credentials');
        } else if (response.status >= 500) {
          throw new Error('Server error. Please try again later.');
        } else {
          throw new Error('Login failed. Please try again.');
        }
      }

      // Parse successful response
      const data: LoginResponse = await response.json();

      // Update state with successful login
      setAuthState({
        username: data.user.username,
        userID: data.user.userId,
        email: data.user.email,
        isLoggedIn: true,
        isLoading: false,
        error: null
      });

      // Store JWT token and expiration for session persistence
      if (typeof Storage !== 'undefined') {
        sessionStorage.setItem('authToken', data.token);
        sessionStorage.setItem('tokenExpiry', data.expiresAt);
        sessionStorage.setItem('user', JSON.stringify(data.user));
      }

      console.log('Login successful:', data.user.username);

    } catch (error) {
      // Handle different types of errors
      let errorMessage = 'Login failed. Please try again.';
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = 'Request timed out. Please check your connection.';
        } else {
          errorMessage = error.message;
        }
      }

      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));

      console.error('Login error:', error);
    }
  };

  // Logout function
  const logout = (): void => {
    setAuthState({
      username: null,
      userID: null,
      email: null,
      isLoggedIn: false,
      isLoading: false,
      error: null
    });
    
    // Remove JWT token and user data from session storage
    if (typeof Storage !== 'undefined') {
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('tokenExpiry');
      sessionStorage.removeItem('user');
    }

    console.log('User logged out');
  };

  // Initialize auth state from stored session (call this on app startup)
  const initializeAuth = (): void => {
    if (typeof Storage !== 'undefined') {
      const token = sessionStorage.getItem('authToken');
      const expiry = sessionStorage.getItem('tokenExpiry');
      const userStr = sessionStorage.getItem('user');

      if (token && expiry && userStr) {
        // Check if token is still valid
        const expiryDate = new Date(expiry);
        const now = new Date();

        if (now < expiryDate) {
          // Token is still valid, restore user session
          try {
            const user = JSON.parse(userStr);
            setAuthState({
              username: user.username,
              userID: user.userId,
              email: user.email,
              isLoggedIn: true,
              isLoading: false,
              error: null
            });
            console.log('Session restored for user:', user.username);
          } catch (error) {
            // Invalid stored user data, clear storage
            logout();
          }
        } else {
          // Token expired, clear storage
          logout();
          console.log('Session expired, please log in again');
        }
      }
    }
  };

  // Context value that will be provided to children
  const value: AuthContextType = {
    ...authState,
    login,
    logout,
    initializeAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}