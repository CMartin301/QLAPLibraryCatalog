
import { AuthProvider } from './contexts/AuthContext';
import { LoginForm } from './components/LoginForm';
import { GreetingPage } from './components/GreetingPage';
import { useAuth } from './hooks/useAuth';

/**
 * Main App Content Component
 * 
 * This component handles the conditional rendering based on auth state.
 * It's separated from the main App component so it can use the useAuth hook
 * (hooks can only be used inside components that are wrapped by the provider).
 */
function AppContent() {
  const { isLoggedIn } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {isLoggedIn ? <GreetingPage /> : <LoginForm />}
    </div>
  );
}

/**
 * Main App Component
 * 
 * This is your root component that wraps everything with the AuthProvider.
 * The AuthProvider must wrap any components that need access to auth state.
 */
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;