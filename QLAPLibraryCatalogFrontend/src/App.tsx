
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { GreetingPage } from './components/dashboard/GreetingPage';
import AuthContainer from './components/auth/AuthContainer';
import { AuthInitializer } from './components/auth/AuthInitializer';
import { LoadingBoundary } from './components/auth/LoadingBoundary';
import { AuthErrorBoundary } from './components/auth/AuthErrorBoundary';
import { ProtectedRoute, AuthRoute } from './components/auth/RouteGuards';
import Footer from './components/layout/Footer';
import Header from './components/layout/Header';
import MyLibraryPage from './components/myLibrary/MyLibraryPage';

/**
 * App Layout Component
 */
function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {children}
    </div>
  );
}

/**
 * App Routes - Clean route definitions
 */
function AppRoutes() {
  return (
    <Routes>
      {/* Auth routes */}
      <Route 
        path="/login" 
        element={
          <AuthRoute>
            <AppLayout>
              <AuthContainer />
            </AppLayout>
          </AuthRoute>
        } 
      />
      
      <Route 
        path="/register" 
        element={
          <AuthRoute>
            <AppLayout>
              <AuthContainer />
            </AppLayout>
          </AuthRoute>
        } 
      />

      {/* Protected routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <GreetingPage />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      {/* Add the MyLibrary route back */}
      <Route 
        path="/my-library" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <MyLibraryPage />
            </AppLayout>
          </ProtectedRoute>
        } 
      />

      {/* Default routes */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

/**
 * Industry Standard App Structure
 * 
 * 1. Error Boundary - Catches auth errors
 * 2. Router - Enables navigation
 * 3. Auth Provider - Provides auth state
 * 4. Auth Initializer - One-time initialization
 * 5. Loading Boundary - Centralized loading
 * 6. Routes - Clean route definitions
 */
function App() {
  return (
    <AuthErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <AuthInitializer />
          <LoadingBoundary>
            <Header />
            <AppRoutes />
            <Footer />
          </LoadingBoundary>
        </AuthProvider>
      </BrowserRouter>
    </AuthErrorBoundary>
  );
}

export default App;

// import { AuthProvider } from './contexts/AuthContext';
// import { LoginForm } from './components/auth/LoginForm';
// import { GreetingPage } from './components/dashboard/GreetingPage';
// import { useAuth } from './hooks/useAuth';
// import AuthContainer from './components/auth/AuthContainer';
// import { useEffect } from 'react';
// import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
// import RegistrationForm from './components/auth/RegistrationForm';
// import Footer from './components/layout/Footer';
// import Header from './components/layout/Header';
// import MyLibraryPage from './components/myLibrary/MyLibraryPage';

// /**
//  * Protected Route Component
//  * 
//  * Wraps components that require authentication.
//  * Redirects to login if user is not authenticated.
//  */
// function ProtectedRoute({ children }: { children: React.ReactNode }) {
//   const { isLoggedIn, isLoading, hasInitialized, initializeAuth } = useAuth();

//   // Initialize auth on app startup
//   useEffect(() => {
//     initializeAuth();
//   }, [initializeAuth]);

//   // Show loading while checking auth status
//   if (isLoading || !hasInitialized) {
//     return (
//       <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//         <div className="text-center">
//           <div className="loading-spinner mx-auto mb-4"></div>
//           <p>Loading...</p>
//         </div>
//       </div>
//     );
//   }
  
//   return isLoggedIn ? <>{children}</> : <Navigate to="/login" replace />;
// }

// /**
//  * Auth Route Component
//  * 
//  * Wraps auth-related components (login, register).
//  * Redirects to dashboard if user is already authenticated.
//  */
// function AuthRoute({ children }: { children: React.ReactNode }) {
//   const { isLoggedIn, isLoading, initializeAuth } = useAuth();
  
//   // Initialize auth state on mount
//   useEffect(() => {
//     initializeAuth();
//   }, [initializeAuth]);
  
//   // Show loading while checking auth status
//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//         <div className="text-center">
//           <div className="loading-spinner mx-auto mb-4"></div>
//           <p>Checking authentication...</p>
//         </div>
//       </div>
//     );
//   }
    
//   return isLoggedIn ? <Navigate to="/dashboard" replace /> : <>{children}</>;
// }


// /**
//  * App Routes Component
//  * 
//  * Defines all application routes and their corresponding components.
//  * Must be inside AuthProvider to access auth state.
//  */
// function AppRoutes() {
//   return (
//     <Routes>
//       {/* Auth routes - redirect to dashboard if already logged in */}
//       <Route 
//         path="/login" 
//         element={
//           <AuthRoute>
//               <AuthContainer />
//           </AuthRoute>
//         } 
//       />
      
//       <Route 
//         path="/register" 
//         element={
//           <AuthRoute>
//               <AuthContainer />
//           </AuthRoute>
//         } 
//       />

//       {/* Protected routes - require authentication */}
//       <Route 
//         path="/dashboard" 
//         element={
//           <ProtectedRoute>
//               <GreetingPage />
//           </ProtectedRoute>
//         } 
//       />
//       <Route 
//         path="/mylibrary" 
//         element={
//           <ProtectedRoute>
//               <MyLibraryPage />
//           </ProtectedRoute>
//         } 
//       />

//       {/* Default redirect based on auth status */}
//       <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
//       {/* Catch all - redirect unknown routes to login */}
//       <Route path="*" element={<Navigate to="/login" replace />} />
//     </Routes>
//   );
// }

// /**
//  * Main App Component
//  * 
//  * Root component that provides routing and auth context.
//  * BrowserRouter must wrap Routes, and AuthProvider must wrap components using auth.
//  */
// function App() {
//   return (
//     <BrowserRouter>
//       <AuthProvider>
//         <Header />
//         <AppRoutes />
//         <Footer />
//       </AuthProvider>
//     </BrowserRouter>
//   );
// }

// export default App;