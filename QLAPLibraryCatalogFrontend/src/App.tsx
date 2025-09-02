
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
import NetworkCatalogPage from './components/networkCatalog/NetworkCatalogPage';

/**
 * App Layout Component
 */
function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className=" bg-gray-100 flex justify-center py-6 px-4 sm:px-6 lg:px-8">
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
      <Route 
        path="/network-catalog" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <NetworkCatalogPage />
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
