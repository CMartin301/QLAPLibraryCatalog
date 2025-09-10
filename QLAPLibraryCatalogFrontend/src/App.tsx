
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import AuthContainer from './components/auth/AuthContainer';
import { AuthInitializer } from './components/auth/AuthInitializer';
import { LoadingBoundary } from './components/auth/LoadingBoundary';
import { AuthErrorBoundary } from './components/auth/AuthErrorBoundary';
import { ProtectedRoute, AuthRoute } from './components/auth/RouteGuards';
import Footer from './components/layout/Footer';
import Header from './components/layout/Header';
import MyLibraryPage from './components/myLibrary/MyLibraryPage';
import NetworkCatalogPage from './components/networkCatalog/NetworkCatalogPage';
import UserPreferencesContainer from './components/preferences/UserPreferencesContainer';
import BorrowingDashboard from './components/borrowing/BorrowingPage';
import Dashboard from './components/dashboard/Dashboard';
import { Toaster } from 'react-hot-toast';   // ⬅️ import here

/**
 * App Layout Component
 */
function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray-100 flex justify-center py-6 px-4 sm:px-6 lg:px-8">
      {children}
    </div>
  );
}

/**
 * App Routes
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
              <Dashboard />
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
        path="/borrowing" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <BorrowingDashboard />
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
      <Route 
        path="/preferences" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <UserPreferencesContainer />
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
 * App Root
 */
function App() {
  return (
    <AuthErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <AuthInitializer />
          <LoadingBoundary>
            <Header />
            <Toaster
              position="top-center"          // centered horizontally
              gutter={16}                    // spacing from top
              containerStyle={{ marginTop: '64px' }} // adjust for header height if needed
              toastOptions={{
                success: {
                  style: { background: "#4ade80", color: "#fff" },
                  duration: 4000,
                },
                error: {
                  style: { background: "#f87171", color: "#fff" },
                  duration: 4000,
                },
              }}
            />
            <AppRoutes />
            <Footer />
          </LoadingBoundary>
        </AuthProvider>
      </BrowserRouter>
    </AuthErrorBoundary>
  );
}

export default App;
