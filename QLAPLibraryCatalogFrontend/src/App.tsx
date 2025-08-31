
import { AuthProvider } from './contexts/AuthContext';
import { LoginForm } from './components/auth/LoginForm';
import { GreetingPage } from './components/dashboard/GreetingPage';
import { useAuth } from './hooks/useAuth';
import AuthContainer from './components/auth/AuthContainer';
import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import RegistrationForm from './components/auth/RegistrationForm';
import Footer from './components/layout/Footer';
import Header from './components/layout/Header';
import MyLibraryPage from './components/myLibrary/MyLibraryPage';

/**
 * Protected Route Component
 * 
 * Wraps components that require authentication.
 * Redirects to login if user is not authenticated.
 */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, isLoading, initializeAuth } = useAuth();

  // Initialize auth on app startup
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Show loading while checking auth status
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }
// Only decide after loading is complete
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
  // return isLoggedIn ? <>{children}</> : <Navigate to="/login" replace />;
}

/**
 * Auth Route Component
 * 
 * Wraps auth-related components (login, register).
 * Redirects to dashboard if user is already authenticated.
 */function AuthRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, isLoading, initializeAuth } = useAuth();
  
  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);
  
  // Show loading while checking auth status
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p>Checking authentication...</p>
        </div>
      </div>
    );
  }
    
  return isLoggedIn ? <Navigate to="/dashboard" replace /> : <>{children}</>;
}


/**
 * App Routes Component
 * 
 * Defines all application routes and their corresponding components.
 * Must be inside AuthProvider to access auth state.
 */
function AppRoutes() {
  return (
    <Routes>
      {/* Auth routes - redirect to dashboard if already logged in */}
      <Route 
        path="/login" 
        element={
          <AuthRoute>
              <AuthContainer />
          </AuthRoute>
        } 
      />
      
      <Route 
        path="/register" 
        element={
          <AuthRoute>
              <AuthContainer />
          </AuthRoute>
        } 
      />

      {/* Protected routes - require authentication */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
              <GreetingPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/mylibrary" 
        element={
          <ProtectedRoute>
              <MyLibraryPage />
          </ProtectedRoute>
        } 
      />

      {/* Default redirect based on auth status */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      {/* Catch all - redirect unknown routes to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

// /**
//  * Main App Content Component
//  * 
//  * This component handles the conditional rendering based on auth state.
//  * It's separated from the main App component so it can use the useAuth hook
//  * (hooks can only be used inside components that are wrapped by the provider).
//  */
// function AppContent() {
//   const { isLoggedIn } = useAuth();

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      
//       {isLoggedIn ? <GreetingPage /> : <AuthContainer />}
//     </div>
//   );
// }

/**
 * Main App Component
 * 
 * Root component that provides routing and auth context.
 * BrowserRouter must wrap Routes, and AuthProvider must wrap components using auth.
 */
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Header />
        <AppRoutes />
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;