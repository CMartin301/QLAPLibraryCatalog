import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { Mail, Lock, User, Eye, EyeOff, UserPlus, AlertTriangle, Loader2 } from 'lucide-react';

export function RegistrationForm() {
  const [email, setEmail] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  
  const { register, isLoading, error } = useAuth();

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !username.trim() || !password.trim()) {
      return;
    }

    if (password !== confirmPassword) {
      // Handle password mismatch - you might want to add local state for this error
      return;
    }
    
    await register({
      email,
      username,
      password,
      userPreferences: {} // Default empty preferences
    });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Header */}
        <div className="login-header">
          <div className="login-header-content">
            <h1 className="login-title">Create Account</h1>
            <p className="login-subtitle">Join the Queer Library and Archive Project</p>
          </div>
        </div>

        {/* Form */}
        <div className="login-body">
          <form onSubmit={handleSubmit} noValidate>
            {/* Error Display */}
            {error && (
              <div className="error-alert" role="alert" aria-live="polite">
                <div className="error-icon" aria-hidden="true">
                  <AlertTriangle size={20} />
                </div>
                <div className="error-content">
                  <strong>Registration Failed</strong>
                  <span>{error}</span>
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="reg-email" className="form-label">
                Email Address
              </label>
              <div className="input-wrapper">
                <div className="input-icon" aria-hidden="true">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  id="reg-email"
                  className={`form-input ${error ? 'form-input-error' : ''}`}
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  autoComplete="email"
                  aria-required="true"
                />
              </div>
            </div>

            {/* Username Field */}
            <div className="form-group">
              <label htmlFor="reg-username" className="form-label">
                Username
              </label>
              <div className="input-wrapper">
                <div className="input-icon" aria-hidden="true">
                  <User size={20} />
                </div>
                <input
                  type="text"
                  id="reg-username"
                  className={`form-input ${error ? 'form-input-error' : ''}`}
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                  autoComplete="username"
                  aria-required="true"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="reg-password" className="form-label">
                Password
              </label>
              <div className="input-wrapper">
                <div className="input-icon" aria-hidden="true">
                  <Lock size={20} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="reg-password"
                  className={`form-input ${error ? 'form-input-error' : ''}`}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  autoComplete="new-password"
                  aria-required="true"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="form-group">
              <label htmlFor="reg-confirm-password" className="form-label">
                Confirm Password
              </label>
              <div className="input-wrapper">
                <div className="input-icon" aria-hidden="true">
                  <Lock size={20} />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="reg-confirm-password"
                  className={`form-input ${error || (confirmPassword && password !== confirmPassword) ? 'form-input-error' : ''}`}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  autoComplete="new-password"
                  aria-required="true"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {confirmPassword && password !== confirmPassword && (
                <div className="field-error" role="alert">
                  Passwords do not match
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !email.trim() || !username.trim() || !password.trim() || password !== confirmPassword}
              className="submit-button"
            >
              <span className="button-content">
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="loading-spinner" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={20} />
                    <span>Create Account</span>
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Footer */}
          <div className="login-footer">
            <div className="divider">
              <span className="divider-text">Already have an account?</span>
            </div>
            <button 
              type="button"
              className="register-link"
              onClick={() => {/* Handle navigation to login */}}
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegistrationForm;