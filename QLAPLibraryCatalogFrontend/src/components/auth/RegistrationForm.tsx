import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !username.trim() || !password.trim()) {
      return;
    }

    if (password !== confirmPassword) {
      return;
    }
    
    await register({
      email,
      username,
      password,
      userPreferences: {}
    });
  };

  const passwordsMatch = !confirmPassword || password === confirmPassword;

  return (
    <div className="min-h-screen flex justify-center bg-gray-100 px-4 py-8">
      <div className="w-full max-w-md bg-white shadow-xl rounded-3xl overflow-hidden">
        
        {/* Header Section */}
        <div className="px-8 pt-8 pb-2">
          <h1 className="text-2xl font-bold text-charcoal text-center mb-2">
            Create Account
          </h1>
          <p className="text-sm text-charcoal-light text-center">
            Join the Queer Library and Archive Project
          </p>
        </div>

        {/* Form Section */}
        <div className="px-8 pb-8">
          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <AlertTriangle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
              <div className="text-red-700 text-sm">
                <p className="font-Media mb-1">Registration Failed</p>
                <p>{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Email Field */}
            <div>
              <label htmlFor="reg-email" className="block text-sm font-Media text-charcoal mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail 
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-light" 
                  size={20} 
                />
                <input
                  type="email"
                  id="reg-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl
                           focus:outline-none focus:ring-2 focus:ring-lavender-500 focus:border-transparent
                           disabled:bg-gray-50 disabled:text-gray-500 text-charcoal
                           placeholder-charcoal-light transition-all duration-200"
                  placeholder="Enter your email"
                  autoComplete="email"
                  aria-required="true"
                />
              </div>
            </div>

            {/* Username Field */}
            <div>
              <label htmlFor="reg-username" className="block text-sm font-Media text-charcoal mb-2">
                Username
              </label>
              <div className="relative">
                <User 
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-light" 
                  size={20} 
                />
                <input
                  type="text"
                  id="reg-username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl
                           focus:outline-none focus:ring-2 focus:ring-lavender-500 focus:border-transparent
                           disabled:bg-gray-50 disabled:text-gray-500 text-charcoal
                           placeholder-charcoal-light transition-all duration-200"
                  placeholder="Choose a username"
                  autoComplete="username"
                  aria-required="true"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="reg-password" className="block text-sm font-Media text-charcoal mb-2">
                Password
              </label>
              <div className="relative">
                <Lock 
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-light" 
                  size={20} 
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="reg-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl
                           focus:outline-none focus:ring-2 focus:ring-lavender-500 focus:border-transparent
                           disabled:bg-gray-50 disabled:text-gray-500 text-charcoal
                           placeholder-charcoal-light transition-all duration-200"
                  placeholder="Create a password"
                  autoComplete="new-password"
                  aria-required="true"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal-light 
                           hover:text-charcoal transition-colors focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="reg-confirm-password" className="block text-sm font-Media text-charcoal mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock 
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-light" 
                  size={20} 
                />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="reg-confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  className={`w-full pl-12 pr-12 py-3 border rounded-xl
                           focus:outline-none focus:ring-2 focus:ring-lavender-500 focus:border-transparent
                           disabled:bg-gray-50 disabled:text-gray-500 text-charcoal
                           placeholder-charcoal-light transition-all duration-200
                           ${!passwordsMatch ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  aria-required="true"
                  aria-invalid={!passwordsMatch ? 'true' : 'false'}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal-light 
                           hover:text-charcoal transition-colors focus:outline-none"
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {!passwordsMatch && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertTriangle size={16} />
                  Passwords do not match
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !email.trim() || !username.trim() || !password.trim() || !passwordsMatch}
              className="w-full py-3 px-4 bg-lavender-500 hover:bg-lavender-500 
                       disabled:bg-gray-400 disabled:cursor-not-allowed
                       text-white font-Media rounded-xl shadow-lg
                       transition-all duration-200 transform hover:scale-[1.01]
                       focus:outline-none focus:ring-2 focus:ring-lavender-500 focus:ring-offset-2
                       flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <UserPlus size={20} />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-charcoal-light">Already have an account?</span>
              </div>
            </div>
            
            <button 
              type="button"
              onClick={() => navigate("/login")}
              className="w-full py-3 px-4 border-2 border-lavender-500 text-lavender-500 
                       hover:bg-lavender-500 hover:text-white font-Media rounded-xl
                       transition-all duration-200 transform hover:scale-[1.01]
                       focus:outline-none focus:ring-2 focus:ring-lavender-500 focus:ring-offset-2"
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