import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, LogIn, AlertTriangle, Loader2 } from "lucide-react";
import useAuth from "../../hooks/useAuth";

export function LoginForm() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    login(email, password);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  return (
    <div className="flex justify-center bg-gray-100 px-4 py-8">
      <div className="w-full max-w-md bg-white shadow-xl rounded-3xl overflow-hidden">
        
        {/* Header Section */}
        <div className="px-8 pt-8 pb-2">
          <h1 className="text-2xl font-bold text-charcoal text-center mb-2">
            Welcome Back
          </h1>
          <p className="text-sm text-charcoal-light text-center">
            Sign in to access your book collection
          </p>
        </div>

        {/* Form Section */}
        <div className="px-8 pb-8">
          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <AlertTriangle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
              <div className="text-red-700 text-sm">
                <p className="font-Media mb-1">Login Failed</p>
                <p>{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-Media text-charcoal mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail 
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-light" 
                  size={20} 
                />
                <input
                  type="email"
                  id="email"
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
                  aria-invalid={error ? 'true' : 'false'}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-Media text-charcoal mb-2">
                Password
              </label>
              <div className="relative">
                <Lock 
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-light" 
                  size={20} 
                />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                  className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl
                           focus:outline-none focus:ring-2 focus:ring-lavender-500 focus:border-transparent
                           disabled:bg-gray-50 disabled:text-gray-500 text-charcoal
                           placeholder-charcoal-light transition-all duration-200"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  aria-required="true"
                  aria-invalid={error ? 'true' : 'false'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal-light 
                           hover:text-charcoal transition-colors focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Form Options */}
            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-lavender-500 border-gray-300 rounded 
                           focus:ring-lavender-500 focus:ring-2"
                />
                <span className="text-sm text-charcoal-light">Remember me</span>
              </label>
              <button
                type="button"
                className="text-sm text-lavender-500 hover:text-lavender-500 font-Media
                         transition-colors focus:outline-none focus:underline"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !email.trim() || !password.trim()}
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
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  <span>Sign In</span>
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
                <span className="px-4 bg-white text-charcoal-light">New to QLAP?</span>
              </div>
            </div>
            
            <p className="text-sm text-charcoal-light mb-4">
              Join thousands of book lovers in your community
            </p>
            
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="w-full py-3 px-4 border-2 border-lavender-500 text-lavender-500 
                       hover:bg-lavender-500 hover:text-white font-Media rounded-xl
                       transition-all duration-200 transform hover:scale-[1.01]
                       focus:outline-none focus:ring-2 focus:ring-lavender-500 focus:ring-offset-2"
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