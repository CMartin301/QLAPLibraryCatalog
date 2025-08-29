import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { Mail, Lock, Eye, EyeOff, LogIn, AlertTriangle, Loader2 } from 'lucide-react';

/**
 * LoginForm Component
 * 
 * Modern, accessible login form with mobile-first design
 * Following WCAG 2.1 guidelines and modern UX patterns
 */
export function LoginForm() {
  // Local state for form inputs
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  
  // Access auth context using our custom hook
  const { login, isLoading, error } = useAuth();

  // Handle form submission
  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!email.trim() || !password.trim()) {
      return;
    }
    
    login(email, password);
  };

  // Handle Enter key press in password field
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Header Section */}
        <div className="login-header">
          <div className="login-header-content">
            <h1 className="login-title">Welcome Back</h1>
            <p className="login-subtitle">Sign in to access your book collection</p>
          </div>
        </div>

        {/* Form Section */}
        <div className="login-body">
          <form onSubmit={handleSubmit} noValidate>
            {/* Global Error Display */}
            {error && (
              <div className="error-alert" role="alert" aria-live="polite">
                <div className="error-icon" aria-hidden="true">
                  <AlertTriangle size={20} />
                </div>
                <div className="error-content">
                  <strong>Login Failed</strong>
                  <span>{error}</span>
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <div className="input-wrapper">
                <div className="input-icon" aria-hidden="true">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  id="email"
                  className={`form-input ${error ? 'form-input-error' : ''}`}
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  autoComplete="email"
                  autoCapitalize="none"
                  spellCheck="false"
                  aria-required="true"
                  aria-invalid={error ? 'true' : 'false'}
                  aria-describedby={error ? 'email-error' : undefined}
                />
              </div>
              {error && (
                <div id="email-error" className="field-error" role="alert">
                  Please check your email address
                </div>
              )}
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="input-wrapper">
                <div className="input-icon" aria-hidden="true">
                  <Lock size={20} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className={`form-input ${error ? 'form-input-error' : ''}`}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                  autoComplete="current-password"
                  aria-required="true"
                  aria-invalid={error ? 'true' : 'false'}
                  aria-describedby={error ? 'password-error' : undefined}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={0}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {error && (
                <div id="password-error" className="field-error" role="alert">
                  Please check your password
                </div>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="form-options">
              <label className="checkbox-wrapper">
                <input 
                  type="checkbox" 
                  className="checkbox-input"
                  id="rememberMe"
                />
                <span className="checkbox-custom" aria-hidden="true"></span>
                <span className="checkbox-label">Remember me</span>
              </label>
              
              <button 
                type="button" 
                className="forgot-link"
                onClick={() => {/* Handle forgot password */}}
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !email.trim() || !password.trim()}
              className="submit-button"
              aria-describedby="submit-help"
            >
              <span className="button-content">
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="loading-spinner" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <LogIn size={20} />
                    <span>Sign In</span>
                  </>
                )}
              </span>
            </button>
            
            <div id="submit-help" className="sr-only">
              {isLoading ? 'Please wait while we sign you in' : 'Click to sign in to your account'}
            </div>
          </form>

          {/* Footer Section */}
          <div className="login-footer">
            <div className="divider">
              <span className="divider-text">New to QLAP?</span>
            </div>
            <p className="signup-text">
              Join thousands of book lovers in your community
            </p>
            <button 
              type="button"
              className="register-link"
              onClick={() => {/* Handle navigation to register */}}
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;