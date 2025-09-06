import { createContext, useState, useCallback, ReactNode } from 'react';
import { authService } from '../services/authService';
import { RegisterRequest, User } from '../types/auth';

// Define the shape of our auth state
export interface AuthState {
  username: string | null;
  userID: number | null;
  email: string | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  hasInitialized: boolean; 
  error: string | null;
}

// Define the shape of our context value
export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
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
    hasInitialized: false,
    error: null
  });

  // Login function - now uses authService
  const login = useCallback(async (email: string, password: string): Promise<void> => {
    // Set loading state
    setAuthState(prev => ({
      ...prev,
      isLoading: true,
      error: null
    }));

    try {
      // Use the authService instead of direct API calls
      const response = await authService.login({ email, password });

      // Update state with successful login
      setAuthState({
        username: response.user.username,
        userID: response.user.userId,
        email: response.user.email,
        isLoggedIn: true,
        isLoading: false,
        hasInitialized: true,
        error: null
      });

      // Store auth data for session persistence
      if (typeof Storage !== 'undefined') {
        sessionStorage.setItem('authToken', response.token);
        sessionStorage.setItem('tokenExpiry', response.expiresAt);
        sessionStorage.setItem('user', JSON.stringify(response.user));
      }

      console.log('Login successful:', response.user.username);

    } catch (error: any) {
      // Handle errors from authService
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.response?.status === 401) {
        // Handle unauthorized (invalid credentials)
        errorMessage = error.response.data?.error || 'Invalid credentials';
      } else if (error.response?.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timed out. Please check your connection.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));

      console.error('Login error:', error);
    }
  }, []);


  // Registration function
  const register = useCallback(async (userData: RegisterRequest): Promise<void> => {
    setAuthState(prev => ({
      ...prev,
      isLoading: true,
      error: null
    }));

    try {
      const user = await authService.register(userData);
      
      await login(userData.email, userData.password);
      
      console.log('Registration successful:', user.username);
    } catch (error: any) {
      // Handle errors from authService
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.response?.status === 401) {
        // Handle unauthorized (invalid credentials)
        errorMessage = error.response.data?.error || 'Invalid credentials';
      } else if (error.response?.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timed out. Please check your connection.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        hasInitialized: true,
        error: errorMessage
      }));
      console.error('Registration error:', error);
    }
  }, []);


  // Logout function
  const logout = useCallback((): void => {
    setAuthState({
      username: null,
      userID: null,
      email: null,
      isLoggedIn: false,
      hasInitialized: true,
      isLoading: false,
      error: null
    });
    
    // Remove auth data from session storage
    if (typeof Storage !== 'undefined') {
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('tokenExpiry');
      sessionStorage.removeItem('user');
    }

    console.log('User logged out');
  }, []);

  // Initialize auth state from stored session (call this on app startup)
  const initializeAuth = useCallback((): void => {
    
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
            const user: User = JSON.parse(userStr);
            setAuthState({
              username: user.username,
              userID: user.userId,
              email: user.email,
              isLoggedIn: true,
              isLoading: false,
              hasInitialized: true,
              error: null
            });
            console.log('Session restored for user:', user.username);
            return;
          } catch (error) {
            // Invalid stored user data, clear storage
            logout();
            return;
          }
        } else {
          // Token expired, clear storage
          logout();
          return;
        }
      }
    }  
    setAuthState(prev => ({
    ...prev,
    hasInitialized: true,
    isLoading: false
  }));
}, [logout]); 

  // Context value that will be provided to children
  const value: AuthContextType = {
    ...authState,
    login,
    register,
    logout,
    initializeAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}