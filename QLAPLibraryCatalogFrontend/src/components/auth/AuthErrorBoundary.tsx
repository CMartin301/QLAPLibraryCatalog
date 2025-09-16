import { Component, ReactNode } from 'react';
import Button from '../shared/Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * AuthErrorBoundary Component
 * 
 * Catches and handles auth-related errors gracefully.
 * Industry standard: Always wrap auth flows in error boundaries.
 */
export class AuthErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Auth Error:', error, errorInfo);
    
    // Clear potentially corrupted auth state
    if (typeof Storage !== 'undefined') {
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('tokenExpiry');
      sessionStorage.removeItem('user');
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Authentication Error
              </h2>
              <p className="text-gray-600 mb-6">
                Something went wrong. Please try refreshing the page.
              </p>

                    <Button
                      variant="primary"
                      size="md"
                      onClick={() => window.location.reload()}
                      aria-label={`Cancel borrow request`}
                    >
                      Refresh Page
                    </Button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}