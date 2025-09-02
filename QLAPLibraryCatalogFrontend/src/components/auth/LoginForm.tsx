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
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] px-4">
      <div className="w-full max-w-md bg-[var(--color-card)] shadow-lg rounded-2xl p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Welcome Back</h1>
          <p className="text-sm text-[var(--color-muted)]">Sign in to access your book collection</p>
        </div>

        {/* Error */}
        {error && (
          <div
            className="flex items-center gap-2 mb-4 p-3 rounded-md bg-red-100 text-red-700 text-sm"
            role="alert"
          >
            <AlertTriangle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[var(--color-text)]"
            >
              Email Address
            </label>
            <div className="mt-1 relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]"
                size={18}
              />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="w-full pl-10 pr-3 py-2 border border-[var(--color-border)] rounded-lg shadow-sm 
                           focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-sm"
                placeholder="Enter your email"
                autoComplete="email"
                aria-required="true"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[var(--color-text)]"
            >
              Password
            </label>
            <div className="mt-1 relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]"
                size={18}
              />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                className="w-full pl-10 pr-10 py-2 border border-[var(--color-border)] rounded-lg shadow-sm 
                           focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-sm"
                placeholder="Enter your password"
                autoComplete="current-password"
                aria-required="true"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)] hover:text-[var(--color-text)]"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Options */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="h-4 w-4 text-[var(--color-primary)] border-[var(--color-border)] rounded"
              />
              <span className="text-[var(--color-muted)]">Remember me</span>
            </label>
            <button
              type="button"
              className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-medium"
            >
              Forgot password?
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading || !email.trim() || !password.trim()}
            className="w-full flex justify-center items-center gap-2 py-2 px-4 
                       bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] 
                       text-white rounded-lg font-medium shadow-md disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : <LogIn size={18} />}
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <div className="text-[var(--color-muted)] text-sm">New to QLAP?</div>
          <p className="text-[var(--color-text)] text-sm">
            Join thousands of book lovers in your community
          </p>
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="mt-3 w-full py-2 px-4 border border-[var(--color-primary)] text-[var(--color-primary)] 
                       rounded-lg font-medium hover:bg-[var(--color-primary)] hover:text-white"
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;


// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Mail, Lock, Eye, EyeOff, LogIn, AlertTriangle, Loader2 } from 'lucide-react';
// import useAuth from '../../hooks/useAuth';

// /**
//  * LoginForm Component
//  * 
//  * Modern, accessible login form with mobile-first design
//  * Following WCAG 2.1 guidelines and modern UX patterns
//  */
// export function LoginForm() {
//   // Local state for form inputs
//   const [email, setEmail] = useState<string>('');
//   const [password, setPassword] = useState<string>('');
//   const [showPassword, setShowPassword] = useState<boolean>(false);
  
//   // Access auth context using our custom hook
//   const { login, isLoading, error } = useAuth();

//   const navigate = useNavigate();

//   // Handle form submission
//   const handleSubmit = (e: React.SyntheticEvent) => {
//     e.preventDefault();
    
//     // Basic validation
//     if (!email.trim() || !password.trim()) {
//       return;
//     }
    
//     login(email, password);
//   };

//   // Handle Enter key press in password field
//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === 'Enter') {
//       handleSubmit(e);
//     }
//   };

//   return (
//     <div className="login-container">
//       <div className="login-card">
//         {/* Header Section */}
//         <div className="login-header">
//           <div className="login-header-content">
//             <h1 className="login-title">Welcome Back</h1>
//             <p className="login-subtitle">Sign in to access your book collection</p>
//           </div>
//         </div>

//         {/* Form Section */}
//         <div className="login-body">
//           <form onSubmit={handleSubmit} noValidate>
//             {/* Global Error Display */}
//             {error && (
//               <div className="error-alert" role="alert" aria-live="polite">
//                 <div className="error-icon" aria-hidden="true">
//                   <AlertTriangle size={20} />
//                 </div>
//                 <div className="error-content">
//                   <strong>Login Failed</strong>
//                   <span>{error}</span>
//                 </div>
//               </div>
//             )}

//             {/* Email Field */}
//             <div className="form-group">
//               <label htmlFor="email" className="form-label">
//                 Email Address
//               </label>
//               <div className="input-wrapper">
//                 <div className="input-icon" aria-hidden="true">
//                   <Mail size={20} />
//                 </div>
//                 <input
//                   type="email"
//                   id="email"
//                   className={`form-input ${error ? 'form-input-error' : ''}`}
//                   placeholder="Enter your email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   disabled={isLoading}
//                   autoComplete="email"
//                   autoCapitalize="none"
//                   spellCheck="false"
//                   aria-required="true"
//                   aria-invalid={error ? 'true' : 'false'}
//                   aria-describedby={error ? 'email-error' : undefined}
//                 />
//               </div>
//               {error && (
//                 <div id="email-error" className="field-error" role="alert">
//                   Please check your email address
//                 </div>
//               )}
//             </div>

//             {/* Password Field */}
//             <div className="form-group">
//               <label htmlFor="password" className="form-label">
//                 Password
//               </label>
//               <div className="input-wrapper">
//                 <div className="input-icon" aria-hidden="true">
//                   <Lock size={20} />
//                 </div>
//                 <input
//                   type={showPassword ? 'text' : 'password'}
//                   id="password"
//                   className={`form-input ${error ? 'form-input-error' : ''}`}
//                   placeholder="Enter your password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   onKeyDown={handleKeyDown}
//                   disabled={isLoading}
//                   autoComplete="current-password"
//                   aria-required="true"
//                   aria-invalid={error ? 'true' : 'false'}
//                   aria-describedby={error ? 'password-error' : undefined}
//                 />
//                 <button
//                   type="button"
//                   className="password-toggle"
//                   onClick={() => setShowPassword(!showPassword)}
//                   aria-label={showPassword ? 'Hide password' : 'Show password'}
//                   tabIndex={0}
//                 >
//                   {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                 </button>
//               </div>
//               {error && (
//                 <div id="password-error" className="field-error" role="alert">
//                   Please check your password
//                 </div>
//               )}
//             </div>

//             {/* Remember Me & Forgot Password */}
//             <div className="form-options">
//               <label className="checkbox-wrapper">
//                 <input 
//                   type="checkbox" 
//                   className="checkbox-input"
//                   id="rememberMe"
//                 />
//                 <span className="checkbox-custom" aria-hidden="true"></span>
//                 <span className="checkbox-label">Remember me</span>
//               </label>
              
//               <button 
//                 type="button" 
//                 className="forgot-link"
//                 onClick={() => {/* Handle forgot password */}}
//               >
//                 Forgot Password?
//               </button>
//             </div>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               disabled={isLoading || !email.trim() || !password.trim()}
//               className="submit-button"
//               aria-describedby="submit-help"
//             >
//               <span className="button-content">
//                 {isLoading ? (
//                   <>
//                     <Loader2 size={20} className="loading-spinner" />
//                     <span>Signing In...</span>
//                   </>
//                 ) : (
//                   <>
//                     <LogIn size={20} />
//                     <span>Sign In</span>
//                   </>
//                 )}
//               </span>
//             </button>
            
//             <div id="submit-help" className="sr-only">
//               {isLoading ? 'Please wait while we sign you in' : 'Click to sign in to your account'}
//             </div>
//           </form>

//           {/* Footer Section */}
//           <div className="login-footer">
//             <div className="divider">
//               <span className="divider-text">New to QLAP?</span>
//             </div>
//             <p className="signup-text">
//               Join thousands of book lovers in your community
//             </p>
//             <button 
//               type="button"
//               className="register-link"
//               onClick={() => navigate('/register')}
//             >
//               Create Account
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default LoginForm;